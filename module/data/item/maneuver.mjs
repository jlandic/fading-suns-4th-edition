import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { SKILLS } from "../../registry/skills.mjs";
import { TIME_TYPES } from "../../registry/time.mjs";
import { ItemDataModel } from "../abstract.mjs";

const { StringField, HTMLField } = foundry.data.fields;

export default class ManeuverData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      description: new HTMLField(),
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
