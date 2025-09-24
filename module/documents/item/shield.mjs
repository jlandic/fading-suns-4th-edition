import ItemFS4 from "./item.mjs";

export default class ShieldFS4 extends ItemFS4 {
  recharge() {
    if (this.system.handheld) return;

    this.update({
      system: {
        state: {
          hits: this.system.hits,
        },
      },
    });
  }

  resetBurnout() {
    if (this.system.handheld) return;
    this.update({
      system: {
        state: {
          burnoutRounds: 0,
        },
      },
    });
  }

  updateState(field, value) {
    if (this.system.handheld) return;

    this.update({
      [field]: value,
    });
  }

  toggleDistortion() {
    if (this.system.handheld) return;

    this.update({
      system: {
        state: {
          distorting: !this.system.state.distorting,
        }
      }
    })
  }
}
