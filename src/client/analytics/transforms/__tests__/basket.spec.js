import transformBasket from '../basket'

describe('Transfrom basket for dataLayer', () => {
  it('should return a formatted object, with the following properties', () => {
    const state = {
      shoppingBag: {
        totalItems: 3,
        bag: {
          products: [],
          total: 60.95,
        },
      },
    }
    const result = transformBasket(state)
    expect(result).toEqual({
      totalQuantity: 3,
      totalPrice: 60.95,
      productList: [],
    })
  })

  it('should omit extra properties', () => {
    const state = {
      shoppingBag: {
        products: [],
        foo: 'bar',
      },
    }
    const result = transformBasket(state)
    expect(result).toEqual({
      totalQuantity: 0,
      totalPrice: 0,
      productList: [],
    })
  })
})
