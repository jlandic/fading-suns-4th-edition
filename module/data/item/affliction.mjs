import { SimpleItemData } from "../abstract.mjs";

const { HTMLField } = foundry.data.fields;

export default class AfflictionData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      effects: new HTMLField(),
      preconditions: new HTMLField(),
    });
  }
}
