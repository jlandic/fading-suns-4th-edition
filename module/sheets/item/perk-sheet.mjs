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

      preconditions: await TextEditor.enrichHTML(
        item.system.preconditions
          .map((conditionSet) =>
            conditionSet
              .map((condition) => {
                if (condition.special) {
                  return condition.text;
                } else {
                  return `@UUID[Item.${condition.id}]`;
                }
              })
              .join(game.i18n.localize("fs4.base.andSeparator"))
          )
          .join(game.i18n.localize("fs4.base.orSeparator")),
        { async: true }
      ),

      types: PERK_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.perk.types.${type}`),
        value: type,
      })),
      sourceTypes: PERK_SOURCE_TYPES.map((sourceType) => ({
        name: game.i18n.localize(`fs4.perk.sourceTypes.${sourceType}`),
        value: sourceType,
      })),
    });

    return context;
  }
}
