import ModifierData, { ModifierValueTypes } from "../data/item/modifier.mjs";

export const ROLL_FAVOR = Object.freeze({
  UNFAVORABLE: -1,
  NORMAL: 0,
  FAVORABLE: 1,
});

export class RollIntention {
  constructor({
    characteristic = null,
    skill = null,
    maneuver = null,
  } = {}) {
    this.maneuver = maneuver;

    if (maneuver) {
      this.characteristic = maneuver.system.characteristic;
      this.skill = maneuver.system.skill;
    } else {
      this.characteristic = characteristic;
      this.skill = skill;
    }
  }

  toString() {
    if (this.maneuver) {
      return this.maneuver.name;
    }

    const characteristicLabel = game.i18n.localize(`fs4.characteristics.${this.characteristic}`);
    const skillLabel = game.i18n.localize(`fs4.skills.${this.skill}`);

    return `${skillLabel} + ${characteristicLabel}`;
  }
}

export class RollData {
  constructor({
    actor = null,
    goalModifier = 0,
    favor = ROLL_FAVOR.NORMAL,
    rollIntention = new RollIntention(),
    modifiers = [],
  }) {
    this.actor = actor;
    this.rollIntention = rollIntention;
    this.modifiers = modifiers.map((mod) => new ModifierData(mod));
    this.favor = favor;
    this.goalModifier = goalModifier;

    if (actor == null) {
      throw new Error("Actor is required to perform a roll");
    }
    if (!rollIntention.characteristic || !rollIntention.skill) {
      throw new Error("RollIntention must have both characteristic and skill defined");
    }
  }

  get characteristicBaseValue() {
    return this.actor.system.characteristics[this.rollIntention.characteristic];
  }

  get skillBaseValue() {
    return this.actor.system.skills[this.rollIntention.skill];
  }

  get baseGoal() {
    return this.modifiedCharacteristicValue + this.modifiedSkillValue;
  }

  get characteristicModifier() {
    const characteristicModifiers = this.modifiers.filter((mod) => {
      return mod.attribute === "characteristic" && mod.affectedAttribute === this.rollIntention.characteristic;
    });
    return characteristicModifiers.reduce((sum, mod) => sum + mod.valueAsNumber, 0);
  }

  get skillModifier() {
    const skillModifiers = this.modifiers.filter((mod) => {
      return mod.attribute === "skill" && mod.affectedAttribute === this.rollIntention.skill;
    });
    return skillModifiers.reduce((sum, mod) => sum + mod.valueAsNumber, 0);
  }

  get modifiedCharacteristicValue() {
    return this.characteristicBaseValue + this.characteristicModifier;
  }

  get modifiedSkillValue() {
    return this.skillBaseValue + this.skillModifier;
  }

  get actorGoalModifier() {
    const goalModifiers = this.modifiers.filter((mod) => {
      return mod.attribute === "goal";
    });
    return goalModifiers.reduce((sum, mod) => sum + mod.valueAsNumber, 0);
  }

  get totalGoalModifier() {
    return this.actorGoalModifier + this.goalModifier;
  }

  get modifiedGoal() {
    return this.baseGoal + this.totalGoalModifier;
  }

  get hasALeastOneFavor() {
    return this.favor === ROLL_FAVOR.FAVORABLE || this.modifiers.some((mod) => mod.valueType === ModifierValueTypes.FAVORABLE);
  }

  get hasALeastOneUnfavor() {
    return this.favor === ROLL_FAVOR.UNFAVORABLE || this.modifiers.some((mod) => mod.valueType === ModifierValueTypes.UNFAVORABLE);
  }

  get isFavorable() {
    return this.hasALeastOneFavor && !this.hasALeastOneUnfavor;
  }

  get isUnfavorable() {
    return this.hasALeastOneUnfavor && !this.hasALeastOneFavor;
  }
}

export class DiceThrow {
  constructor(rollData) {
    this.rollData = rollData;
    this.result = null;
    this.rolls = [];
  }

  static isBetterThan(a, b) {
    if (a.vp === b.vp) {
      return a.result < b.result;
    }

    return a.vp > b.vp;
  }

  static calculatevp(result, goal) {
    let vp = result;
    if (vp > goal) {
      return 0;
    }
    if (vp === 19 || vp === 20) {
      return 0;
    }

    return vp;
  }

  async roll() {
    this.rolls = [];

    const roll = await new Roll("1d20").roll();
    this.rolls.push(roll);
    if (game.dice3d) {
      await game.dice3d.showForRoll(roll, game.user, true);
    }

    this.result = roll.total;
    if (this.isFavorable || this.isUnfavorable) {
      const secondRoll = await new Roll("1d20").roll();
      this.rolls.push(secondRoll);
      if (game.dice3d) {
        await game.dice3d.showForRoll(secondRoll, game.user, true);
      }

      const firstRollResult = { result: roll.total, goal: this.goal };
      const secondRollResult = { result: secondRoll.total, goal: this.goal };

      if (this.isFavorable && DiceThrow.isBetterThan(secondRollResult, firstRollResult)) {
        this.result = secondRoll.total;
      } else if (this.isUnfavorable && DiceThrow.isBetterThan(firstRollResult, secondRollResult)) {
        this.result = secondRoll.total;
      }
    }

    return this;
  }

  get vp() {
    if (this.result == null) {
      throw new Error("Dice have not been rolled yet");
    }

    return DiceThrow.calculatevp(this.result, this.goal);
  }

  get goal() {
    return this.rollData.modifiedGoal;
  }

  get isFavorable() {
    return this.rollData.isFavorable;
  }

  get isUnfavorable() {
    return this.rollData.isUnfavorable;
  }

  get isCriticalSuccess() {
    return this.vp === this.result;
  }

  get isCriticalFailure() {
    return this.result === 20;
  }

  get chatContext() {
    return {
      result: this.result,
      vp: this.vp,
      hasVpToGain: this.vp > 0,
      goal: this.goal,
      characteristic: game.i18n.localize(`fs4.characteristics.${this.rollData.rollIntention.characteristic}`),
      skill: game.i18n.localize(`fs4.skills.${this.rollData.rollIntention.skill}`),
      maneuverUuid: this.rollData.rollIntention.maneuver ? this.rollData.rollIntention.maneuver.uuid : null,
      maneuverName: this.rollData.rollIntention.maneuver ? this.rollData.rollIntention.maneuver.name : null,
      modifiedCharacteristicValue: this.rollData.modifiedCharacteristicValue,
      characteristicBaseValue: this.rollData.characteristicBaseValue,
      skillBaseValue: this.rollData.skillBaseValue,
      modifiedSkillValue: this.rollData.modifiedSkillValue,
      characteristicModifier: this.rollData.characteristicModifier,
      skillModifier: this.rollData.skillModifier,
      baseGoal: this.rollData.baseGoal,
      goalModifier: this.rollData.goalModifier,
      actorGoalModifier: this.rollData.actorGoalModifier,
      totalGoalModifier: this.rollData.totalGoalModifier,
      isFavorable: this.isFavorable,
      isUnfavorable: this.isUnfavorable,
      isCriticalSuccess: this.isCriticalSuccess,
      isCriticalFailure: this.isCriticalFailure,
      hasModifier: this.rollData.modifiers.length > 0 || this.goalModifier != 0,
      modifiers: this.rollData.modifiers,
      actorId: this.rollData.actor.id,
    }
  }

  async sendToChat() {
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.rollData.actor }),
      content: await renderTemplate("systems/fs4/templates/chat/roll-result.hbs", this.chatContext),
    }, { rollMode: game.settings.get("core", "rollMode") });
  }
}
