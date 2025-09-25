import { selectSkillDialog } from "../dialogs/selectSkill.mjs";

export const importManeuvers = async () => {
  const actor = canvas.tokens.controlled[0]?.actor;
  if (actor == null) {
    ui.notifications.error(
      game.i18n.localize("fs4.notifications.error.noTokenSelected")
    );
    return;
  }

  const { skill } = await selectSkillDialog();
  if (skill == null) return;

  const existingManeuvers = actor.items.filter(
    (item) => item.type === "maneuver" && item.system.skill === skill
  ).map((item) => item.system.id);

  const maneuvers = game.items.filter(
    (item) => item.type === "maneuver" && item.system.skill === skill && !existingManeuvers.includes(item.system.id)
  ).map((item) => item.toObject());

  await actor.createEmbeddedDocuments("Item", [maneuvers]);
}
