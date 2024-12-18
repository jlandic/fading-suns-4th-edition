import { SKILLS } from "./skills.mjs";

export const skillLabels = () =>
  SKILLS.reduce((acc, skill) => {
    const labelText = game.i18n.localize(`fs4.skills.${skill}`);

    return {
      ...acc,
      [skill]: labelText,
    };
  }, {});

export const skillFromLabel = (labelText) => {
  for (const [skill, label] of Object.entries(skillLabels())) {
    if (label === labelText) {
      return skill;
    }
  }
};
