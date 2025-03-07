import ItemSheetFS4 from "../item-sheet.mjs";

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

  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),
      patrons: await TextEditor.enrichHTML(item.system.patrons, {
        async: true,
      }),
      capabilities: await TextEditor.enrichHTML(item.system.capabilities, {
        async: true,
      }),
      perk: await TextEditor.enrichHTML(item.system.perk, {
        async: true,
      }),
      equipment: await TextEditor.enrichHTML(item.system.equipment, {
        async: true,
      }),

      characteristics: item.system.characteristics.map((characteristicBundle) =>
        characteristicBundle
          .map(({ name: key, value }) => {
            const name = game.i18n.localize(`fs4.characteristics.${key}`);
            return `${name} +${value}`;
          })
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
      skills: item.system.skills.map((skillBundle) =>
        skillBundle
          .map(({ name: key, value }) => {
            const name = game.i18n.localize(`fs4.skills.${key}`);
            return `${name} +${value}`;
          })
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
    });

    if (item.system.open) {
      context.class = game.i18n.localize(`fs4.callings.open`);
    }

    return context;
  }
}
