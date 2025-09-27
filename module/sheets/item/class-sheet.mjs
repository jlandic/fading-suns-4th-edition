import ItemSheetFS4 from "./item-sheet.mjs";

export default class ClassSheetFS4 extends ItemSheetFS4 {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    let perkText = this.item.system.perks
      .map((perk) => `<li>@UUID[Item.${perk.id}]</li>`)
      .join("");
    if (perkText === "") {
      perkText = `<li>${game.i18n.localize("fs4.perk.seeWithGm")}</li>`;
    }
    const factionText = this.item.system.factions
      .map((faction) => `<li>@UUID[Item.${faction.id}]</li>`)
      .join("");
    const callingText = this.item.system.callings
      .map((calling) => `<li>@UUID[Item.${calling.id}]</li>`)
      .join("");

    foundry.utils.mergeObject(context, {
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
      specialCharacteristics: this.item.system.characteristics[0].length === 0,
      specialSkills: this.item.system.skills[0].length === 0,

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
