import ModifierData from "../data/item/modifier.mjs";
import { DiceThrow, ROLL_FAVOR, RollData } from "../rules/roll.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class RollApp extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  constructor(actor, rollIntention) {
    super();

    this.actor = actor;
    this.rollIntention = rollIntention;
    this.availableModifiers = this.#prepareAvailableModifiers(actor, rollIntention);

    if (actor == null) {
      ui.notifications.error(
        game.i18n.localize("fs4.notifications.error.noTokenSelected")
      );
      return;
    }
  }

  static DEFAULT_OPTIONS = {
    position: { width: 400, height: "auto" },
    tag: "form",
    window: {
      icon: "fas fa-dice",
      title: "fs4.apps.roll.title",
      resizable: true,
      contentClasses: ["roll"],
    },
    form: {
      handler: RollApp.#onSubmit
    }
  };

  static PARTS = {
    main: {
      template: "systems/fs4/templates/apps/roll.hbs",
      scrollable: [".scrollable"],
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    foundry.utils.mergeObject(context, {
      baseRoll: new RollData({
        actor: this.actor.toObject(false),
        rollIntention: this.rollIntention,
      }),
      actor: this.actor.toObject(false),
      rollIntention: this.rollIntention,
      title: this.rollIntention.toString(),
      availableModifiers: this.availableModifiers,
    });

    return context;
  }

  static async #onSubmit(event, _form, formData) {
    event.preventDefault();

    const data = Object.fromEntries(formData);
    const rollData = new RollData({
      actor: this.actor,
      rollIntention: this.rollIntention,
      goalModifier: Number(data.modifier) || 0,
      favor: data.favorable === "true" ? ROLL_FAVOR.FAVORABLE : (data.unfavorable === "true" ? ROLL_FAVOR.UNFAVORABLE : ROLL_FAVOR.NONE),
      modifiers: this.availableModifiers.filter((mod) => data[`active.${mod._id}`] === "true"),
    });

    const diceThrow = await new DiceThrow(rollData).roll();
    diceThrow.sendToChat();

    this.close();
  }

  #prepareAvailableModifiers() {
    return this.actor.items.map((item) => {
      return item.system.modifiers
        .filter((mod) => mod.active)
        .map((mod) => {
          return new ModifierData(mod)
        })
        .filter((mod) => mod.appliesToRoll(this.rollIntention))
        .map((mod) => {
          return {
            ...mod.toObject(false),
            humanReadable: mod.humanReadable,
            parent: item,
          };
        });
    }).flat();
  }
}
