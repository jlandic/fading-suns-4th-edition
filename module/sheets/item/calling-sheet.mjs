import ItemSheetFS4 from "../item-sheet.mjs";

export default class CallingSheetFS4 extends ItemSheetFS4 {
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    let perkText = item.system.perks
      .map((perk) => `<li>@UUID[Item.${perk.id}]</li>`)
      .join("");
    if (perkText === "") {
      perkText = `<li>${game.i18n.localize("fs4.perks.seeWithGm")}</li>`;
    }

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

      perks: await TextEditor.enrichHTML(`<ul>${perkText}</ul>`, {
        async: true,
      }),
      isOpen: item.system.class === undefined,
      class: item.system.class
        ? await TextEditor.enrichHTML(`@UUID[Item.${item.system.class.id}]`, {
            async: true,
          })
        : game.i18n.localize("fs4.perks.specialPreconditions.open"),
    });

    return context;
  }
}
