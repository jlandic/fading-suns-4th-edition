export default class ItemFS4 extends Item {
    removeEmbeddedItem(itemId, collectionName) {
        console.log(collectionName)
        this.update({
            system: {
              [collectionName]: this.system[collectionName].filter((id) => id !== itemId)
            }
        });
    }

    async addEmbeddedItem(item, collectionName) {
        this.update({
            system: {
              [collectionName]: this.system[collectionName].concat(item.id)
            }
        });
    }
}
