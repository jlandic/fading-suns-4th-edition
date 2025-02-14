import { configurePdfMapping } from "./module/scripts/configurePdfMapping.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import { rollSkill } from "./module/scripts/rollSkill.mjs";
import { skillFromLabel } from "./module/registry/pdfLabelMapping.mjs";
import PerkSheetFS4 from "./module/sheets/item/perk-sheet.mjs";
import * as utils from "./module/utils.mjs";
import CapabilitySheetFS4 from "./module/sheets/item/capability-sheet.mjs";
import CallingSheetFS4 from "./module/sheets/item/calling-sheet.mjs";
import ClassSheetFS4 from "./module/sheets/item/class-sheet.mjs";
import FactionSheetFS4 from "./module/sheets/item/faction-sheet.mjs";
import { registerHandlebarsHelpers } from "./module/handlebarHelpers.mjs";
import SpeciesSheetFS4 from "./module/sheets/item/species-sheet.mjs";

globalThis.fs4 = {
  dataModels,
};

Hooks.once("init", () => {
  globalThis.fs4 = game.fs4 = Object.assign(game.system, globalThis.fs4);
  console.log("FS4 | Initializing the system");

  CONFIG.Actor.dataModels = dataModels.actor.config;
  CONFIG.Actor.documentClass = documents.ActorFS4;
  CONFIG.Actor.trackableAttributes = dataModels.actor.trackableAttributes;

  CONFIG.Item.dataModels = dataModels.item.config;
  CONFIG.Item.documentClass = documents.ItemFS4;

  DocumentSheetConfig.unregisterSheet(Item, "core", ItemSheet);
  DocumentSheetConfig.registerSheet(Item, "fs4", PerkSheetFS4, {
    label: "FS4.sheets.PerkSheetFS4",
    types: ["perk"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", CapabilitySheetFS4, {
    label: "FS4.sheets.CapabilitySheetFS4",
    types: ["capability"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", CallingSheetFS4, {
    label: "FS4.sheets.CallingSheetFS4",
    types: ["calling"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ClassSheetFS4, {
    label: "FS4.sheets.ClassSheetFS4",
    types: ["class"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", FactionSheetFS4, {
    label: "FS4.sheets.FactionSheetFS4",
    types: ["faction"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", SpeciesSheetFS4, {
    label: "FS4.sheets.SpeciesSheetFS4",
    types: ["species"],
  });

  utils.preloadTemplates();
  registerHandlebarsHelpers();
});

Hooks.once("ready", async () => {
  if (game.user.isGM) {
    const rootFolder =
      game.folders.find((f) => f.name === "FS4" && f.type === "Macro") ||
      (await Folder.create({ name: "FS4", type: "Macro" }));
    const configMacroFolder =
      game.folders.find((f) => f.name === "Config" && f.type === "Macro") ||
      (await Folder.create({
        name: "Config",
        type: "Macro",
        folder: rootFolder.id,
      }));

    window.fs4.scripts.configurePdfMapping = configurePdfMapping;
    window.fs4.scripts.rollSkill = rollSkill;

    window.fs4.utils = {
      skillFromLabel,
    };

    const macros = [
      {
        name: game.i18n.localize("fs4.macros.configurePdfFieldMapping"),
        type: "script",
        folder: configMacroFolder.id,
        command: "window.fs4.scripts.configurePdfMapping();",
        img: "icons/svg/circle.svg",
      },
      {
        name: game.i18n.localize("fs4.macros.rollSkillFromSheet"),
        type: "script",
        folder: configMacroFolder.id,
        command:
          "window.fs4.scripts.rollSkill(window.fs4.utils.skillFromLabel(label))",
        flags: {
          "fading-suns-4th-edition.rollSkillFromSheet": true,
        },
      },
      {
        name: game.i18n.localize("fs4.macros.rollSkill"),
        type: "script",
        folder: rootFolder.id,
        command: "window.fs4.scripts.rollSkill()",
      },
    ];

    for (const macroData of macros) {
      const existingMacro = game.macros.find((m) => m.name === macroData.name);
      if (existingMacro == null) {
        await Macro.create(macroData);
      }
    }
  }
});
