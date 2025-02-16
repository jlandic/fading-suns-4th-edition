import { ARMOR_TYPES } from "../../registry/armorTypes.mjs";
import { CHARACTERISTIC_GROUPS } from "../../registry/characteristics.mjs";
import { SKILLS } from "../../registry/skills.mjs";

export default class CharacterSheetFS4 extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats",
        },
      ],
      width: 560,
      resizable: true,
      classes: ["sheet", "character"],
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
    })).sort((a, b) => a.localizedName.localeCompare(b.localizedName));

    foundry.utils.mergeObject(context, {
      source: source.system,
      system: actor.system,
      user: game.user,
      actorType: game.i18n.localize(`fs4.actorTypes.${this.actor.type}`),

      description: await TextEditor.enrichHTML(actor.system.description, {
        async: true,
      }),
      perks: await TextEditor.enrichHTML(actor.system.perks, {
        async: true,
      }),
      capabilities: await TextEditor.enrichHTML(actor.system.capabilities, {
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
      })),
      maneuvers: Object.keys(actor.system.maneuvers).map((index) => ({
        key: `maneuvers.${index}`,
        actorValue: actor.system.maneuvers[index],
      })),
      armor: ARMOR_TYPES.map((type) => ({
        type,
        checked: actor.system.armor[type],
      })),
      weapons: Object.keys(actor.system.weapons).map((index) => ({
        key: `weapons.${index}`,
        weapon: actor.system.weapons[index],
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
    html.on("focus", "input[type=number].short", (event) => {
      event.preventDefault();
      event.currentTarget.select();
    });
    html.on("focus", "input.fake-label", (event) => {
      event.preventDefault();
      event.currentTarget.blur();
    });

    html.on("click", ".armor-type", this._toggleArmorType.bind(this));
  }

  _toggleArmorType(event) {
    event.preventDefault();

    const type = event.currentTarget.dataset.type;
    this.actor.toggleArmorType(type);
  }
}
