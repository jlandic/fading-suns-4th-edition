import { config } from "../../data/item/_module.mjs";
import SimpleItemSheetFS4 from "./simple-item-sheet.mjs";

export default class SimpleItemWithTypeSheetFS4 extends SimpleItemSheetFS4 {
  get mainPart() {
    return "simpleItemWithType";
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      types: config[this.item.type].types.map((type) => ({
        name: game.i18n.localize(`fs4.${this.item.type}.types.${type}`),
        value: type,
      })),
    });

    return context;
  }
}
