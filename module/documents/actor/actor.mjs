import { roll, rollSkill } from "../../scripts/rollSkill.mjs";

export default class ActorFS4 extends Actor {
  toggleArmorType(armorType) {
    this.update({
      [`system.armor.${armorType}`]: !this.system.armor[armorType],
    });
  }

  emptyCache() {
    this.update({
      "system.bank.vp": Math.min(
        this.system.bankCapacity - this.system.bank.wp,
        this.system.bank.vp
      ),
    });
  }

  calculateGoal(skill, characteristic) {
    return (
      this.system.skills[skill] + this.system.characteristics[characteristic]
    );
  }

  rollSkill(skill) {
    rollSkill(this, skill);
  }

  rollManeuver(maneuverId) {
    console.log("Rolling maneuver", maneuverId);
    console.log(this.items);
    const maneuver = this.items.get(maneuverId);
    roll(this, maneuver.system.characteristic, maneuver.system.skill);
  }
}
