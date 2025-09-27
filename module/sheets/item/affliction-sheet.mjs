import ItemSheetFS4 from "./item-sheet.mjs";

export default class AfflictionSheetFS4 extends ItemSheetFS4 {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      effects: await TextEditor.enrichHTML(this.item.system.effects, {
        async: true,
      }),
      preconditions: await TextEditor.enrichHTML(
        this.item.system.preconditions.map((condition) => {
          if (condition.special) {
            return condition.text;
          } else {
            return `@UUID[Item.${condition.id}]`;
          }
        }).join(game.i18n.localize("fs4.base.orSeparator")),
        { async: true }
      ),
    });

    return context;
  }
}
