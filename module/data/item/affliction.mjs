import { SimpleItemData } from "../abstract.mjs";

const { HTMLField, ArrayField, StringField } = foundry.data.fields;

export default class AfflictionData extends SimpleItemData {
    static defineSchema() {
        return this.mergeSchema(super.defineSchema(), {
            effects: new HTMLField(),
            _preconditions: new ArrayField(new StringField()),
        });
    }

    get preconditions() {
        return this._preconditions.map((condition) => {
            const specialKey = `fs4.affliction.specialPreconditions.${condition}`;
            const text = game.i18n.localize(specialKey);
            if (text !== specialKey) {
                return { special: true, text: text };
            }

            return game.items
                .filter((item) => item.type === "class")
                .find((item) => item.system.id === condition)

        })
    }
}
