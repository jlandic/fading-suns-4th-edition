import ModifierData from "../../data/item/modifier.mjs";
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
  "power",
  "state",
];
const LINKED_TYPES = [
  "class",
  "faction",
  "calling",
  "species",
  "blessing",
  "curse",
  "affliction",
];

export default class CharacterSheetFS4 extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    position: {
      width: 580,
      height: "auto",
    },
    tag: "form",
    window: {
      icon: "fas fa-user",
      title: "fs4.sheets.CharacterSheetFS4",
      resizable: true,
      contentClasses: ["character"],
    },
    form: {
      submitOnChange: true,
    },
    actions: {
      showImage: CharacterSheetFS4.#showImage,
      roll: CharacterSheetFS4.#roll,
      rollManeuver: CharacterSheetFS4.#rollManeuver,
      rollPower: CharacterSheetFS4.#rollPower,
      emptyCache: CharacterSheetFS4.#emptyCache,
      rechargeShield: CharacterSheetFS4.#rechargeShield,
      resetShieldBurnout: CharacterSheetFS4.#resetShieldBurnout,
      toggleShieldDistortion: CharacterSheetFS4.#toggleShieldDistortion,
      removeItem: CharacterSheetFS4.#removeItem,
      equipItem: CharacterSheetFS4.#equipItem,
      unequipItem: CharacterSheetFS4.#unequipItem,
      editItem: CharacterSheetFS4.#editItem,
      editLinkedItem: CharacterSheetFS4.#editLinkedItem,
      clearLinkedItem: CharacterSheetFS4.#clearLinkedItem,
      removeState: CharacterSheetFS4.#removeState,
      toggleModifierActive: CharacterSheetFS4.#toggleModifierActive,
    },
  }

  static PARTS = {
    header: { template: "systems/fs4/templates/actor/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    stats: { template: "systems/fs4/templates/actor/stats.hbs", scrollable: [".tab-content"] },
    identity: { template: "systems/fs4/templates/actor/identity.hbs", scrollable: [".tab-content"] },
    equipment: { template: "systems/fs4/templates/actor/equipment.hbs", scrollable: [".tab-content"] },
    embeddedModifiers: { template: "systems/fs4/templates/shared/embeddedModifiers.hbs", scrollable: [".scrollable"] },
    notes: { template: "systems/fs4/templates/actor/notes.hbs", scrollable: [".tab-content"] },
  }

  static TABS = {
    primary: {
      initial: "stats",
      tabs: [
        {
          id: "stats",
          cssClass: "tab-stats",
          label: "fs4.sheets.tabs.stats",
        },
        {
          id: "identity",
          cssClass: "tab-identity",
          label: "fs4.sheets.tabs.identity",
        },
        {
          id: "equipment",
          cssClass: "tab-equipment",
          label: "fs4.sheets.tabs.equipment",
        },
        {
          id: "embeddedModifiers",
          cssClass: "tab-embeddedModifiers",
          label: "fs4.sheets.tabs.embeddedModifiers",
        },
        {
          id: "notes",
          cssClass: "tab-notes",
          label: "fs4.sheets.tabs.notes",
        }
      ]
    }
  }

  /* OVERRIDES
   */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const skills = SKILLS.map((name) => ({
      key: `skills.${name}`,
      localizedName: game.i18n.localize(`fs4.skills.${name}`),
      actorValue: this.document.system.skills[name],
      dataRoll: name,
    })).sort((a, b) => a.localizedName.localeCompare(b.localizedName));

    this.#prepareItems(context);
    const linkedItems = await this.#prepareLinkedItems(context);
    Object.assign(context, linkedItems);
    this.#prepareArmor(context);
    this.#prepareShield(context);
    this.#prepareEmbeddedModifiers(context);

    const resistanceMods = {
      body: context.armor?.res,
      mind: null,
      spirit: null,
    }

    return {
      ...context,
      source: this.document,
      system: this.document.system,
      user: game.user,
      actorType: game.i18n.localize(`fs4.actorTypes.${this.document.type}`),

      description: await TextEditor.enrichHTML(this.document.system.description, {
        async: true,
      }),
      notes: await TextEditor.enrichHTML(this.document.system.notes, {
        async: true,
      }),

      characteristics: Object.keys(CHARACTERISTIC_GROUPS).reduce(
        (acc, group) => {
          const characteristics = CHARACTERISTIC_GROUPS[group].map((name) => ({
            key: `characteristics.${name}`,
            localizedName: game.i18n.localize(`fs4.characteristics.${name}`),
            actorValue: this.document.system.characteristics[name],
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
      resistance: Object.keys(this.document.system.res).map((res) => ({
        key: `res.${res}.value`,
        modKey: `res.${res}.mod`,
        localizedName: game.i18n.localize(`fs4.character.fields.res.${res}`),
        actorValue: this.document.system.res[res],
        mod: resistanceMods[res],
      })),
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);

    this.element.querySelectorAll("input[type=number]").forEach((input) => {
      input.addEventListener("focus", (event) => {
        event.preventDefault();
        event.currentTarget.select();
      });
    });
    this.element.querySelectorAll("input.enhanced-number").forEach((input) => {
      input.addEventListener("focus", (event) => {
        event.preventDefault();
        event.currentTarget.select();
      });
    });
    this.element.querySelectorAll("input.shield").forEach((input) => {
      input.addEventListener("blur", CharacterSheetFS4.#updateShield.bind(this));
    });
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
      if (item.type === "state") {
        await this.actor.applyState(items[0]);
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
        itemId: event.currentTarget.dataset.itemId,
        skill: event.currentTarget.dataset.skill,
        actorId: this.actor.id,
      })
    );
  }

  /* ACTIONS
   */

  static #showImage(event, target) {
    event.preventDefault();

    const popout = new foundry.applications.apps.ImagePopout({
      src: target.dataset.src,
      uuid: target.dataset.uuid,
      window: {
        title: target.dataset.name,
      }
    });

    popout.render(true);
  }

  static #roll(event, target) {
    event.preventDefault();

    const { skill } = target.dataset;
    rollSkill(skill, this.document);
  }

  static #rollManeuver(event, target) {
    event.preventDefault();

    const { itemId } = target.dataset;
    this.document.rollManeuver(itemId);
  }

  static #rollPower(event, target) {
    event.preventDefault();

    const { itemId } = target.dataset;
    this.document.rollPower(itemId);
  }

  static #emptyCache(event) {
    event.preventDefault();

    this.actor.emptyCache();
  }

  static #updateShield(event) {
    event.preventDefault();

    this.actor.updateShieldState(event.currentTarget.name, event.currentTarget.value);
  }

  static #rechargeShield(event) {
    event.preventDefault();

    this.actor.rechargeShield();
  }

  static #resetShieldBurnout(event) {
    event.preventDefault();

    this.actor.resetShieldBurnout();
  }

  static #toggleShieldDistortion(event) {
    event.preventDefault();

    this.actor.toggleShieldDistortion();
  }

  static #equipItem(event, target) {
    event.preventDefault();

    const { itemId } = target.dataset;
    this.actor.equipItem(itemId);
  }

  static #unequipItem(event, target) {
    event.preventDefault();

    const { itemId } = target.dataset;
    this.actor.unequipItem(itemId);
  }

  static #removeItem(event, target) {
    event.preventDefault();

    const { itemId } = target.dataset;
    this.actor.removeItem(itemId);
  }

  static #removeState(event, target) {
    event.preventDefault();

    const { itemId } = target.dataset;
    this.actor.removeState(itemId);
  }

  static #editItem(event, target) {
    event.preventDefault();

    const { itemId } = target.dataset;
    const item = this.actor.items.get(itemId);
    if (item) {
      item.sheet.render(true);
    }
  }

  static #editLinkedItem(event, target) {
    event.preventDefault();

    const { identifier } = target.dataset;
    const item = game.items.get(identifier);
    if (item) {
      item.sheet.render(true);
    }
  }

  static async #clearLinkedItem(event, target) {
    event.preventDefault();

    const field = target.dataset.field;
    await this.actor.clearReference(field);
  }

  static async #toggleModifierActive(event, target) {
    event.preventDefault();

    const { modifierId, parentId } = target.dataset;
    const item = this.actor.items.get(parentId);
    if (!item) return;

    const modifiers = item.system.modifiers.map((mod) => {
      if (mod._id === modifierId) {
        mod.active = !mod.active;
      }
      return mod;
    });

    await item.update({ "system.modifiers": modifiers });
  }

  /* CONTEXT PREPARATION
   */

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
    power: {
      name: "powers",
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
          item.system.characteristic
        ),
        validStats: item.system.skill && item.system.characteristic,
      }),
    },
    state: {
      name: "states",
      sort: true,
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
        adjustedGoalModifier: weapon.system.adjustedGoalModifier,
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

  #prepareEmbeddedModifiers(context) {
    context.embeddedModifiers = this.actor.items.map((item) => {
      return item.system.modifiers.map((mod) => {
        return {
          ...mod,
          readOnly: true,
          parent: item,
        };
      });
    }).flat();
  }

  #prepareItems(context) {
    Object.keys(CharacterSheetFS4.ITEM_PREPARATION).forEach((type) => {
      context[CharacterSheetFS4.ITEM_PREPARATION[type].name] = [];
    });

    for (let item of context.document.items) {
      if (CharacterSheetFS4.ITEM_PREPARATION[item.type]) {
        const { name, prepare } = CharacterSheetFS4.ITEM_PREPARATION[item.type];
        const preparedItem = prepare
          ? prepare(context.document, item)
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

  async #prepareLinkedItems(context) {
    const items = await Promise.all(
      LINKED_TYPES.map(async (type) => {
        const item = await fromUuid(context.document.system[type]);
        return item ? [type, { id: item.id, name: item.name }] : null;
      })
    );

    return Object.fromEntries(items.filter(Boolean));
  }

  #prepareArmor(context) {
    const equipped = context.document.items.filter(
      (item) =>
        item.type === "armor" &&
        context.document.getFlag("fs4", `equipped.${item.id}`)
    );
    context.armorTypes = ARMOR_TYPES.map((type) => ({
      type,
      checked: equipped.some((item) => item.system.anti.includes(type)),
    }));

    context.armor = {
      res: equipped.reduce((acc, item) => acc + item.system.adjustedRes || 0, 0),
    };
  }

  #prepareShield(context) {
    const equipped = context.document.items.find(
      (item) =>
        item.type === "shield" &&
        context.document.getFlag("fs4", `equipped.${item.id}`)
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
}
