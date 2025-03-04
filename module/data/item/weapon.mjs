import { ARMOR_TYPES } from "../../registry/armorTypes.mjs";
import { SIZES } from "../../registry/size.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";
import EquipmentData from "./equipment.mjs";

const {
  NumberField,
  ArrayField,
  HTMLField,
  StringField,
  SchemaField,
  BooleanField,
} = foundry.data.fields;

export default class ArmorData extends EquipmentData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      goalModifier: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      damage: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      strRequirement: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      range: new SchemaField({
        melee: new BooleanField({ initial: true }),
        extremeRange: new BooleanField({ initial: true }),
        short: new NumberField({
          ...defaultNumberFieldOptions(0),
        }),
        long: new NumberField({
          ...defaultNumberFieldOptions(0),
        }),
      }),
      rof: new NumberField({
        ...defaultNumberFieldOptions(1),
      }),
      burst: new BooleanField({ initial: false }),
      ammo: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      size: new StringField({
        choices: SIZES,
      }),
      anti: new ArrayField({
        choices: ARMOR_TYPES,
      }),
      features: new HTMLField(),
    });
  }
}
