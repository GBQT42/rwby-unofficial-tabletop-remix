import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class rwbyActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['rwby-unofficial-tabletop-remix', 'sheet', 'actor'],
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'features',
        },
      ],
    });
  }

  /** @override */
  get template() {
    if (this.actor.type == "opponent") {
      return `systems/rwby-unofficial-tabletop-remix/templates/actor/actor-character-sheet.hbs`;
    } else {
      return `systems/rwby-unofficial-tabletop-remix/templates/actor/actor-${this.actor.type}-sheet.hbs`;
    }
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    // for (let [k, v] of Object.entries(context.system.abilities)) {
    //   v.label = game.i18n.localize(CONFIG.RWBY.abilities[k]) ?? k;
    // }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const skills = [];
    const semblanceFeatures = [];
    const auraFeatures = [];
    const dusts = [];
    const combatFeatures = [];
    const defenses = [];
    const saves = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      } else if (i.type === "skill") {
        skills.push(i);
      } else if (i.type === "semblance") {
        semblanceFeatures.push(i);
      } else if (i.type === "auraFeature") {
        auraFeatures.push(i);
      } else if (i.type === "dust") {
        dusts.push(i);
      } else if (i.type === "combatFeature") {
        combatFeatures.push(i);
      } else if (i.type === "defense") {
        defenses.push(i);
      } else if (i.type === "save") {
        saves.push(i);
      } else {
        console.log("Unsupported type: " + i.type);
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.skills = skills;
    context.semblanceFeatures = semblanceFeatures;
    context.auraFeatures = auraFeatures;
    context.dusts = dusts;
    context.combatFeatures = combatFeatures;
    context.defenses = defenses;
    context.saves = saves;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {

    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    } else

      // Handle rolls that supply the formula directly.
      if (dataset.roll) {
        let label = dataset.label ? `${dataset.label}` : '';
        let roll = new Roll(dataset.roll, this.actor.getRollData());
        roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: label,
          rollMode: game.settings.get('core', 'rollMode'),
        });
        return roll;
      } else
        // 
        if (dataset.rollModifier) {
          return this.rwbyRollSimple(dataset, event.ctrlKey);
        } else {
          console.log("Unknown roll type.");
        }
  }




  async rwbyRollSimple(dataset, skipDialog = false) {
    console.log("Rolling a RWBY roll!");

    let label = dataset.label;
    let modifierString = dataset.rollModifier;
    let nativeDifficulty = dataset.nativeDifficulty ? Number(dataset.nativeDifficulty) : 0;
    let secondAttribute = (dataset.secondAttribute === "true");
    const template_data = { secondAttribute: secondAttribute };
    const dialogContent = await renderTemplate("systems/rwby-unofficial-tabletop-remix/templates/rolls/parts/roll-dialog-content.hbs", template_data);

    if (skipDialog) {
      if (secondAttribute) {
        ui.notifications.warn("Skipping secondary attribute selection");
      }
      this.rwbyDoRoll(modifierString, nativeDifficulty, label);
    } else {
      let d = new Dialog({
        title: "Roll Dialog",
        content: dialogContent,
        buttons: {
          disav2: {
            label: "Désavantage Majeur",
            callback: (html) => this.rwbyRollParseFromHtml(html, modifierString, this.rwbyClampDiff(nativeDifficulty - 2), label)
          },
          disav1: {
            label: "Désavantage",
            callback: (html) => this.rwbyRollParseFromHtml(html, modifierString, this.rwbyClampDiff(nativeDifficulty - 1), label)
          },
          av1: {
            label: "Avantage",
            callback: (html) => this.rwbyRollParseFromHtml(html, modifierString, this.rwbyClampDiff(nativeDifficulty + 1), label)
          },
          av2: {
            label: "Avantage Majeur",
            callback: (html) => this.rwbyRollParseFromHtml(html, modifierString, this.rwbyClampDiff(nativeDifficulty + 2), label)
          },
          regular: {
            label: "Normal",
            callback: (html) => this.rwbyRollParseFromHtml(html, modifierString, this.rwbyClampDiff(nativeDifficulty + 0), label)
          }
        },
        default: "regular"
      });
      d.render(true);


    }


    return;
  }


  rwbyClampDiff(difficulty) {
    return Math.min(2, Math.max(-2, difficulty));
  }

  //See rwbyDoRoll for details on params
  rwbyRollParseFromHtml(html, modifierString, difficulty = 0, label = "RWBY roll") {
    let dialogModifier = html.find('input[name=\'roll.modifier.extra\']').val();
    let extraAttribute = html.find('select[name=\'second.attribute\']').val();
    if (extraAttribute) {
      modifierString = modifierString + "+" + extraAttribute;
      //label = label + " + " + extraAttribute;
    }
    if (dialogModifier != "0" && dialogModifier != "") {
      modifierString = modifierString + "+" + dialogModifier + "[Mod]"
    }
    return this.rwbyDoRoll(modifierString, difficulty, label);
  }


  /**
   * 
   * @param {String} modifierString A string containing a formula evaluating to a number in the context of a foundry roll, such as "@abilities.per.value + @abilities.dis.value + 3".
   * @param {int} difficulty An int representing the difficulty/ease of the roll: -2 for major disadvantage, -1 for disadvantage, 0 for a regular roll, +1 for advantage and +2 for major advantage
   * @param {String} label A name for the roll, as you want to display it
   * @returns 
   */
  rwbyDoRoll(modifierString, difficulty = 0, label = "RWBY roll") {
    let diceString = "2d12";
    if (difficulty < 0) {
      diceString = (2 - difficulty) + "d12kl2";
    } else if (difficulty > 0) {
      diceString = (2 + difficulty) + "d12kh2";
    }

    let rollString = diceString + "+" + modifierString;
    console.log("Rolling " + rollString);
    let roll = new Roll(rollString, this.actor.getRollData());

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      rollMode: game.settings.get('core', 'rollMode'),
    });
    return roll;
  }
}
