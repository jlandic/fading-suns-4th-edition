import AfflictionData from "./affliction.mjs";
import BlessingData from "./blessing.mjs";
import CallingData from "./calling.mjs";
import CapabilityData from "./capability.mjs";
import ClassData from "./class.mjs";
import CurseData from "./curse.mjs";
import FactionData from "./faction.mjs";
import ManeuverData from "./maneuver.mjs";
import PerkData from "./perk.mjs";
import SpeciesData from "./species.mjs";
import StateData from "./state.mjs";
import TechCompulsionData from "./techCompulsion.mjs";

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
  TechCompulsionData,
  AfflictionData,
  StateData,
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
  techCompulsion: TechCompulsionData,
  affliction: AfflictionData,
  state: StateData,
};
