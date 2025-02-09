import {
  CAPABILITY_CATEGORIES,
  CAPABILITY_TYPES,
} from "../../registry/capabilities.mjs";
import { ItemDataModel } from "../abstract.mjs";

const { StringField, SetField } = foundry.data.fields;

export default class CapabilityData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      type: new StringField({
        choices: CAPABILITY_TYPES,
      }),
      category: new StringField({
        choices: CAPABILITY_CATEGORIES,
      }),
      description: new StringField(),
      reserved: new SetField(new StringField()),
    });
  }
}
