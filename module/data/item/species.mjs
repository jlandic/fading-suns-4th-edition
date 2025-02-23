import { SimpleItemData } from "../abstract.mjs";

const { NumberField, ArrayField } = foundry.data.fields;

export default class SpeciesData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      size: new NumberField(),
      speed: new ArrayField(new NumberField()),
    });
  }

  get twoLeggedSpeed() {
    return this.speed[0];
  }
}
