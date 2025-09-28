import { QUALITY_LEVELS } from "../../data/item/equipment.mjs";
import ItemSheetFS4 from "./item-sheet.mjs";

export default class EquipmentSheetFS4 extends ItemSheetFS4 {
  static get references() {
    return {
      techCompulsion: "techCompulsion",
    };
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      isEquipment: true,
      qualityOptions: QUALITY_LEVELS.map((level) => ({
        name: game.i18n.localize(`fs4.equipment.quality.${level}`),
        value: level,
      })),
    });

    return context;
  }
}
