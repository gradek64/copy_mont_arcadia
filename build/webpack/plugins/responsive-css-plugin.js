const R = require('ramda')
const postcss = require('postcss')
const breakPoints = require('../../../src/shared/brand/default/variables/default-responsive.js')
const breakKeys = R.keys(breakPoints)
const breakValues = R.values(breakPoints)

function ResponsiveCssPlugin() {}

function initMediaQueryRoot() {
  return breakKeys.reduce((prev, next) => {
    prev[next] = postcss.root()
    return prev
  }, {})
}

function splitMediaQuery(css, result) {
  const mediaCss = initMediaQueryRoot()
  return css.walkAtRules((rule) => {
    const indexAt = breakValues.indexOf(rule.params)
    if (rule.name === 'media' && indexAt > -1) {
      const cssName = breakKeys[indexAt]
      if (cssName === 'mobile') return
      mediaCss[cssName].append(rule)
      result.chunks = mediaCss
      return result
    }
  })
}

function mergeNodesToCss(result) {
  // Currently merges the minimal MediaQueries with the higher sizes.
  return breakKeys.reduce((prev, name, i) => {
    if (!name.includes('-') && !name.includes('mobile')) {
      const initialCss = result.chunks[name].toResult().css
      prev[name] =
        breakKeys.reduce((css, additional, j) => {
          if (i > j && additional.includes('min-')) {
            return css + result.chunks[additional].toResult().css + '\n'
          }
          return css
        }, '') + initialCss
    }
    return prev
  }, {})
}

function writeCss(css) {
  return {
    source: () => css,
    size: () => Buffer.byteLength(css, 'utf8'),
  }
}

ResponsiveCssPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, next) => {
    const styleSheets = Object.keys(compilation.assets).filter((name) =>
      name.endsWith('styles.css')
    )

    const promises = styleSheets.map((name) => {
      const css = compilation.assets[name].source()
      return postcss([splitMediaQuery])
        .process(css, { from: undefined })
        .then((result) => {
          // Update styles.css without MediaQueries
          compilation.assets[name] = writeCss(result.css)
          return result
        })
        .then(mergeNodesToCss)
        .then((mediaQueries) => {
          Object.keys(mediaQueries).forEach((media) => {
            compilation.assets[
              name.replace('.css', '-' + media + '.css')
            ] = writeCss(mediaQueries[media])
          })
        })
        .catch(({ name, reason }) =>
          console.error('Error in postcss compilation', name, reason)
        )
    })

    Promise.all(promises).then(() => {
      next()
    })
  })
}

module.exports = ResponsiveCssPlugin
