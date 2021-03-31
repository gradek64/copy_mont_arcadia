import { product, recommendation } from '../data-mapper'
import {
  GTM_PAGE_TYPES,
  GTM_LIST_TYPES,
} from '../../../../shared/analytics/analytics-constants'

describe('Data mapper', () => {
  describe('Product', () => {
    it('fails gracefully if no product is passed', () => {
      const mappedProduct = product()
      expect(mappedProduct).not.toBeUndefined()
    })

    describe('maps category', () => {
      it('uses categoryTitle if product.list is not provided', () => {
        const mappedProduct = product(
          {},
          null,
          GTM_PAGE_TYPES.PDP_PAGE_TYPE,
          'Jeans'
        )
        expect(mappedProduct.category).toBe('Jeans')
      })

      it('sets category as GTM_PAGE_TYPES.PDP_PAGE_TYPE if product.list references PDP page', () => {
        const mappedProductRecentlyViewed = product(
          {
            list: GTM_LIST_TYPES.PDP_RECENTLY_VIEWED,
          },
          null,
          GTM_PAGE_TYPES.PDP_PAGE_TYPE,
          'Jeans'
        )
        expect(mappedProductRecentlyViewed.category).toBe(
          GTM_PAGE_TYPES.PDP_PAGE_TYPE
        )

        const mappedProductWhyNotTry = product(
          {
            list: GTM_LIST_TYPES.PDP_WHY_NOT_TRY,
          },
          null,
          GTM_PAGE_TYPES.PDP_PAGE_TYPE,
          'Jeans'
        )
        expect(mappedProductWhyNotTry.category).toBe(
          GTM_PAGE_TYPES.PDP_PAGE_TYPE
        )
      })
    })

    it('maps ecmcCategory', () => {
      const iscmCategory = 'EASY'
      const mappedProduct = product({
        iscmCategory,
      })
      expect(mappedProduct.ecmcCategory).toBe(iscmCategory)
    })

    it('does not map category if category key in product attributes is missing', () => {
      const mappedProduct = product({
        attributes: {},
      })
      expect(mappedProduct.category).toBe(undefined)
    })

    it('maps quantity', () => {
      const quantity = 4
      const mappedProduct = product({
        quantity,
      })
      expect(mappedProduct.quantity).toBe(quantity.toString())
    })

    it('maps total size', () => {
      const mappedProduct = product({
        items: [{ size: 1 }, { size: 2 }, {}, { size: 0 }, { size: 4 }],
      })
      expect(mappedProduct.totalSizes).toBe('3')
    })

    it('maps total size with sizes as strings', () => {
      const mappedProduct = product({
        items: [{ size: 'ONE', quantity: 10 }, { size: 'TWO', quantity: 0 }],
      })
      expect(mappedProduct.totalSizes).toBe('2')
    })

    it('does not map total size if items is not an array', () => {
      const mappedProduct = product({
        items: 'whatever',
      })
      expect(mappedProduct.totalSizes).toBeUndefined()
    })

    it('maps sizes in stock', () => {
      const mappedProduct = product({
        items: [
          { size: 1, quantity: 1 },
          { size: 2, quantity: 0 },
          {},
          { size: 0, quantity: 2 },
          { size: 4, quantity: 3 },
        ],
      })
      expect(mappedProduct.sizesInStock).toBe('1,4')
    })

    it('does not map size in stock if items is not an array', () => {
      const mappedProduct = product({
        items: 'whatever',
      })
      expect(mappedProduct.sizesInStock).toBeUndefined()
    })

    it('maps size when size is a number', () => {
      const size = 3
      const mappedProduct = product({
        size,
      })
      expect(mappedProduct.size).toBe(size.toString())
    })

    it('maps size when size is a string', () => {
      const size = '3'
      const mappedProduct = product({
        size,
      })
      expect(mappedProduct.size).toBe(size)
    })

    it('maps review rating from product attributes', () => {
      const mappedProduct = product({
        attributes: {
          AverageOverallRating: '1',
          bazaarVoiceData: {
            average: 5,
          },
        },
      })
      expect(mappedProduct.reviewRating).toBe('1.0')
    })

    it('maps review rating from bazaar', () => {
      const mappedProduct = product({
        bazaarVoiceData: {
          average: 5,
        },
      })
      expect(mappedProduct.reviewRating).toBe('5.0')
    })

    it('maps product id', () => {
      const productId = 32006092
      const mappedProduct = product({
        productId,
      })
      expect(mappedProduct.productId).toBe(productId.toString())
    })

    it('maps line number', () => {
      const lineNumber = '02G22NBLC'
      const mappedProduct = product({
        lineNumber,
      })
      expect(mappedProduct.id).toBe(lineNumber)
    })

    it('maps name', () => {
      const mappedProduct = product({
        lineNumber: '02G22NBLC',
        name: 'product name',
      })
      expect(mappedProduct.name).toBe('(02G22NBLC) product name')
    })

    it('does not map markdown when was price is not available', () => {
      const mappedProduct = product({})
      expect(mappedProduct.markdown).toBeUndefined()
    })

    it('maps markdown', () => {
      const mappedProduct = product({
        wasPrice: 10,
        unitPrice: 3,
      })
      expect(mappedProduct.markdown).toBe('70.00')
    })

    it('maps department', () => {
      const mappedProduct = product({
        attributes: {
          Department: 'Some Product',
        },
      })
      expect(mappedProduct.department).toBe('Some Product')
    })
  })

  describe('Recommendation', () => {
    it('fails gracefully if no product is passed', () => {
      const mappedProduct = recommendation()
      expect(mappedProduct).not.toBeUndefined()
    })

    it('maps recommendation correctly', () => {
      const peeriusProductMock = {
        prices: {
          GBP: {
            unitPrice: 42,
            salePrice: 42,
          },
        },
        url: 'http://www.topshop.com/random-link-so-random',
        img:
          'https://images.topshop.com/i/it-was-a-real-image-link-but-i-shortened-it',
        attributes: {
          size: 'w3634',
          productterm: 'jeans',
          type1: 'shop all jeans',
          term: 'jean',
          topterm: 'jean',
        },
        id: 1977429789961,
        title: 'Authentic Raw Hem Jamie Jeans',
        refCode: 'TS02K03PBLG',
      }

      const peeriusSaleProductMock = {
        ...peeriusProductMock,
        prices: {
          GBP: {
            unitPrice: 42,
            salePrice: 25,
          },
        },
      }

      const mappedProduct = recommendation(
        peeriusProductMock,
        'GBP',
        GTM_PAGE_TYPES.PDP_PAGE_TYPE
      )

      const mappedSaleProduct = recommendation(
        peeriusSaleProductMock,
        'GBP',
        GTM_PAGE_TYPES.PDP_PAGE_TYPE
      )

      expect(mappedProduct).toMatchObject({
        id: 'TS02K03PBLG',
        productId: '',
        name: '(TS02K03PBLG) Authentic Raw Hem Jamie Jeans',
        price: '42',
        unitNowPrice: '42',
        quantity: 1,
        position: 1,
        category: 'pdp',
        list: GTM_LIST_TYPES.PDP_WHY_NOT_TRY,
      })

      expect(mappedSaleProduct).toMatchObject({
        id: 'TS02K03PBLG',
        productId: '',
        name: '(TS02K03PBLG) Authentic Raw Hem Jamie Jeans',
        price: '25',
        unitNowPrice: '25',
        quantity: 1,
        position: 1,
        category: 'pdp',
        list: GTM_LIST_TYPES.PDP_WHY_NOT_TRY,
      })
    })
  })
})
