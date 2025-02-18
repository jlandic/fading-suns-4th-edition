import {
  getBankCapacityForLevel,
  getSurgeAndRevivalAmountForLevel,
} from "../../rules/leveling.mjs";
import {
  armor,
  asset,
  bank,
  characteristics,
  defaultNumberFieldOptions,
  eshield,
  indexedMap,
  item,
  maneuver,
  ownership,
  res,
  skills,
  weapon,
} from "../fields/character.mjs";
import CreatureTemplate from "./templates/creature.mjs";

const { StringField, NumberField, SchemaField, HTMLField } =
  foundry.data.fields;

export default class CharacterData extends CreatureTemplate {
  static _systemType = "character";

  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      // Header
      rank: new StringField(),
      species: new StringField(),
      planet: new StringField(),
      birthdate: new StringField(),
      size: new NumberField({
        ...defaultNumberFieldOptions(5),
      }),
      speed: new StringField(),
      // Background
      class: new StringField(),
      secondaryClass: new StringField(),
      level: new NumberField({
        ...defaultNumberFieldOptions(1),
        min: 1,
      }),
      faction: new StringField(),
      blessing: new StringField(),
      curse: new StringField(),
      calling: new StringField(),
      // Characteristics
      characteristics: characteristics(),
      // Skills
      skills: skills(),
      // Occult
      psi: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      urge: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      theurgy: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      hubris: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      res: res(),
      armor: armor(),
      eshield: eshield(),
      vitality: new SchemaField({
        value: new NumberField({
          ...defaultNumberFieldOptions(0),
        }),
        max: new NumberField({
          ...defaultNumberFieldOptions(),
        }),
      }),
      revivals: new NumberField({
        ...defaultNumberFieldOptions(1),
      }),
      maneuvers: indexedMap(9, maneuver),
      bank: bank(),
      perks: new HTMLField(),
      capabilities: new HTMLField(),
      techgnosis: new NumberField({
        ...defaultNumberFieldOptions(),
      }),
      // Belongings
      weapons: indexedMap(5, weapon),
      equipment: new HTMLField(),
      cash: new NumberField({
        ...defaultNumberFieldOptions(0),
      }),
      notes: new StringField(),
    });
  }

  prepareBaseData() {
    this.vitality.max = this.vitalityRating;
  }

  get vitalityRating() {
    return (
      this.size +
      this.level +
      this.characteristics.endurance +
      this.characteristics.will +
      this.characteristics.faith
    );
  }

  get revivalRating() {
    return this.size + this.level;
  }

  get revivalAmount() {
    return getSurgeAndRevivalAmountForLevel(this.level);
  }

  get surgeRating() {
    return (
      Math.max(
        this.characteristics.strength,
        this.characteristics.wits,
        this.characteristics.presence
      ) + this.level
    );
  }

  get surgeAmount() {
    return getSurgeAndRevivalAmountForLevel(this.level);
  }

  get bankCapacity() {
    return getBankCapacityForLevel(this.level);
  }
}
