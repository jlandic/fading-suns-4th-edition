import { ItemDataModel } from "../abstract.mjs";
import { score } from "../fields/character.mjs";

const { StringField, SetField } = foundry.data.fields;

export default class ClassData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      description: new StringField(),
      capabilities: new SetField(new StringField()),
      perk: new StringField(),
      perks: new SetField(new StringField()),
      skills: new SetField(new SetField(score())),
      characteristics: new SetField(new SetField(score())),
    });
  }
}
