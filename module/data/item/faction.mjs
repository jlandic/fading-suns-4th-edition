import { ItemDataModel } from "../abstract.mjs";

const { SetField, StringField, NumberField, SchemaField } = foundry.data.fields;

export default class FactionData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      capabilities: new SetField(new SetField(new StringField())),
      characteristics: new SetField(
        new SetField(
          new SchemaField({
            name: new StringField(),
            value: new NumberField(),
          })
        )
      ),
      skills: new SetField(
        new SetField(
          new SchemaField({
            name: new StringField(),
            value: new NumberField(),
          })
        )
      ),
      perk: new StringField(),
      blessing: new StringField(),
      curse: new StringField(),
      equipment: new StringField(),
      description: new StringField(),
    });
  }
}
