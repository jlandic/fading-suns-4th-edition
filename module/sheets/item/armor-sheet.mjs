import { ARMOR_TYPES, ESHIELD_TYPES } from "../../registry/armorTypes.mjs";
import ItemSheetFS4 from "../item-sheet.mjs";

export default class ArmorSheetFS4 extends ItemSheetFS4 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      height: 410,
    });
  }

  static get referenceCollections() {
    return {
      armorFeature: "features",
    };
  }

  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      eshieldTypes: ESHIELD_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.eshieldTypes.short.${type}`),
        richName: game.i18n.localize(`fs4.eshieldTypes.${type}`),
        value: type,
      })),
      armorTypes: ARMOR_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.armorTypes.short.${type}`),
        richName: game.i18n.localize(`fs4.armorTypes.${type}`),
        type,
        checked: item.system.anti.includes(type),
      })),
    });

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".armor-type", this._toggleArmorType.bind(this));
  }

  async _toggleArmorType(event) {
    event.preventDefault();

    const type = event.currentTarget.dataset.type;
    const anti = this.item.system.anti;
    const index = anti.indexOf(type);

    if (index === -1) {
      anti.push(type);
    } else {
      anti.splice(index, 1);
    }

    await this.item.update({ system: { anti } });
  }
}
