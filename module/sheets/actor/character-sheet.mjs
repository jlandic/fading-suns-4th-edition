import { ARMOR_TYPES } from "../../registry/armorTypes.mjs";
import { CHARACTERISTIC_GROUPS } from "../../registry/characteristics.mjs";
import { SKILLS } from "../../registry/skills.mjs";
import { rollSkill } from "../../scripts/rollSkill.mjs";
import { findItem } from "../../utils/dataAccess.mjs";

const { TextEditor } = foundry.applications.ux;

const DROPABLE_TYPES = [
  "maneuver",
  "perk",
  "capability",
  "weapon",
  "armor",
  "shield",
  "equipment",
];
const LINKED_TYPES = [
  "class",
  "faction",
  "calling",
  "species",
  "blessing",
  "curse",
];

export default class CharacterSheetFS4 extends foundry.appv1.sheets.ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats",
        },
      ],
      width: 580,
      resizable: true,
      classes: ["sheet", "character"],
      dragDrop: [
        {
          dropSelector: null,
          dragSelector: ".draggable",
        },
      ],
    });
  }

  get template() {
    return "systems/fs4/templates/actor/character.hbs";
  }

  async getData(options) {
    const context = await super.getData(options);
    const actor = context.actor;
    const source = actor.toObject();
    const skills = SKILLS.map((name) => ({
      key: `skills.${name}`,
      localizedName: game.i18n.localize(`fs4.skills.${name}`),
      actorValue: actor.system.skills[name],
      dataRoll: name,
    })).sort((a, b) => a.localizedName.localeCompare(b.localizedName));

    this._prepareItems(context);
    const linkedItems = await this._prepareLinkedItems(context);
    Object.assign(context, linkedItems);
    this._prepareArmor(context);
    this._prepareShield(context);

    const resistanceMods = {
      body: context.armor?.res,
      mind: null,
      spirit: null,
    }

    foundry.utils.mergeObject(context, {
      source: source.system,
      system: actor.system,
      user: game.user,
      actorType: game.i18n.localize(`fs4.actorTypes.${this.actor.type}`),

      description: await TextEditor.enrichHTML(actor.system.description, {
        async: true,
      }),
      notes: await TextEditor.enrichHTML(actor.system.notes, {
        async: true,
      }),

      characteristics: Object.keys(CHARACTERISTIC_GROUPS).reduce(
        (acc, group) => {
          const characteristics = CHARACTERISTIC_GROUPS[group].map((name) => ({
            key: `characteristics.${name}`,
            localizedName: game.i18n.localize(`fs4.characteristics.${name}`),
            actorValue: actor.system.characteristics[name],
          }));

          return {
            ...acc,
            [group]: characteristics,
          };
        },
        {}
      ),
      firstSkillGroup: skills.slice(0, skills.length / 2),
      secondSkillGroup: skills.slice(skills.length / 2, skills.length),
      resistance: Object.keys(actor.system.res).map((res) => ({
        key: `res.${res}.value`,
        modKey: `res.${res}.mod`,
        localizedName: game.i18n.localize(`fs4.character.fields.res.${res}`),
        actorValue: actor.system.res[res],
        mod: resistanceMods[res],
      })),
    });

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("focus", ".score input", (event) => {
      event.preventDefault();
      event.currentTarget.select();
    });
    html.on("focus", "input[type=number]", (event) => {
      event.preventDefault();
      event.currentTarget.select();
    });
    html.on("focus", "input.enhanced-number", (event) => {
      event.preventDefault();
      event.currentTarget.select();
    });
    html.on("focus", "input.fake-label", (event) => {
      event.preventDefault();
      event.currentTarget.blur();
    });

    html.on("click", ".rollable-skill", this._onRoll.bind(this));
    html.on("click", ".rollable-maneuver", this._onRollManeuver.bind(this));
    html.on("click", "#empty-cache", this._emptyCache.bind(this));
    html.on("click", "#recharge-shield", this._rechargeShield.bind(this));
    html.on("click", "#reset-shield-burnout", this._resetShieldBurnout.bind(this));

    html.on("click", ".item-add", async (event) => {
      event.preventDefault();

      const itemType = event.currentTarget.dataset.itemType;
      await this.actor.createEmbeddedDocuments("Item", [
        { name: game.i18n.localize("TYPES.Item.maneuver"), type: itemType },
      ]);
    });

    html.on("click", ".item-edit", (event) => {
      event.preventDefault();

      const itemId = event.currentTarget.closest(".item").dataset.itemId;
      this.actor.items.get(itemId).sheet.render(true);
    });

    html.on("click", ".linked-item", (event) => {
      event.preventDefault();

      const item = game.items.get(event.currentTarget.dataset.identifier);
      if (item) {
        item.sheet.render(true);
      }
    });

    html.on("click", ".item-delete", this._removeItem.bind(this));
    html.on("click", ".item-equip", this._equipItem.bind(this));
    html.on("click", ".item-unequip", this._unequipItem.bind(this));

    html.on("blur", "input.shield", this._updateShield.bind(this));
    html.on("click", "#toggle-shield-distortion", this._toggleShieldDistortion.bind(this));
  }

  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    const item = await fromUuid(data.uuid);
    if (DROPABLE_TYPES.includes(item.type)) {
      const itemPromises = await this.actor.createEmbeddedDocuments("Item", [
        item.toObject(),
      ]);
      const items = await Promise.all(itemPromises);

      if (item.type === "weapon") {
        await this.actor.onAddWeapon(items[0]);
      }
    } else if (LINKED_TYPES.includes(item.type)) {
      await this.actor.update({ [`system.${item.type}`]: data.uuid });

      if (item.type === "species" && item.system.size && item.system.speed) {
        this.actor.update({
          "system.size": item.system.size,
          "system.speed": item.system.speed,
        });
      }
    } else {
      console.warn("Unsupported item type", item.type);
    }
  }

  _onDragStart(event) {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        type: event.currentTarget.dataset.draggableType,
        itemId: event.currentTarget.closest(".item")?.dataset?.itemId,
        roll: event.currentTarget.dataset.roll,
        actorId: this.actor.id,
      })
    );
  }

  static ITEM_PREPARATION = {
    maneuver: {
      name: "maneuvers",
      sort: (a, b) => {
        if (a.system.skill === b.system.skill) {
          return a.name.localeCompare(b.name);
        }

        return a.system.skill.localeCompare(b.system.skill);
      },
      prepare: (actor, item) => ({
        ...item,
        id: item.id,
        goal: actor.calculateGoal(
          item.system.skill,
          item.system.characteristic,
          item.system.addWeaponToRoll,
        ),
        validStats: item.system.skill && item.system.characteristic,
      }),
    },
    perk: {
      name: "perks",
      sort: true,
    },
    capability: {
      name: "capabilities",
      sort: true,
    },
    weapon: {
      name: "weapons",
      sort: false,
      prepare: (actor, weapon) => ({
        ...weapon,
        ...weapon.system,
        id: weapon.id,
        rangeText: weapon.system.rangeText,
        features: weapon.system.features
          .map((identifier) => findItem(identifier)?.name)
          .join(", "),
        ammo:
          actor.getFlag("fs4", `ammo.${weapon.id}`) + "/" + weapon.system.ammo,
        equipped: actor.getFlag("fs4", `activeWeapon.${weapon.system.type}`) === weapon.id,
      }),
    },
    equipment: {
      name: "equipment",
      sort: false,
      prepare: (actor, equipment) => ({
        ...equipment,
        ...equipment.system,
        id: equipment.id,
        equipped: actor.getFlag("fs4", `equipped.${equipment.id}`),
        equippable: true,
      }),
    },
    armor: {
      name: "equipment",
      sort: false,
      prepare: (actor, armor) => ({
        ...armor,
        ...armor.system,
        id: armor.id,
        equipped: actor.getFlag("fs4", `equipped.${armor.id}`),
        equippable: true,
      }),
    },
    shield: {
      name: "equipment",
      sort: false,
      prepare: (actor, shield) => ({
        ...shield,
        ...shield.system,
        id: shield.id,
        equipped: actor.getFlag("fs4", `equipped.${shield.id}`),
        equippable: true,
      }),
    }
  };

  _prepareItems(context) {
    Object.keys(CharacterSheetFS4.ITEM_PREPARATION).forEach((type) => {
      context[CharacterSheetFS4.ITEM_PREPARATION[type].name] = [];
    });

    for (let item of context.actor.items) {
      if (CharacterSheetFS4.ITEM_PREPARATION[item.type]) {
        const { name, prepare } = CharacterSheetFS4.ITEM_PREPARATION[item.type];
        const preparedItem = prepare
          ? prepare(context.actor, item)
          : { ...item.toObject(), id: item._id };

        context[name].push(preparedItem);
      }
    }

    Object.values(CharacterSheetFS4.ITEM_PREPARATION).find(({ name, sort }) => {
      if (sort) {
        if (sort instanceof Function) {
          context[name].sort(sort);
        } else {
          context[name].sort((a, b) => a.name.localeCompare(b.name));
        }
      }
    });
  }

  async _prepareLinkedItems(context) {
    const items = await Promise.all(
      LINKED_TYPES.map(async (type) => {
        const item = await fromUuid(context.actor.system[type]);
        return item ? [type, { id: item.id, name: item.name }] : null;
      })
    );

    return Object.fromEntries(items.filter(Boolean));
  }

  _prepareArmor(context) {
    const equipped = context.actor.items.filter(
      (item) =>
        item.type === "armor" &&
        context.actor.getFlag("fs4", `equipped.${item.id}`)
    );
    context.armorTypes = ARMOR_TYPES.map((type) => ({
      type,
      checked: equipped.some((item) => item.system.anti.includes(type)),
    }));

    context.armor = {
      res: equipped.reduce((acc, item) => acc + item.system.res || 0, 0),
    };
  }

  _prepareShield(context) {
    const equipped = context.actor.items.find(
      (item) =>
        item.type === "shield" &&
        context.actor.getFlag("fs4", `equipped.${item.id}`)
    );

    if (equipped) {
      context.shield = {
        ...equipped.system,
        id: equipped.id,
        name: equipped.name,
        canDistort: equipped.system.canDistort(),
      };
    }
  }

  _toggleArmorType(event) {
    event.preventDefault();

    const type = event.currentTarget.dataset.type;
    this.actor.toggleArmorType(type);
  }

  _onRoll(event) {
    event.preventDefault();

    const skill = event.currentTarget.dataset.roll;
    rollSkill(skill, this.actor);
  }

  _onRollManeuver(event) {
    event.preventDefault();

    const maneuverId = event.currentTarget.dataset.maneuverId;
    this.actor.rollManeuver(maneuverId);
  }

  _emptyCache(event) {
    event.preventDefault();

    this.actor.emptyCache();
  }

  _updateShield(event) {
    event.preventDefault();

    this.actor.updateShieldState(event.currentTarget.name, event.currentTarget.value);
  }

  _rechargeShield(event) {
    event.preventDefault();

    this.actor.rechargeShield();
  }

  _resetShieldBurnout(event) {
    event.preventDefault();

    this.actor.resetShieldBurnout();
  }

  _toggleShieldDistortion(event) {
    event.preventDefault();

    this.actor.toggleShieldDistortion();
  }

  _equipItem(event) {
    event.preventDefault();

    const { itemId } = event.currentTarget.closest(".item").dataset;
    this.actor.equipItem(itemId);
  }

  _unequipItem(event) {
    event.preventDefault();

    const { itemId } = event.currentTarget.closest(".item").dataset;
    this.actor.unequipItem(itemId);
  }

  _removeItem(event) {
    event.preventDefault();

    const { itemId } = event.currentTarget.closest(".item").dataset;
    this.actor.removeItem(itemId);
  }
}
