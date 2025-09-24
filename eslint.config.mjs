import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  ...compat.extends("eslint:recommended"),
  {
    files: ["**/*.mjs"],
    plugins: {},
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        foundry: "readonly",
        CONFIG: "writable",
        globalThis: "writable",
        game: "writable",
        Hooks: "readonly",
        ui: "readonly",
        Actor: "readonly",
        Macro: "readonly",
        Dialog: "readonly",
        actor: "readonly",
        Roll: "readonly",
        ChatMessage: "readonly",
        canvas: "readonly",
        Folder: "readonly",
        ItemDataModel: "readonly",
        Item: "readonly",
        TextEditor: "readonly",
        Handlebars: "readonly",
        DragDrop: "readonly",
        fromUuid: "readonly",
      },

      parser: babelParser,
      ecmaVersion: 6,
      sourceType: "module",

      parserOptions: {
        requireConfigFile: false,
      },
    },

    rules: {},
  },
];
