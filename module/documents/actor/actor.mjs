export default class ActorFS4 extends Actor {
  toggleArmorType(armorType) {
    this.update({
      [`system.armor.${armorType}`]: !this.system.armor[armorType],
    });

    console.log(this.system.armor);
  }
}
