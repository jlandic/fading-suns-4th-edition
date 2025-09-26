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
