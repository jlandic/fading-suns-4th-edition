import { PERK_SOURCE_TYPES, PERK_TYPES } from "../../registry/perks.mjs";
import ItemSheetFS4 from "./item-sheet.mjs";

export default class PerkSheetFS4 extends ItemSheetFS4 {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      benefice: await TextEditor.enrichHTML(this.item.system.benefice, {
        async: true,
      }),

      preconditions: await TextEditor.enrichHTML(
        this.item.system.preconditions
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
