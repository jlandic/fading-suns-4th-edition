import BlessingData from "./blessing.mjs";
import CallingData from "./calling.mjs";
import CapabilityData from "./capability.mjs";
import ClassData from "./class.mjs";
import CurseData from "./curse.mjs";
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
  BlessingData,
  CurseData,
};

export const config = {
  faction: FactionData,
  perk: PerkData,
  calling: CallingData,
  capability: CapabilityData,
  class: ClassData,
  maneuver: ManeuverData,
  species: SpeciesData,
  blessing: BlessingData,
  curse: CurseData,
};
