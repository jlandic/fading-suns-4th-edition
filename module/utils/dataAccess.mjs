export const findItem = (id) => {
  const item = game.items.get(id);

  if (item) return item;

  return game.items.find((item) => item.system.identifier === id);
};

export const findReferenceItem = (itemId, source = game.items) => {
  const item = source.get(itemId);
  if (!item) return null;

  return game.items.find((i) => i.system.identifier === item.system.identifier) ?? null;
}
