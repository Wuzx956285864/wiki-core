const {
  plugins,
  themeConfig,
  presets,
  themes,
} = require("./docusaurus.config.d/mod.js");

const swagger = require("./docusaurus.config.d/swagger.js");

const ConfigLocalized = require("./docusaurus.config.localized.js");

const defaultLocale = "en";
const currentLocale =
  process.env.DOCUSAURUS_CURRENT_LOCALE != "undefined"
    ? process.env.DOCUSAURUS_CURRENT_LOCALE
    : defaultLocale;

function getLocalizedConfigValue(/** @type {string} */ key) {
  const values = ConfigLocalized[key];
  if (!values) {
    throw new Error(`Localized config key=${key} not found`);
  }
  const value = values[currentLocale]
    ? values[currentLocale]
    : values[defaultLocale];
  if (!value) {
    throw new Error(
      `Localized value for config key=${key} not found for both currentLocale=${currentLocale} or defaultLocale=${defaultLocale}`
    );
  }
  return value;
}

const specsList = swagger.specs.map((item) => {
  return {
    ...item,
    spec: `swagger/${currentLocale}/${item.spec}`,
  };
});

/** @type {import('@docusaurus/types').Config} */
const docConfig = {
  title: "CodePay Open Docs",
  tagline: "CodePay Document Center New Release",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://developer.codepay.me/",
  baseUrl: "/docs/",

  organizationName: "Wiki",
  projectName: "CodePay",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    path: "i18n",
  },
  plugins,
  themes,
  // clientModules: [require.resolve("./src/utils/utils.ts")],
  presets: [
    ...presets,
    [
      "redocusaurus",
      {
        config: swagger.config,
        theme: swagger.theme,
        specs: specsList,
      },
    ],
  ],
  themeConfig: {
    ...themeConfig,
    footer: {
      ...themeConfig.footer,
      links: getLocalizedConfigValue("footerLinks"),
    },
  },
};

module.exports = docConfig;
