import {
  CAPABILITY_CATEGORIES,
  CAPABILITY_TYPES,
} from "../../registry/capabilities.mjs";
import ItemSheetFS4 from "../item-sheet.mjs";

export default class CapabilitySheetFS4 extends ItemSheetFS4 {
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),
      isReserved: item.system.reserved.length > 0,

      types: CAPABILITY_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.capabilities.types.${type}`),
        value: type,
      })),
      categories: CAPABILITY_CATEGORIES.map((category) => ({
        name: game.i18n.localize(`fs4.capabilities.categories.${category}`),
        value: category,
      })),
    });

    return context;
  }
}
