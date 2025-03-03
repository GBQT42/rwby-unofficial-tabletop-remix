//Intended to represent any kind of save

import rwbyItemBase from "./item-base.mjs";

export default class rwbySave extends rwbyItemBase {

    static defineSchema() {

        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();


        schema.rollModifier = new fields.StringField({ required: true, initial: "@abilities.per.rollableModifier + @abilities.dex.rollableModifier" });

        return schema;
    }

}