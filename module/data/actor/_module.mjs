import CharacterData from "./character.mjs";

export { CharacterData };

export const config = {
  character: CharacterData,
};

export const trackableAttributes = {
  character: {
    bar: ["vitality"],
    value: ["bank.vp"],
  },
};
