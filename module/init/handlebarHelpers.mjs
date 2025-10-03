export const registerHandlebarsHelpers = () => {
  Handlebars.registerHelper("eq", (a, b) => a == b);
  Handlebars.registerHelper("not", (a) => !a);
  Handlebars.registerHelper("formatMod", formatMod);
  Handlebars.registerHelper("withSign", withSign);
};

export const formatMod = (number) => {
  if (number === undefined || number === null) return "+0";
  if (number > 0) return `+${number}`;
  if (number < 0) return `-${number}`;
  return "+0";
}

export const withSign = (number) => {
  if (number === undefined || number === null) return "0";
  if (number > 0) return `+${number}`;
  if (number < 0) return number.toString();
  return "0";
}
