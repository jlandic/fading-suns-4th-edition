const HANDLEBARS_TEMPLATES = [
  // Items
  "systems/fs4/templates/item/perk.hbs",
  "systems/fs4/templates/item/capability.hbs",
  "systems/fs4/templates/item/calling.hbs",
  "systems/fs4/templates/item/class.hbs",
  "systems/fs4/templates/item/faction.hbs",
  "systems/fs4/templates/item/species.hbs",
  "systems/fs4/templates/item/maneuver.hbs",
  "systems/fs4/templates/item/simple-item.hbs",
  "systems/fs4/templates/item/simple-item-with-type.hbs",
  "systems/fs4/templates/item/armor.hbs",
  "systems/fs4/templates/item/weapon.hbs",
  "systems/fs4/templates/item/equipment.hbs",
  "systems/fs4/templates/item/affliction.hbs",
  "systems/fs4/templates/item/shield.hbs",

  // Item partials
  "systems/fs4/templates/item/partials/equipment-base.hbs",

  // Actor
  "systems/fs4/templates/actor/character.hbs",

  // Actor partials
  "systems/fs4/templates/actor/partials/score.hbs",
  "systems/fs4/templates/actor/partials/maneuvers.hbs",
  "systems/fs4/templates/actor/partials/weapons.hbs",
  "systems/fs4/templates/actor/partials/equipments.hbs",

  // Shared Partials
  "systems/fs4/templates/partials/sheet-header.hbs",
  "systems/fs4/templates/partials/linked-item.hbs",
  "systems/fs4/templates/partials/linked-item-collection.hbs",
];

export async function preloadTemplates() {
  const paths = HANDLEBARS_TEMPLATES.reduce((acc, partialPath) => {
    acc[partialPath.replace(".hbs", ".html")] = partialPath;
    acc[`fs4.${partialPath.split("/").pop().replace(".hbs", "")}`] =
      partialPath;

    return acc;
  }, {});

  return foundry.applications.handlebars.loadTemplates(paths);
}
