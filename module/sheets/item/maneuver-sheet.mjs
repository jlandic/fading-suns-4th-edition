import { ADD_TO_ROLL_OPTIONS } from "../../data/item/maneuver.mjs";
import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { MANEUVER_TYPES } from "../../registry/maneuverTypes.mjs";
import { SKILLS } from "../../registry/skills.mjs";
import ItemSheetFS4 from "../item-sheet.mjs";

export default class ManeuverSheetFS4 extends ItemSheetFS4 {
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),
      impact: await TextEditor.enrichHTML(item.system.impact, {
        async: true,
      }),
      resistance: await TextEditor.enrichHTML(item.system.resistance, {
        async: true,
      }),
      time: await TextEditor.enrichHTML(
        item.system.time,
        {
          async: true,
        }
      ),
      capability: await TextEditor.enrichHTML(item.system.capability, {
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
        selected: item.system.addWeaponToRoll === option,
      })),
      typeOptions: MANEUVER_TYPES.map((option) => ({
        name: game.i18n.localize(`fs4.maneuver.types.${option}`),
        value: option,
        selected: item.system.type === option,
      })),
    });

    return context;
  }
}
