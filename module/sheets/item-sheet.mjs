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

  static get embeddedCollections() {
    return {};
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
      itemType: game.i18n.localize(`TYPES.Item.${this.item.type}`),
    });

    return context;
  }

  _prepareCollection(itemType) {
    return this.item.system[this.constructor.embeddedCollections[itemType]].map((id) => {
      const { name, system: { description } } = game.items.get(id);

      return {
        name,
        description,
        id,
      }
    });
  }

  async _onDropEmbeddedItem(event) {
    event.preventDefault();

    const { uuid } = TextEditor.getDragEventData(event);
    const item = await fromUuid(uuid);
    const collectionName = this.constructor.embeddedCollections[item.type];

    if (collectionName === undefined) {
      console.warn("This item has no embedded collection of type", item.type);
      return;
    }

    await this.item.addEmbeddedItem(item, collectionName);
  }

  _onShowItem(event) {
    event.preventDefault();

    const id = event.currentTarget.closest(".item").dataset.id;
    const item = game.items.get(id);
    if (item) {
      item.sheet.render(true);
    }
  }

  _onDeleteEmbeddedItem(event) {
    event.preventDefault();

    const id = event.currentTarget.closest(".item").dataset.id;
    const collectionName = event.currentTarget.closest(".collection").dataset.collectionName;
    this.item.removeEmbeddedItem(id, collectionName);
  }
}
