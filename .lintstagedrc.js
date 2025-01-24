const path = require("path");

// TODO: エラーで使えないのでpackage.jsonのpre-commitを変更している。
// see https://github.com/eslint/eslint/issues/19322

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.css": ["prettier --write"],
};
