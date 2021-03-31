import NavigationDesktop from '../NavigationDesktop'

jest.mock('../../../Mapper')

const navigationDesktop = new NavigationDesktop()

describe('# NavigationDesktop', () => {
  describe('# mapEndpoint', () => {
    it('sets "destinationEndpoint" property to the expected value', () => {
      expect(navigationDesktop.destinationEndpoint).toBeUndefined()
      navigationDesktop.mapEndpoint()
      expect(navigationDesktop.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/CategoryDetails'
      )
    })
  })
  describe('# mapRequestParameters', () => {
    it('sets the "query" property as expected', () => {
      expect(navigationDesktop.query).toBeUndefined()

      navigationDesktop.mapRequestParameters()
      expect(navigationDesktop.query).toEqual({
        catalogId: undefined,
        langId: undefined,
        storeId: undefined,
      })

      navigationDesktop.storeConfig = {
        catalogId: 'catalogId',
        langId: 'langId',
        siteId: 'storeId',
      }
      navigationDesktop.mapRequestParameters()
      expect(navigationDesktop.query).toEqual({
        catalogId: 'catalogId',
        langId: 'langId',
        storeId: 'storeId',
      })
    })
  })
})
