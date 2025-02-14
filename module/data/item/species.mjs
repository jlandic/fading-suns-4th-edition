import { ItemDataModel } from "../abstract.mjs";

const { StringField, NumberField, ArrayField, HTMLField } = foundry.data.fields;

export default class SpeciesData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField(),
      description: new HTMLField(),
      size: new NumberField(),
      speed: new ArrayField(new NumberField()),
    });
  }

  get twoLeggedSpeed() {
    return this.speed[0];
  }
}
