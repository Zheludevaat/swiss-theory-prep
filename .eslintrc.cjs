// Flat ESLint config is new and moving; classic .eslintrc.cjs remains the most
// stable choice for a Vite + TypeScript + React project. Keep this small — the
// recommended sets from each plugin already cover 95% of what we care about.

module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint", "react-hooks", "react-refresh"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: { react: { version: "18.3" } },
  ignorePatterns: [
    "dist/",
    "dev-dist/",
    "build/",
    "node_modules/",
    "public/",
    "*.timestamp-*.mjs",
    "*.config.js",
    "*.config.cjs",
  ],
  rules: {
    // The design is pragmatic about `any` in library boundaries (ts-fsrs
    // types, idb schema). Keep it as a warning, not an error, so we don't
    // chase casts through `@ts-expect-error`.
    "@typescript-eslint/no-explicit-any": "warn",

    // Already enforced stricter by tsc with `noUnusedLocals`; the ESLint
    // variant is left on but ignores `_` prefixed identifiers so we can keep
    // intentional "used for its side-effect only" parameters legible.
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],

    // Fast-refresh friendliness for our Vite setup.
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ["tests/**/*.ts", "tests/**/*.tsx", "scripts/**/*.ts"],
      rules: {
        // Tests and scripts are allowed to be looser with typing.
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
