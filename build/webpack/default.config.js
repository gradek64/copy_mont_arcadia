const webpack = require('webpack')
const config = require('../config.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const plugins = require('./plugins')
const WebpackManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const buildUtilities = require('./lib/build-utilities.js')
const NewRelicSourceMapPlugin = require('new-relic-source-map-webpack-plugin')
const path = require('path')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')

/*
 * Those are plugins to anaylse our webpack build,
 * they will only works when using npm run build:analyse
 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const WebpackMonitor = require('webpack-monitor')
const Jarvis = require('webpack-jarvis')

module.exports = (env) => {
  /*
   * Allows us to conditionally run config. For example:
   *   mode: ifProd('production', 'development')
   * resolves as:
   *   mode: 'production'
   */
  const { ifProd, ifDev } = getIfUtils(env)
  const { WEBPACK_USE_HTTPS = false, DEV_SERVER_PORT = false } = process.env

  return buildUtilities[ifProd('addBrandsProd', 'addBrandsDev')]({
    name: 'client',
    devServer: {
      contentBase: config.get('dir_src'),
      compress: true,
      public: WEBPACK_USE_HTTPS ? 'https://localhost' : undefined,
      port: DEV_SERVER_PORT || 8080,
      hot: true,
      disableHostCheck: true,
      noInfo: false,
      lazy: false,
      clientLogLevel: 'info',

      // controls console output of web-dev-server
      stats: {
        all: false,
        modules: true,
        maxModules: true,
        errors: true,
        warnings: true,
        assets: true,
        moduleTrace: true,
        errorDetails: true,
        source: true,
        chunks: true,
        colors: true,
        builtAt: true,
        hash: true,
        entryPoint: true,
        children: false,
        timings: true,
        version: true,
      },
      watchOptions: {
        poll: false,
      },
      historyApiFallback: false,
      proxy: {
        '*': 'http://localhost:' + (process.env.PORT || 3000),
      },
      host: '0.0.0.0',
    },

    mode: ifProd('production', 'development'),

    target: 'web',

    // Sets the home directory. Used for entry and module.rules.loader paths
    context: config.get('root_dir'),

    // set WEBPACK_DEVTOOL env variable to 'source-map' to use the redux devtools trace feature
    devtool: ifProd(
      'hidden-source-map',
      process.env.WEBPACK_DEVTOOL || 'eval-source-map'
    ),

    // Controls the console output of the build.
    stats: {
      assets: true,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: true,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      depth: false,
      entrypoints: true,
      env: false,
      errors: true,
      errorDetails: true,
      hash: false,
      maxModules: 0,
      modules: false,
      moduleTrace: false,
      performance: false,
      providedExports: false,
      publicPath: false,
      reasons: false,
      source: true,
      timings: false,
      usedExports: false,
      version: false,
      warnings: false,
    },

    entry: {
      /*
       * NOTES
       * removeEmpty filters out undefined vals
       */

      // The main application code chunk (vendor is now created via optimization.splitChunks)
      bundle: removeEmpty([
        // The functional tests require monkypatching fetch with an XHR mplementation. This could probably be moved to SSR.
        process.env.FUNCTIONAL_TESTS === 'true'
          ? './public/common/vendors/polyfill-fetch-override.js'
          : undefined,

        // The main client side entry point
        './src/client/index.jsx',
      ]),

      /*
       * Separate chunk incase an error occurs in bundle.js, this script can still
       * operate as normal. Although this is very small, does this need to be part
       * of the webpack build?
       */
      'service-desk': ['./src/client/lib/service-desk.js'],
    },

    output: {
      /*
       * We should only reference the filename, not path and also add the chunk
       * hashing here also instead of using AddHashesPlugin
       */
      filename: config.get('dir_common') + '/[name].js',

      // The output directory which is actually /public not /assets, the var is misleading
      path: config.get('dir_assets'),

      // The public URL of the output directory
      publicPath: '/assets/',
    },

    resolve: {
      // Will automatically resolve files with these extensions if not specified in the import/require path
      extensions: ['.js', '.jsx', '.json'],
    },

    optimization: {
      // Gathers modules shared between multiple entry points (previously CommonsChunkPlugin)
      splitChunks: {
        // prevent more than route chunks being created i.e. 1 chunk for 1 route (+ bundle & vendor)
        maxAsyncRequests: 2,
        cacheGroups: {
          commons: {
            // Look for code that looks for code that comes from the node_modules if found, place in vendor file
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          /*
           * Ability to split files into separate chunks for css

           * Find all files which are CSS modules which are critical css files and put this into a
           * separate file and put this into public.
           *
           * This should not include this into the main bundle.css with the magic of cacheGroups chunking
           */
          critical: {
            test: (m) => {
              // check if any files are css modules and are critical css bundle the together
              return (
                m.constructor.name === 'CssModule' &&
                m.identifier().match(/\.critical\.css/g)
              )
            },
            name: 'critical',
            chunks: 'all',
            enforce: true,
          },
          criticalBrand: {
            test: (m) => {
              return (
                m.constructor.name === 'CssModule' &&
                m.identifier().match(/\.criticalBrand\.css/g)
              )
            },
            name: (module, chunks) => {
              const brandName = chunks.map((item) => item.name).join('~')
              return `${brandName}.criticalBrand`
            },
            chunks: 'all',
            enforce: true,
          },
        },
      },
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            warnings: false,
            compress: {
              unused: true,
              dead_code: true,
            },
          },
        }),
      ],

      /*
       * Determine which exports are used throughout the application.
       * If the exports aren't used, they are subsequently stripped out via optimization.minimizer.
       * See: https://webpack.js.org/configuration/optimization/#optimizationusedexports
       */
      usedExports: true,

      /*
       * Turns on the sideEffects flag in package.json (we currently don't use it).
       * If enabled, usedExports will ignore array of provided files (can also be a boolean).
       * See: https://webpack.js.org/configuration/optimization/#optimizationsideeffects
       */
      sideEffects: true,
    },

    plugins: removeEmpty([
      /*
       * Webpack will not bundle modules that match this regex:
       * ignored-server-require  - Used by Async.js
       * cache-service-redis     - Used by superagent.js (should be removed in future)
       * moment-timezone         - Needs checking but it may be possible to remove
       * ua-parser-js.           - Needs checking but it may be possible to remove
       * newrelic                - Used by superagent.js (newrelic node agent)
       */
      new webpack.IgnorePlugin(
        /ignored-server-require|cache-service-redis|moment-timezone|ua-parser-js|newrelic/
      ),

      /*
       * Extracts .css file contents into {entryName}.css files e.g. topshop.css, burton.css, bundle.css.
       * This basically just renames topshop.js -> topshop.css in a messy way as the topshop.js file will just contain CSS
       * (see notes on addBrandsProd/Dev above)
       */
      new MiniCssExtractPlugin({
        filename: '[name].css',
        allChunks: true,
      }),

      /*
       * Orders commonly used modules first thus giving them smaller ids thereby saving some space
       * See: https://webpack.js.org/plugins/internal-plugins/#occurrenceorderplugin
       */
      new webpack.optimize.OccurrenceOrderPlugin(),

      // Defines global variables
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.ENABLE_CLIENT_ERROR_LOGGING':
          process.env.ENABLE_CLIENT_ERROR_LOGGING === 'true',
        'process.env.ERROR_REPORT_THROTTLE_TIMEOUT': 3000,
      }),

      /*
       * Takes the bundle.css file generated by `extractCSS` and adds it to
       * each brand .css file. Then runs a postcss configuration on each one:
       *   gathers variables for {brand} + default vars
       *   applies postcss plugins (see build-utilities.js#customPostcss )
       *   re-writes urls:
       *   dev: just copies the existing url
       *   prod: removes "public/{brand}" or rewrites "public/common" urls
       *   writes to public/{brand}/styles.css
       *
       * The brand .css files are removed in the RemovalPlugin below
       */
      new plugins.BrandCssPlugin(
        {
          dirCommon: config.get('dir_common'),
          brands: config.get('brands'),
          convertUrlImports: ifProd(),
        },
        buildUtilities.customPostcss
      ),

      /*
       * Cleans up all the intermediary compliation assets
       * e.g. topshop.css, topshop.js, bundle.css and their source maps
       * also removes critical js and js.maps files which are created through webpack which are unused from the cacheGroups
       */
      new plugins.RemovalPlugin([
        {
          test: new RegExp(
            `^(?!((${config
              .get('brands')
              .concat(['default'])
              .join('|')})\/.+)).*\\.css$`
          ),
        },
        {
          test: new RegExp(
            `(${config
              .get('brands')
              .concat(['default', 'critical'])
              .join('|')}).*\\.js$`
          ),
        },
        {
          test: new RegExp(
            `(${config
              .get('brands')
              .concat([
                'bundle.css',
                'critical.css',
                'critical.js',
                'WrappedWishlistPageContainer.css',
              ])
              .join('|')}).*\\.map$`
          ),
        },
      ]),

      /*
       * Gets each {brand}/styles.css file and extracts media rules into separate "breakpoint" .css files:
       *  styles-tablet.css
       *  styles-laptop.css - Can't find media rules for this style...
       *  styles-desktop.css
       *  styles-grid.css - This probably isn't supposed to be created
       */
      new plugins.ResponsiveCssPlugin(),

      /*
       * Applies cssnano (minifier) to all .css compliation assets
       * We probably can't use cssnano as a loader as the custom plugins
       * apply changes after the emit stage
       */
      ifProd(
        new plugins.CssNanoPlugin({
          autoprefixer: false,
          zindex: false,
          reduceIdents: false,
        })
      ),

      // Custom hashing of filenames because (again) the other custom plugins emit their own files
      !env.analyse ? ifProd(new plugins.AddHashesPlugin()) : undefined,

      new WebpackManifestPlugin({
        fileName: 'webpack-manifest.json',
        writeToFileEmit: true,
      }),

      /*
       * Takes the webpack-manifest.json file generated by ChunkManifestPlugin
       * and replaces it with generated-assets.json - a manifest that groups
       * assets by file extension. This is used during SSR to add the hashed
       * filenames to the index.html. It is also set in the redux store for:
       *   Main.jsx - to be able to add stylesheets into the DOM when the window resizes
       *   CmsWrapper - to check for stylesheets that CMS wants to add to the DOM. No idea why monty would have any stylesheets that CMS needs...?
       */
      new plugins.GenerateAssets(),

      // Upload source maps to New Relic to deobfuscate stack traces in errors
      ifProd(
        new NewRelicSourceMapPlugin({
          applicationId: process.env.NEW_RELIC_APPLICATION_ID,
          nrAdminKey: process.env.NEWRELIC_KEY,
          staticAssetUrl: process.env.WEB_URL,
          noop: typeof process.env.NEWRELIC_KEY === 'undefined',
        })
      ),

      // See https://github.com/gajus/write-file-webpack-plugin
      ifDev(
        new WriteFilePlugin({
          log: false,
          test: /generated-assets.json$/,
          useHashIndex: true,
        })
      ),

      // Ability to write to disk for server side render for web-dev-server as the files are loaded into memory
      ifDev(
        new WriteFilePlugin({
          log: false,
          test: /critical.css$/,
          useHashIndex: false,
        })
      ),

      ifDev(new webpack.HotModuleReplacementPlugin()),

      // To prevent webpack from bundling the server side logging stuff we alias it to the client logger which has a matching API
      new webpack.NormalModuleReplacementPlugin(
        /server\/lib\/logger\.js/,
        path.resolve(config.get('dir_src'), 'client/lib/logger.js')
      ),

      // Plugin for analysing our webpack build
      env.analyse && new BundleAnalyzerPlugin(),
      env.analyse &&
        new WebpackMonitor({
          launch: true,
          port: 3030,
          excludeSourceMaps: false,
        }),
      // to see the dashboard please visit http://localhost:1337/
      env.analyse &&
        new Jarvis({
          port: 1337,
          watchOnly: false,
        }),
    ]),
    module: {
      rules: [
        /*
         * Processes all .css imports from js files (excluding src/custom/*)
         * This is extracted to {entryName}.css files
         * See notes above on `extractCSS`
         */
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader?sourceMap&-url',
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('lost'),
                  require('postcss-nested')(),
                ],
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['thread-loader', 'babel-loader'],
        },
      ],
    },
  })
}
