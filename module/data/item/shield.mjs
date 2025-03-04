import { SIZES } from "../../registry/size.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";
import EquipmentData from "./equipment.mjs";

const { NumberField, StringField, BooleanField } = foundry.data.fields;

export default class ShieldData extends EquipmentData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      size: new StringField({
        choices: SIZES,
      }),
      // e-shield
      hits: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      burnout: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      distortion: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      burst: new BooleanField({ initial: false }),
      // handheld
      res: new NumberField({
        ...defaultNumberFieldOptions(1),
      }),
      strRequirement: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      damage: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
    });
  }
}
