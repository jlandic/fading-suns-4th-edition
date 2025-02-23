import ItemSheetFS4 from "../item-sheet.mjs";

export default class SimpleItemSheetFS4 extends ItemSheetFS4 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      height: 400,
    });
  }

  get template() {
    return `systems/fs4/templates/item/simple-item.hbs`;
  }

  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),
    });

    return context;
  }
}
