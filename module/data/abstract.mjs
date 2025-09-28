export default class SystemDataModel extends foundry.abstract.TypeDataModel {
  static _systemType;
  static _schemaTemplates = [];

  static get _schemaTemplateFields() {
    const fieldNames = Object.freeze(
      new Set(this._schemaTemplates.map((t) => t.schema.keys()).flat())
    );
    Object.defineProperty(this, "_schemaTemplateFields", {
      value: fieldNames,
      writable: false,
      configurable: false,
    });
    return fieldNames;
  }

  static defineSchema() {
    const schema = {};

    for (const template of this._schemaTemplates) {
      if (!template.defineSchema) {
        throw new Error(
          `Invalid FS4 template mixin ${template} defined on class ${this.constructor}`
        );
      }

      this.mergeSchema(schema, template.defineSchema());
    }

    return schema;
  }

  static mergeSchema(a, b) {
    Object.assign(a, b);
    return a;
  }

  static *_initializationOrder() {
    for (const template of this._schemaTemplates) {
      for (const entry of template._initializationOrder()) {
        entry[1] = this.schema.get(entry[0]);
        yield entry;
      }
    }
    for (const entry of this.schema.entries()) {
      if (this._schemaTemplateFields.has(entry[0])) continue;
      yield entry;
    }
  }

  static mixin(...templates) {
    for (const template of templates) {
      if (!(template.prototype instanceof SystemDataModel)) {
        throw new Error(
          `${template.name} is not a subclass of SystemDataModel`
        );
      }
    }

    const Base = class extends this { };
    Object.defineProperty(Base, "_schemaTemplates", {
      value: Object.seal([...this._schemaTemplates, ...templates]),
      writable: false,
      configurable: false,
    });

    for (const template of templates) {
      // Take all static methods and fields from template and mix in to base class
      for (const [key, descriptor] of Object.entries(
        Object.getOwnPropertyDescriptors(template)
      )) {
        if (this._immiscible.has(key)) continue;
        Object.defineProperty(Base, key, descriptor);
      }

      // Take all instance methods and fields from template and mix in to base class
      for (const [key, descriptor] of Object.entries(
        Object.getOwnPropertyDescriptors(template.prototype)
      )) {
        if (["constructor"].includes(key)) continue;
        Object.defineProperty(Base.prototype, key, descriptor);
      }
    }

    return Base;
  }
}

export class ActorDataModel extends SystemDataModel { }
export class ItemDataModel extends SystemDataModel { }

const { StringField, HTMLField } = foundry.data.fields;

export class SimpleItemData extends ItemDataModel {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      id: new StringField({
        initial: () => crypto.randomUUID(),
      }),
      description: new HTMLField(),
    });
  }

  get identifier() {
    return this.id || this.parent.id;
  }
}
