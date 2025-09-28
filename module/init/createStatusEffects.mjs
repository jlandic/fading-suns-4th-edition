const createStatusEffects = () => {
  CONFIG.statusEffects = game.items
    .filter((i) => i.type === "state")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({
      id: i.system.id,
      label: i.name,
      img: i.img,
      _id: i.id.padEnd(16, "0"),
    }));
};

export default createStatusEffects;
