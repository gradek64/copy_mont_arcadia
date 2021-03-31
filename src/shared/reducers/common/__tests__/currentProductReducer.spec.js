import currentProductReducer from '../currentProductReducer'

describe('Current Product', () => {
  describe('CLEAR_PRODUCT', () => {
    it('should return an empty object', () => {
      const currentProduct = {
        productId: 30263823,
      }
      const reducer = currentProductReducer(currentProduct, {
        type: 'CLEAR_PRODUCT',
      })
      expect(reducer).toEqual({})
    })
  })

  describe('SET_PRODUCT', () => {
    it('should replace with supplied product', () => {
      const currentProduct = {
        productId: 30263823,
      }
      const product = {
        productId: 30164534,
      }
      const expectedState = {
        ...product,
        newItems: undefined,
      }
      const reducer = currentProductReducer(currentProduct, {
        type: 'SET_PRODUCT',
        product,
      })
      expect(reducer).toEqual(expectedState)
    })

    it('should replace with supplied product but dont overwrite items its the same product', () => {
      const initialState = {
        productId: 30263823,
        data: 'old',
        newItems: {
          productId: 30263823,
          items: [{ a: 'b' }],
        },
      }
      const product = {
        productId: 30263823,
        data: 'new',
        items: [{ b: 'c' }],
      }
      const reducer = currentProductReducer(initialState, {
        type: 'SET_PRODUCT',
        product,
      })
      expect(reducer).toEqual({
        productId: 30263823,
        data: 'new',
        items: [{ a: 'b' }],
      })
    })

    it('should replace with supplied product but overwrite items its not the same product', () => {
      const initialState = {
        productId: 30263823,
        items: [{ a: 'b' }],
      }
      const product = {
        productId: 30164534,
        items: [{ b: 'c' }],
      }

      const expectedState = {
        ...product,
        newItems: undefined,
      }
      const reducer = currentProductReducer(initialState, {
        type: 'SET_PRODUCT',
        product,
      })
      expect(reducer).toEqual(expectedState)
    })
  })

  describe('UPDATE_SEE_MORE_URL', () => {
    it('should add `seeMoreUrl`s to correct see more links', () => {
      const currentProduct = {
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
          },
        ],
      }

      const reducer = currentProductReducer(currentProduct, {
        type: 'UPDATE_SEE_MORE_URL',
        seeMoreLink: '/_/N-2bu3Z1xjf',
        seeMoreUrl:
          'www.topman.com.arcadiagroup.co.uk/Spray-On-Jeans/_/N-2bu3Z1xjf',
      })
      expect(reducer).toEqual({
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
            seeMoreUrl:
              'www.topman.com.arcadiagroup.co.uk/Spray-On-Jeans/_/N-2bu3Z1xjf',
          },
        ],
      })
    })
  })

  describe('UPDATE_PRODUCT_ITEMS', () => {
    it('should not updated items if its for the same product', () => {
      const old_items = [{ a: 'c', b: 'd' }]
      const items = [{ a: '000', b: '111' }]
      const initialState = {
        productId: '12345',
        items: old_items,
      }

      const reducer = currentProductReducer(initialState, {
        type: 'UPDATE_PRODUCT_ITEMS',
        productId: '12345',
        items,
      })
      expect(reducer).toEqual({
        productId: '12345',
        items: [{ a: '000', b: '111' }],
      })
    })

    it('should set newItems if its for the different product', () => {
      const old_items = [{ a: 'c', b: 'd' }]
      const items = [{ a: 'b', b: 'c' }]
      const currentProduct = {
        productId: '12345',
        items: old_items,
      }

      const reducer = currentProductReducer(currentProduct, {
        type: 'UPDATE_PRODUCT_ITEMS',
        productId: 'ABCDEF',
        items,
      })
      expect(reducer).toEqual({
        productId: '12345',
        items: old_items,
        newItems: {
          productId: 'ABCDEF',
          items,
        },
      })
    })
  })
})
