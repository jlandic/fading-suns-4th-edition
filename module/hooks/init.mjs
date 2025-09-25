export const preUpdateActor = (actor, update) => {
  const source = actor.toObject();

  function walk(obj, path = []) {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const currentPath = path.concat(key);

      if (value && typeof value === "object" && !Array.isArray(value)) {
        walk(value, currentPath);
      } else if (typeof value === "string" && /^[+-]\d+$/.test(value)) {
        const fullPath = currentPath.join(".");
        const current = foundry.utils.getProperty(source, fullPath);
        const base = (typeof current === "number") ? current : (parseInt(current) || 0);

        foundry.utils.setProperty(update, fullPath, base + parseInt(value));
      }
    }
  }

  walk(update);
};

export const hotbarDrop = (hotbar, data, slot) => {
  debugger;
}
