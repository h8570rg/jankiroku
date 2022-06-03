const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")} -c ${path.relative(process.cwd(), ".eslintrc.json")}`;

module.exports = {
  "*.{js,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.{ts,tsx}": ["bash -c 'npm run type-check'"],
};
