import { ARMOR_TYPES, ESHIELD_TYPES } from "../../registry/armorTypes.mjs";
import EquipmentSheetFS4 from "./equipment-sheet.mjs";

export default class ArmorSheetFS4 extends EquipmentSheetFS4 {
  static get referenceCollections() {
    return {
      armorFeature: "features",
    };
  }

  static get references() {
    return {
      ...super.references,
      capability: "capability",
    };
  }

  async _configureRenderOptions(options) {
    super._configureRenderOptions(options);

    options.actions = {
      ...options.actions,
      toggleArmorType: ArmorSheetFS4.#toggleArmorType,
    };
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

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
        checked: this.item.system.anti.includes(type),
      })),
    });

    return context;
  }

  static async #toggleArmorType(event, target) {
    event.preventDefault();

    const type = target.dataset.type;
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
