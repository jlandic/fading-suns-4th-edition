import ItemSheetFS4 from "../item-sheet.mjs";

export default class SpeciesSheetFS4 extends ItemSheetFS4 {
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;

    foundry.utils.mergeObject(context, {
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),
      speed: item.system.speed.join("/"),
    });

    return context;
  }
}
