import { ARMOR_TYPES, ESHIELD_TYPES } from "../../registry/armorTypes.mjs";
import { SIZES } from "../../registry/size.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";
import EquipmentData from "./equipment.mjs";

const { NumberField, StringField, BooleanField, SchemaField, ArrayField } = foundry.data.fields;

export default class ShieldData extends EquipmentData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      size: new StringField({
        choices: SIZES,
      }),
      thresholds: new SchemaField({
        low: new NumberField({
          ...defaultNumberFieldOptions(0),
        }),
        high: new NumberField({
          ...defaultNumberFieldOptions(0),
        }),
      }),
      features: new ArrayField(new StringField()),
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
      compatibility: new ArrayField(new StringField({
        choices: ESHIELD_TYPES,
      })),
      handheld: new BooleanField({ initial: false }),
      // handheld
      res: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      damage: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      for: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      anti: new ArrayField(
        new StringField({
          choices: ARMOR_TYPES,
        })
      ),
      // state
      state: new SchemaField({
        hits: new NumberField({
          ...defaultNumberFieldOptions(0),
        }),
        burnoutRounds: new NumberField({
          ...defaultNumberFieldOptions(0),
        }),
        distorting: new BooleanField({ initial: false }),
      })
    });
  }

  recharge() {
    if (this.handheld) return;

    this.state.hits = this.hits;
  }

  canDistort() {
    return !this.handheld && this.distortion > 0;
  }
}
