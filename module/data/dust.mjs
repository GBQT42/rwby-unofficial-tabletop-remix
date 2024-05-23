//Intended to represent both the Semblance itself and Semblance techniques


import rwbyItemBase from "./item-base.mjs";

export default class rwbyDust extends rwbyItemBase {

    static defineSchema() {

        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        
        schema.attr = new fields.StringField({ required: true, initial:"@abilities.esp.value[@abilities.esp.abbr]"});
        schema.rollModifier = new fields.NumberField({ ...requiredInteger, initial: 0 });

        return schema;
    }

}