const HANDLEBARS_TEMPLATES = [
  // Items
  "systems/fading-suns-4th-edition/templates/item/perk.hbs",
  "systems/fading-suns-4th-edition/templates/item/capability.hbs",
  "systems/fading-suns-4th-edition/templates/item/calling.hbs",
  "systems/fading-suns-4th-edition/templates/item/class.hbs",
  "systems/fading-suns-4th-edition/templates/item/faction.hbs",
  "systems/fading-suns-4th-edition/templates/item/species.hbs",

  // Item partials
  "systems/fading-suns-4th-edition/templates/item/partials/item-header.hbs",
];

export async function preloadTemplates() {
  const paths = HANDLEBARS_TEMPLATES.reduce((acc, partialPath) => {
    acc[partialPath.replace(".hbs", ".html")] = partialPath;
    acc[`fs4.${partialPath.split("/").pop().replace(".hbs", "")}`] =
      partialPath;

    return acc;
  }, {});

  return loadTemplates(paths);
}
