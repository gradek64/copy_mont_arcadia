const BrandCssPlugin = require('./brand-css-plugin')
const ResponsiveCssPlugin = require('./responsive-css-plugin')
const GenerateAssets = require('./generate-assets')
const AddHashesPlugin = require('./add-hashes.js')
const CssNanoPlugin = require('./cssnano-plugin.js')
const RemovalPlugin = require('./removal-plugin')
const LogAssetsPlugin = require('./log-assets-plugin')
module.exports = {
  BrandCssPlugin,
  ResponsiveCssPlugin,
  GenerateAssets,
  AddHashesPlugin,
  CssNanoPlugin,
  RemovalPlugin,
  LogAssetsPlugin,
}
