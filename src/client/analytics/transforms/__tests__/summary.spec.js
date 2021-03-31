import product from '../product'
import summary from '../summary'

const mockState = {
  config: {
    currencyCode: 'EUR',
  },
  checkout: {
    orderCompleted: {
      orderId: 1706986,
      deliveryMethod: 'UK Standard up to 4 working days',
      deliveryCost: '4.00',
      deliveryPrice: '4.00',
      totalOrderPrice: '44.8',
      totalOrdersDiscount: '-£7.2',
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
      paymentDetails: [
        {
          paymentMethod: 'Visa',
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

describe('GTM summary transformer', () => {
  describe('summary()', () => {
    it('produces the expected output given the mock state', () => {
      const orderLines = mockState.checkout.orderCompleted.orderLines
      const products = mockState.checkout.orderSummary.basket.products.map(
        (_product) => product(_product, orderLines)
      )
      expect(summary(mockState, products)).toEqual({
        id: '1706986',
        revenue: '44.80',
        productRevenue: '73.00',
        markdownRevenue: '48.00',
        paymentType: 'Visa',
        orderDiscount: '15.00',
        discountValue: '7.20',
        orderCountry: 'UK',
        deliveryPrice: '4.00',
        deliveryDiscount: undefined,
        shippingOption: 'UK Standard up to 4 working days',
        deliverToStore: undefined,
        ddpOrder: 'False',
      })
    })

    it('sets orderCountry correctly when the deliveryDetails.address.country state exists', () => {
      const orderLines = mockState.checkout.orderCompleted.orderLines
      const products = mockState.checkout.orderSummary.basket.products.map(
        (product_) => product(product_, orderLines)
      )
      const mockCountry = 'mockCountry'
      expect(
        summary(
          {
            ...mockState,
            checkout: {
              ...mockState.checkout,
              orderSummary: {
                ...mockState.orderSummary,
                deliveryDetails: {
                  address: {
                    country: mockCountry,
                  },
                },
              },
            },
          },
          products
        ).orderCountry
      ).toEqual(mockCountry)
    })

    it('sets orderCountry correctly when the deliveryDetails.country state exists', () => {
      const orderLines = mockState.checkout.orderCompleted.orderLines
      const products = mockState.checkout.orderSummary.basket.products.map(
        (_product) => product(_product, orderLines)
      )
      const mockCountry = 'someOtherMockCountry'
      expect(
        summary(
          {
            ...mockState,
            checkout: {
              ...mockState.checkout,
              orderSummary: {
                ...mockState.orderSummary,
                deliveryDetails: {
                  country: mockCountry,
                },
              },
            },
          },
          products
        ).orderCountry
      ).toEqual(mockCountry)
    })

    it('sets deliverToStore correctly when the deliveryStore state exists', () => {
      const mockStateWithDeliveryStore = {
        checkout: {
          ...mockState.checkout,
          deliveryStore: {
            deliveryStoreCode: 'TS0001',
            storeAddress1: '214 Oxford Street',
            storeAddress2: 'Oxford Circus',
            storeCity: 'West End',
            storePostcode: 'W1W 8LG',
          },
        },
      }
      expect(summary(mockStateWithDeliveryStore, [])).toMatchObject({
        deliverToStore: 'TS0001',
      })
    })
  })
})
