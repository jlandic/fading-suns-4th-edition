export async function migrateWorld() {
  console.log("Running world migration...");

  for (let actor of game.actors) {
    if (actor.system?.techgnosis !== undefined) {
      await actor.update({ "system.-=techgnosis": null });
    }
  }

  console.log("Migration complete!");
}
