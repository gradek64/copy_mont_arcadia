import Navigation from '../Navigation'

jest.mock('../../../Mapper')

const navigation = new Navigation()

describe('# Navigation', () => {
  describe('# mapEndpoint', () => {
    it('sets "destinationEndpoint" property to the expected value', () => {
      expect(navigation.destinationEndpoint).toBeUndefined()
      navigation.storeConfig = { siteId: 'siteId' }
      navigation.mapEndpoint()
      expect(navigation.destinationEndpoint).toBe('/navigation-siteId.json')
    })
  })
  describe('# mapResponseBody', () => {
    it('returns body.navigationEntries or empty object', () => {
      expect(navigation.mapResponseBody()).toEqual({})
      expect(navigation.mapResponseBody({})).toEqual({})
      expect(navigation.mapResponseBody({ a: 'a' })).toEqual({})
      expect(
        navigation.mapResponseBody({ navigationEntries: 'navigationEntries' })
      ).toBe('navigationEntries')
    })
  })
})
