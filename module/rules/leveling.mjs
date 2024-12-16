export const getSurgeAndRevivalAmountForLevel = (level) => {
  if (level < 4) return 1;
  if (level < 7) return 2;
  if (level < 10) return 3;

  return 4;
};

export const getBankCapacityForLevel = (level) => {
  return Math.floor(level / 2) * 5 + 5;
};
