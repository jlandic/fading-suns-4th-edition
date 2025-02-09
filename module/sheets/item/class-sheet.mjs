import ItemSheetFS4 from "../item-sheet.mjs";

export default class ClassSheetFS4 extends ItemSheetFS4 {
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

      characteristics: item.system.characteristics.map((characteristicBundle) =>
        characteristicBundle
          .map(({ name, value }) => `${name} +${value}`)
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
      specialCharacteristics: item.system.characteristics[0].length === 0,

      skills: item.system.skills.map((skillBundle) =>
        skillBundle
          .map(({ name, value }) => `${name} +${value}`)
          .join(game.i18n.localize("fs4.base.orSeparator"))
      ),
      specialSkills: item.system.skills[0].length === 0,
    });

    return context;
  }
}
