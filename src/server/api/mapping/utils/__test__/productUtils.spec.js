import { getProductUnitPrice } from '../productUtils'

describe('getProductUnitPrice', () => {
  describe('when isBundleOrOutfit,bundleType and bundleMinPrice are undefined', () => {
    const product = {
      nowPrice: 25,
    }
    it('should return the `nowPrice`', () => {
      const price = getProductUnitPrice(product)
      expect(price).toEqual('25.00')
    })
  })

  describe('when isBundleOrOutfit,bundleType and bundleMinPrice are not undefined', () => {
    describe('when isBundleOrOutfit is equal to `Outfit` or `Bundle` and NumberOfSlots is greater than 1', () => {
      const product = {
        nowPrice: 25,
        isBundleOrOutfit: 'Outfit',
        bundleType: 'Flexible',
        bundleMinPrice: 30,
        NumberOfSlots: 3,
      }
      it('should return the `bundleMinPrice`', () => {
        const price = getProductUnitPrice(product)
        expect(price).toEqual('30.00')
      })
    })

    describe('when isBundleOrOutfit is equal to `Outfit` or `Bundle` and NumberOfSlots is not greater than 1', () => {
      const product = {
        nowPrice: 25,
        isBundleOrOutfit: 'Outfit',
        bundleType: 'Flexible',
        bundleMinPrice: 30,
        NumberOfSlots: 1,
      }
      it('should return the `nowPrice`', () => {
        const price = getProductUnitPrice(product)
        expect(price).toEqual('25.00')
      })
    })

    describe('when isBundleOrOutfit is not equal to `Outfit` or `Bundle` and NumberOfSlots is greater than 1', () => {
      const product = {
        nowPrice: 25,
        isBundleOrOutfit: 'Bund',
        bundleType: 'Flexible',
        bundleMinPrice: 30,
        NumberOfSlots: 3,
      }
      it('should return the `nowPrice`', () => {
        const price = getProductUnitPrice(product)
        expect(price).toEqual('25.00')
      })
    })
  })
})
