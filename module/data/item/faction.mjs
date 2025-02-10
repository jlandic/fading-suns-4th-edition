import { ItemDataModel } from "../abstract.mjs";
import { score } from "../fields/character.mjs";

const { SetField, StringField, ArrayField } = foundry.data.fields;

export default class FactionData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField(),
      class: new StringField(),
      description: new StringField(),
      capabilities: new SetField(new StringField()),
      perk: new StringField(),
      equipment: new StringField(),
      blessing: new StringField(),
      curse: new StringField(),
      skills: new ArrayField(new ArrayField(score())),
      characteristics: new ArrayField(new ArrayField(score())),
    });
  }
}
