import ModifierSheet from "../../apps/modifierSheet.mjs";
import { ItemDataModel } from "../abstract.mjs";

const {
  StringField,
  BooleanField,
} = foundry.data.fields;

export const ModifierValueTypes = Object.freeze({
  CONSTANT: "constant",
  FORMULA: "formula",
  FAVORABLE: "favorable",
  UNFAVORABLE: "unfavorable",
});

export const ModifierAttributeTypes = Object.freeze({
  SKILL: "skill",
  CHARACTERISTIC: "characteristic",
  RES: "res",
  INITIATIVE: "initiative",
  GOAL: "goal",
});

export const ModifierTypes = Object.freeze({
  AUSTERITY: "austerity",
  UNTYPED: "untyped",
});

export const ModifierContext = Object.freeze({
  NONE: "none",
  RANGED_ATTACK: "ranged",
  MELEE_ATTACK: "melee",
  INFLUENCE_PERSUASION: "influence_persuasion",
  INFLUENCE_COERCION: "influence_coercion",
  INFLUENCE: "influence",
  DEFENSE: "defense",
  SPECIFIC_MANEUVER: "specific_maneuver",
  DAMAGE: "damage",
});

export default class ModifierData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      _id: new StringField({
        initial: () => foundry.utils.randomID(),
        required: true,
        readonly: false,
      }),
      name: new StringField({
        required: true,
        initial: () => "New Modifier",
        blank: false,
      }),
      value: new StringField({
        required: false,
        initial: "",
      }),
      valueType: new StringField({
        choices: Object.values(ModifierValueTypes),
        initial: ModifierValueTypes.CONSTANT,
      }),
      attribute: new StringField({
        choices: Object.values(ModifierAttributeTypes),
        initial: ModifierAttributeTypes.GOAL,
      }),
      affectedAttribute: new StringField({ initial: "" }),
      type: new StringField({
        choices: Object.values(ModifierTypes),
        initial: ModifierTypes.UNTYPED,
      }),
      active: new BooleanField({ initial: true }),
      notes: new StringField({ initial: "" }),
      context: new StringField({
        choices: Object.values(ModifierContext),
        initial: ModifierContext.NONE,
      }),
      maneuverId: new StringField({ initial: "" }),
    });
  }

  get valueAsNumber() {
    return Number(this.value);
  }

  async edit() {
    await new ModifierSheet(this).render(true);
  }

  get humanReadable() {
    if (this.valueType === ModifierValueTypes.FAVORABLE) {
      return game.i18n.localize("fs4.modifier.favorable");
    }

    if (this.valueType === ModifierValueTypes.UNFAVORABLE) {
      return game.i18n.localize("fs4.modifier.unfavorable");
    }

    if (this.attribute === ModifierAttributeTypes.GOAL) {
      return `${this.value >= 0 ? "+" : ""}${this.value}`;
    }

    const attributeName = game.i18n.localize(`${this.affectedAttributeI18nPrefix}${this.affectedAttribute}`);
    return `${attributeName} ${this.value >= 0 ? "+" : ""}${this.value}`;
  }

  get affectedAttributeI18nPrefix() {
    switch (this.attribute) {
      case ModifierAttributeTypes.CHARACTERISTIC:
        return "fs4.characteristics.";
      case ModifierAttributeTypes.SKILL:
        return "fs4.skills.";
      case ModifierAttributeTypes.RES:
        return "fs4.character.fields.res.";
      default:
        return "fs4.modifier.noAffectedAttribute";
    }
  }

  appliesToRoll(rollIntention) {
    if ([ModifierAttributeTypes.RES, ModifierAttributeTypes.INITIATIVE].includes(this.attribute)) {
      return false;
    }

    if (this.attribute === ModifierAttributeTypes.CHARACTERISTIC && this.affectedAttribute !== rollIntention.characteristic) {
      return false;
    }

    if (this.attribute === ModifierAttributeTypes.SKILL && this.affectedAttribute !== rollIntention.skill) {
      return false;
    }

    if (this.context === ModifierContext.NONE) {
      return true;
    }

    if (!rollIntention.maneuver) {
      return false;
    }

    switch (this.context) {
      case ModifierContext.RANGED_ATTACK:
        return rollIntention.maneuver.system.addWeaponToRoll === "ranged";
      case ModifierContext.MELEE_ATTACK:
        return rollIntention.maneuver.system.addWeaponToRoll === "melee";
      case ModifierContext.INFLUENCE_PERSUASION:
        return rollIntention.maneuver.system.type === "influence_persuasion";
      case ModifierContext.INFLUENCE_COERCION:
        return rollIntention.maneuver.system.type === "influence_coercion";
      case ModifierContext.INFLUENCE:
        return ["influence_persuasion", "influence_coercion", "influence"].includes(rollIntention.maneuver.system.type);
      case ModifierContext.SPECIFIC_MANEUVER:
        return rollIntention.maneuver.system.id === this.maneuverId;
      case ModifierContext.DEFENSE:
        return rollIntention.maneuver.system.type === "defense";
      case ModifierContext.DAMAGE:
        return false;
      default:
        return false;
    }
  }

  async updateParent(data) {
    if (!this.parent) {
      throw new Error("Modifier has no parent item to update");
    }

    const modifiers = this.parent.system.modifiers;
    const existing = modifiers.find((mod) => mod._id === this._id);
    if (!existing) {
      throw new Error("Modifier not found in parent item");
    }

    const index = modifiers.indexOf(existing);
    modifiers[index] = Object.fromEntries(data);

    await this.parent.update({
      "system.modifiers": modifiers,
    });
  }
}
