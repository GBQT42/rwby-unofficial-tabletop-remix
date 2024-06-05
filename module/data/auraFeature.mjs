//Intended to represent Aura techniques and the like.


import rwbyItemBase from "./item-base.mjs";

export default class rwbyAuraFeature extends rwbyItemBase {

    static defineSchema() {

        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        
        schema.defaultAttr = new fields.StringField({ required: true, initial:""});
        schema.rollModifier = new fields.NumberField({ ...requiredInteger, initial: 0 });
        schema.damageRoll = new fields.StringField({ initial: "" });

        return schema;
    }

}