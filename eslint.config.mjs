import js from "@eslint/js";
import tseslint from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";
import eslintConfigPrettier from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  {
    ignores: ["lib/database.types.ts"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tailwind.configs["flat/recommended"],
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-deprecated": "error",
    },
  },
  {
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          "newlines-between": "never",
          warnOnUnassignedImports: true,
        },
      ],
      "no-console": "error",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "dayjs",
              message: "Please import from '@/lib/utils/date' instead.",
            },
          ],
        },
      ],
    },
  },
  {
    settings: {
      tailwindcss: {
        /* cspell:disable-next-line */
        callees: ["classNames"],
      },
    },
  },
];
