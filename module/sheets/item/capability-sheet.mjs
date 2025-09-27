import {
  CAPABILITY_CATEGORIES,
  CAPABILITY_TYPES,
} from "../../registry/capabilities.mjs";
import ItemSheetFS4 from "./item-sheet.mjs";

export default class CapabilitySheetFS4 extends ItemSheetFS4 {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      isReserved: this.item.system.reserved.length > 0,
      types: CAPABILITY_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.capability.types.${type}`),
        value: type,
      })),
      categories: CAPABILITY_CATEGORIES.map((category) => ({
        name: game.i18n.localize(`fs4.capability.categories.${category}`),
        value: category,
      })),
    });

    return context;
  }
}
