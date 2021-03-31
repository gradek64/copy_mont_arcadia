import product from '../product'

const mockState = {
  config: {
    currencyCode: 'EUR',
  },
  checkout: {
    orderCompleted: {
      orderLines: [
        {
          lineNo: '26M48MIVR',
          colour: 'IVORY',
        },
        {
          lineNo: '42H08KGLD',
          colour: 'GOLD',
        },
      ],
    },
    orderSummary: {
      shippingCountry: 'UK',
      basket: {
        products: [
          {
            productId: 123456789,
            orderItemId: 8025765,
            lineNumber: '26M48MIVR',
            size: '6',
            name: 'PETITE Floral Jacquard Midi Wrap Dress',
            quantity: 1,
            isOnSale: true,
            wasWasPrice: '49.00',
            unitPrice: '30.00',
            totalPrice: '30.00',
            items: [],
            attributes: {},
          },
          {
            productId: 987654321,
            orderItemId: 8025780,
            lineNumber: '42H08KGLD',
            size: '38',
            name: 'HELD UP Leather Knot Sandals',
            quantity: 1,
            isOnSale: true,
            wasPrice: '24.00',
            unitPrice: '18.00',
            totalPrice: '18.00',
            items: [],
            attributes: {},
          },
        ],
      },
    },
    orderError: false,
  },
}
describe('transforms.product()', () => {
  it('produces the expected output given the mock state', () => {
    const orderLines = mockState.checkout.orderCompleted.orderLines
    const products = mockState.checkout.orderSummary.basket.products.map(
      (item) => product(item, orderLines)
    )

    expect(products).toEqual([
      {
        id: '26M48MIVR',
        productId: '123456789',
        name: '(26M48MIVR) PETITE Floral Jacquard Midi Wrap Dress',
        price: '30.00',
        unitWasPrice: '49.00',
        unitNowPrice: '30.00',
        markdown: '38.78',
        brand: undefined,
        colour: undefined,
        quantity: '1',
        category: undefined,
        size: '6',
        totalSizes: undefined,
        sizesInStock: undefined,
        sizesAvailable: undefined,
        reviewRating: undefined,
        list: '',
        isOnSale: false,
      },
      {
        id: '42H08KGLD',
        productId: '987654321',
        name: '(42H08KGLD) HELD UP Leather Knot Sandals',
        price: '18.00',
        unitWasPrice: '24.00',
        unitNowPrice: '18.00',
        markdown: '25.00',
        brand: undefined,
        colour: undefined,
        quantity: '1',
        category: undefined,
        size: '38',
        totalSizes: undefined,
        sizesInStock: undefined,
        sizesAvailable: undefined,
        reviewRating: undefined,
        list: '',
        isOnSale: true,
      },
    ])
  })
})
