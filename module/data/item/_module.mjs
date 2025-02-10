import CallingData from "./calling.mjs";
import CapabilityData from "./capability.mjs";
import ClassData from "./class.mjs";
import FactionData from "./faction.mjs";
import PerkData from "./perk.mjs";

export { FactionData, PerkData };

export const config = {
  faction: FactionData,
  perk: PerkData,
  calling: CallingData,
  capability: CapabilityData,
  class: ClassData,
};
