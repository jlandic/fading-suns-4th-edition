import { SimpleItemData } from "../abstract.mjs";
import { score } from "../fields/character.mjs";

const { SetField, StringField, ArrayField } = foundry.data.fields;

export default class FactionData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      _class: new StringField(),
      capabilities: new SetField(new StringField()),
      perk: new StringField(),
      equipment: new StringField(),
      blessing: new StringField(),
      curse: new StringField(),
      skills: new ArrayField(new ArrayField(score())),
      characteristics: new ArrayField(new ArrayField(score())),
    });
  }

  get class() {
    return game.items.find(
      (item) => item.type === "class" && item.system.id === this._class
    );
  }
}
