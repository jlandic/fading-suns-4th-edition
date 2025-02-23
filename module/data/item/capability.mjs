import {
  CAPABILITY_CATEGORIES,
  CAPABILITY_TYPES,
} from "../../registry/capabilities.mjs";
import { SimpleItemData } from "../abstract.mjs";

const { StringField, SetField } = foundry.data.fields;

export default class CapabilityData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      type: new StringField({
        choices: CAPABILITY_TYPES,
      }),
      category: new StringField({
        choices: CAPABILITY_CATEGORIES,
      }),
      reserved: new SetField(new StringField()),
    });
  }
}
