const postcss = require('postcss')
const postcssUrl = require('postcss-url')
const path = require('path')
const { isEmpty } = require('ramda')

const criticalCssFileName = 'critical.css'
const criticalBrandFileName = 'criticalBrand'
const bundleFileName = 'bundle'

function BrandCssPlugin(config, cb) {
  this.config = config
  this.cb = cb
}

/**
 * Find css assets and if it cannot find the assets it will return false
 * @param type
 * @param compilationAssets
 * @param brand
 * @returns {string|boolean}
 */
BrandCssPlugin.prototype.findCssAsset = function(
  type,
  compilationAssets,
  brand = null
) {
  if (isEmpty(compilationAssets)) return false

  switch (type) {
    case bundleFileName:
      return Object.keys(compilationAssets).find((asset) => {
        return asset.startsWith(bundleFileName) && asset.endsWith('.css')
      })
    case criticalCssFileName:
      return Object.keys(compilationAssets).find((asset) => {
        return asset.endsWith(criticalCssFileName)
      })
    case 'brand':
      return Object.keys(compilationAssets).find((asset) => {
        return asset === `${brand}.css`
      })
    case criticalBrandFileName:
      return Object.keys(compilationAssets).find((asset) => {
        return asset === `${brand}.${criticalBrandFileName}.css`
      })
  }
  return false
}

BrandCssPlugin.prototype.apply = function(compiler) {
  // emit allows to intercept of the bundle css file and start processing
  compiler.plugin('emit', (compilation, next) => {
    // gets the bundle name
    const bundleName = this.findCssAsset('bundle', compilation.assets)
    // Gets the critical CSS name if available
    const criticalCssName = this.findCssAsset(
      criticalCssFileName,
      compilation.assets
    )

    // if the compiled file is not available it will stop
    // Allow any precompiled files called the bundle file
    // if we can't find any bundle or critical css file just don't compile the brand css
    if (
      !compilation.assets[bundleName] &&
      !compilation.assets[criticalCssFileName]
    ) {
      console.log('Did not find any files which has bundle css file')
      return next()
    }

    // The bundled file before it gets processed with all the various plugins
    // This already has the css from all the pages compiled together
    // Provides the source of the file .. precompiled
    // extraBrandCss is the brand specific files relating to brands which is then added into the css file after
    const bundleCssSource = compilation.assets[bundleName].source()

    const files = [
      {
        source: bundleCssSource,
        outputFileName: 'styles.css',
        extraBrandCss: true,
        addCriticalBrand: false,
      },
    ]

    // only add this if any critical files are available to be inserted to all brands folders
    if (criticalCssName) {
      const criticalCssSource = compilation.assets[criticalCssName].source()
      files.push({
        source: criticalCssSource,
        outputFileName: criticalCssFileName,
        extraBrandCss: false,
        addCriticalBrand: true,
      })
    }

    // loop through all the brands
    const promises = this.config.brands.map((brand) => {
      // loops through all the style files to set and format , process css
      // these are e.g topshop.css wallis.css
      const brandCssName = this.findCssAsset('brand', compilation.assets, brand)

      // find all the critical css specific brands e.g header-topshop
      const brandCriticalCssName = this.findCssAsset(
        criticalBrandFileName,
        compilation.assets,
        brand
      )
      // Loop through the files and compile all the required css files in the brands directory
      files.map((config) => {
        let formattedSource = config.source
        // This is used for the extra css for the bundle css file
        if (config.extraBrandCss && compilation.assets[brandCssName]) {
          formattedSource += compilation.assets[brandCssName].source()
        }

        // append critical brand css into critical css file
        if (config.addCriticalBrand && brandCriticalCssName) {
          formattedSource += compilation.assets[brandCriticalCssName].source()
        }

        const formattedSourceCss = formattedSource.replace(/\\\-\-/g, '--')
        // postcss formatting and processing into new styles
        return postcss(this.cb(brand, this.config.dev))
          .use(
            // goes through the css and replaces any names and directories inside in the css
            postcssUrl({
              url: this.config.convertUrlImports
                ? 'copy'
                : (asset) => {
                    return asset.url
                      .replace(`public/${brand}/`, '')
                      .replace(`public/common/`, '../common/')
                  },
              useHash: this.config.convertUrlImports,
            })
          )
          .process(formattedSourceCss, {
            from: undefined,
            to: path.join(
              __dirname,
              `../../../public/${brand}/${config.outputFileName}`
            ),
          })
          .then((result) => {
            result.warnings().forEach((warn) => console.log(warn.toString()))

            compilation.assets[`${brand}/${config.outputFileName}`] = {
              source: () => result.css,
              size: () => Buffer.byteLength(result.css, 'utf8'),
            }
          })
          .catch((err) => {
            // If the reporter throws an error, the message should simply be logged to the console.
            // Otherwise the server will crash.
            if (/postcss-reporter/.test(err.message)) {
              return console.log(err.message, err)
            }
            throw err
          })
      })
    })

    Promise.all(promises)
      .then(() => next())
      .catch((err) => {
        return next(err)
      })
  })
}

module.exports = BrandCssPlugin
