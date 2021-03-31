import * as getProductRoute from '../get-product-route'

describe('getProductRoute', () => {
  describe('#getRouteFromUrl', () => {
    it('should strip the domain from the url', () => {
      const url =
        'https://burton.co.uk/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      expect(getProductRoute.getRouteFromUrl(url)).toBe(
        '/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      )
    })

    it('should strip protocol-less domains from the url', () => {
      const url =
        '//burton.co.uk/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      expect(getProductRoute.getRouteFromUrl(url)).toBe(
        '/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      )
    })

    it('should return the url as is if there‘s no domain', () => {
      const url =
        '/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      expect(getProductRoute.getRouteFromUrl(url)).toBe(
        '/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      )
    })

    it('should return `null` if the url is not valid url', () => {
      const url = 'foo-bar'
      expect(getProductRoute.getRouteFromUrl(url)).toBeNull()
    })
  })

  describe('#getProductRouteFromId', () => {
    it('should build a product url from the pathname and id in dev', () => {
      const pathname =
        '/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      const localiseMock = jest.fn(() => 'product')
      expect(
        getProductRoute.getProductRouteFromId(pathname, '123', localiseMock)
      ).toBe('/en/bruk/product/123')
      expect(localiseMock).toHaveBeenCalledWith('product')
    })

    it('should build a product url from the pathname and id in prod', () => {
      const pathname =
        '/en/bruk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      const localiseMock = jest.fn(() => 'product')
      expect(
        getProductRoute.getProductRouteFromId(pathname, '123', localiseMock)
      ).toBe('/en/bruk/product/123')
      expect(localiseMock).toHaveBeenCalledWith('product')
    })

    it('should build a product url from the pathname which has multiple words of product in the url', () => {
      const pathname =
        '/en/bruk/product/product/product/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      const localiseMock = jest.fn(() => 'product')
      expect(
        getProductRoute.getProductRouteFromId(pathname, '123', localiseMock)
      ).toBe('/en/bruk/product/123')
      expect(localiseMock).toHaveBeenCalledWith('product')
    })

    it('should build a product url if pathname has any numbers or characters', () => {
      const pathname =
        '/en5/br2211uk/product/short-sleeve-white-linen-blend-overhead-shirt-5555497'
      const localiseMock = jest.fn(() => 'product')
      expect(
        getProductRoute.getProductRouteFromId(pathname, '123', localiseMock)
      ).toBe('/en5/br2211uk/product/123')
      expect(localiseMock).toHaveBeenCalledWith('product')
    })
  })

  describe('#getProductRouteFromParams', () => {
    it('should build a product url given parameters', () => {
      expect(
        getProductRoute.getProductRouteFromParams(
          'fr',
          'brfr',
          'produit',
          '123'
        )
      ).toBe('/fr/brfr/produit/123')
    })
  })

  describe('removeQueryFromPathname', () => {
    it('should handle with query parameter', () => {
      expect(
        getProductRoute.removeQueryFromPathname('aaaa.com?query=1&query=2')
      ).toBe('aaaa.com')
    })

    it('should handle without query parameter', () => {
      expect(getProductRoute.removeQueryFromPathname('aaaa.com')).toBe(
        'aaaa.com'
      )
    })
  })
})
