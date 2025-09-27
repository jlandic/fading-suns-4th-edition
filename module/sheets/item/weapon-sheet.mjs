import { ARMOR_TYPES } from "../../registry/armorTypes.mjs";
import { SIZES } from "../../registry/size.mjs";
import EquipmentSheetFS4 from "./equipment-sheet.mjs";

export default class WeaponSheetFS4 extends EquipmentSheetFS4 {
  static get referenceCollections() {
    return {
      weaponFeature: "features",
    };
  }

  static get references() {
    return {
      capability: "capability",
    };
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      armorTypes: ARMOR_TYPES.map((type) => ({
        name: game.i18n.localize(`fs4.armorTypes.short.${type}`),
        richName: game.i18n.localize(`fs4.armorTypes.${type}`),
        type,
        checked: this.item.system.anti.includes(type),
      })),
      sizes: SIZES.map((size) => ({
        name: game.i18n.localize(`fs4.size.short.${size}`),
        richName: game.i18n.localize(`fs4.size.${size}`),
        value: size,
      })),
    });

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".armor-type", this._toggleAntiType.bind(this));
    html.on(
      "change",
      "input[name='system.melee']",
      this._onToggleRange.bind(this)
    );
  }

  _onToggleRange(event) {
    event.preventDefault();

    if (this.item.system.melee === false) {
      this.item.update({
        system: { range: { short: 0, long: 0, extreme: false } },
      });
    }
  }

  async _toggleAntiType(event) {
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
