/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: false,
  trailingComma: "es5",
  singleQuote: true,
  tabWidth: 2,
};

export default config;
