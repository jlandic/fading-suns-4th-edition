import { SKILLS } from "../registry/skills.mjs";

const fields = foundry.applications.fields;

export const selectSkillDialog = () => {
  const selectSkillInput = fields.createSelectInput({
    options: SKILLS.map((skill) => ({
      value: skill,
      label: game.i18n.localize(`fs4.skills.${skill}`),
    })).sort((a, b) => a.label.localeCompare(b.label)),
    name: "skill",
  });

  const selectGroup = fields.createFormGroup({
    input: selectSkillInput,
    label: game.i18n.localize("fs4.dialog.selectSkill.label"),
  });

  const selectSkillDialogContent = selectGroup.outerHTML;

  return foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("fs4.dialog.selectSkill.label") },
    content: selectSkillDialogContent,
    ok: {
      label: game.i18n.localize("fs4.dialog.common.buttons.ok"),
    },
  });
};
