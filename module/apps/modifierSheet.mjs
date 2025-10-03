import { ModifierAttributeTypes, ModifierContext, ModifierTypes, ModifierValueTypes } from "../data/item/modifier.mjs";
import { CHARACTERISTICS } from "../registry/characteristics.mjs";
import { SKILLS } from "../registry/skills.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class ModifierSheet extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  constructor(modifier) {
    super();

    this.modifier = modifier;
  }

  static DEFAULT_OPTIONS = {
    position: { width: 400, height: "auto" },
    tag: "form",
    window: {
      icon: "fas fa-calculator",
      title: "fs4.apps.modifier",
      resizable: true,
      contentClasses: ["modifier"],
    },
    form: {
      handler: ModifierSheet.#onSubmit
    }
  };

  static PARTS = {
    main: {
      template: "systems/fs4/templates/apps/editModifier.hbs",
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      modifier: this.modifier.toObject(false),
      valueTypeOptions: Object.values(ModifierValueTypes).map((type) => ({
        value: type,
        label: game.i18n.localize(`fs4.modifier.valueTypes.${type}`),
      })),
      attributeTypeOptions: Object.values(ModifierAttributeTypes).map((type) => ({
        value: type,
        label: game.i18n.localize(`fs4.modifier.attributeTypes.${type}`),
      })),
      modifierTypeOptions: Object.values(ModifierTypes).map((type) => ({
        value: type,
        label: game.i18n.localize(`fs4.modifier.types.${type}`),
      })),
      skillOptions: SKILLS.map((skill) => ({
        value: skill,
        label: game.i18n.localize(`fs4.skills.${skill}`),
      })),
      characteristicOptions: CHARACTERISTICS.map((char) => ({
        value: char,
        label: game.i18n.localize(`fs4.characteristics.${char}`),
      })),
      resOptions: ["body", "mind", "spirit"].map((res) => ({
        value: res,
        label: game.i18n.localize(`fs4.character.fields.res.${res}`),
      })),
      contextOptions: Object.values(ModifierContext).map((context) => ({
        value: context,
        label: game.i18n.localize(`fs4.modifier.contexts.${context}`),
      })),
      maneuverOptions: game.items.filter(i => i.type === "maneuver").map((maneuver) => ({
        value: maneuver.system.id,
        label: maneuver.name,
      })).sort((a, b) => a.label.localeCompare(b.label)),
    });

    return context;
  }

  _onRender() {
    const valueTypeSelect = this.element.querySelector("#value-type-select");
    const attributeSelect = this.element.querySelector("#attribute-select");
    const contextSelect = this.element.querySelector("#context-select");

    contextSelect.addEventListener("change", (event) => {
      event.preventDefault();
      const newContext = event.target.value;
      this.#initializeManeuverSelect(newContext);
    });

    attributeSelect.addEventListener("change", (event) => {
      event.preventDefault();
      const newAttribute = event.target.value;
      this.#initializeAffectedAttributeSelect(newAttribute);
      this.#initializeContextSelect(newAttribute);
    });

    valueTypeSelect.addEventListener("change", (event) => {
      event.preventDefault();
      const newValueType = event.target.value;
      this.#initializeValueInput(newValueType);
    });

    this.#initializeValueInput(this.modifier.valueType);
    this.#initializeAffectedAttributeSelect(this.modifier.attribute);
    this.#initializeContextSelect(this.modifier.attribute);
    this.#initializeManeuverSelect(this.modifier.context);
  }

  static async #onSubmit(event, _form, formData) {
    event.preventDefault();

    await this.modifier.updateParent(formData);
  }

  #initializeManeuverSelect(context) {
    const maneuverSelect = this.element.querySelector("#maneuver-select");

    if (context === ModifierContext.SPECIFIC_MANEUVER) {
      maneuverSelect.disabled = false;
    } else {
      maneuverSelect.disabled = true;
      maneuverSelect.value = "";
    }
  }

  #initializeContextSelect(attribute) {
    const contextSelect = this.element.querySelector("#context-select");

    if (attribute === ModifierAttributeTypes.GOAL) {
      contextSelect.value = ModifierContext.NONE;
      contextSelect.disabled = false;
    } else {
      contextSelect.value = ModifierContext.NONE;
      contextSelect.disabled = true;
    }
  }

  #initializeValueInput(valueType) {
    const valueInput = this.element.querySelector("#value-input");

    switch (valueType) {
      case ModifierValueTypes.CONSTANT:
        valueInput.type = "number";
        valueInput.value = Number.isNaN(Number(this.modifier.value)) ? 0 : Number(this.modifier.value);
        valueInput.disabled = false;
        break;
      case ModifierValueTypes.FORMULA:
        valueInput.type = "text";
        valueInput.disabled = true;
        break;
      case ModifierValueTypes.FAVORABLE:
      case ModifierValueTypes.UNFAVORABLE:
        valueInput.type = "number";
        valueInput.value = "";
        valueInput.disabled = true;
        break;
      default:
        valueInput.type = "number";
        valueInput.value = Number.isNaN(Number(this.modifier.value)) ? 0 : Number(this.modifier.value);
        valueInput.disabled = false;
        break;
    }
  }

  #initializeAffectedAttributeSelect(attribute) {
    const affectedAttributeSelect = this.element.querySelector("#affected-attribute-select");

    switch (attribute) {
      case ModifierAttributeTypes.CHARACTERISTIC:
        affectedAttributeSelect.disabled = false;
        affectedAttributeSelect.innerHTML = Object.values(CHARACTERISTICS).map((characteristic) => {
          return `<option value="${characteristic}">${game.i18n.localize(`fs4.characteristics.${characteristic}`)}</option>`;
        }).join("\n");
        break;
      case ModifierAttributeTypes.SKILL:
        affectedAttributeSelect.disabled = false;
        affectedAttributeSelect.innerHTML = Object.values(SKILLS).map((skill) => {
          return `<option value="${skill}">${game.i18n.localize(`fs4.skills.${skill}`)}</option>`;
        }).join("\n");
        break;
      case ModifierAttributeTypes.RES:
        affectedAttributeSelect.disabled = false;
        affectedAttributeSelect.innerHTML = Object.values(["body", "mind", "spirit"]).map((res) => {
          return `<option value="${res}">${game.i18n.localize(`fs4.character.fields.res.${res}`)}</option>`;
        }).join("\n");
        break;
      default:
        affectedAttributeSelect.disabled = true;
        affectedAttributeSelect.innerHTML = "";
        break;
    }
  }
}
