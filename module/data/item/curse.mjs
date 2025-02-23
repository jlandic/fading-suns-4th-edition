import { ItemDataModel } from "../abstract.mjs";

const { StringField, HTMLField } = foundry.data.fields;

export default class CurseData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField(),
      description: new HTMLField(),
    });
  }
}
