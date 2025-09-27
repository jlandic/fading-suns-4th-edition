import ManeuverData from "./maneuver.mjs";

export const POWER_SCHOOLS = [
  "theurgy",
  "psi"
];

export const COMPONENTS = [
  "liturgy",
  "gestures",
  "prayer",
];

const {
  StringField,
  SchemaField,
  HTMLField,
  BooleanField,
  NumberField,
} = foundry.data.fields;

export default class PowerData extends ManeuverData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      path: new StringField(),
      cost: new StringField(),
      school: new StringField({ choices: POWER_SCHOOLS, initial: "theurgy" }),
      components: new SchemaField({
        liturgy: new BooleanField({ initial: false }),
        gestures: new BooleanField({ initial: false }),
        prayer: new BooleanField({ initial: false }),
      }),
      level: new NumberField({ initial: 1, min: 1, max: 10 }),
      preconditions: new HTMLField(),
      elementary: new BooleanField({ initial: false }),
    });
  }

  get canRequireComponents() {
    return this.school === "theurgy";
  }
}
