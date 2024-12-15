import * as dataModels from "./module/data/_module.mjs";

globalThis.fs4 = {
  dataModels,
};

Hooks.once("init", () => {
  globalThis.fs4 = game.fs4 = Object.assign(game.system, globalThis.fs4);
  console.log("FS4 | Initializing the system");

  CONFIG.Actor.dataModels = dataModels.actor.config;
});
