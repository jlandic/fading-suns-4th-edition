import { ARMOR_TYPES } from "../../registry/armorTypes.mjs";
import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { RESERVED_SKILLS, SKILLS } from "../../registry/skills.mjs";

const { NumberField, SchemaField, StringField } = foundry.data.fields;

const DEFAULT_CHARACTERISTIC_SCORE = 3;
const DEFAULT_SKILL_SCORE = 3;
const DEFAULT_RESERVED_SKILL_SCORE = 0;

export const defaultNumberFieldOptions = (initial = 0) => ({
  initial,
  integer: true,
  nullable: false,
  min: 0,
});

export const characteristic = () =>
  new NumberField({
    ...defaultNumberFieldOptions(DEFAULT_CHARACTERISTIC_SCORE),
    min: 1,
    max: 10,
  });

export const characteristics = () =>
  new SchemaField(
    CHARACTERISTICS.reduce(
      (acc, item) => ({
        ...acc,
        [item]: characteristic(),
      }),
      {}
    )
  );

export const skill = (initial = DEFAULT_SKILL_SCORE) =>
  new NumberField({
    ...defaultNumberFieldOptions(initial),
    min: initial,
  });

export const skills = () =>
  new SchemaField(
    SKILLS.reduce(
      (acc, item) => ({
        ...acc,
        [item]: skill(
          RESERVED_SKILLS.includes(skill)
            ? DEFAULT_RESERVED_SKILL_SCORE
            : DEFAULT_SKILL_SCORE
        ),
      }),
      {}
    )
  );

export const moddedField = (initial = 0, min = 0) =>
  new SchemaField({
    value: new NumberField({
      ...defaultNumberFieldOptions(initial),
      min,
    }),
    mod: new StringField(),
  });

export const res = () =>
  new SchemaField({
    body: moddedField(),
    mind: moddedField(),
    spirit: moddedField(),
  });

export const armor = () =>
  new SchemaField({
    name: new StringField(),
    ...ARMOR_TYPES.reduce(
      (acc, item) => ({
        ...acc,
        [item]: new NumberField({
          ...defaultNumberFieldOptions(),
        }),
      }),
      {}
    ),
  });

export const eshield = () =>
  new SchemaField({
    name: new StringField(),
    hits: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    thresholdMin: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    thresholdMax: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
  });

export const indexedMap = (length, fieldType) =>
  new SchemaField({
    ...Array.from({ length }, (_, i) => i).reduce(
      (acc, i) => ({
        ...acc,
        [i]: fieldType(),
      }),
      {}
    ),
  });

export const maneuver = () =>
  new SchemaField({
    name: new StringField(),
    goal: new StringField(),
    impact: new StringField(),
  });

export const weapon = () =>
  new SchemaField({
    name: new StringField(),
    tl: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    goal: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    damage: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    str: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    range: new StringField(),
    rof: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    ammo: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    features: new StringField(),
  });

export const item = () =>
  new SchemaField({
    name: new StringField(),
    nt: new NumberField({
      ...defaultNumberFieldOptions(1),
    }),
    size: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
  });

export const ownership = () =>
  new SchemaField({
    name: new StringField(),
    location: new StringField(),
  });

export const asset = () =>
  new SchemaField({
    name: new StringField(),
    income: new StringField(),
  });

export const bank = () =>
  new SchemaField({
    vp: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    wp: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
    surge: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
  });
