import { config } from "../../data/item/_module.mjs";
import ItemSheetFS4 from "../item-sheet.mjs";

export default class SimpleItemWithTypeSheetFS4 extends ItemSheetFS4 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      height: 400,
    });
  }

  get template() {
    return `systems/fs4/templates/item/simple-item-with-type.hbs`;
  }

  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      types: config[item.type].types.map((type) => ({
        name: game.i18n.localize(`fs4.${item.type}.types.${type}`),
        value: type,
      })),
    });

    return context;
  }
}
