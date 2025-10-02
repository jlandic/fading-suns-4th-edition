import ModifierData from "../../data/item/modifier.mjs";
import { findItem } from "../../utils/dataAccess.mjs";

const { TextEditor } = foundry.applications.ux;

const TYPES_WITH_SHEET = [
  "affliction",
  "armor",
  "calling",
  "capability",
  "class",
  "equipment",
  "faction",
  "maneuver",
  "perk",
  "shield",
  "species",
  "weapon",
];

export default class ItemSheetFS4 extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2
) {
  static DEFAULT_OPTIONS = {
    position: { width: 560, height: 560 },
    tag: "form",
    window: {
      icon: "fas fa-box-open",
      title: "fs4.sheets.ItemSheetFS4",
      resizable: true,
      contentClasses: ["item"],
    },
    form: {
      submitOnChange: true,
    },
    actions: {
      showImage: ItemSheetFS4.#showImage,
      showItem: ItemSheetFS4.#showItem,
      editItem: ItemSheetFS4.#showItem,
      deleteItem: ItemSheetFS4.#deleteItem,
      clearLinkedItem: ItemSheetFS4.#clearLinkedItem,
      addModifier: ItemSheetFS4.#addModifier,
      editModifier: ItemSheetFS4.#editModifier,
      deleteModifier: ItemSheetFS4.#deleteModifier,
    },
  };

  static PARTS = {
    header: { template: "systems/fs4/templates/item/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    ...TYPES_WITH_SHEET.reduce((obj, type) => {
      obj[type] = { template: `systems/fs4/templates/item/${type}.hbs`, scrollable: [".scrollable"] };
      return obj;
    }, {}),
    simpleItem: { template: "systems/fs4/templates/item/simple-item.hbs", scrollable: [".scrollable"] },
    simpleItemWithType: { template: "systems/fs4/templates/item/simple-item-with-type.hbs", scrollable: [".scrollable"] },
    modifiers: { template: "systems/fs4/templates/shared/modifiers.hbs", scrollable: [".scrollable"] },
  };

  static TABS = {
    primary: {
      initial: "main",
      tabs: [
        {
          id: "main",
          cssClass: "tab-main",
          label: "fs4.sheets.tabs.information",
        },
        {
          id: "modifiers",
          cssClass: "tab-modifiers",
          label: "fs4.sheets.tabs.modifiers",
        }
      ]
    }
  }

  static get referenceCollections() {
    return {};
  }

  static get references() {
    return {};
  }

  get mainPart() {
    return this.item.type;
  }

  _configureRenderOptions(options) {
    super._configureRenderOptions(options);

    options.parts = [
      "header",
      "tabs",
      this.mainPart,
      "modifiers",
    ];
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      source: this.document,
      system: this.document.system,
      user: game.user,
      isGm: game.user.isGM,
      itemType: game.i18n.localize(`TYPES.Item.${this.document.type}`),
      description: await TextEditor.enrichHTML(this.document.system.description, {
        async: true,
      }),
    });

    this.#prepareEmbeddedCollections(context);
    this.#prepareReferences(context);

    this.item.system.modifiers = this.item.system.modifiers.map((mod) => {
      return new ModifierData(mod, { parent: this.item });
    });

    return context;
  }

  _onRender(context, options) {
    super._onRender(context, options);

    new foundry.applications.ux.DragDrop.implementation({
      callbacks: {
        drop: this._onDrop.bind(this)
      }
    }).bind(this.element);

    this.element.querySelectorAll("input[type=number]").forEach((input) => {
      input.addEventListener("focus", (event) => {
        event.preventDefault();
        event.currentTarget.select();
      });
    });
    this.element.querySelectorAll("input.enhanced-number").forEach((input) => {
      input.addEventListener("focus", (event) => {
        event.preventDefault();
        event.currentTarget.select();
      });
    });
  }

  async _onDrop(event) {
    await this.#onDropItem(event);
  }

  #prepareEmbeddedCollections(context) {
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

  #prepareReferences(context) {
    Object.keys(this.constructor.references).forEach((type) => {
      const field = this.constructor.references[type];
      const linked = findItem(this.item.system[field]);

      context[type] = {
        name: linked?.name,
        identifier: linked?.system?.identifier,
      };
    });
  }

  async #onDropItem(event) {
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

  static #showImage(event, target) {
    event.preventDefault();

    const popout = new foundry.applications.apps.ImagePopout({
      src: target.dataset.src,
      uuid: target.dataset.uuid,
      window: {
        title: target.dataset.name,
      }
    });

    popout.render(true);
  }

  static #showItem(event, target) {
    event.preventDefault();

    const identifier = target.dataset.itemId;
    const item = findItem(identifier);
    if (item) {
      item.sheet.render(true);
    }
  }

  static #deleteItem(event, target) {
    event.preventDefault();

    const id = target.dataset.itemId;
    const collection = target.dataset.collection;
    this.item.removeEmbeddedItem(id, collection);
  }

  static #clearLinkedItem(event, target) {
    event.preventDefault();

    const field = target.dataset.field;
    this.item.clearReference(field);
  }

  static async #addModifier(event) {
    event.preventDefault();

    const modifiers = this.item.system.modifiers.slice();
    modifiers.push(new ModifierData({
      name: this.item.name,
    }));

    await this.item.update({
      system: {
        modifiers,
      },
    });
  }

  static async #editModifier(event, target) {
    event.preventDefault();

    const id = target.dataset.modifierId;
    const modifier = this.item.system.modifiers.find((mod) => mod._id === id);
    if (modifier) {
      await modifier.edit();
    }
  }

  static async #deleteModifier(event, target) {
    event.preventDefault();

    const id = target.dataset.modifierId;
    const modifiers = this.item.system.modifiers.slice();
    const index = modifiers.findIndex((mod) => mod._id === id);
    if (index === -1) {
      console.warn(`Modifier with id ${id} not found`);
      return;
    }

    modifiers.splice(index, 1);
    this.item.update({
      system: {
        modifiers,
      },
    });
  }
}
