import { SimpleItemData } from "../abstract.mjs";
import { defaultNumberFieldOptions } from "../fields/character.mjs";

const { NumberField, StringField } = foundry.data.fields;

export const QUALITY_LEVELS = [
  "disrepair",
  "unreliable",
  "poor_workmanship",
  "standard",
  "superior",
  "masterwork",
  "premium",
];

const COST_MULTIPLIERS = {
  disrepair: 0.7,
  unreliable: 0.8,
  poor_workmanship: 0.9,
  standard: 1.0,
  superior: 1.1,
  masterwork: 1.2,
  premium: 1.3,
}

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
      quality: new StringField({
        choices: QUALITY_LEVELS,
        initial: "standard",
      }),
    });
  }

  get adjustedCost() {
    if (this.cost == null) return null;

    return Math.round(this.cost * COST_MULTIPLIERS[this.quality]);
  }

  get rollModifier() {
    if (!this.quality === "premium") return 0;

    return 1;
  }
}
