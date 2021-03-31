function getBrandConfigFromHeaders(req) {
  return (
    (req.headers['brand-code'] && req.headers['brand-code'].substring(0, 2)) ||
    'ts'
  )
}

export function mockFooterHandler(req, reply) {
  const brandCode = getBrandConfigFromHeaders(req)
  reply(null, require(`./mocks/footer-${brandCode}.json`)) // eslint-disable-line import/no-dynamic-require
}

export function mockNavigationHandler(req, reply) {
  const brandCode = getBrandConfigFromHeaders(req)
  reply(null, require(`./mocks/nav-${brandCode}.json`)) // eslint-disable-line import/no-dynamic-require
}
