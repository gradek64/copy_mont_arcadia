import testReducer from '../swatchesReducer'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'

describe('Swatches Reducer', () => {
  it('Default values', () => {
    const state = configureMockStore().getState()
    expect(state.swatches.products).toEqual({})
  })
  describe('NEXT_SWATCHES', () => {
    it('should increase page counter in existing product', () => {
      expect(
        testReducer(
          {
            products: {
              12345: {
                page: 3,
                selected: 2,
              },
              54321: {
                page: 1,
                selected: 4,
              },
            },
          },
          {
            type: 'NEXT_SWATCHES',
            productId: 12345,
          }
        )
      ).toEqual({
        products: {
          12345: {
            page: 4,
            selected: 2,
          },
          54321: {
            page: 1,
            selected: 4,
          },
        },
      })
    })
    it('should add default product with increased page counter if productId not exists', () => {
      expect(
        testReducer(
          {
            products: {
              12345: {
                page: 3,
                selected: 2,
              },
            },
          },
          {
            type: 'NEXT_SWATCHES',
            productId: 33442,
          }
        )
      ).toEqual({
        products: {
          12345: {
            page: 3,
            selected: 2,
          },
          33442: {
            page: 1,
            selected: 0,
          },
        },
      })
    })
  })
  describe('PREV_SWATCHES', () => {
    it('should decrease page counter in existing product', () => {
      expect(
        testReducer(
          {
            products: {
              12345: {
                page: 3,
                selected: 2,
              },
              54321: {
                page: 1,
                selected: 4,
              },
            },
          },
          {
            type: 'PREV_SWATCHES',
            productId: 12345,
          }
        )
      ).toEqual({
        products: {
          12345: {
            page: 2,
            selected: 2,
          },
          54321: {
            page: 1,
            selected: 4,
          },
        },
      })
    })
    it('should add default product with decreased page counter if productId not exists', () => {
      expect(
        testReducer(
          {
            products: {
              12345: {
                page: 3,
                selected: 2,
              },
            },
          },
          {
            type: 'PREV_SWATCHES',
            productId: 33442,
          }
        )
      ).toEqual({
        products: {
          12345: {
            page: 3,
            selected: 2,
          },
          33442: {
            page: -1,
            selected: 0,
          },
        },
      })
    })
  })
  describe('SELECT_SWATCH', () => {
    it('should change `selected` to `swatchIndex` in existing product', () => {
      expect(
        testReducer(
          {
            products: {
              12345: {
                page: 3,
                selected: 2,
              },
            },
          },
          {
            type: 'SELECT_SWATCH',
            productId: 12345,
            swatchIndex: 4,
          }
        )
      ).toEqual({
        products: {
          12345: {
            page: 3,
            selected: 4,
          },
        },
      })
    })
    it('should change `selected` to `swatchIndex` if productId not exists', () => {
      expect(
        testReducer(
          {
            products: {
              12345: {
                page: 3,
                selected: 2,
              },
            },
          },
          {
            type: 'SELECT_SWATCH',
            productId: 33442,
            swatchIndex: 4,
          }
        )
      ).toEqual({
        products: {
          12345: {
            page: 3,
            selected: 2,
          },
          33442: {
            page: 0,
            selected: 4,
          },
        },
      })
    })
  })
  describe('RESET_SWATCHES_PAGE', () => {
    it('should reset `page` attr in products', () => {
      expect(
        testReducer(
          {
            products: {
              12345: {
                page: 3,
                selected: 2,
              },
              54321: {
                page: 1,
                selected: 4,
              },
            },
          },
          {
            type: 'RESET_SWATCHES_PAGE',
          }
        )
      ).toEqual({
        products: {
          12345: {
            page: 0,
            selected: 2,
          },
          54321: {
            page: 0,
            selected: 4,
          },
        },
      })
    })
  })
})
