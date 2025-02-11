import { ItemDataModel } from "../abstract.mjs";
import { score } from "../fields/character.mjs";

const { StringField, SetField, ArrayField } = foundry.data.fields;

export default class CallingData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField(),
      class: new StringField(),
      description: new StringField(),
      patrons: new StringField(),
      capabilities: new SetField(new StringField()),
      perk: new StringField(),
      equipment: new StringField(),
      perks: new ArrayField(new StringField()),
      skills: new ArrayField(new ArrayField(score())),
      characteristics: new ArrayField(new ArrayField(score())),
    });
  }

  get linkedPerks() {
    const allPerks = game.items.filter(
      (item) => item.type === "perk" && item.system.id != "special_see_with_gm"
    );

    return this.perks.map((perk) =>
      allPerks.find((item) => item.system.id === perk)
    );
  }
}
