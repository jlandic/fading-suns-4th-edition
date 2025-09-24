import AfflictionData from "./affliction.mjs";
import ArmorData from "./armor.mjs";
import ArmorFeatureData from "./armorFeature.mjs";
import BlessingData from "./blessing.mjs";
import CallingData from "./calling.mjs";
import CapabilityData from "./capability.mjs";
import ClassData from "./class.mjs";
import CurseData from "./curse.mjs";
import EquipmentData from "./equipment.mjs";
import FactionData from "./faction.mjs";
import ManeuverData from "./maneuver.mjs";
import PerkData from "./perk.mjs";
import ShieldData from "./shield.mjs";
import ShieldFeatureData from "./shieldFeature.mjs";
import SpeciesData from "./species.mjs";
import StateData from "./state.mjs";
import TechCompulsionData from "./techCompulsion.mjs";
import WeaponData from "./weapon.mjs";
import WeaponFeatureData from "./weaponFeature.mjs";

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
  WeaponFeatureData,
  ArmorFeatureData,
  ArmorData,
  WeaponData,
  EquipmentData,
  ShieldData,
  ShieldFeatureData,
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
  weaponFeature: WeaponFeatureData,
  armorFeature: ArmorFeatureData,
  armor: ArmorData,
  weapon: WeaponData,
  equipment: EquipmentData,
  shield: ShieldData,
  shieldFeature: ShieldFeatureData,
};
