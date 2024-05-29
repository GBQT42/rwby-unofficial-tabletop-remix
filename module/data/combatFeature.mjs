//Intended to represent both the regular attacks and weapon techniques


import rwbyItemBase from "./item-base.mjs";

export default class rwbyCombatFeature extends rwbyItemBase {

    static defineSchema() {

        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();


        schema.rollModifier = new fields.StringField({ required: true, initial: "@abilities.for.rollableModifier + @abilities.dex.rollableModifier" });
        schema.damageRoll = new fields.StringField({ initial: "1d6 + @abilities.for.rollableModifier" });

        return schema;
    }

}