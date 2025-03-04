import { ARMOR_TYPES, ESHIELD_TYPES } from "../../registry/armorTypes.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";
import EquipmentData from "./equipment.mjs";

const { StringField, NumberField, ArrayField } = foundry.data.fields;

export default class ArmorData extends EquipmentData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      res: new NumberField({
        ...defaultNumberFieldOptions(1),
      }),
      eshieldCompability: new StringField({
        choices: ESHIELD_TYPES,
      }),
      dexModifier: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      vigorModifier: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      agora: new StringField(),
      anti: new ArrayField({
        choices: ARMOR_TYPES,
      }),
    });
  }
}
