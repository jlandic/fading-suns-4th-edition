import { ARMOR_TYPES } from "../../registry/armorTypes.mjs";
import { SIZES } from "../../registry/size.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";
import EquipmentData from "./equipment.mjs";

const { NumberField, ArrayField, StringField, SchemaField, BooleanField } =
  foundry.data.fields;

export default class WeaponData extends EquipmentData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      capability: new StringField(),
      goalModifier: new NumberField({
        ...defaultNumberFieldOptions(0),
        min: null,
      }),
      damage: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      strRequirement: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      melee: new BooleanField({ initial: true }),
      range: new SchemaField({
        extreme: new BooleanField({ initial: true }),
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
      anti: new ArrayField(
        new StringField({
          choices: ARMOR_TYPES,
        })
      ),
      features: new ArrayField(new StringField()),
    });
  }

  get extremeRange() {
    if (this.range.melee || !this.range.extremeRange) return null;

    return this.range.long * 2;
  }

  get rangeText() {
    if (this.melee) return game.i18n.localize("fs4.weapon.fields.melee");

    if (this.range.extremeRange)
      return `${this.range.short}/${this.range.long}/${this.extremeRange}`;

    return `${this.range.short}/${this.range.long}`;
  }

  resetRange() {
    this.range.short = undefined;
    this.range.long = undefined;
    this.range.extremeRange = false;
  }
}
