import Boom from 'boom'
import geoIPPixelHandler from '../geo-ip-pixel'

describe('geoIPPixel', () => {
  let reply
  let response
  beforeEach(() => {
    response = {
      bytes: jest.fn(() => response),
      header: jest.fn(() => response),
    }
    reply = jest.fn(() => response)
  })
  it('sets the GEOIP cookie in the response', () => {
    const ISO = 'US'
    const req = {
      params: {
        ISO,
      },
    }

    geoIPPixelHandler(req, reply)

    expect(reply).toHaveBeenCalledTimes(1)
    expect(reply.mock.calls[0][0]).toBeInstanceOf(Buffer)
    expect(response.bytes).toHaveBeenCalledWith(42)
    expect(response.header).toHaveBeenCalledWith('Content-Type', 'image/gif')
    expect(response.header).toHaveBeenCalledWith(
      'set-cookie',
      `GEOIP=${ISO};Max-Age=157680000;Path=/`
    )
  })

  it('missing ISO param', () => {
    const req = {
      params: {},
    }

    geoIPPixelHandler(req, reply)

    expect(response.header).not.toHaveBeenCalled()
    expect(reply).toHaveBeenCalledWith(
      Boom.badRequest('Missing ISO param in path')
    )
  })

  it('ISO 2 only please :D', () => {
    const req = {
      params: {
        ISO: 'USA',
      },
    }

    geoIPPixelHandler(req, reply)

    expect(response.header).not.toHaveBeenCalled()
    expect(reply).toHaveBeenCalledWith(Boom.badRequest('ISO 2 only'))
  })
})
