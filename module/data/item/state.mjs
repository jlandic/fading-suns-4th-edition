import { CHARACTERISTIC_GROUPS } from "../../registry/characteristics.mjs";
import { SimpleItemData } from "../abstract.mjs";

const { StringField } = foundry.data.fields;

export default class StateData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      type: new StringField({
        choices: StateData.types,
        initial: StateData.types[0],
      }),
    });
  }

  static types = Object.keys(CHARACTERISTIC_GROUPS);
}
