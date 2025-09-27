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
    });

    return context;
  }
}
