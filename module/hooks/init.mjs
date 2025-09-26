export const preUpdateActor = (actor, update) => {
  const source = actor.toObject();

  function walk(obj, path = []) {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const currentPath = path.concat(key);

      if (value && typeof value === "object" && !Array.isArray(value)) {
        walk(value, currentPath);
      } else if (typeof value === "string" && /^[+-]\d+$/.test(value)) {
        const fullPath = currentPath.join(".");
        const current = foundry.utils.getProperty(source, fullPath);
        const base = (typeof current === "number") ? current : (parseInt(current) || 0);

        foundry.utils.setProperty(update, fullPath, base + parseInt(value));
      }
    }
  }

  walk(update);
};

export const hotbarDrop = async (_hotbar, data, slot) => {
  const {
    type,
    roll,
    itemId,
    actorId,
  } = data;

  const actor = Actor.get(actorId);
  const item = actor?.items?.get(itemId);

  const folder = game.folders.find((f) => f.name === "Hotbar" && f.type === "Macro");
  if (folder == null) return;

  let command = "";
  let name = new Handlebars.SafeString(item?.name);
  if (type === "maneuver") {
    command = `Actor.get("${actor.id}")?.rollManeuver("${item.id}");`;
  } else if (type === "skill") {
    name = game.i18n.localize(`fs4.skills.${roll}`);
    command = `Actor.get("${actor.id}")?.rollSkill("${roll}");`;
  }

  if (command === "") return;

  const macro =
    game.macros.find(m => m.name === name && m.command === command) ??
    (await Macro.create({
      type: "script",
      name,
      command,
      folder: folder.id,
    })) ??
    null;

  if (macro == null) return;

  await game.user.assignHotbarMacro(macro, slot);
}
