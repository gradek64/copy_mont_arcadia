const postcss = require('postcss')
const cssnano = require('cssnano')

function CssNanoPlugin(config) {
  this.config = config
}

CssNanoPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, next) => {
    const styleSheets = Object.keys(compilation.assets).filter((name) =>
      name.endsWith('.css')
    )

    const promises = styleSheets.map((name) => {
      const css = compilation.assets[name].source()
      return postcss([cssnano(this.config)])
        .process(css, { from: undefined })
        .then((result) => {
          compilation.assets[name] = {
            source: () => result.css,
            size: () => Buffer.byteLength(result.css, 'utf8'),
          }
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

module.exports = CssNanoPlugin
