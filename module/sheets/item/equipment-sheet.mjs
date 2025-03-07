import ItemSheetFS4 from "../item-sheet.mjs";

export default class EquipmentSheetFS4 extends ItemSheetFS4 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      height: 410,
    });
  }

  static get references() {
    return {
      techCompulsion: "techCompulsion",
    };
  }
}
