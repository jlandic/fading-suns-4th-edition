const SOURCE_FOLDER = "source";
const PACK = "world.test";
const TYPES = ["species"];

export const importJson = async () => {
  const pack = game.packs.get(PACK);
  const folders = await createCompendiumFolders(pack);

  TYPES.forEach(async (file) => {
    const content = await fetch(`${SOURCE_FOLDER}/${file}.json`);
    console.log(content);
    const data = await content.json();
    const entries = JSON.parse(data);

    entries.forEach(async (entry) => {
      if (typeof entry.system?.id !== "string") {
        console.error("Invalid FSID for", entry.name);
        return;
      }

      const existing = game.system.api.fsid.find(`items.${entry.system.id}`);
      if (existing) {
        console.log("Updating", entry.system.id);
        await existing.update(entry);
      } else {
        console.log("Creating", entry.system.id);
        const document = await pack.createDocument(entry);
        await document.setFlag("fs4", "fsid", entry.system.id);
        await document.update({ folder: folders[entry.type] });
      }
    });
  });
};

const createCompendiumFolders = async (pack) => {
  TYPES.reduce(async (acc, name) => {
    let folder = pack.folders.find((f) => f.name === name);
    if (!folder) {
      folder = await pack.createFolder({ name });
    }

    return {
      ...acc,
      [name]: folder.id,
    };
  });
};
