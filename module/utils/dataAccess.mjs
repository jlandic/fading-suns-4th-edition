export const findItem = (id) => {
  const item = game.items.get(id);

  if (item) return item;

  return game.items.find((item) => item.system.identifier === id);
};
