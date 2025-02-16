export default class ItemSheetFS4 extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      tabs: [],
      width: 560,
      resizable: true,
      classes: ["sheet", "item"],
      dragDrop: [
        {
          dropSelector: ".drop",
        },
      ],
    });
  }

  get template() {
    return `systems/fs4/templates/item/${this.item.type}.hbs`;
  }

  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;
    const source = item.toObject();

    foundry.utils.mergeObject(context, {
      source: source.system,
      system: item.system,
      user: game.user,
      itemType: game.i18n.localize(`fs4.itemTypes.${this.item.type}`),
    });

    return context;
  }
}
