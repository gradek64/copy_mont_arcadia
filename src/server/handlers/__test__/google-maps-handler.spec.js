jest.mock('../../../server/lib/logger', () => ({
  generateTransactionId: () => 'AAAAA',
  info: jest.fn(),
  error: jest.fn(),
}))

import { error } from '../../../server/lib/logger'
import googleMapsHandler from '../google-maps-handler'

// For more info and to test url and key combinations check here:
// https://developers.google.com/maps/documentation/maps-static/get-api-key#dig-sig-key

describe('google static maps signing at endpoint: /api/static-map', () => {
  const OLD_ENV = process.env
  const dummySigningKey = 'testkeytestkeytestkeytestke='
  let code
  let mockReply
  let response

  // These urls should have their queryStrings UrlEncoded already (required to generate correct base64 key)
  const propsWithoutMappers = {
    currentLat: 51.515615,
    currentLng: -0.1432734,
    markers: [],
    dimensions: {
      height: 650,
      width: 394,
    },
    iconDomain: 'static.topshop.com',
    zoom: 14,
  }
  const propsWithMappers = {
    ...propsWithoutMappers,
    markers: [
      [51.5157, -0.141396],
      [51.514043, -0.157231],
      [51.509599, -0.123069],
      [51.499783, -0.163677],
    ],
  }
  const normalRequest =
    'https://maps.googleapis.com/maps/api/staticmap?center=51.515615%2C-0.1432734&zoom=14&size=394x650&maptype=roadmap&style=feature%3Apoi%7Cvisibility%3Aoff%26style%3Dfeature%3Apoi.park%7Cvisibility%3Aon&key=AIzaSyBadoEbcsHE0WvdLeRiBXz0mnGpwS7ZlnQ'
  const withMappersRequest =
    'https://maps.googleapis.com/maps/api/staticmap?center=51.515615%2C-0.1432734&zoom=14&size=394x650&maptype=roadmap&style=feature%3Apoi%7Cvisibility%3Aoff%26style%3Dfeature%3Apoi.park%7Cvisibility%3Aon&key=AIzaSyBadoEbcsHE0WvdLeRiBXz0mnGpwS7ZlnQ&markers=icon%3Ahttps%3A%2F%2Fstatic.topshop.com%2Fv1%2Fstatic%2Fstore-markers%7C51.5157%2C-0.141396%7C51.514043%2C-0.157231%7C51.509599%2C-0.123069%7C51.499783%2C-0.163677'

  const expectedNormalSigned =
    'https://maps.googleapis.com/maps/api/staticmap?center=51.515615%2C-0.1432734&zoom=14&size=394x650&maptype=roadmap&style=feature%3Apoi%7Cvisibility%3Aoff%26style%3Dfeature%3Apoi.park%7Cvisibility%3Aon&key=AIzaSyBadoEbcsHE0WvdLeRiBXz0mnGpwS7ZlnQ&signature=ffy74XUFWrPYsjDsQ8EfgQ2V_vw='
  const expectedWithMappersSigned =
    'https://maps.googleapis.com/maps/api/staticmap?center=51.515615%2C-0.1432734&zoom=14&size=394x650&maptype=roadmap&style=feature%3Apoi%7Cvisibility%3Aoff%26style%3Dfeature%3Apoi.park%7Cvisibility%3Aon&key=AIzaSyBadoEbcsHE0WvdLeRiBXz0mnGpwS7ZlnQ&markers=icon%3Ahttps%3A%2F%2Fstatic.topshop.com%2Fv1%2Fstatic%2Fstore-markers%7C51.5157%2C-0.141396%7C51.514043%2C-0.157231%7C51.509599%2C-0.123069%7C51.499783%2C-0.163677&signature=zxrXHjk2I6zQf6z1y72MSLLiEbk='

  const validRequestOptions = (props) => ({
    url: '/api/static-map',
    method: 'POST',
    info: {
      hostname: 'www.topshop.com',
    },
    payload: props,
  })

  beforeEach(() => {
    code = jest.fn()
    mockReply = jest.fn((r) => {
      response = r
      return {
        code,
      }
    })
  })

  afterEach(() => {
    process.env = OLD_ENV
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('Valid requests', () => {
    beforeEach(() => {
      process.env.GOOGLE_URL_SIGNING_SECRET = dummySigningKey
      process.env.GOOGLE_API_KEY = 'AIzaSyBadoEbcsHE0WvdLeRiBXz0mnGpwS7ZlnQ'
    })

    it('correctly signs a normal request without mappers', async () => {
      const requestOptions = validRequestOptions(propsWithoutMappers)
      googleMapsHandler(requestOptions, mockReply)
      expect(mockReply).toHaveBeenCalledWith({
        url: normalRequest,
        signature: expectedNormalSigned,
      })
      expect(code).toHaveBeenCalledWith(200)
    })

    it('correctly signs a normal request with mappers and an icon url provided', async () => {
      const requestOptions = validRequestOptions(propsWithMappers)
      googleMapsHandler(requestOptions, mockReply)
      expect(mockReply).toHaveBeenCalledWith({
        url: withMappersRequest,
        signature: expectedWithMappersSigned,
      })
      expect(code).toHaveBeenCalledWith(200)
    })
  })

  describe('Invalid requests', () => {
    it('returns an error if there is no payload provided', async () => {
      googleMapsHandler({ info: { hostname: 'www.topshop.com' } }, mockReply)
      expect(response.output).toEqual({
        statusCode: 400,
        payload: {
          statusCode: 400,
          error: 'Bad Request',
          message:
            'a request body with the following properties are required: currentLat, currentLng, markers, dimensions, iconDomain, zoom',
        },
        headers: {},
      })
    })

    it('no props provided in the payload', async () => {
      googleMapsHandler(
        {
          info: { hostname: 'www.topshop.com' },
          payload: {},
        },
        mockReply
      )
      expect(response.output).toEqual({
        statusCode: 400,
        payload: {
          statusCode: 400,
          error: 'Bad Request',
          message:
            'a request body with the following properties are required: currentLat, currentLng, markers, dimensions, iconDomain, zoom',
        },
        headers: {},
      })
    })

    it("fallsback to unsigned url if the signing secret isn't available", async () => {
      delete process.env.GOOGLE_URL_SIGNING_SECRET
      const requestOptions = validRequestOptions(propsWithoutMappers)
      googleMapsHandler(requestOptions, mockReply)
      expect(mockReply).toHaveBeenCalledWith({
        url: normalRequest,
        signature: normalRequest,
      })
      expect(code).toHaveBeenCalledWith(200)
    })

    it('should call logger when error encountered', async () => {
      googleMapsHandler(
        {
          info: { hostname: 'www.topshop.com' },
          payload: { url: '' },
        },
        mockReply
      )
      expect(error).toHaveBeenCalledTimes(1)
    })
  })
})
