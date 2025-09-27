export default class ItemFS4 extends Item {
  removeEmbeddedItem(identifier, collectionName) {
    this.update({
      system: {
        [collectionName]: this.system[collectionName].filter(
          (id) => id !== identifier
        ),
      },
    });
  }

  addEmbeddedItem(identifier, collectionName) {
    this.update({
      system: {
        [collectionName]: this.system[collectionName].concat(identifier),
      },
    });
  }

  addReference(identifier, field) {
    this.update({
      system: {
        [field]: identifier,
      },
    });
  }

  clearReference(field) {
    this.update({ [field]: "" });
  }
}
