import ItemFS4 from "./item.mjs";

export default class StateFS4 extends ItemFS4 {
  toEffectData() {
    return {
      changes: [],
      disabled: false,
      description: this.system.description,
      icon: this.img,
      name: this.name,
      origin: this.uuid,
      statuses: [this.system.id],
    }
  }
}
