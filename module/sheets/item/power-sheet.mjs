import { COMPONENTS, POWER_SCHOOLS } from "../../data/item/power.mjs";
import ManeuverSheetFS4 from "./maneuver-sheet.mjs";

export default class PowerSheetFS4 extends ManeuverSheetFS4 {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      actions: {
        toggleComponent: PowerSheetFS4.#toggleComponent,
      }
    }
  );

  get mainPart() {
    return "maneuver";
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      includePowerFields: true,
      elementaryI18nKey: `fs4.power.fields.elementary.${this.item.system.school}`,
      schoolOptions: POWER_SCHOOLS.map((school) => ({
        name: game.i18n.localize(`fs4.power.schools.${school}`),
        value: school,
        selected: this.item.system.school === school,
      })),
      componentOptions: COMPONENTS.map((component) => ({
        name: game.i18n.localize(`fs4.power.components.${component}`),
        value: component,
        selected: this.item.system.components[component],
      })),
    });

    return context;
  }

  static async #toggleComponent(event, target) {
    event.preventDefault();

    const { type } = target.dataset;
    if (!COMPONENTS.includes(type)) return;

    await this.item.update({
      system: {
        components: {
          [type]: !this.item.system.components[type],
        },
      },
    });
  }
}
