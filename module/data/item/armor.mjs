import { ARMOR_TYPES, ESHIELD_TYPES } from "../../registry/armorTypes.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";
import EquipmentData from "./equipment.mjs";

const { StringField, NumberField, ArrayField } = foundry.data.fields;

export default class ArmorData extends EquipmentData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      capability: new StringField(),
      res: new NumberField({
        ...defaultNumberFieldOptions(1),
      }),
      eshieldCompatibility: new StringField({
        choices: ESHIELD_TYPES,
        initial: ESHIELD_TYPES[0],
      }),
      dexModifier: new NumberField({
        ...defaultNumberFieldOptions(0),
        min: null,
      }),
      vigorModifier: new NumberField({
        ...defaultNumberFieldOptions(0),
        min: null,
      }),
      anti: new ArrayField(
        new StringField({
          choices: ARMOR_TYPES,
        })
      ),
      features: new ArrayField(new StringField()),
    });
  }

  get adjustedRes() {
    return this.res + this.rollModifier;
  }
}
