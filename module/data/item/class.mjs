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
      perks: new SetField(new StringField()),
      skills: new ArrayField(new ArrayField(score())),
      characteristics: new ArrayField(new ArrayField(score())),
    });
  }

  get factions() {
    return game.items
      .filter((item) => item.type === "faction")
      .filter((faction) => faction.system.class === this.code);
  }

  get callings() {
    return game.items
      .filter((item) => item.type === "calling")
      .filter((calling) => calling.system.class === this.code);
  }
}
