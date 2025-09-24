# FS4 FoundryVTT System - AI Coding Instructions

## Architecture Overview

This is a **FoundryVTT game system** for Fading Suns 4th Edition, built with modern ES modules and structured around FoundryVTT's Document-Data Model pattern.

### Core Structure
- **Entry Point**: `fs4.mjs` - registers all data models, sheets, and hooks
- **Data Models**: `module/data/` - Foundry DataModel classes for Actors and Items
- **Document Classes**: `module/documents/` - Extended Actor/Item document classes
- **Sheet Classes**: `module/sheets/` - UI rendering classes extending ActorSheet/ItemSheet
- **Templates**: `templates/` - Handlebars templates for all sheets
- **Registries**: `module/registry/` - Configuration constants and enums

### Key Patterns

**Data Model Inheritance**: All data models extend `SystemDataModel` from `abstract.mjs`, which provides schema template mixing via `_schemaTemplates` array. Example:
```javascript
// In perk.mjs
export default class PerkData extends SimpleItemData {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), { /* fields */ });
  }
}
```

**Registry Pattern**: Constants are centralized in `module/registry/` files:
- `SKILLS` array in `skills.mjs`
- `CHARACTERISTICS` and `CHARACTERISTIC_GROUPS` in `characteristics.mjs`
- Item type configurations like `PERK_TYPES` in `perks.mjs`

**Sheet Registration**: Sheets are registered in `fs4.mjs` with specific types:
```javascript
Actors.registerSheet("fs4", CharacterSheetFS4, {
  types: ["character"],
  makeDefault: true,
});
```

## Development Workflow

**Build System**:
- `npm run build` - Builds both JS (Rollup) and CSS (Less)
- `npm run watch` - Watches Less files for changes
- `npm run build:packs` - Packages compendium data

**File Organization**:
- Each item type has: data model (`module/data/item/`), sheet class (`module/sheets/item/`), and template (`templates/item/`)
- Character sheets use partials extensively (see `templates/actor/partials/`)
- CSS built from Less files in `less/` directory

**Handlebars Conventions**:
- Custom helpers registered in `utils/handlebarHelpers.mjs`
- Partials follow `{{> "fs4.partial-name"}}` pattern
- Data context prepared in sheet `getData()` methods

## Critical Integrations

**FoundryVTT Integration**:
- Uses `foundry.appv1.sheets` for backwards compatibility
- Trackable attributes defined in `module/data/actor/_module.mjs`
- Document types declared in `system.json` under `documentTypes`

**Drag & Drop**: Character sheet handles specific droppable types defined in `DROPABLE_TYPES` array

**Localization**: French-first system (`lang/fr.json`) with i18n keys following `fs4.category.field` pattern

## Key Files for Understanding
- `fs4.mjs` - System initialization and registration
- `module/data/abstract.mjs` - Base data model with template mixing
- `module/sheets/actor/character-sheet.mjs` - Main character sheet logic
- `templates/actor/character.hbs` - Main character template structure
- `system.json` - FoundryVTT system manifest and document type definitions
