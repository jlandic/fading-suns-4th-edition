import { ItemDataModel } from "../abstract.mjs";
import { score } from "../fields/character.mjs";

const { StringField, SetField, ArrayField } = foundry.data.fields;

export default class ClassData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField(),
      description: new StringField(),
      capabilities: new SetField(new StringField()),
      perk: new StringField(),
      _perks: new ArrayField(new StringField()),
      skills: new ArrayField(new ArrayField(score())),
      characteristics: new ArrayField(new ArrayField(score())),
    });
  }

  get factions() {
    return game.items
      .filter((item) => item.type === "faction")
      .filter((faction) => faction.system.class?.system.id === this.id);
  }

  get callings() {
    let items = game.items
      .filter((item) => item.type === "calling")
      .filter((calling) => calling.system.class?.system.id === this.id);

    if (items.length === 0) {
      items = game.items
        .filter((item) => item.type === "calling")
        .filter((calling) => calling.system.class === undefined);
    }

    return items;
  }

  get perks() {
    const allPerks = game.items.filter((item) => item.type === "perk");

    return this._perks
      .map((perk) => allPerks.find((item) => item.system.id === perk))
      .filter((perk) => perk);
  }
}
