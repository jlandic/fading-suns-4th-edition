import { findItem } from "../utils/dataAccess.mjs";

export default class ItemSheetFS4 extends foundry.appv1.sheets.ItemSheet {
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

  static get referenceCollections() {
    return {};
  }

  static get references() {
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
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),
    });

    this._prepareEmbeddedCollections(context);
    this._prepareReferences(context);

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".linked-item", this._onShowItem.bind(this));
    html.on("click", ".item-show", this._onShowItem.bind(this));
    html.on("click", ".item-delete", this._onDeleteEmbeddedItem.bind(this));

    html.on("focus", "input[type=number]", (event) => {
      event.preventDefault();
      event.currentTarget.select();
    });
  }

  async _onDrop(event) {
    await this._onDropItem(event);
  }

  _prepareEmbeddedCollections(context) {
    Object.keys(this.constructor.referenceCollections).forEach((type) => {
      const field = this.constructor.referenceCollections[type];
      context[field] = this.item.system[field].map((identifier) => {
        const linked = findItem(identifier);

        return {
          name: linked?.name,
          description: linked?.system?.description,
          identifier,
        };
      });
    });
  }

  _prepareReferences(context) {
    Object.keys(this.constructor.references).forEach((type) => {
      const field = this.constructor.references[type];
      const linked = findItem(this.item.system[field]);

      context[type] = {
        name: linked?.name,
        identifier: linked?.system?.identifier,
      };
    });
  }

  async _onDropItem(event) {
    console.debug("Received event", event);
    event.preventDefault();

    const { uuid } = TextEditor.getDragEventData(event);
    const item = await fromUuid(uuid);
    let field = this.constructor.references[item.type];
    if (field !== undefined) {
      this.item.addReference(item.system.identifier, field);
    } else {
      field = this.constructor.referenceCollections[item.type];
      this.item.addEmbeddedItem(item.system.identifier, field);
    }

    if (field === undefined)
      console.warn("This item has no reference of type", item.type);
  }

  _onShowItem(event) {
    console.debug("Received event", event);
    event.preventDefault();

    const identifier = event.currentTarget.closest(".item").dataset.identifier;
    const item = findItem(identifier);
    if (item) {
      item.sheet.render(true);
    }
  }

  _onDeleteEmbeddedItem(event) {
    console.debug("Received event", event);
    event.preventDefault();

    const id = event.currentTarget.closest(".item").dataset.identifier;
    const collectionName =
      event.currentTarget.closest(".collection").dataset.collectionName;
    this.item.removeEmbeddedItem(id, collectionName);
  }
}
