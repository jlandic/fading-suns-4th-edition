import CommonTemplate from "./common.mjs";

const { HTMLField, ArrayField, ObjectField } = foundry.data.fields;

export default class CreatureTemplate extends CommonTemplate {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      description: new HTMLField(),
      modifiers: new ArrayField(new ObjectField()),
    });
  }
}
