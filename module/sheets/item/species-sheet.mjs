import ItemSheetFS4 from "./item-sheet.mjs";

export default class SpeciesSheetFS4 extends ItemSheetFS4 {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      speed: this.item.system.speed.join("/"),
    });

    return context;
  }
}
