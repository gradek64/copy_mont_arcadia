import {
  getQuickview,
  getQuickviewActiveItem,
  getQuickViewProduct,
  getQuickViewProductId,
  shouldShowQuickviewError,
  getQuickviewQuantity,
} from '../quickviewSelectors'

describe('quickviewSelectors', () => {
  describe('getQuickview', () => {
    it('should get quick view state from the root state', () => {
      const quickview = {
        test: true,
      }
      const state = {
        quickview,
      }

      expect(getQuickview(state)).toEqual(quickview)
    })

    it('should default to an empty object', () => {
      expect(getQuickview({})).toEqual({})
    })
  })

  describe('getQuickviewActiveItem', () => {
    it('should get quick view active item', () => {
      const activeItem = {
        test: true,
      }
      const state = {
        quickview: {
          activeItem,
        },
      }

      expect(getQuickviewActiveItem(state)).toEqual(activeItem)
    })

    it('should default to an empty object', () => {
      expect(getQuickviewActiveItem({})).toEqual({})
    })
  })

  describe('getQuickViewProduct', () => {
    it('should get quick view product', () => {
      const product = {
        test: true,
      }
      const state = {
        quickview: {
          product,
        },
      }

      expect(getQuickViewProduct(state)).toEqual(product)
    })

    it('should default to an empty object', () => {
      expect(getQuickViewProduct({})).toEqual({})
    })
  })

  describe('getQuickViewProductId', () => {
    it('should get quick view productId', () => {
      const productId = 'abc123'
      const state = {
        quickview: {
          productId,
        },
      }

      expect(getQuickViewProductId(state)).toBe(productId)
    })

    it('should default to an empty object', () => {
      expect(getQuickViewProductId({})).toEqual({})
    })
  })

  describe('shouldShowQuickviewError', () => {
    it('should get the show error state', () => {
      const showError = true
      const state = {
        quickview: {
          showError,
        },
      }

      expect(shouldShowQuickviewError(state)).toBe(showError)
    })

    it('should default to false', () => {
      expect(shouldShowQuickviewError({})).toEqual(false)
    })
  })

  describe('getQuickviewQuantity', () => {
    it('should get the selected quantity from state', () => {
      const selectedQuantity = 4
      const state = {
        quickview: {
          selectedQuantity,
        },
      }

      expect(getQuickviewQuantity(state)).toBe(selectedQuantity)
    })

    it('should default to 1', () => {
      expect(getQuickviewQuantity({})).toBe(1)
    })
  })
})
