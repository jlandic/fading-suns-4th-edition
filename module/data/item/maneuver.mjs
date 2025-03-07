import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { SKILLS } from "../../registry/skills.mjs";
import { TIME_TYPES } from "../../registry/time.mjs";
import { SimpleItemData } from "../abstract.mjs";

const { StringField, HTMLField } = foundry.data.fields;

export default class ManeuverData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      characteristic: new StringField({
        choices: CHARACTERISTICS,
      }),
      skill: new StringField({
        choices: SKILLS,
      }),
      resistance: new HTMLField(),
      capability: new HTMLField(),
      impact: new HTMLField(),
      time: new StringField({
        choices: TIME_TYPES,
      }),
      timeDescription: new HTMLField(),
    });
  }
}
