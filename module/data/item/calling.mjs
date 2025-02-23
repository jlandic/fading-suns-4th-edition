import { SimpleItemData } from "../abstract.mjs";
import { score } from "../fields/character.mjs";

const { StringField, SetField, ArrayField, HTMLField } = foundry.data.fields;

export default class CallingData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      _class: new StringField(),
      patrons: new HTMLField(),
      capabilities: new SetField(new StringField()),
      perk: new StringField(),
      equipment: new StringField(),
      _perks: new ArrayField(new StringField()),
      skills: new ArrayField(new ArrayField(score())),
      characteristics: new ArrayField(new ArrayField(score())),
    });
  }

  get class() {
    if (this._class === "open") {
      return undefined;
    }

    const item = game.items.find(
      (item) => item.type === "class" && item.system.id === this._class
    );

    return item;
  }

  get perks() {
    const allPerks = game.items.filter(
      (item) => item.type === "perk" && item.system.id != "special_see_with_gm"
    );

    return this._perks.map((perk) =>
      allPerks.find((item) => item.system.id === perk)
    );
  }
}
