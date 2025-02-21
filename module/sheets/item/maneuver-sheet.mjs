import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { SKILLS } from "../../registry/skills.mjs";
import { TIME_TYPES } from "../../registry/time.mjs";
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
      timeDescription: await TextEditor.enrichHTML(
        item.system.timeDescription,
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
      times: TIME_TYPES.map((time) => ({
        name: game.i18n.localize(`fs4.time.${time}`),
        value: time,
      })),

      hasTimeDescription: item.system.timeDescription.trim().length !== 0,
    });

    return context;
  }
}
