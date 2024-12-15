import CommonTemplate from "./common.mjs";

export default class CreatureTemplate extends CommonTemplate {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {});
  }
}
