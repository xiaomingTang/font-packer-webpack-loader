const path = require("path")

module.exports = {
  "root": true,
  "env": {
    "node": true,
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "import/named": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "no-console": "off",
    "max-len": "off",

    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "semi": ["error", "never"],
  },
  "settings": {
    "import/resolver": {
      "alias": {
        "map": [
          ["@Src", path.resolve("./src")],
          ["@Test", path.resolve("./test")],
        ],
        "extensions": [".ts", ".js", ".json"],
      },
    },
  },
}
