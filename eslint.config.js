// @ts-check
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

// Update config to include Prettier plugin and config
module.exports = tseslint.config(
  {
    files: ["**/*.{ts,html}"],
    extends: [
      ...angular.configs.tsRecommended,
      prettierConfig, // Disables conflicting rules
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error", // Runs Prettier as an ESLint rule
    },
  }
);