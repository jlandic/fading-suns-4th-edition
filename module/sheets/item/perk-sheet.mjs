import { PERK_SOURCE_TYPES, PERK_TYPES } from "../../registry/perks.mjs";
import ItemSheetFS4 from "../item-sheet.mjs";

export default class PerkSheetFS4 extends ItemSheetFS4 {
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),

      benefice: await TextEditor.enrichHTML(item.system.benefice, {
        async: true,
      }),

      types: PERK_TYPES,
      sourceTypes: PERK_SOURCE_TYPES,
    });

    return context;
  }
}
