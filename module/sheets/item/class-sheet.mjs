import ItemSheetFS4 from "../item-sheet.mjs";

export default class ClassSheetFS4 extends ItemSheetFS4 {
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    let perkText = item.system.perks
      .map((perk) => `<li>@UUID[Item.${perk.id}]</li>`)
      .join("");
    if (perkText === "") {
      perkText = `<li>${game.i18n.localize(
        "fs4.perks.special_see_with_gm"
      )}</li>`;
    }
    const factionText = item.system.factions
      .map((faction) => `<li>@UUID[Item.${faction.id}]</li>`)
      .join("");
    const callingText = item.system.callings
      .map((calling) => `<li>@UUID[Item.${calling.id}]</li>`)
      .join("");

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
      specialCharacteristics: item.system.characteristics[0].length === 0,
      specialSkills: item.system.skills[0].length === 0,

      perks: await TextEditor.enrichHTML(`<ul>${perkText}</ul>`, {
        async: true,
      }),
      factions: await TextEditor.enrichHTML(`<ul>${factionText}</ul>`, {
        async: true,
      }),
      callings: await TextEditor.enrichHTML(`<ul>${callingText}</ul>`, {
        async: true,
      }),
    });

    return context;
  }
}
