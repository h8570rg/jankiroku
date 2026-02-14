import tsParser from "@typescript-eslint/parser";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

export default [
  betterTailwindcss.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/globals.css",
        detectComponentClasses: true,
      },
    },
  },
  {
    ignores: [".next/**", "*.config.ts"],
  },
];
