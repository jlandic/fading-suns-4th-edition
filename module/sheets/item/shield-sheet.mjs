import { ARMOR_TYPES, ESHIELD_TYPES } from "../../registry/armorTypes.mjs";
import { SIZES } from "../../registry/size.mjs";
import EquipmentSheetFS4 from "./equipment-sheet.mjs";

export default class ShieldSheetFS4 extends EquipmentSheetFS4 {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      actions: {
        toggleCompatibleType: ShieldSheetFS4.#toggleCompatibleType,
        toggleArmorType: ShieldSheetFS4.#toggleArmorType,
      }
    }
  );

  static get referenceCollections() {
    return {
      shieldFeature: "features",
    };
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

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
        checked: this.item.system.compatibility.includes(type),
      })),
      armorTypes: ARMOR_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.armorTypes.short.${type}`),
        richName: game.i18n.localize(`fs4.armorTypes.${type}`),
        type,
        checked: this.item.system.anti.includes(type),
      })),
    });

    return context;
  }

  static async #toggleCompatibleType(event, target) {
    event.preventDefault();

    const { type } = target.dataset;
    const compatibility = this.item.system.compatibility;
    const index = compatibility.indexOf(type);

    if (index === -1) {
      compatibility.push(type);
    } else {
      compatibility.splice(index, 1);
    }

    await this.item.update({ system: { compatibility } });
  }

  static async #toggleArmorType(event, target) {
    event.preventDefault();

    const { type } = target.dataset;
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
