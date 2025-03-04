import { SimpleItemData } from "../abstract.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";

const { NumberField, StringField } = foundry.data.fields;

export default class EquipmentData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      nt: new NumberField({
        ...defaultNumberFieldOptions(null),
        nullable: true,
      }),
      agora: new StringField(),
      cost: new NumberField({
        ...defaultNumberFieldOptions(null),
        nullable: true,
      }),
    });
  }
}
