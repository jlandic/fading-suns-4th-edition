import ItemSheetFS4 from "../item-sheet.mjs";

export default class FactionSheetFS4 extends ItemSheetFS4 {
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      description: await TextEditor.enrichHTML(item.system.description, {
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
      blessing: await TextEditor.enrichHTML(item.system.blessing, {
        async: true,
      }),
      curse: await TextEditor.enrichHTML(item.system.curse, {
        async: true,
      }),

      characteristics: item.system.characteristics.map((characteristicBundle) =>
        characteristicBundle
          .map(({ key, value }) => {
            const name = game.i18n.localize(`fs4.characteristics.${key}`);
            return `${name} +${value}`;
          })
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
      skills: item.system.skills.map((skillBundle) =>
        skillBundle
          .map(({ key, value }) => {
            const name = game.i18n.localize(`fs4.skills.${key}`);
            return `${name} +${value}`;
          })
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
    });

    return context;
  }
}
