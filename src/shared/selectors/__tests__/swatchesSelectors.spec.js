import {
  getSwatchProductById,
  getSelectedSwatchProduct,
  getSelectedSwatchProductId,
} from '../swatchesSelectors'

describe('Swatches Selectors', () => {
  const mockState = {
    products: {
      products: [
        {
          productId: 123,
          colourSwatches: [
            { swatchProduct: { productId: 123 } },
            { swatchProduct: { productId: 321 } },
          ],
        },
      ],
    },
    swatches: {
      products: { 123: { selected: 1 } },
    },
  }

  describe('#getSwatchProductById', () => {
    it('should return an item from swatches with matching productId key', () => {
      const productId = 123

      expect(getSwatchProductById(productId, mockState)).toEqual(
        mockState.swatches.products[productId]
      )
    })
  })

  describe('#getSelectedSwatchProduct', () => {
    it('should return a swatchProduct', () => {
      const productId = 123

      expect(getSelectedSwatchProduct(productId, mockState)).toEqual(
        mockState.products.products[0].colourSwatches[1].swatchProduct
      )
    })
    it('should return an empty object', () => {
      const productId = 'non-existing-id'

      expect(getSelectedSwatchProduct(productId, mockState)).toEqual(undefined)
    })
  })

  describe('#getSelectedSwatchProductId', () => {
    it('should return a swatchProduct.productId', () => {
      const productId = 123

      expect(getSelectedSwatchProductId(productId, mockState)).toEqual(
        mockState.products.products[0].colourSwatches[1].swatchProduct.productId
      )
    })
  })
})
