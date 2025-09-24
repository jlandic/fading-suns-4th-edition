import ItemFS4 from "./item.mjs";
import ShieldFS4 from "./shield.mjs";

const itemMapping = {
  shield: ShieldFS4,
}

export const ItemProxyFS4 = new Proxy(function () { }, {
  construct: (target, args) => {
    const [data, context] = args;
    if (!itemMapping[data.type]) {
      return new ItemFS4(data, context);
    }

    return new itemMapping[data.type](data, context);
  },
  get: (_target, prop) => {
    switch (prop) {
      case "create":
      case "createDocuments":
        return (data, options) => {
          if (data.constructor === Array) {
            return data.map(i => ItemFS4.create(i, options));
          }

          if (!itemMapping[data.type]) {
            return ItemFS4.create(data, options);
          }

          return itemMapping[data.type].create(data, options);
        }
      case Symbol.hasInstance:
        return (instance) => Object.values(itemMapping).some(i => instance instanceof i) || instance instanceof ItemFS4;
      default:
        return ItemFS4[prop];
    }
  },
})
