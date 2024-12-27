import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";
import eslintConfigPrettier from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
// [...compat.extends(
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "next/core-web-vitals",
//     "plugin:tailwindcss/recommended",
//     "prettier",
// ),
export default tseslint.config(
  {
    ignores: ["lib/database.types.ts"],
  },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  tailwind.configs["flat/recommended"],
  eslintConfigPrettier,
  compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@typescript-eslint/no-deprecated": "error",
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
            {
              pattern: "server-only",
              group: "builtin",
              position: "before",
            },
          ],

          pathGroupsExcludedImportTypes: ["server-only"],
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
      // "typescript-eslint/no-deprecated": "error",
    },
  },
);
