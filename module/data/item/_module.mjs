import CallingData from "./calling.mjs";
import CapabilityData from "./capability.mjs";
import ClassData from "./class.mjs";
import FactionData from "./faction.mjs";
import ManeuverData from "./maneuver.mjs";
import PerkData from "./perk.mjs";
import SpeciesData from "./species.mjs";

export {
  FactionData,
  PerkData,
  CallingData,
  CapabilityData,
  ClassData,
  ManeuverData,
  SpeciesData,
};

export const config = {
  faction: FactionData,
  perk: PerkData,
  calling: CallingData,
  capability: CapabilityData,
  class: ClassData,
  maneuver: ManeuverData,
  species: SpeciesData,
};
