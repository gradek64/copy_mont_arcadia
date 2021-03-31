import { pick, evolve, map, clone } from 'ramda'
import {
  createOrder,
  createOrderDeliveryOption,
  giftCardCoversTotal,
  formatPhoneNumber,
  isCheckoutPath,
  isCheckoutProfile,
  reportIncorrectDataAnalytics,
  deliverySections,
} from '../checkout'
import { fixTotal } from '../checkout-utilities/helpers'
import * as mocks from '../../../../test/unit/lib/checkout-mocks'

jest.mock('../../../shared/lib/cookie', () => ({
  getTraceIdFromCookie: () => 'testTraceId',
}))

const INPUT_FIELDS = pick(
  [
    'billingCardDetails',
    'orderSummary',
    'yourDetails',
    'yourAddress',
    'deliveryInstructions',
    'billingDetails',
    'billingAddress',
    'credentials',
    'auth',
    'user',
  ],
  mocks
)

const cleanFields = (fields) =>
  map(
    evolve({ fields: map((field) => ({ ...field, isDirty: false })) }),
    fields
  )

describe('Checkout', () => {
  describe('createOrder', () => {
    it('should create a shortOrder if the user already has checkout details', () => {
      const input = cleanFields(INPUT_FIELDS)
      const order = createOrder({
        ...input,
        paymentMethods: mocks.paymentMethods,
        orderCompletePath: 'order-complete',
        psd2PunchoutPath: 'psd2-order-punchout',
        isGuestOrder: false,
      })
      expect(order).toEqual(mocks.shortOrder)
    })

    it('should create a guestOrder if the user is not authenticated', () => {
      const order = createOrder({
        ...INPUT_FIELDS,
        auth: {
          authenticated: false,
        },
        user: {
          exists: true,
          email: '.TEMP.-something',
        },
        paymentMethods: mocks.paymentMethods,
        orderCompletePath: 'order-complete',
        psd2PunchoutPath: 'psd2-order-punchout',
        isGuestOrder: false,
      })
      expect(order).toEqual(mocks.guestOrder)
    })

    it('should create a guest checkout order if the user is in guest checkout', () => {
      const order = createOrder({
        ...INPUT_FIELDS,
        auth: {
          authentication: false,
          loading: false,
          bvToken: undefined,
          loginLocation: undefined,
          traceId: undefined,
        },
        user: {},
        paymentMethods: mocks.paymentMethods,
        orderCompletePath: 'order-complete',
        psd2PunchoutPath: 'psd2-order-punchout',
        isGuestOrder: true,
      })
      expect(order).toEqual({
        ...mocks.fullOrder,
        isGuestOrder: true,
        signUpGuest: false,
      })
    })

    it('should add sections for details that has been modified', () => {
      const order = createOrder({
        ...INPUT_FIELDS,
        paymentMethods: mocks.paymentMethods,
        orderCompletePath: 'order-complete',
        psd2PunchoutPath: 'psd2-order-punchout',
        isGuestOrder: false,
      })
      expect(order).toEqual(mocks.fullOrder)
    })

    it('should set default shippingCountry if country has not been selected as delivery', () => {
      const input = clone(INPUT_FIELDS)
      input.yourAddress.fields.country.value = ''
      input.orderSummary.shippingCountry = 'United Kingdom'
      const order = createOrder({
        ...input,
        paymentMethods: mocks.paymentMethods,
      })
      expect(order.orderDeliveryOption.shippingCountry).toEqual(
        'United Kingdom'
      )
    })

    it("should set CVV as '0' if giftCard covers the basket total", () => {
      const input = clone(INPUT_FIELDS)
      input.orderSummary.basket.total = '0.00'
      input.orderSummary.giftCards = [
        {
          giftCardId: '6646689',
          giftCardNumber: 'XXXX XXXX XXXX 0830',
          balance: '26.95',
          amountUsed: '26.95',
          remainingBalance: '257.15',
        },
      ]
      const order = createOrder({
        ...input,
        paymentMethods: mocks.paymentMethods,
      })
      expect(order.cardCvv).toEqual('0')
    })

    it("should set CVV as '0' if there is no CVV in the billingDetails", () => {
      const input = clone(INPUT_FIELDS)
      input.billingCardDetails.fields.cvv = ''
      const order = createOrder({
        ...input,
        paymentMethods: mocks.paymentMethods,
      })
      expect(order.cardCvv).toEqual('0')
    })

    describe('Payment Section', () => {
      let dateMock

      beforeEach(() => {
        dateMock = jest.spyOn(global, 'Date').mockImplementation(() => {
          return {
            getFullYear: () => 2020,
          }
        })
      })

      it('should set paymentType to empty string if basket total is 0', () => {
        const input = clone(INPUT_FIELDS)
        const orderId = 'test-order-id'
        input.orderSummary.basket.orderId = orderId
        input.orderSummary.basket.total = '0.00'
        input.orderSummary.giftCards = [
          {
            giftCardId: '6646689',
            giftCardNumber: 'XXXX XXXX XXXX 0830',
            balance: '26.95',
            amountUsed: '26.95',
            remainingBalance: '257.15',
          },
        ]
        const order = createOrder({
          ...input,
          paymentMethods: mocks.paymentMethods,
        })
        expect(order.paymentType).toBe('')
        expect(order.returnUrl).toBe(
          `https://www.topshop.com/undefined?orderId=${orderId}&paymentMethod=`
        )
      })

      afterEach(() => {
        dateMock.mockRestore()
      })

      it('should return dummy card info if not a card payment', () => {
        const input = clone(INPUT_FIELDS)
        input.billingCardDetails.fields.paymentType.value = 'PYPAL'
        const order = createOrder({
          ...input,
          paymentMethods: mocks.paymentMethods,
        })
        expect(order.creditCard).toEqual({
          expiryYear: '2021',
          expiryMonth: '1',
          cardNumber: '0',
          type: 'PYPAL',
        })
      })

      it('should return cardNumberHash if fields aren’t dirty', () => {
        const input = cleanFields(INPUT_FIELDS)
        const order = createOrder({
          ...input,
          paymentMethods: mocks.paymentMethods,
        })
        expect(order.cardNumberHash).toBe('card number hash')
      })

      it('should use cardNumberHash from user’s account if none in order summary', () => {
        const input = cleanFields(INPUT_FIELDS)
        delete input.orderSummary.cardNumberHash
        const order = createOrder({
          ...input,
          paymentMethods: mocks.paymentMethods,
          user: {
            creditCard: {
              cardNumberHash: '123456qwerty',
            },
          },
        })
        expect(order.cardNumberHash).toBe('123456qwerty')
      })

      it('should add the selected savePaymentDetails property when the feature SAVE_PAYMENT_DETAILS is enabled', () => {
        const input = cleanFields(INPUT_FIELDS)
        const order = createOrder({
          ...input,
          savePaymentDetails: true,
          featureSavePaymentDetailsEnabled: true,
          paymentMethods: mocks.paymentMethods,
          paymentConfig: {
            saveDetails: true,
          },
        })
        expect(order.save_details).toEqual(true)
      })

      it('should not add the savePaymentDetails property when the feature SAVE_PAYMENT_DETAILS is disabled', () => {
        const input = cleanFields(INPUT_FIELDS)
        const order = createOrder({
          ...input,
          savePaymentDetails: false,
          featureSavePaymentDetailsEnabled: false,
          paymentMethods: mocks.paymentMethods,
        })
        expect(order.save_details).toBeUndefined()
      })
    })

    it('should provide placeholder postcode when one is not provided (i.e is not required)', () => {
      const mockAddress = {
        fields: {
          address1: { isDirty: true, value: 'delivery address1' },
          address2: { isDirty: true, value: 'delivery address2' },
          city: { isDirty: true, value: 'delivery city' },
          county: { isDirty: true, value: 'delivery county' },
          postcode: { isDirty: true, value: '' },
          country: { isDirty: true, value: 'delivery country' },
        },
      }
      const order = createOrder({
        ...INPUT_FIELDS,
        yourAddress: mockAddress,
        billingAddress: mockAddress,
        paymentMethods: mocks.paymentMethods,
      })

      expect(order.deliveryAddress.postcode).toEqual('0')
      expect(order.billingDetails.address.postcode).toEqual('0')
    })

    it('includes signUpGuest property to the request if it is a guest order', () => {
      const order = createOrder({
        ...INPUT_FIELDS,
        auth: {
          authentication: false,
          loading: false,
          bvToken: undefined,
          loginLocation: undefined,
          traceId: undefined,
        },
        user: {},
        guestUser: {
          fields: {
            signUpGuest: {
              value: true,
            },
          },
        },
        paymentMethods: mocks.paymentMethods,
        orderCompletePath: 'order-complete',
        psd2PunchoutPath: 'psd2-order-punchout',
        isGuestOrder: true,
      })
      expect(order).toEqual({
        ...mocks.fullOrder,
        isGuestOrder: true,
        signUpGuest: true,
      })
    })
  })

  describe('reportIncorrectDataAnalytics', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    const err =
      'ADP-214 createOrderDeliveryOption() cannot read deliveryOptions of undefined'
    const invalidData = {
      deliveryLocations: {
        deliveryMethods: ['STORE', 'PARCEL_SHOP', 'COLLECT_FROM_STORE'],
      },
    }
    it('sends invalid data and error message through the noticeError function in the NREUM object', () => {
      window.NREUM = {
        noticeError: jest.fn(),
      }
      expect(window.NREUM.noticeError).not.toHaveBeenCalled()
      reportIncorrectDataAnalytics(err, invalidData)
      expect(window.NREUM.noticeError).toHaveBeenCalledTimes(1)
      expect(window.NREUM.noticeError).toHaveBeenCalledWith(err, {
        data: invalidData,
      })
    })
  })

  describe('fixTotal', () => {
    const shippingCost = 4
    const subTotal = 10
    const discounts = [1, 3]
    it('returns the total (incl.delivery) if the shippingCost is positive', () => {
      expect(fixTotal(subTotal, shippingCost, [])).toEqual(14)
    })
    it('returns the subTotal (before delivery) if the shipping cost is 0', () => {
      expect(fixTotal(subTotal, 0, [])).toEqual(subTotal)
    })
    it('returns the subTotal (before delivery) - discounts if the shipping cost is 0 and a discount has been applied', () => {
      const discount = 3
      expect(fixTotal(subTotal, 0, [discount])).toEqual(subTotal - discount)
    })
    it('returns the subTotal (before delivery) - discounts if the shipping cost is 0 and discounts have been applied', () => {
      expect(fixTotal(subTotal, 0, discounts)).toEqual(subTotal - 4)
    })
    it('handles euro commas', () => {
      expect(fixTotal('7,50', '5,00', ['0,75'])).toEqual(11.75)
    })
  })

  describe('giftCardCoversTotal', () => {
    it('should return false if params are not valid', () => {
      expect(giftCardCoversTotal()).toBe(false)
      expect(giftCardCoversTotal(null, null)).toBe(false)
      expect(giftCardCoversTotal({}, '')).toBe(false)
    })

    it('should return false if params giftCards is empty', () => {
      expect(giftCardCoversTotal([], '10.00')).toBe(false)
    })

    it('should return true if there is at least one giftCard and total is 0', () => {
      const giftCard = {
        giftCardId: '6646689',
        giftCardNumber: 'XXXX XXXX XXXX 0830',
        balance: '26.95',
        amountUsed: '26.95',
        remainingBalance: '257.15',
      }

      expect(giftCardCoversTotal([giftCard], '0.00')).toBe(true)
    })

    it('should return false if there is at least one giftCard and total is less than 1 but greater than 0', () => {
      const giftCard = {
        giftCardId: '6646689',
        giftCardNumber: 'XXXX XXXX XXXX 0830',
        balance: '26.95',
        amountUsed: '26.95',
        remainingBalance: '257.15',
      }

      expect(giftCardCoversTotal([giftCard], '0.30')).toBe(false)
    })
  })
  describe('formatPhoneNumber()', () => {
    it('should remove spacing in phone number', () => {
      const number = '07111 111111'
      const returnNumber = '07111111111'
      expect(formatPhoneNumber(number)).toEqual(returnNumber)
    })

    it('should do nothing if there are no spaces in number', () => {
      const number = '07111111111'
      const returnNumber = '07111111111'
      expect(formatPhoneNumber(number)).toEqual(returnNumber)
    })
  })

  describe('createOrderDeliveryOption()', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    window.NREUM = {
      noticeError: jest.fn(),
    }
    it('should not call reportIncorrectDataAnalytics() if selectedDeliveryMethod exists', () => {
      const data = cleanFields(INPUT_FIELDS)
      createOrderDeliveryOption(data.orderSummary, data.yourAddress)
      expect(window.NREUM.noticeError).not.toHaveBeenCalled()
    })
    it('should call reportIncorrectDataAnalytics() if selectedDeliveryMethods is empty', () => {
      const inputData = cleanFields(INPUT_FIELDS)
      const data = {
        ...inputData,
        orderSummary: {
          deliveryLocations: [
            {
              selected: true,
              deliveryLocationType: 'PARCELSHOP',
              deliveryMethods: [],
            },
          ],
          basket: {
            orderId: '1111',
          },
        },
      }
      createOrderDeliveryOption(data.orderSummary, data.yourAddress)
      expect(window.NREUM.noticeError).toHaveBeenCalledTimes(1)
      expect(window.NREUM.noticeError).toHaveBeenCalledWith(
        'ADP-214 There is no selected delivery method',
        {
          data: {
            deliveryLocations: data.orderSummary.deliveryLocations,
            orderId: data.orderSummary.basket.orderId,
            traceId: 'testTraceId',
          },
        }
      )
    })
    it('should call reportIncorrectDataAnalytics() if Home Express is selected but no delivery option is selected', () => {
      const inputData = cleanFields(INPUT_FIELDS)
      const data = {
        ...inputData,
        orderSummary: {
          deliveryLocations: [
            {
              selected: false,
              deliveryLocationType: 'PARCELSHOP',
            },
            {
              selected: false,
              deliveryLocationType: 'STORE',
            },
            {
              selected: true,
              deliveryLocationType: 'HOME',
              deliveryMethods: [
                {
                  deliveryType: 'HOME_EXPRESS',
                  selected: true,
                  deliveryOptions: [
                    {
                      shipModeId: 28003,
                      nominatedDate: '2029-12-12',
                      selected: false,
                    },
                  ],
                },
              ],
            },
          ],
          basket: {
            orderId: '1111',
          },
        },
      }
      createOrderDeliveryOption(data.orderSummary, data.yourAddress)
      expect(window.NREUM.noticeError).toHaveBeenCalledTimes(1)
      expect(window.NREUM.noticeError).toHaveBeenCalledWith(
        'ADP-819 There is no selected delivery option',
        { data: data.orderSummary.deliveryLocations }
      )
    })
  })

  describe('isCheckoutPath', () => {
    it('returns true for checkout paths', () => {
      const checkoutPaths = [
        '/checkout/delivery/login',
        '/checkout/delivery/delivery',
        '/checkout/delivery/collect-from-store',
        '/checkout/delivery/payment',
        '/checkout/delivery-payment',
      ]

      checkoutPaths.forEach((path) => {
        const result = isCheckoutPath(path)

        expect(result).toBe(true)
      })
    })

    it('returns false for other paths', () => {
      // this is not exhaustive
      const nonCheckoutPath = [
        '/wishlist',
        '/',
        '/style-adviser',
        '/reset-password',
        '/my-account',
        '/my-account/my-password',
        '/return-history',
      ]

      nonCheckoutPath.forEach((path) => {
        const result = isCheckoutPath(path)

        expect(result).toBe(false)
      })
    })
  })

  describe('isCheckoutProfile', () => {
    it('true if has paid with any payment type', () => {
      const ANY_PAYMENT_TYPE = 'abc'
      expect(
        isCheckoutProfile({ creditCard: { type: ANY_PAYMENT_TYPE } })
      ).toBe(true)
    })

    it('true if has delivery address', () => {
      expect(
        isCheckoutProfile({ deliveryDetails: { addressDetailsId: 1 } })
      ).toBe(true)
    })

    it('true if has billing address', () => {
      expect(
        isCheckoutProfile({ billingDetails: { addressDetailsId: 1 } })
      ).toBe(true)
    })

    it('false if not checked out previously', () => {
      expect(
        isCheckoutProfile({
          creditCard: { type: '', cardNumberHash: '' },
          billingDetails: { addressDetailsId: -1 },
          deliveryDetails: { addressDetailsId: -1 },
        })
      ).toBe(false)

      expect(isCheckoutProfile({})).toBe(false)
    })
  })

  describe('deliverySections', () => {
    const input = cleanFields(INPUT_FIELDS)
    const expected = {
      deliveryAddress: {
        address1: 'delivery address1',
        address2: 'delivery address2',
        city: 'delivery city',
        country: 'delivery country',
        postcode: 'delivery postcode',
        state: 'delivery county',
      },
      deliveryNameAndPhone: {
        firstName: 'delivery firstName',
        lastName: 'delivery lastName',
        telephone: '1235553456',
      },
    }
    const newUser = {
      deliveryDetails: {
        addressDetailsId: -1,
      },
    }
    const returningUser = {
      deliveryDetails: {
        addressDetailsId: 12345678,
      },
    }
    const locationHome = [
      {
        deliveryLocationType: 'HOME',
        selected: true,
      },
      {
        deliveryLocationType: 'STORE',
        selected: false,
      },
    ]
    const locationStore = [
      {
        deliveryLocationType: 'HOME',
        selected: false,
      },
      {
        deliveryLocationType: 'STORE',
        selected: true,
      },
    ]

    it('should return a delivery section if a new user', () => {
      input.yourDetails.fields.title.isDirty = true
      const props = {
        ...input,
        orderSummary: {
          deliveryLocations: locationHome,
        },
        user: newUser,
      }
      expect(deliverySections(props)).toEqual(expected)
    })

    it('should return a delivery section if a returning user with a delivery type CFS or CFP and updated the form', () => {
      input.yourDetails.fields.title.isDirty = true
      const props = {
        ...input,
        orderSummary: {
          deliveryLocations: locationStore,
        },
        user: returningUser,
      }
      expect(deliverySections(props)).toEqual(expected)
    })

    it('should return an empty object if a returning user has not updated the delivery details form', () => {
      input.yourDetails.fields.title.isDirty = false
      const props = {
        ...input,
        orderSummary: {
          deliveryLocations: locationHome,
        },
        user: returningUser,
      }
      expect(deliverySections(props)).toEqual({})
    })
  })
})
