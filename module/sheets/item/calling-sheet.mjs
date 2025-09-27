import ItemSheetFS4 from "./item-sheet.mjs";

export default class CallingSheetFS4 extends ItemSheetFS4 {
  static get references() {
    return {
      class: "class",
    };
  }

  static get referenceCollections() {
    return {
      perk: "perks",
    };
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      patrons: await TextEditor.enrichHTML(this.item.system.patrons, {
        async: true,
      }),
      perk: await TextEditor.enrichHTML(this.item.system.perk, {
        async: true,
      }),
      equipment: await TextEditor.enrichHTML(this.item.system.equipment, {
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

    if (this.item.system.open) {
      context.class = game.i18n.localize(`fs4.calling.open`);
    }

    return context;
  }
}
