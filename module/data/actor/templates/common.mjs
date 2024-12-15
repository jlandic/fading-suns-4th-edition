import { ActorDataModel } from "../../abstract.mjs";

export default class CommonTemplate extends ActorDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {});
  }
}
