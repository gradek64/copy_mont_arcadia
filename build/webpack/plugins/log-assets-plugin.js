
const LogAssetsPlugin = function (prefix='', bail=false) {
  const shouldBail = typeof bail === 'function' ? bail : () => !!bail
  const shouldBailToString = shouldBail.toString ? shouldBail.toString() : 'bail?'
  this.apply = (compiler) => {
    compiler.plugin('emit', (compilation, next) => {
      const assets = Object.keys(compilation.assets).sort()
      console.log(`${prefix.toUpperCase()} - LOG ASSETS:`, assets)
      next(shouldBail(assets) ? new Error(`${prefix.toUpperCase()} - List Assets bailing because ${shouldBailToString} evaluated to true`) : undefined)
    })
  }
}

module.exports = LogAssetsPlugin
