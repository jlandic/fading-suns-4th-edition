import { ItemDataModel } from "../abstract.mjs";

const { StringField, NumberField } = foundry.data.fields;

export default class PerkData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField(),
      sourceType: new StringField(),
      type: new StringField({
        choices: [
          "ability",
          "austerity",
          "cyberdevice",
          "power",
          "privilege",
          "verve",
        ],
      }),
      preconditions: new StringField(),
      description: new StringField(),
      benefice: new StringField(),
      techCompulsion: new StringField(),
      tl: new NumberField({ nullable: true }),
    });
  }
}
