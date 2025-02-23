import {
  PERK_SOURCE_TYPES,
  PERK_TYPES,
  PRECONDITION_TYPES,
} from "../../registry/perks.mjs";
import { SimpleItemData } from "../abstract.mjs";

const { StringField, NumberField, ArrayField } = foundry.data.fields;

export default class PerkData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      sourceType: new StringField({
        choices: PERK_SOURCE_TYPES,
      }),
      type: new StringField({
        choices: PERK_TYPES,
      }),
      _preconditions: new ArrayField(new ArrayField(new StringField())),
      benefice: new StringField(),
      techCompulsion: new StringField(),
      tl: new NumberField({ nullable: true }),
    });
  }

  get preconditions() {
    return this._preconditions.map((conditionSet) =>
      conditionSet.map((condition) => {
        const specialKey = `fs4.perks.specialPreconditions.${condition}`;
        const text = game.i18n.localize(specialKey);
        if (text !== specialKey) {
          return { special: true, text: text };
        }

        return (
          game.items
            .filter((item) => PRECONDITION_TYPES.includes(item.type))
            .find((item) => item.system.id === condition) || {
            special: true,
            text: condition,
          }
        );
      })
    );
  }
}
