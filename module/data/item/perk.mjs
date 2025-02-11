import { PERK_SOURCE_TYPES, PERK_TYPES } from "../../registry/perks.mjs";
import { ItemDataModel } from "../abstract.mjs";

const { StringField, NumberField } = foundry.data.fields;

export default class PerkData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField(),
      sourceType: new StringField({
        choices: PERK_SOURCE_TYPES,
      }),
      type: new StringField({
        choices: PERK_TYPES,
      }),
      preconditions: new StringField(),
      description: new StringField(),
      benefice: new StringField(),
      techCompulsion: new StringField(),
      tl: new NumberField({ nullable: true }),
    });
  }
}
