function RemovalPlugin(configs) {
  this.configs = configs.map(config => Object.assign({ test: /^$/ }, config))
}

RemovalPlugin.prototype.shouldRemove = function (name) {
  return this.configs.find(config => {
    const { test } = config
    return test.test(name)
  })
}

RemovalPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', (compilation, next) => {
    Promise.resolve().then(() => {
      compilation.assets = Object.keys(compilation.assets)
        .filter(name => !this.shouldRemove(name))
        .reduce((assets, name) => {
          assets[name] = compilation.assets[name]
          return assets
        }, {})

      next()
    })
      .catch(err => next(err))
  })
}

module.exports = RemovalPlugin
