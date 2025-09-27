import ItemSheetFS4 from "./item-sheet.mjs";

export default class SimpleItemSheetFS4 extends ItemSheetFS4 {
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);

    if (options.isFirstRender) {
      options.position.height = "400";
    }
  }

  get mainPart() {
    return "simpleItem";
  }
}
