import { CHARACTERISTICS } from "../../registry/characteristics.mjs";
import { RESERVED_SKILLS, SKILLS } from "../../registry/skills.mjs";

const { NumberField, SchemaField, StringField } =
  foundry.data.fields;

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
          RESERVED_SKILLS.some((skill) => skill == item)
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

export const score = () =>
  new SchemaField({
    name: new StringField(),
    value: new NumberField({
      ...defaultNumberFieldOptions(),
    }),
  });
