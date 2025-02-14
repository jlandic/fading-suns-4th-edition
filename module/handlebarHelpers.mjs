export const registerHandlebarsHelpers = () => {
  Handlebars.registerHelper("eq", (a, b) => a == b);
};
