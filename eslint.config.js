import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { js },
    extends: ["js/recommended"],
  },
  tsEslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-target-blank": "off",
    },
  },
]);
