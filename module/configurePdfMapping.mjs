const actorMapping = {
  name: "name",
  rank: "system.rank",
  species: "system.species",
  planet: "system.planet",
  birthdate: "system.birthdate",
  size: "system.size",
  speed: "system.speed",
  // Background
  class: "system.class",
  secondaryClass: "system.secondaryClass",
  level: "system.level",
  faction: "system.faction",
  blessing: "system.blessing",
  curse: "system.curse",
  calling1: "system.calling1",
  calling2: "system.calling2",
  calling3: "system.calling3",
  // Characteristics
  str: "system.characteristics.str",
  dex: "system.characteristics.dex",
  end: "system.characteristics.end",
  wit: "system.characteristics.wits",
  per: "system.characteristics.per",
  wil: "system.characteristics.wil",
  pre: "system.characteristics.pre",
  int: "system.characteristics.int",
  fth: "system.characteristics.fth",
  // Skills
  academia: "system.skills.academia",
  alchemy: "system.skills.alchemy",
  animalia: "system.skills.animalia",
  arts: "system.skills.arts",
  charm: "system.skills.charm",
  crafts: "system.skills.crafts",
  disguise: "system.skills.disguise",
  drive: "system.skills.drive",
  empathy: "system.skills.empathy",
  fight: "system.skills.fight",
  focus: "system.skills.focus",
  impress: "system.skills.impress",
  interface: "system.skills.interface",
  intrusion: "system.skills.intrusion",
  knavery: "system.skills.knavery",
  melee: "system.skills.melee",
  observe: "system.skills.observe",
  perform: "system.skills.perform",
  pilot: "system.skills.pilot",
  remedy: "system.skills.remedy",
  shoot: "system.skills.shoot",
  sleightofhand: "system.skills.sleightofhand",
  sneak: "system.skills.sneak",
  survival: "system.skills.survival",
  techredemption: "system.skills.techredemption",
  vigor: "system.skills.vigor",
  // Occult
  psi: "system.occult.psi",
  urge: "system.occult.urge",
  theurgy: "system.occult.theurgy",
  hubris: "system.occult.hubris",
  // Resistance
  body: "system.res.body.value",
  bodyMod: "system.res.body.mod",
  mind: "system.res.mind.value",
  mindMod: "system.res.mind.mod",
  spirit: "system.res.spirit.value",
  spiritMod: "system.res.spirit.mod",
  // Armor
  armor: "system.armor.name",
  blstr: "system.armor.blstr",
  flm: "system.armor.flm",
  hrd: "system.armor.hrd",
  lsr: "system.armor.lsr",
  shk: "system.armor.shk",
  slm: "system.armor.slm",
  son: "system.armor.son",
  // e-shield
  eshield: "system.eshield.name",
  hits: "system.eshield.hits",
  thresholdMin: "system.eshield.thresholdMin",
  thresholdMax: "system.eshield.thresholdMax",
  // Vitality and Revivals
  vitalityRating: "system.vitalityRating",
  vitality: "system.vitality",
  revivalRating: "system.revivalRating",
  revival: "system.revivals",
  // Maneuvers
  ...Array.from({ length: 8 }, (_, i) => i).reduce(
    (acc, i) => ({
      ...acc,
      [`maneuver${i + 1}`]: `system.maneuvers.${i}.name`,
      [`goal${i + 1}`]: `system.maneuvers.${i}.goal`,
      [`impact${i + 1}`]: `system.maneuvers.${i}.impact`,
    }),
    {}
  ),
  // Bank
  bankCapacity: "system.bankCapacity",
  vp: "system.bank.vp",
  wp: "system.bank.wp",
  surgeRating: "system.surgeRating",
  surge: "system.bank.surge",
  // References
  perks: "system.perks",
  capabilities: "system.capabilities",
  birthrights: "system.birthrights",
  // Items
  techgnosis: "system.techgnosis",
  ...Array.from({ length: 8 }, (_, i) => i).reduce(
    (acc, i) => ({
      ...acc,
      [`item${i + 1}`]: `system.items.${i}.name`,
      [`itemTL${i + 1}`]: `system.items.${i}.tl`,
      [`itemSize${i + 1}`]: `system.items.${i}.size`,
    }),
    {}
  ),
  // Weapons
  ...Array.from({ length: 5 }, (_, i) => i).reduce(
    (acc, i) => ({
      ...acc,
      [`weapon${i + 1}`]: `system.weapons.${i}.name`,
      [`weaponTL${i + 1}`]: `system.weapons.${i}.tl`,
      [`weaponGoal${i + 1}`]: `system.weapons.${i}.goal`,
      [`weaponDamage${i + 1}`]: `system.weapons.${i}.damage`,
      [`weaponStr${i + 1}`]: `system.weapons.${i}.str`,
      [`weaponRange${i + 1}`]: `system.weapons.${i}.range`,
      [`weaponRof${i + 1}`]: `system.weapons.${i}.rof`,
      [`weaponAmmo${i + 1}`]: `system.weapons.${i}.ammo`,
      [`weaponFeatures${i + 1}`]: `system.weapons.${i}.features`,
    }),
    {}
  ),
  // Ownership
  ...Array.from({ length: 6 }, (_, i) => i).reduce(
    (acc, i) => ({
      ...acc,
      [`owned${i + 1}`]: `system.owned.${i}.name`,
      [`ownedLocation${i + 1}`]: `system.owned.${i}.location`,
    }),
    {}
  ),
  // Money
  cash: "system.cash",
  // Assets
  ...Array.from({ length: 4 }, (_, i) => i).reduce(
    (acc, i) => ({
      ...acc,
      [`asset${i + 1}`]: `system.assets.${i}.name`,
      [`assetIncome${i + 1}`]: `system.assets.${i}.location`,
    }),
    {}
  ),
  notes: "system.notes",
};

export const configurePdfMapping = () => {
  ui.pdfpager.registerActorMapping(actorMapping);
};
