import * as dataModels from "./module/data/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import { rollSkill } from "./module/scripts/rollSkill.mjs";
import PerkSheetFS4 from "./module/sheets/item/perk-sheet.mjs";
import CapabilitySheetFS4 from "./module/sheets/item/capability-sheet.mjs";
import CallingSheetFS4 from "./module/sheets/item/calling-sheet.mjs";
import ClassSheetFS4 from "./module/sheets/item/class-sheet.mjs";
import FactionSheetFS4 from "./module/sheets/item/faction-sheet.mjs";
import { registerHandlebarsHelpers } from "./module/utils/handlebarHelpers.mjs";
import SpeciesSheetFS4 from "./module/sheets/item/species-sheet.mjs";
import { preloadTemplates } from "./module/utils/configureTemplates.mjs";
import CharacterSheetFS4 from "./module/sheets/actor/character-sheet.mjs";
import ManeuverSheetFS4 from "./module/sheets/item/maneuver-sheet.mjs";
import SimpleItemSheetFS4 from "./module/sheets/item/simple-item-sheet.mjs";
import SimpleItemWithTypeSheetFS4 from "./module/sheets/item/simple-item-with-type.mjs";
import ArmorSheetFS4 from "./module/sheets/item/armor-sheet.mjs";

globalThis.fs4 = {
  dataModels,
};

Hooks.once("init", () => {
  console.log("FS4 | Initializing the system");
  globalThis.fs4 = game.fs4 = Object.assign(game.system, globalThis.fs4);

  CONFIG.Actor.dataModels = dataModels.actor.config;
  CONFIG.Actor.documentClass = documents.ActorFS4;
  CONFIG.Actor.trackableAttributes = dataModels.actor.trackableAttributes;

  CONFIG.Item.dataModels = dataModels.item.config;
  CONFIG.Item.documentClass = documents.ItemFS4;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("fs4", CharacterSheetFS4, {
    types: ["character"],
    label: "fs4.sheets.CharacterSheetFS4",
    makeDefault: true,
  });
  DocumentSheetConfig.registerSheet(Actor, "fs4", CharacterSheetFS4, {
    label: "fs4.sheets.CharacterSheetFS4",
    types: ["character"],
  });
  DocumentSheetConfig.unregisterSheet(Item, "core", ItemSheet);
  DocumentSheetConfig.registerSheet(Item, "fs4", PerkSheetFS4, {
    label: "fs4.sheets.PerkSheetFS4",
    types: ["perk"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", CapabilitySheetFS4, {
    label: "fs4.sheets.CapabilitySheetFS4",
    types: ["capability"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", CallingSheetFS4, {
    label: "fs4.sheets.CallingSheetFS4",
    types: ["calling"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ClassSheetFS4, {
    label: "fs4.sheets.ClassSheetFS4",
    types: ["class"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", FactionSheetFS4, {
    label: "fs4.sheets.FactionSheetFS4",
    types: ["faction"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", SpeciesSheetFS4, {
    label: "fs4.sheets.SpeciesSheetFS4",
    types: ["species"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ManeuverSheetFS4, {
    label: "fs4.sheets.ManeuverSheetFS4",
    types: ["maneuver"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", SimpleItemSheetFS4, {
    label: "fs4.sheets.SimpleItemSheetFS4",
    types: [
      "blessing",
      "curse",
      "techCompulsion",
      "affliction",
      "armorFeature",
      "weaponFeature",
    ],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", SimpleItemWithTypeSheetFS4, {
    label: "fs4.sheets.SimpleItemWithTypeSheetFS4",
    types: ["state"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ArmorSheetFS4, {
    label: "fs4.sheets.ArmorSheetFS4",
    types: ["armor"],
  });

  preloadTemplates();
  registerHandlebarsHelpers();
});

Hooks.once("ready", async () => {
  if (game.user.isGM) {
    const rootFolder =
      game.folders.find((f) => f.name === "FS4" && f.type === "Macro") ||
      (await Folder.create({ name: "FS4", type: "Macro" }));

    window.fs4.scripts.rollSkill = rollSkill;

    const macros = [
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
