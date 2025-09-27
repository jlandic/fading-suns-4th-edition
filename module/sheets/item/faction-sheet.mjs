import ItemSheetFS4 from "./item-sheet.mjs";

export default class FactionSheetFS4 extends ItemSheetFS4 {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      capabilities: await TextEditor.enrichHTML(this.item.system.capabilities, {
        async: true,
      }),
      perk: await TextEditor.enrichHTML(this.item.system.perk, {
        async: true,
      }),
      equipment: await TextEditor.enrichHTML(this.item.system.equipment, {
        async: true,
      }),
      blessing: await TextEditor.enrichHTML(this.item.system.blessing, {
        async: true,
      }),
      curse: await TextEditor.enrichHTML(this.item.system.curse, {
        async: true,
      }),

      characteristics: this.item.system.characteristics.map((characteristicBundle) =>
        characteristicBundle
          .map(({ name: key, value }) => {
            const name = game.i18n.localize(`fs4.characteristics.${key}`);
            return `${name} +${value}`;
          })
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
      skills: this.item.system.skills.map((skillBundle) =>
        skillBundle
          .map(({ name: key, value }) => {
            const name = game.i18n.localize(`fs4.skills.${key}`);
            return `${name} +${value}`;
          })
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
    });

    return context;
  }
}
