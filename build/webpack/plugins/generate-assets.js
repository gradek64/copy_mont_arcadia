const R = require('ramda')

const assetsFile = 'generated-assets.json'
const manifestFile = 'webpack-manifest.json'

module.exports = class GenerateAssets {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const publicPath = compilation.outputOptions.publicPath
      const assetList = Object.keys(compilation.assets).reduce((prev, name) => {
        if (!name || name === manifestFile) return prev
        const extension = name.match(/\.([^\.]+)$/)
        const type = extension[1] ? extension[1] : 'other'
        const originalName = compilation.assets[name].originalName || name

        return R.assocPath([type, originalName], publicPath + name, prev)
      }, {})

      if (compilation.assets[manifestFile])
        delete compilation.assets[manifestFile]

      compilation.assets[assetsFile] = {
        source: () => JSON.stringify(assetList),
        size: () => Buffer.byteLength(JSON.stringify(assetList), 'utf8'),
      }
      callback()
    })
  }
}
