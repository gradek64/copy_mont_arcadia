const crypto = require('crypto')

function hash(buffer) {
  return crypto
    .createHash('md5')
    .update(buffer)
    .digest('hex')
}

const HASH_REGEX = /\.([^\.]*)\./

const mapHash = {}

module.exports = class AddHashesPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      Object.keys(compilation.assets).forEach((assetName) => {
        if (
          assetName === 'webpack-manifest.json' ||
          assetName.includes('critical.css')
        )
          return
        const assetHash = assetName.endsWith('.map')
          ? mapHash[assetName.substring(0, assetName.length - 4)]
          : hash(compilation.assets[assetName].source())
        if (assetName.endsWith('.js')) {
          mapHash[assetName] = assetHash
        }
        const webpackHash = assetName.match(HASH_REGEX)
        const newName =
          webpackHash && !assetName.endsWith('.map')
            ? assetName.replace(webpackHash[1], assetHash)
            : assetName.replace('.', `.${assetHash}.`)
        compilation.assets[newName] = compilation.assets[assetName]
        compilation.assets[newName].originalName = assetName
        delete compilation.assets[assetName]
      })
      callback()
    })
  }
}
