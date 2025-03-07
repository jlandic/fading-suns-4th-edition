import { SimpleItemData } from "../abstract.mjs";
import { score } from "../fields/character.mjs";

const { StringField, SetField, ArrayField, HTMLField, BooleanField } =
  foundry.data.fields;

export default class CallingData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      open: new BooleanField({
        initial: false,
      }),
      class: new StringField(),
      perks: new ArrayField(new StringField()),
      patrons: new HTMLField(),
      capabilities: new SetField(new StringField()),
      perk: new StringField(),
      equipment: new StringField(),
      skills: new ArrayField(new ArrayField(score())),
      characteristics: new ArrayField(new ArrayField(score())),
    });
  }
}
