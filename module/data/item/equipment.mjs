import { SimpleItemData } from "../abstract.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";

const { NumberField, StringField } = foundry.data.fields;

export default class EquipmentData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      tl: new NumberField({
        ...defaultNumberFieldOptions(null),
        nullable: true,
      }),
      agora: new StringField(),
      cost: new NumberField({
        ...defaultNumberFieldOptions(null),
        nullable: true,
      }),
      techCompulsion: new StringField(),
    });
  }
}
