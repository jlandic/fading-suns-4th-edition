import { configurePdfMapping } from "./module/scripts/configurePdfMapping.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import { rollSkill } from "./module/scripts/rollSkill.mjs";
import { skillFromLabel } from "./module/registry/pdfLabelMapping.mjs";

globalThis.fs4 = {
  dataModels,
};

Hooks.once("init", () => {
  globalThis.fs4 = game.fs4 = Object.assign(game.system, globalThis.fs4);
  console.log("FS4 | Initializing the system");

  CONFIG.Actor.dataModels = dataModels.actor.config;
  CONFIG.Actor.documentClass = documents.ActorFS4;
  CONFIG.Actor.trackableAttributes = dataModels.actor.trackableAttributes;
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
