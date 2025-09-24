import CommonTemplate from "./common.mjs";

const { HTMLField } = foundry.data.fields;

export default class CreatureTemplate extends CommonTemplate {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      description: new HTMLField(),
    });
  }
}
