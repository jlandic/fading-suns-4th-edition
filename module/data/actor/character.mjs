import CreatureTemplate from "./templates/creature.mjs";

const { StringField } = foundry.data.fields;

export default class CharacterData extends CreatureTemplate {
  static defineSchema() {
    return {
      fullName: new StringField(),
    };
  }
}
