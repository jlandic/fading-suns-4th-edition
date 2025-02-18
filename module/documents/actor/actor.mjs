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
}
