const jsessionidCookieOptions = {
  // 31 days as the TTL of the keys in the Redis Session Manager. This TTL is
  // necessary in order to replicate the same behaviour of Legacy Desktop where
  // the Guest User shopping bag lasts 10 days.
  ttl: 1000 * 60 * 60 * 24 * 5,
  path: '/',
  encoding: 'none',
  // For local development and continuous integration environments, transmission
  // over http is permitted.
  isSecure: process.env.NODE_ENV === 'production' && process.env.CI !== 'true',
  // Setting the following to true will deny any attempt of accessing the cookie
  // through javascript.
  isHttpOnly: true,
  clearInvalid: false,
  strictHeader: false,
}

export { jsessionidCookieOptions }
