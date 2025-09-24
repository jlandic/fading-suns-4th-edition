import { ARMOR_TYPES, ESHIELD_TYPES } from "../../registry/armorTypes.mjs";
import { SIZES } from "../../registry/size.mjs";
import EquipmentSheetFS4 from "./equipment-sheet.mjs";

export default class ShieldSheetFS4 extends EquipmentSheetFS4 {
  static get referenceCollections() {
    return {
      shieldFeature: "features",
    };
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      height: 410,
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      sizes: SIZES.map((size) => ({
        name: game.i18n.localize(`fs4.size.short.${size}`),
        richName: game.i18n.localize(`fs4.size.${size}`),
        value: size,
      })),
      shieldTypes: ESHIELD_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.eshieldTypes.short.${type}`),
        richName: game.i18n.localize(`fs4.eshieldTypes.${type}`),
        type,
        checked: item.system.compatibility.includes(type),
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

    html.on("click", ".eshield-type", this._toggleCompatibleType.bind(this));
    html.on("click", ".armor-type", this._toggleArmorType.bind(this));
  }

  async _toggleCompatibleType(event) {
    event.preventDefault();

    const type = event.currentTarget.dataset.type;
    const compatibility = this.item.system.compatibility;
    const index = compatibility.indexOf(type);

    if (index === -1) {
      compatibility.push(type);
    } else {
      compatibility.splice(index, 1);
    }

    await this.item.update({ system: { compatibility } });
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
