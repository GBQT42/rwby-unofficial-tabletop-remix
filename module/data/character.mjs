import rwbyActorBase from "./actor-base.mjs";

export default class rwbyCharacter extends rwbyActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
      totalXP: new fields.NumberField({ ...requiredInteger, initial:0}),
      spentXP: new fields.NumberField({ ...requiredInteger, initial:0})
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.RWBY.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        label: new fields.StringField({ required: true, blank: true }),
        abbr: new fields.StringField({ required: true, blank: true })
      });
      return obj;
    }, {}));

    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.RWBY.abilities[key]) ?? key;
      this.abilities[key].abbr = game.i18n.localize(CONFIG.RWBY.abilityAbbreviations[key]) ?? key;
      this.abilities[key].rollableModifier = this.abilities[key].value + "[" + this.abilities[key].abbr + "]";
      this.abilities[key].rollableAdvModifier = Math.ceil(this.abilities[key].value/2) + "[MA " + this.abilities[key].abbr + "]";
    }
    this.attributes.level.value = Math.floor(this.attributes.totalXP / 100);
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.value + 4`.
    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;

    return data
  }
}