process.env.NODE_ENV = 'production'

// Doesn't currently work when analysing all brands
process.env.BRANDS = 'topshop'

module.exports = require('./default.config')({ prod: true, analyse: true })
