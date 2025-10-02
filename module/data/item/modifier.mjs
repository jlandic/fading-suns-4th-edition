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
    });
  }

  get valueAsNumber() {
    return Number(this.value);
  }

  async edit() {
    await new ModifierSheet(this).render(true);
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
