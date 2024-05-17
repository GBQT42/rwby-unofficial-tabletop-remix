import rwbyItemBase from "./item-base.mjs";

export default class rwbySkill extends rwbyItemBase {

    static defineSchema() {

        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.rollModifier = new fields.StringField({ initial: "@abilities.dex.value + @abilities.dis.value" });
        schema.nativeDifficulty = new fields.NumberField({ ...requiredInteger, initial: 0 });

        return schema;
    }

}