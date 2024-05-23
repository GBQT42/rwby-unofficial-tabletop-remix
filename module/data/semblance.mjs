//Intended to represent both the Semblance itself and Semblance techniques


import rwbyItemBase from "./item-base.mjs";

export default class rwbySemblanceFeature extends rwbyItemBase {

    static defineSchema() {

        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        
        schema.defaultAttr = new fields.StringField({ required: true, initial:""});
        schema.rollModifier = new fields.NumberField({ ...requiredInteger, initial: 0 });

        return schema;
    }

}