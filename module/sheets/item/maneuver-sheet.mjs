import { ADD_TO_ROLL_OPTIONS } from "../../data/item/maneuver.mjs";
import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { MANEUVER_TYPES } from "../../registry/maneuverTypes.mjs";
import { SKILLS } from "../../registry/skills.mjs";
import ItemSheetFS4 from "./item-sheet.mjs";

export default class ManeuverSheetFS4 extends ItemSheetFS4 {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      impact: await TextEditor.enrichHTML(this.item.system.impact, {
        async: true,
      }),
      resistance: await TextEditor.enrichHTML(this.item.system.resistance, {
        async: true,
      }),
      time: await TextEditor.enrichHTML(
        this.item.system.time,
        {
          async: true,
        }
      ),
      capability: await TextEditor.enrichHTML(this.item.system.capability, {
        async: true,
      }),

      skills: SKILLS.map((skill) => ({
        name: game.i18n.localize(`fs4.skills.${skill}`),
        value: skill,
      })).sort((a, b) => a.name.localeCompare(b.name)),
      characteristics: CHARACTERISTICS.map((characteristic) => ({
        name: game.i18n.localize(`fs4.characteristics.${characteristic}`),
        value: characteristic,
      })),
      addToRollOptions: ADD_TO_ROLL_OPTIONS.map((option) => ({
        name: game.i18n.localize(`fs4.maneuver.addToRollOptions.${option}`),
        value: option,
        selected: this.item.system.addWeaponToRoll === option,
      })),
      typeOptions: MANEUVER_TYPES.map((option) => ({
        name: game.i18n.localize(`fs4.maneuver.types.${option}`),
        value: option,
        selected: this.item.system.type === option,
      })),
    });

    return context;
  }
}
