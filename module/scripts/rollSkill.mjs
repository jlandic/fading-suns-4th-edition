import { CHARACTERISTICS } from "../registry/characteristics.mjs";
import { SKILLS } from "../registry/skills.mjs";

const { getProperty } = foundry.utils;

export const rollSkill = (selectedSkill, sourceActor = undefined) => {
  const actor = sourceActor || canvas.tokens.controlled[0]?.actor;

  if (actor == null) {
    ui.notifications.error(
      game.i18n.localize("fs4.notifications.error.noTokenSelected")
    );
    return;
  }

  const characteristicsMap = CHARACTERISTICS.reduce(
    (acc, key) => ({
      ...acc,
      [key]: game.i18n.localize(`fs4.characteristics.${key}`),
    }),
    {}
  );

  let dialogContent = `
    <p>${game.i18n.localize("fs4.dialog.rollSkill.selectACharacteristic")}:</p>
    <p>
      <select id="characteristic">
        ${Object.entries(characteristicsMap)
          .map(
            ([key, value]) =>
              `<option value="${key}">${value} (${actor.system.characteristics[key]})</option>`
          )
          .join("")}
      </select>
    </p>
  `;

  if (selectedSkill == undefined) {
    const skillsMap = SKILLS.reduce(
      (acc, key) => ({
        ...acc,
        [key]: game.i18n.localize(`fs4.skills.${key}`),
      }),
      {}
    );

    dialogContent += `
      <p>${game.i18n.localize("fs4.dialog.rollSkill.selectASkill")}:</p>
      <p>
        <select id="skill">
          ${Object.entries(skillsMap)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(
              ([key, value]) =>
                `<option value="${key}">${value} (${actor.system.skills[key]})</option>`
            )
            .join("")}
        </select>\
      </p>
    `;
  }

  new Dialog({
    title: game.i18n.localize("fs4.dialog.rollSkill.title"),
    content: dialogContent,
    buttons: {
      roll: {
        label: game.i18n.localize("fs4.dialog.rollSkill.buttons.roll"),
        callback: async (html) => {
          const characteristic = html.find("#characteristic").val();
          const skill = selectedSkill || html.find("#skill").val();

          const characteristicValue = getProperty(
            actor,
            `system.characteristics.${characteristic}`
          );
          const skillValue = getProperty(actor, `system.skills.${skill}`);

          let roll = await new Roll("1d20").roll();
          if (game.dice3d) {
            await game.dice3d.showForRoll(roll, game.user, true);
          }
          let rollResult = roll.total;
          let target = characteristicValue + skillValue;

          let pv = rollResult;
          if (rollResult > target) {
            pv = 0;
          }

          let message = `
            <p>
              <strong>
                ${game.i18n.localize(`fs4.characteristics.${characteristic}`)}
              </strong> (${characteristicValue})
              +
              <strong>
                ${game.i18n.localize(`fs4.skills.${skill}`)}
              </strong> (${skillValue})
            </p>
            <p><strong>${game.i18n.localize(
              "fs4.rules.target"
            )}</strong>: ${characteristicValue} + ${skillValue} = ${target}</p>

            <p><strong>${game.i18n.localize(
              "fs4.dialog.rollSkill.result"
            )}</strong>: ${rollResult}</p>
          `;

          if (pv > 0) {
            message += `<p><strong>${game.i18n.localize(
              "fs4.character.fields.pv"
            )}:</strong> ${pv}</p>`;

            if (rollResult == target) {
              message += `<p><strong>${game.i18n.localize(
                "fs4.dialog.rollSkill.criticalSuccess"
              )}!</strong></p>`;
            }
          } else if (rollResult == 20) {
            message += `<strong>${game.i18n.localize(
              "fs4.dialog.rollSkill.criticalFailure"
            )}!</strong>`;
          } else {
            message += `<strong>${game.i18n.localize(
              "fs4.dialog.rollSkill.failure"
            )}</strong>`;
          }

          ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: message,
          });
        },
      },
      cancel: {
        label: game.i18n.localize("fs4.dialog.common.buttons.cancel"),
      },
    },
    default: "roll",
  }).render(true);
};
