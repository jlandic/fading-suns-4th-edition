import RollApp from "../../apps/roll.mjs";
import { selectCharacteristicDialog } from "../../dialogs/selectCharacteristic.mjs";
import { RollIntention } from "../../rules/roll.mjs";
import { roll, rollSkill } from "../../scripts/rollSkill.mjs";

export default class ActorFS4 extends Actor {
  validate({ changes, clean = false, fallback = false, dropInvalidEmbedded = false, strict = true, fields = true, joint } = {}) {
    const source = this.toObject();

    function walk(obj, path = []) {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        const currentPath = path.concat(key);

        if (value && typeof value === "object" && !Array.isArray(value)) {
          walk(value, currentPath);
        } else if (typeof value === "string" && /^[+-]\d+$/.test(value)) {
          const fullPath = currentPath.join(".");
          const current = foundry.utils.getProperty(source, fullPath);
          const base = (typeof current === "number") ? current : (parseInt(current) || 0);

          foundry.utils.setProperty(changes, fullPath, base + parseInt(value));
        }
      }
    }

    if (changes) walk(changes);

    return super.validate({ changes, clean, fallback, dropInvalidEmbedded, strict, fields, joint });
  }

  gainVp(amount) {
    this.update({
      "system.bank.vp": this.system.bank.vp + amount,
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

  calculateGoal(skill, characteristic, addWeaponToRoll = "no") {
    if (addWeaponToRoll !== "no") {
      const modifier = this.equippedWeaponModifier(addWeaponToRoll);

      if (modifier) {
        return (
          this.system.skills[skill] +
          this.system.characteristics[characteristic] +
          modifier
        );
      }
    }

    return (
      this.system.skills[skill] + this.system.characteristics[characteristic]
    );
  }

  equippedWeaponModifier(type) {
    const weaponId = this.getFlag("fs4", `activeWeapon.${type}`);
    const weapon = this.items.get(weaponId);

    return weapon ? weapon.system.adjustedGoalModifier : 0;
  }

  async clearReference(field) {
    await this.update({ [field]: "" });
  }

  async rollSkill(skill) {
    const {
      characteristic,
    } = await selectCharacteristicDialog();

    const rollIntention = new RollIntention({
      skill,
      characteristic,
    });

    await new RollApp(
      this,
      rollIntention,
    ).render(true);
  }

  async rollManeuver(maneuverId) {
    const maneuver = this.items.get(maneuverId);

    const rollIntention = new RollIntention({
      maneuver,
    });

    await new RollApp(
      this,
      rollIntention,
    ).render(true);
  }

  rollPower(powerId) {
    const power = this.items.get(powerId);
    roll(this, power.system.characteristic, power.system.skill, powerId);
  }

  removeItem(itemId) {
    if (!this.items.has(itemId)) return;

    const deleted = this.items.get(itemId).delete();
    this.unsetFlag("fs4", `equipped.${itemId}`);

    return deleted;
  }

  equipItem(itemId) {
    const item = this.items.get(itemId);
    if (!item) return;

    this.setFlag("fs4", `equipped.${itemId}`, true);
    if (item.type === "weapon") {
      this.setFlag("fs4", `activeWeapon.${item.system.type}`, itemId);
    }
  }

  unequipItem(itemId) {
    const item = this.items.get(itemId);
    if (!item) return;

    this.unsetFlag("fs4", `equipped.${itemId}`);
    if (item.type === "weapon") {
      this.unsetFlag("fs4", `activeWeapon.${item.system.type}`);
    }
  }

  onAddWeapon(item) {
    if (item.system.melee) return;

    this.setFlag("fs4", `ammo.${item.id}`, item.system.ammo);
  }

  onRemoveWeapon(item) {
    this.unsetFlag("fs4", `ammo.${item.id}`);
    if (this.getFlag("fs4", `activeWeapon.${item.system.type}`) === item.id) {
      this.unsetFlag("fs4", `activeWeapon.${item.system.type}`);
    }
    this.unsetFlag("fs4", `equipped.${item.id}`);
  }

  updateShieldState(field, value) {
    this._shield()?.updateState(field, value);
  }

  rechargeShield() {
    this._shield()?.recharge();
  }

  resetShieldBurnout() {
    this._shield()?.resetBurnout();
  }

  toggleShieldDistortion() {
    this._shield()?.toggleDistortion();
  }

  async applyState(state) {
    await this.createEmbeddedDocuments("ActiveEffect", [
      state.toEffectData(),
    ]);
  }

  async removeState(stateId) {
    this.removeItem(stateId);
    await this.effects.find(e => e.origin.endsWith(stateId)).delete();
  }

  _shield() {
    return this.items.find((item) => item.type === "shield" && this.getFlag("fs4", `equipped.${item.id}`));
  }
}
