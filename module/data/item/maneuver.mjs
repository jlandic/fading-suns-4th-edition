import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { MANEUVER_TYPES } from "../../registry/maneuverTypes.mjs";
import { SKILLS } from "../../registry/skills.mjs";
import { SimpleItemData } from "../abstract.mjs";

const { StringField, HTMLField } = foundry.data.fields;

export const ADD_TO_ROLL_OPTIONS = [
  "no",
  "melee",
  "ranged",
]

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
      time: new HTMLField(),
      type: new StringField({
        choices: MANEUVER_TYPES,
        initial: "action",
      }),
      addWeaponToRoll: new StringField({
        choices: ADD_TO_ROLL_OPTIONS,
        initial: "no",
      }),
    });
  }
}
