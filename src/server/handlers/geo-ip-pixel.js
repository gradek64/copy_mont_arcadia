import Boom from 'boom'

export default (req, reply) => {
  const {
    params: { ISO },
  } = req
  if (!ISO) return reply(Boom.badRequest('Missing ISO param in path'))
  if (ISO.length !== 2) return reply(Boom.badRequest('ISO 2 only'))

  const buf = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  )
  const fiveYears = 157680000
  reply(buf)
    .bytes(buf.length)
    .header('Content-Type', 'image/gif')
    .header('set-cookie', `GEOIP=${ISO};Max-Age=${fiveYears};Path=/`)
}
