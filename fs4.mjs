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
import WeaponSheetFS4 from "./module/sheets/item/weapon-sheet.mjs";
import EquipmentSheetFS4 from "./module/sheets/item/equipment-sheet.mjs";
import AfflictionSheetFS4 from "./module/sheets/item/affliction-sheet.mjs";
import ShieldSheetFS4 from "./module/sheets/item/shield-sheet.mjs";

const {
  DocumentSheetConfig,
} = foundry.applications.apps;
const {
  Actors,
} = foundry.documents.collections;

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
  CONFIG.Item.documentClass = documents.ItemProxyFS4;

  Actors.registerSheet("fs4", CharacterSheetFS4, {
    types: ["character"],
    label: "fs4.sheets.CharacterSheetFS4",
    makeDefault: true,
  });
  DocumentSheetConfig.registerSheet(Actor, "fs4", CharacterSheetFS4, {
    label: "fs4.sheets.CharacterSheetFS4",
    makeDefault: true,
    types: ["character"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", PerkSheetFS4, {
    label: "fs4.sheets.PerkSheetFS4",
    makeDefault: true,
    types: ["perk"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", CapabilitySheetFS4, {
    label: "fs4.sheets.CapabilitySheetFS4",
    makeDefault: true,
    types: ["capability"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", CallingSheetFS4, {
    label: "fs4.sheets.CallingSheetFS4",
    makeDefault: true,
    types: ["calling"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ClassSheetFS4, {
    label: "fs4.sheets.ClassSheetFS4",
    makeDefault: true,
    types: ["class"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", FactionSheetFS4, {
    label: "fs4.sheets.FactionSheetFS4",
    makeDefault: true,
    types: ["faction"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", SpeciesSheetFS4, {
    label: "fs4.sheets.SpeciesSheetFS4",
    makeDefault: true,
    types: ["species"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ManeuverSheetFS4, {
    label: "fs4.sheets.ManeuverSheetFS4",
    makeDefault: true,
    types: ["maneuver"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", SimpleItemSheetFS4, {
    label: "fs4.sheets.SimpleItemSheetFS4",
    makeDefault: true,
    types: [
      "blessing",
      "curse",
      "techCompulsion",
      "affliction",
      "armorFeature",
      "weaponFeature",
      "shieldFeature",
    ],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", SimpleItemWithTypeSheetFS4, {
    label: "fs4.sheets.SimpleItemWithTypeSheetFS4",
    makeDefault: true,
    types: ["state"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ArmorSheetFS4, {
    label: "fs4.sheets.ArmorSheetFS4",
    makeDefault: true,
    types: ["armor"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", WeaponSheetFS4, {
    label: "fs4.sheets.WeaponSheetFS4",
    makeDefault: true,
    types: ["weapon"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", ShieldSheetFS4, {
    label: "fs4.sheets.ShieldSheetFS4",
    makeDefault: true,
    types: ["shield"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", EquipmentSheetFS4, {
    label: "fs4.sheets.EquipmentSheetFS4",
    makeDefault: true,
    types: ["equipment"],
  });
  DocumentSheetConfig.registerSheet(Item, "fs4", AfflictionSheetFS4, {
    label: "fs4.sheets.AfflictionSheetFS4",
    makeDefault: true,
    types: ["affliction"],
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
