const allBrands = require('./../src/shared/constants/allBrands')
const path = require('path')
const config = new Map()

config.set('host', 'localhost')
config.set('port', 8080)
config.set('root_dir', path.resolve(__dirname, '..'))
config.set('dir_assets', path.join(config.get('root_dir'), '/public'))
config.set('dir_common', 'common')
config.set('dir_src', path.join(config.get('root_dir'), '/src'))
if (process.env.BRANDS) {
  config.set('brands', process.env.BRANDS.split(','))
} else {
  config.set('brands', allBrands)
}

module.exports = config
