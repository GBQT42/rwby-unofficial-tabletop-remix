/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-features.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-items.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-spells.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-effects.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-skills.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-semblance.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-aura.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-dust.hbs',
    "systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-combat.hbs",
    "systems/rwby-unofficial-tabletop-remix/templates/actor/parts/actor-feature-uses-quick-display.hbs",
    // Item partials
    'systems/rwby-unofficial-tabletop-remix/templates/item/parts/item-effects.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/item/parts/item-uses-editor.hbs',
    //Rolls
    'systems/rwby-unofficial-tabletop-remix/templates/rolls/parts/roll-dialog-content.hbs',
    'systems/rwby-unofficial-tabletop-remix/templates/rolls/parts/attribute-selector.hbs',
  ]);
};
