export default class rwbyItemBase extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.StringField({ required: true, blank: true });
    schema.uses = new fields.NumberField({ required: false, blank: true, integer: true });
    schema.maxUses = new fields.NumberField({ required: false, blank: true, integer: true });

    return schema;
  }
}