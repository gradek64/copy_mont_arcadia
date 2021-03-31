import deepFreeze from 'deep-freeze'
import {
  extractDiscountInfo,
  formatDeliveryOptions,
  findAddressIsVisible,
  getSavedAddresses,
  getDeliveryDate,
  getDeliveryLocations,
  getDeliveryPageFormNames,
  getDeliveryPaymentPageFormNames,
  getDeliveryPaymentPageFormErrors,
  getEnrichedDeliveryLocations,
  getErrors,
  getFormErrors,
  getOrderCost,
  getPaymentType,
  getCardNumber,
  getSelectedDeliveryLocation,
  getSelectedDeliveryLocationType,
  getSelectedDeliveryMethod,
  getSelectedDeliveryMethodLabel,
  getSelectedDeliveryOptionFromBasket,
  getSelectedDeliveryStoreType,
  getSelectedDeliveryType,
  getSelectedStoreDetails,
  getShipModeId,
  getSubTotal,
  getTotal,
  getUseDeliveryAsBilling,
  hasCheckedOut,
  hasSelectedStore,
  isCollectFromOrder,
  isDeliveryStoreChoiceAccepted,
  isDeliveryStoreChosen,
  isManualAddress,
  isQASCountry,
  isReturningCustomer,
  isSavePaymentDetailsEnabled,
  isStoreDelivery,
  isParcelDelivery,
  isStoreOrParcelDelivery,
  paymentMethodsAreOpen,
  storedCardHasExpired,
  selectedDeliveryLocationTypeEquals,
  shouldUpdateOrderSummaryStore,
  getBasketDeliveryOptions,
  getCheckoutOrderSummary,
  getCheckoutOrderSummaryBasket,
  getCheckoutOrderSummaryProducts,
  getCheckoutOrderSummaryPromotions,
  getCheckoutOrderSummaryShippingCountry,
  getCheckoutOrderSummaryDeliveryDetails,
  getCheckoutOrderCompleted,
  getCheckoutOrderCompletedDeliveryStoreCode,
  getDDPPromotion,
  getCheckoutOrderLines,
  getCheckoutOrderId,
  getCheckoutUserId,
  getCheckoutUserType,
  getIsRegisteredEmail,
  getCheckoutPromoCodes,
  getCheckoutTotalOrderPrice,
  getCheckoutTotalOrderDiscount,
  getCheckoutProductRevenue,
  getCheckoutPaymentDetails,
  getCheckoutDeliveryAddress,
  getCheckoutDeliveryMethod,
  getCheckoutDeliveryPrice,
  getCheckoutOrderError,
  getCheckoutDeliveryStore,
  getCheckoutOrderCountry,
  getDeliveryCountry,
  getBillingCountry,
  getProgressTrackerSteps,
  orderContainsOutOfStockProduct,
  orderContainsPartiallyOutOfStockProduct,
  orderContainsStandardDeliveryOnlyProduct,
  getSelectedDeliveryMethods,
  shouldShowCollectFromStore,
  getNewlyConfirmedOrder,
  getDeliveryStoreForOrderUpdate,
  getThreeDSecurePrompt,
  getSelectedPaymentMethod,
  getCheckoutPaymentButtonLabel,
  getCheckoutOrderErrorPaymentDetails,
  isSelectedPaymentMethodKlarna,
  getCheckoutPrePaymentConfig,
  getCheckoutFinalisedOrder,
  getShippingCost,
  shouldMountDDCIFrame,
  isGuestOrder,
  // EXP-313
  isStoreWithParcel,
  isOrderCoveredByGiftCards,
  isGiftCardRedemptionEnabled,
  isGiftCardValueThresholdMet,
  giftCardRedemptionPercentage,
} from '../checkoutSelectors'

// mocks
import { orderSummaryCollectFromParcelShop } from '../../../../test/mocks/orderSummary/collect-from-parcel-shop'
import { orderSummaryFreeCollectFromStoreStandard } from '../../../../test/mocks/orderSummary/free-collect-from-store-standard'
import { orderSummaryUkStandard } from '../../../../test/mocks/orderSummary/uk-standard'
import trackerSteps from '../../../../test/mocks/progressTrackerMocks'
import * as stateBurtonCfsiOnlyBasket from '../__mocks__/state-br-cfsi-only-basket'
import * as stateBurtonCfsiAndNotCfsiProducts from '../__mocks__/state-br-cfsi-and-not-cfsi-basket'
import { savedCards } from '../../../../test/mocks/paymentMethodsMocks'

import {
  getCheckoutOrderSummaryProductsWithInventory,
  isStandardDeliveryOnlyProduct,
} from '../inventorySelectors'

jest.mock('../inventorySelectors', () => ({
  getCheckoutOrderSummaryProductsWithInventory: jest.fn(),
  isStandardDeliveryOnlyProduct: jest.fn(),
}))

const homeDeliveryLocation = {
  deliveryLocationType: 'HOME',
  deliveryMethods: [
    {
      additionalDescription: 'Up to 4 working days',
      cost: '4.00',
      deliveryOptions: [],
      deliveryType: 'HOME_STANDARD',
      label: 'UK Standard up to 4 working days',
      selected: true,
      shipCode: 'S',
      shipModeId: 26504,
    },
    {
      additionalDescription: '',
      deliveryOptions: [
        {
          dateText: '05 Aug',
          dayText: 'Sat',
          nominatedDate: '2017-08-05',
          price: '6.00',
          selected: true,
          shipModeId: 28007,
        },
        {
          dateText: '07 Aug',
          dayText: 'Mon',
          nominatedDate: '2017-08-07',
          price: '6.00',
          selected: false,
          shipModeId: 28002,
        },
        {
          dateText: '08 Aug',
          dayText: 'Tue',
          nominatedDate: '2017-08-08',
          price: '6.00',
          selected: false,
          shipModeId: 28003,
        },
        {
          dateText: '09 Aug',
          dayText: 'Wed',
          nominatedDate: '2017-08-09',
          price: '6.00',
          selected: false,
          shipModeId: 28004,
        },
        {
          dateText: '10 Aug',
          dayText: 'Thu',
          nominatedDate: '2017-08-10',
          price: '6.00',
          selected: false,
          shipModeId: 28005,
        },
        {
          dateText: '11 Aug',
          dayText: 'Fri',
          nominatedDate: '2017-08-11',
          price: '6.00',
          selected: false,
          shipModeId: 28006,
        },
      ],
      deliveryType: 'HOME_EXPRESS',
      label: 'Express / Nominated day delivery',
      selected: false,
    },
  ],
  label:
    'Home Delivery Standard (UK up to 4 working days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
  selected: true,
}

const storeDeliveryLocation = {
  deliveryLocationType: 'STORE',
  label: 'Collect from Store Standard (3-7 working days) Express (next day)',
  selected: true,
  deliveryMethods: [],
}

const mockStore = (orderSummary) => {
  return {
    checkout: {
      orderSummary,
    },
    features: {
      status: {
        FEATURE_CFS: true,
        FEATURE_PUDO: true,
      },
    },
  }
}

const configState = {
  config: {
    qasCountries: {
      Sweden: 'SWE',
      'United Kingdom': 'GBR',
    },
  },
}

describe('Checkout Selectors', () => {
  const state = deepFreeze({
    checkout: {
      orderCompleted: {
        orderLines: ['order line 1'],
        orderId: '12345',
        deliveryStoreCode: 'code',
        userId: '56789',
        promoCodes: ['TEST_COUPON_1', 'TEST_COUPON_2'],
        totalOrderPrice: '43.95',
        totalOrdersDiscount: '1.00',
        productRevenue: '40.00',
        paymentDetails: [
          {
            paymentMethod: 'Visa',
            cardNumberStar: '************1111',
            totalCost: '£43.95',
          },
        ],
        deliveryAddress: {
          address1: '123 Test Street',
          name: 'Test Customer',
          country: 'United Kingdom',
          address2: 'LONDON',
          address3: 'W1B 2LG',
        },
        deliveryMethod: 'UK Standard up to 5 days',
        deliveryPrice: '3.95',
        ddpPromotion: {
          label: 'DDP_Shipping_Promotion',
          value: -5.95,
        },
        userType: 'S',
      },
      orderError: 'error',
      deliveryStore: {},
      orderSummary: {
        savedAddresses: ['saved1'],
        basket: {
          products: ['product 1'],
          deliveryOptions: [
            {
              selected: false,
              deliveryOptionId: 47520,
              deliveryOptionExternalId: 'retail_store_collection',
              label: 'Collect from ParcelShop £3.95',
              enabled: true,
              type: 'parcelshop',
              plainLabel: 'Collect from ParcelShop',
            },
            {
              selected: false,
              deliveryOptionId: 28033,
              deliveryOptionExternalId: 'n4',
              label: 'Next or Named Day Delivery £5.95',
              enabled: true,
              type: 'home_express',
              plainLabel: 'Next or Named Day Delivery',
            },
            {
              selected: true,
              deliveryOptionId: 26507,
              deliveryOptionExternalId: 's',
              label: 'Free Standard UK Delivery £0.00',
              enabled: true,
              type: 'home_standard',
              plainLabel: 'Free Standard UK Delivery',
            },
            {
              selected: false,
              deliveryOptionId: 45028,
              deliveryOptionExternalId: 'retail_store_express',
              label: 'Collect From Store Express £2.95',
              enabled: true,
              type: 'store_express',
              plainLabel: 'Collect From Store Express',
            },
            {
              selected: false,
              deliveryOptionId: 45027,
              deliveryOptionExternalId: 'retail_store_standard',
              label: 'Free Collect From Store Standard £0.00',
              enabled: true,
              type: 'store_standard',
              plainLabel: 'Free Collect From Store Standard',
            },
          ],
          promotions: ['promotion 1'],
          total: '100.00',
        },
        shippingCountry: 'GB',
        deliveryDetails: {
          address: {
            country: 'GB',
          },
        },
      },
      selectedPaymentMethod: 'CARD',
      storeWithParcel: true,
    },
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // EXP-313
  describe('isStoreWithParcel', () => {
    it('should return storeWithParcel value', () => {
      expect(isStoreWithParcel(state)).toBe(true)
    })
  })

  describe('getBasketDeliveryOptions', () => {
    it('should return getBasketDeliveryOptions when value exists in the state', () => {
      expect(getBasketDeliveryOptions(state)).toEqual(
        state.checkout.orderSummary.basket.deliveryOptions
      )
    })

    it('should return default value or falsy value when it does not exist in the state', () => {
      expect(getBasketDeliveryOptions({})).toEqual([])
    })
  })

  describe('getCheckoutOrderSummary', () => {
    it('should return CheckoutOrderSummary when value exists in the state', () => {
      expect(getCheckoutOrderSummary(state)).toEqual(
        state.checkout.orderSummary
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderSummary({})).toEqual({})
    })
  })

  describe('getCheckoutOrderSummaryBasket', () => {
    it('should return CheckoutOrderSummaryBasket when value exists in the state', () => {
      expect(getCheckoutOrderSummaryBasket(state)).toEqual(
        state.checkout.orderSummary.basket
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderSummaryBasket({})).toEqual({})
    })
  })

  describe('getSavedAddresses', () => {
    it('should return saveAddresses when value exists in the state', () => {
      expect(getSavedAddresses(state)).toEqual(
        state.checkout.orderSummary.savedAddresses
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getSavedAddresses({})).toEqual({})
    })
  })

  describe('getCheckoutOrderSummaryProducts', () => {
    it('should return CheckoutOrderSummaryProducts when value exists in the state', () => {
      expect(getCheckoutOrderSummaryProducts(state)).toEqual(
        state.checkout.orderSummary.basket.products
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderSummaryProducts({})).toEqual([])
    })
  })

  describe('getCheckoutOrderSummaryPromotions', () => {
    it('should return CheckoutOrderSummaryPromotions when value exists in the state', () => {
      expect(getCheckoutOrderSummaryPromotions(state)).toEqual(
        state.checkout.orderSummary.basket.promotions
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderSummaryPromotions({})).toEqual([])
    })
  })

  describe('getCheckoutOrderSummaryShippingCountry', () => {
    it('should return CheckoutOrderSummaryShippingCountry when value exists in the state', () => {
      expect(getCheckoutOrderSummaryShippingCountry(state)).toEqual(
        state.checkout.orderSummary.shippingCountry
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderSummaryShippingCountry({})).toBeFalsy()
    })
  })

  describe('getCheckoutOrderSummaryDeliveryDetails', () => {
    it('should return CheckoutOrderSummaryDeliveryDetails when value exists in the state', () => {
      expect(getCheckoutOrderSummaryDeliveryDetails(state)).toEqual(
        state.checkout.orderSummary.deliveryDetails
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderSummaryDeliveryDetails({})).toEqual({})
    })
  })

  describe('getCheckoutOrderCompleted', () => {
    it('should return CheckoutOrderCompleted when value exists in the state', () => {
      expect(getCheckoutOrderCompleted(state)).toEqual(
        state.checkout.orderCompleted
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderCompleted({})).toEqual({})
    })
  })

  describe('getCheckoutOrderCompletedDeliveryStoreCode', () => {
    it('should return DeliveryStoreCode when value exists in the state', () => {
      expect(getCheckoutOrderCompletedDeliveryStoreCode(state)).toEqual(
        state.checkout.orderCompleted.deliveryStoreCode
      )
    })

    it('should return undefined if does not exist in the state', () => {
      expect(getCheckoutOrderCompletedDeliveryStoreCode({})).toBeUndefined()
    })
  })

  describe('getDDPPromotion', () => {
    it('should return the ddpPromotion object', () => {
      expect(getDDPPromotion(state)).toEqual(
        state.checkout.orderCompleted.ddpPromotion
      )
    })
  })

  describe('getCheckoutOrderLines', () => {
    it('should return CheckoutOrderLines when value exists in the state', () => {
      expect(getCheckoutOrderLines(state)).toEqual(
        state.checkout.orderCompleted.orderLines
      )
    })

    it(`should return default value or an empty array when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderLines({})).toEqual([])
    })
  })

  describe('getCheckoutOrderId', () => {
    it('should return CheckoutOrderId when value exists in the state', () => {
      expect(getCheckoutOrderId(state)).toEqual(
        state.checkout.orderCompleted.orderId
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderId({})).toBeFalsy()
    })
  })

  describe('getCheckoutUserId', () => {
    it('should return userId when value exists in the state', () => {
      expect(getCheckoutUserId(state)).toEqual(
        state.checkout.orderCompleted.userId
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutUserId({})).toBeFalsy()
    })
  })

  describe('getCheckoutUserType', () => {
    it('should return the userType in order complete', () => {
      expect(getCheckoutUserType(state)).toEqual(
        state.checkout.orderCompleted.userType
      )
    })
  })

  describe('getIsRegisteredEmail', () => {
    it('should return the accountExists in order complete', () => {
      const props = {
        ...state,
        checkout: {
          ...state.checkout,
          orderCompleted: {
            ...state.checkout.orderCompleted,
            isGuestOrder: true,
            isRegisteredEmail: true,
            userType: 'G',
          },
        },
      }
      expect(getIsRegisteredEmail(props)).toEqual(
        props.checkout.orderCompleted.isRegisteredEmail
      )
    })
  })

  describe('getCheckoutPromoCodes', () => {
    it('should return promoCodes when value exists in the state', () => {
      expect(getCheckoutPromoCodes(state)).toEqual(
        state.checkout.orderCompleted.promoCodes
      )
    })

    it(`should return default value or an empty array when it doesn't exist in the state`, () => {
      expect(getCheckoutPromoCodes({})).toEqual([])
    })
  })

  describe('getCheckoutTotalOrderPrice', () => {
    it('should return totalOrderPrice when value exists in the state', () => {
      expect(getCheckoutTotalOrderPrice(state)).toEqual(
        state.checkout.orderCompleted.totalOrderPrice
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutTotalOrderPrice({})).toBeFalsy()
    })
  })

  describe('getCheckoutTotalOrderDiscount', () => {
    it('should return totalOrdersDiscount when value exists in the state', () => {
      expect(getCheckoutTotalOrderDiscount(state)).toEqual(
        state.checkout.orderCompleted.totalOrdersDiscount
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutTotalOrderDiscount({})).toBeFalsy()
    })
  })

  describe('getCheckoutProductRevenue', () => {
    it('should return productRevenue when value exists in the state', () => {
      expect(getCheckoutProductRevenue(state)).toEqual(
        state.checkout.orderCompleted.productRevenue
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutProductRevenue({})).toBeFalsy()
    })
  })

  describe('getCheckoutPaymentDetails', () => {
    it('should return paymentDetails when value exists in the state', () => {
      expect(getCheckoutPaymentDetails(state)).toEqual(
        state.checkout.orderCompleted.paymentDetails
      )
    })

    it(`should return default value or an empty array when it doesn't exist in the state`, () => {
      expect(getCheckoutPaymentDetails({})).toEqual([])
    })
  })

  describe('getCheckoutDeliveryAddress', () => {
    it('should return deliveryAddress when value exists in the state', () => {
      expect(getCheckoutDeliveryAddress(state)).toEqual(
        state.checkout.orderCompleted.deliveryAddress
      )
    })

    it(`should return default value or an empty array when it doesn't exist in the state`, () => {
      expect(getCheckoutDeliveryAddress({})).toEqual({})
    })
  })

  describe('getCheckoutDeliveryMethod', () => {
    it('should return deliveryMethod when value exists in the state', () => {
      expect(getCheckoutDeliveryMethod(state)).toEqual(
        state.checkout.orderCompleted.deliveryMethod
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutDeliveryMethod({})).toBeFalsy()
    })
  })

  describe('getCheckoutDeliveryPrice', () => {
    it('should return deliveryPrice when value exists in the state', () => {
      expect(getCheckoutDeliveryPrice(state)).toEqual(
        state.checkout.orderCompleted.deliveryPrice
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutDeliveryPrice({})).toBeFalsy()
    })
  })

  describe('getCheckoutOrderError', () => {
    it('should return CheckoutOrderError when value exists in the state', () => {
      expect(getCheckoutOrderError(state)).toEqual(state.checkout.orderError)
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutOrderError({})).toBeFalsy()
    })
  })

  describe('getCheckoutDeliveryStore', () => {
    it('should return CheckoutDeliveryStore when value exists in the state', () => {
      expect(getCheckoutDeliveryStore(state)).toEqual(
        state.checkout.deliveryStore
      )
    })

    it(`should return default value or falsy value when it doesn't exist in the state`, () => {
      expect(getCheckoutDeliveryStore({})).toBeFalsy()
    })
  })

  describe('getCheckoutOrderCountry', () => {
    it('should return CheckoutOrderCountry when order summary > delivery details > address has country', () => {
      const country = 'GB'
      expect(
        getCheckoutOrderCountry({
          checkout: {
            orderSummary: {
              deliveryDetails: {
                address: {
                  country,
                },
              },
            },
          },
        })
      ).toEqual(country)
    })

    it('should return CheckoutOrderCountry when order summary > delivery details has country', () => {
      const country = 'GB'
      expect(
        getCheckoutOrderCountry({
          checkout: {
            orderSummary: {
              deliveryDetails: {
                country,
              },
            },
          },
        })
      ).toEqual(country)
    })

    it('should return CheckoutOrderCountry when order summary has shippingCountry', () => {
      const country = 'GB'
      expect(
        getCheckoutOrderCountry({
          checkout: {
            orderSummary: {
              shippingCountry: country,
            },
          },
        })
      ).toEqual(country)
    })

    it('should return undefined when country cannot be found in order summary', () => {
      expect(getCheckoutOrderCountry({})).toBeUndefined()
    })
  })

  describe('orderContainsOutOfStockProduct', () => {
    it('returns true if order contains out of stock product', () => {
      expect(
        orderContainsOutOfStockProduct({
          checkout: {
            orderSummary: {
              basket: {
                products: [{ inStock: true }, { inStock: false }],
              },
            },
          },
        })
      ).toBe(true)
    })
    it('returns false if order does not contain out of stock product', () => {
      expect(
        orderContainsOutOfStockProduct({
          checkout: {
            orderSummary: {
              basket: {
                products: [{ inStock: true }, { inStock: true }],
              },
            },
          },
        })
      ).toBe(false)
    })
  })

  describe('orderContainsPartiallyOutOfStockProduct', () => {
    it('returns true if order contains product which exceeds allowed quantity', () => {
      expect(
        orderContainsPartiallyOutOfStockProduct({
          checkout: {
            orderSummary: {
              basket: {
                products: [
                  { exceedsAllowedQty: undefined },
                  { exceedsAllowedQty: false },
                  { exceedsAllowedQty: true },
                ],
              },
            },
          },
        })
      ).toBe(true)
    })
    it('returns false if order does not contains product which exceeds allowed quantity', () => {
      expect(
        orderContainsPartiallyOutOfStockProduct({
          checkout: {
            orderSummary: {
              basket: {
                products: [
                  { exceedsAllowedQty: undefined },
                  { exceedsAllowedQty: false },
                ],
              },
            },
          },
        })
      ).toBe(false)
    })
  })

  describe('orderContainsStandardDeliveryOnlyProduct', () => {
    const basket = {}

    it('returns true if order contains product which is only available for standard delivery', () => {
      const mockProducts = [{}]
      getCheckoutOrderSummaryProductsWithInventory.mockReturnValueOnce(
        mockProducts
      )
      isStandardDeliveryOnlyProduct.mockReturnValueOnce(true)

      expect(orderContainsStandardDeliveryOnlyProduct({ basket })).toBe(true)
    })
    it('returns false if order contains product which is not only available for standard delivery', () => {
      const mockProducts = [{}]
      getCheckoutOrderSummaryProductsWithInventory.mockReturnValueOnce(
        mockProducts
      )
      isStandardDeliveryOnlyProduct.mockReturnValueOnce(false)

      expect(orderContainsStandardDeliveryOnlyProduct({ basket })).toBe(false)
    })
    it('returns false if no product inventory', () => {
      const mockProducts = null
      getCheckoutOrderSummaryProductsWithInventory.mockReturnValueOnce(
        mockProducts
      )

      expect(orderContainsStandardDeliveryOnlyProduct({ basket })).toBe(false)
    })
  })

  describe('getSelectedDeliveryLocation', () => {
    it('returns the selected delivery location', () => {
      expect(
        getSelectedDeliveryLocation(mockStore(orderSummaryUkStandard))
      ).toEqual(homeDeliveryLocation)
      expect(
        getSelectedDeliveryLocation(
          mockStore(orderSummaryFreeCollectFromStoreStandard)
        )
      ).toEqual(storeDeliveryLocation)
    })
    it('returns null if there is no delivery location selected', () => {
      expect(
        getSelectedDeliveryLocation(mockStore({ prop1: 'value1' }))
      ).toEqual(null)
      expect(
        getSelectedDeliveryLocation(mockStore({ prop2: 'value2' }))
      ).toEqual(null)
    })
  })

  describe(getSelectedDeliveryLocationType.name, () => {
    it('returns the type of the selected delivery location', () => {
      expect(
        getSelectedDeliveryLocationType(mockStore(orderSummaryUkStandard))
      ).toEqual('HOME')
      expect(
        getSelectedDeliveryLocationType(
          mockStore(orderSummaryFreeCollectFromStoreStandard)
        )
      ).toEqual('STORE')
    })
    it('returns null if there is no delivery location selected', () => {
      expect(
        getSelectedDeliveryLocationType(mockStore({ prop1: 'value1' }))
      ).toEqual(null)
      expect(
        getSelectedDeliveryLocationType(mockStore({ prop2: 'value2' }))
      ).toEqual(null)
    })
  })

  describe(selectedDeliveryLocationTypeEquals.name, () => {
    describe('if the type of the selected delivery location', () => {
      it('is equal to the deliveryLocationType parameter returns true', () => {
        expect(
          selectedDeliveryLocationTypeEquals(
            mockStore(orderSummaryUkStandard),
            'HOME'
          )
        ).toEqual(true)
        expect(
          selectedDeliveryLocationTypeEquals(
            mockStore(orderSummaryFreeCollectFromStoreStandard),
            'STORE'
          )
        ).toEqual(true)
      })
      it('is not equal to the deliveryLocationType parameter returns false', () => {
        expect(
          selectedDeliveryLocationTypeEquals(mockStore({ prop1: 'value1' }))
        ).toEqual(false)
        expect(
          selectedDeliveryLocationTypeEquals(mockStore({ prop2: 'value2' }))
        ).toEqual(false)
      })
    })
  })

  describe(getSelectedDeliveryMethod.name, () => {
    it('returns the selected delivery method', () => {
      const expectedMethod = {
        additionalDescription: 'Up to 4 working days',
        cost: '4.00',
        deliveryOptions: [],
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 working days',
        selected: true,
        shipCode: 'S',
        shipModeId: 26504,
      }
      expect(
        getSelectedDeliveryMethod(mockStore(orderSummaryUkStandard))
      ).toEqual(expectedMethod)
    })
    it('returns null if there is no selected delivery method', () => {
      expect(getSelectedDeliveryMethod({})).toBe(null)
    })
  })

  describe(getSelectedDeliveryMethodLabel.name, () => {
    it('returns the selected delivery method label', () => {
      const expectedMethodLabel = 'UK Standard up to 4 working days'
      expect(
        getSelectedDeliveryMethodLabel(mockStore(orderSummaryUkStandard))
      ).toEqual(expectedMethodLabel)
    })
    it('returns null if there is no selected delivery method', () => {
      expect(getSelectedDeliveryMethodLabel({})).toBe(null)
    })
  })

  describe(getSelectedDeliveryOptionFromBasket.name, () => {
    it('returns selected delivery option', () => {
      const state = mockStore(orderSummaryFreeCollectFromStoreStandard)
      const expectedOption = {
        deliveryOptionId: 45019,
        label: 'Free Collect From Store Standard £0.00',
        selected: true,
      }
      expect(getSelectedDeliveryOptionFromBasket(state)).toEqual(expectedOption)
    })
    it('returns null if there is no selected delivery option', () => {
      expect(getSelectedDeliveryOptionFromBasket({})).toBe(null)
    })
  })

  describe('getShippingCost', () => {
    it('returns selected delivery option', () => {
      const store = {
        checkout: {
          orderSummary: {
            deliveryLocations: [
              {
                deliveryLocationType: 'HOME',
                label:
                  'Home Delivery Standard (UK up to 4 days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
                selected: true,
                deliveryMethods: [
                  {
                    shipModeId: 26504,
                    shipCode: 'S',
                    deliveryType: 'HOME_STANDARD',
                    label: 'UK Standard up to 4 days',
                    additionalDescription: 'Up to 4 days',
                    cost: '3.97',
                    selected: true,
                    deliveryOptions: [],
                  },
                  {
                    shipModeId: 26507,
                    shipCode: 'S',
                    deliveryType: 'HOME_EXPRESS',
                    label: 'UK Express up to 2 days',
                    additionalDescription: 'Up to 2 days',
                    cost: '8.00',
                    selected: false,
                    deliveryOptions: [],
                  },
                ],
              },
            ],
          },
        },
      }

      expect(getShippingCost(store)).toEqual('3.97')
    })
  })

  describe('hasCheckedOut', () => {
    it('it should return true is the user has checked out the basket', () => {
      const checkedOutState = {
        checkout: {
          orderSummary: {
            shippingCountry: 'United Kingdom',
            deliveryLocations: [
              { deliveryLocationType: 'HOME', selected: true },
              { deliveryLocationType: 'STORE', selected: false },
              { deliveryLocationType: 'PARCELSHOP', selected: false },
            ],
            basket: {
              inventoryPositions: [{}],
              products: [
                {
                  quantity: 1,
                },
              ],
            },
          },
        },
      }
      const nonCheckedOutState = { checkout: { orderSummary: {} } }

      expect(hasCheckedOut(checkedOutState)).toBe(true)
      expect(hasCheckedOut(nonCheckedOutState)).toBe(false)
    })
  })

  describe('isManualAddress', () => {
    it('should default to `false`', () => {
      const value = isManualAddress()
      expect(value).toBe(false)
    })

    it('should be `true` if `findAddress.isManual` state is true', () => {
      const value = isManualAddress('delivery', {
        findAddress: {
          isManual: true,
        },
      })
      expect(value).toBe(true)
    })
  })

  describe('isQASCountry', () => {
    const configState = {
      config: {
        qasCountries: {
          Sweden: 'SWE',
          'United Kingdom': 'GBR',
        },
      },
    }
    it('should default to `false`', () => {
      const value = isQASCountry()
      expect(value).toBe(false)
    })

    it('should return "true" if the delivery country is one of the QAS countries', () => {
      const value = isQASCountry('deliveryCheckout', {
        ...configState,
        forms: {
          checkout: {
            yourAddress: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
          },
        },
      })
      expect(value).toBe(true)
    })

    it('should return `true` if the billing country is one of the QAS countries', () => {
      const value = isQASCountry('billingCheckout', {
        ...configState,
        forms: {
          checkout: {
            billingAddress: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
          },
        },
      })
      expect(value).toBe(true)
    })

    it('should return `false` if the delivery country is not one of the QAS countries', () => {
      const value = isQASCountry('delivery', {
        ...configState,
        forms: {
          checkout: {
            yourAddress: {
              fields: {
                country: {
                  value: 'Canada',
                },
              },
            },
          },
        },
      })
      expect(value).toBe(false)
    })

    it('should return `true` if order’s country is one of the QAS countries', () => {
      const value = isQASCountry('delivery', {
        ...configState,
        checkout: {
          orderSummary: {
            shippingCountry: 'United Kingdom',
          },
        },
      })
      expect(value).toBe(true)
    })

    it('should return `false` if the order’s country is not one of the QAS countries', () => {
      const value = isQASCountry('delivery', {
        ...configState,
        checkout: {
          orderSummary: {
            shippingCountry: 'Canada',
          },
        },
      })
      expect(value).toBe(false)
    })
  })

  describe('formatDeliveryOptions', () => {
    it('returns empty object if nothing is passed', () => {
      expect(formatDeliveryOptions()).toEqual({})
    })
    it('returns empty object if deliveryOptions is empty', () => {
      expect(
        formatDeliveryOptions({
          state: {
            checkout: {
              orderSummary: {
                basket: { deliveryOptions: [] },
              },
            },
          },
        })
      ).toEqual({})
    })
    it('returns formatted delivery options object with option id as the key', () => {
      expect(formatDeliveryOptions(state)).toEqual({
        parcelshop: {
          selected: false,
          deliveryOptionId: 47520,
          deliveryOptionExternalId: 'retail_store_collection',
          label: 'Collect from ParcelShop £3.95',
          enabled: true,
          type: 'parcelshop',
          plainLabel: 'Collect from ParcelShop',
        },
        home_express: {
          selected: false,
          deliveryOptionId: 28033,
          deliveryOptionExternalId: 'n4',
          label: 'Next or Named Day Delivery £5.95',
          enabled: true,
          type: 'home_express',
          plainLabel: 'Next or Named Day Delivery',
        },
        home_standard: {
          selected: true,
          deliveryOptionId: 26507,
          deliveryOptionExternalId: 's',
          label: 'Free Standard UK Delivery £0.00',
          enabled: true,
          type: 'home_standard',
          plainLabel: 'Free Standard UK Delivery',
        },
        store_express: {
          selected: false,
          deliveryOptionId: 45028,
          deliveryOptionExternalId: 'retail_store_express',
          label: 'Collect From Store Express £2.95',
          enabled: true,
          type: 'store_express',
          plainLabel: 'Collect From Store Express',
        },
        store_standard: {
          selected: false,
          deliveryOptionId: 45027,
          deliveryOptionExternalId: 'retail_store_standard',
          label: 'Free Collect From Store Standard £0.00',
          enabled: true,
          type: 'store_standard',
          plainLabel: 'Free Collect From Store Standard',
        },
      })
    })
  })

  describe('findAddressIsVisible', () => {
    it('should default to `false`', () => {
      const value = findAddressIsVisible()
      expect(value).toBe(false)
    })

    it('should return `true` if not a manual address and a QAS country', () => {
      const value = findAddressIsVisible('delivery', {
        ...configState,
        findAddress: {
          isManual: false,
        },
        checkout: {
          orderSummary: {
            shippingCountry: 'United Kingdom',
          },
        },
      })
      expect(value).toBe(true)
    })

    it('should return `false` if not a manual address and not a QAS country', () => {
      const value = findAddressIsVisible('delivery', {
        findAddress: {
          isManual: false,
        },
      })
      expect(value).toBe(false)
    })

    it('should return `false` if a manual address and a QAS country', () => {
      const value = findAddressIsVisible('delivery', {
        ...configState,
        findAddress: {
          isManual: true,
        },
        checkout: {
          orderSummary: {
            shippingCountry: 'United Kingdom',
          },
        },
      })
      expect(value).toBe(false)
    })
  })

  describe('isDeliveryStoreChosen', () => {
    function stateWithDeliveryStateSetTo(value) {
      return {
        checkout: {
          deliveryStore: value,
        },
      }
    }

    it('returns false when the delivery store object does not exist in the state', () => {
      expect(
        isDeliveryStoreChosen(stateWithDeliveryStateSetTo(undefined))
      ).toBe(false)
      expect(isDeliveryStoreChosen(stateWithDeliveryStateSetTo(null))).toBe(
        false
      )
    })

    it('returns false when the delivery store object exists in the state but is empty', () => {
      expect(isDeliveryStoreChosen(stateWithDeliveryStateSetTo({}))).toBe(false)
    })

    it('returns true when the delivery store object exists in the state and is empty', () => {
      expect(
        isDeliveryStoreChosen(stateWithDeliveryStateSetTo({ foo: '' }))
      ).toBe(true)
    })
  })

  describe('isStoreDelivery', () => {
    it('returns true when store delivery has been selected', () => {
      expect(
        isStoreDelivery(mockStore(orderSummaryFreeCollectFromStoreStandard))
      ).toBe(true)
    })

    it('returns false when store delvivery has not been selected', () => {
      expect(isStoreDelivery(mockStore(orderSummaryUkStandard))).toBe(false)
    })
  })

  describe('isParcelDelivery', () => {
    it('returns true when store delivery has been selected', () => {
      expect(
        isParcelDelivery(mockStore(orderSummaryCollectFromParcelShop))
      ).toBe(true)
    })

    it('returns false when store delvivery has not been selected', () => {
      expect(isParcelDelivery(mockStore(orderSummaryUkStandard))).toBe(false)
    })
  })

  describe('isStoreOrParcelDelivery', () => {
    it('returns true when the store delivery option has been selected', () => {
      expect(
        isStoreOrParcelDelivery(
          mockStore(orderSummaryFreeCollectFromStoreStandard)
        )
      ).toBe(true)
    })

    it('returns true when the parcel shop delivery option has been selected', () => {
      expect(
        isStoreOrParcelDelivery(mockStore(orderSummaryCollectFromParcelShop))
      ).toBe(true)
    })

    it('returns false when a delivery option has been selected other than store or parcel shop', () => {
      expect(isStoreOrParcelDelivery(mockStore(orderSummaryUkStandard))).toBe(
        false
      )
    })
  })

  describe(getUseDeliveryAsBilling.name, () => {
    it('returns true when "useDeliveryAsBilling" = true', () => {
      const store = {
        checkout: {
          useDeliveryAsBilling: true,
        },
      }
      expect(getUseDeliveryAsBilling(store)).toEqual(true)
    })
    it('returns true when "useDeliveryAsBilling" = false', () => {
      const store = {
        checkout: {
          useDeliveryAsBilling: false,
        },
      }
      expect(getUseDeliveryAsBilling(store)).toEqual(false)
    })
  })

  describe('getErrors', () => {
    const formsState = {
      checkout: {
        billingAddress: {
          errors: {
            address1: 'This field is required',
          },
        },
      },
      giftCard: {
        errors: {
          giftCardNumber: 'Giftcard number needs to be 16 characters long.',
        },
      },
    }

    it('should pull out errors from requested forms', () => {
      expect(
        getErrors(['billingAddress', 'giftCard'], { forms: formsState })
      ).toEqual({
        billingAddress: {
          address1: 'This field is required',
        },
        giftCard: {
          giftCardNumber: 'Giftcard number needs to be 16 characters long.',
        },
      })
    })

    it('should not return errors if requested forms don’t have any', () => {
      expect(getErrors(['billingCardDetails'], { forms: formsState })).toEqual(
        {}
      )
    })

    it('should not return errors if state has no form data', () => {
      expect(getErrors(['billingCardDetails'], { forms: {} })).toEqual({})
    })

    it('should not return the errors if the form doesn‘t have errors', () => {
      const state = {
        forms: {
          checkout: {
            billingAddress: {},
          },
        },
      }
      expect(getErrors(['billingAddress'], state)).toEqual({})
    })

    it('should not return errors if the error message is empty', () => {
      const state = {
        forms: {
          checkout: {
            billingAddress: {
              errors: {
                address1: '',
              },
            },
          },
        },
      }
      expect(getErrors(['billingAddress'], state)).toEqual({})
    })
  })

  describe('isReturningCustomer', () => {
    it('should return true if there is a integer that is not -1 on billing address id', () => {
      const state = {
        account: {
          user: {
            billingDetails: {
              addressDetailsId: 2283515,
            },
          },
        },
      }
      expect(isReturningCustomer(state)).toBe(true)
    })

    it('should return false if the billing address id is -1', () => {
      const state = {
        account: {
          user: {
            billingDetails: {
              addressDetailsId: -1,
            },
          },
        },
      }
      expect(isReturningCustomer(state)).toBe(false)
    })
  })

  describe('getFormErrors', () => {
    const formsState = {
      checkout: {
        billingAddress: {
          errors: {
            address1: 'This field is required',
          },
        },
      },
    }

    it('should pull out error from requested form', () => {
      expect(getFormErrors('billingAddress', { forms: formsState })).toEqual({
        address1: 'This field is required',
      })
    })

    it('should return an empty object if no errors', () => {
      expect(getFormErrors('giftCard', { forms: formsState })).toEqual({})
    })
  })

  /* eslint-disable  quote-props,quotes,indent */

  describe('getDeliveryLocations', () => {
    const deliveryLocations = [
      {
        deliveryLocationType: 'HOME',
        label:
          'Home Delivery Standard (UK up to 4 days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
        selected: false,
        deliveryMethods: [],
      },
      {
        deliveryLocationType: 'STORE',
        label:
          'Collect from Store Standard (3-7 working days) Express (next day)',
        selected: true,
        deliveryMethods: [],
      },
      {
        deliveryLocationType: 'PARCELSHOP',
        label:
          'Collect from ParcelShop - UK only Thousands of local shops open early and late Next Day Delivery',
        selected: false,
        deliveryMethods: [],
      },
    ]
    it('should return empty array if the state is empty', () => {
      expect(getDeliveryLocations({})).toEqual([])
    })
    it('should return only Home delivery options if CFS and PUDO feature flags are not enabled', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryLocations },
        },
      }
      const filteredDeliveryLocations = getDeliveryLocations(state)
      expect(filteredDeliveryLocations).toMatchSnapshot()
      expect(filteredDeliveryLocations.length).toBe(1)
    })
    it('should not return CFS options if CFS feature flags is disabled', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryLocations },
        },
        features: {
          status: {
            FEATURE_CFS: false,
            FEATURE_PUDO: true,
          },
        },
      }
      const filteredDeliveryLocations = getDeliveryLocations(state)
      expect(filteredDeliveryLocations).toMatchSnapshot()
      expect(filteredDeliveryLocations.length).toBe(2)
    })
    it('should not return PUDO options if PUDO feature flags is disabled', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryLocations },
        },
        features: {
          status: {
            FEATURE_CFS: true,
            FEATURE_PUDO: false,
          },
        },
      }
      const filteredDeliveryLocations = getDeliveryLocations(state)
      expect(filteredDeliveryLocations).toMatchSnapshot()
      expect(filteredDeliveryLocations.length).toBe(2)
    })
    it('should return the unfiltered list of delivery locations when CFSI and PUDO feature flags is set to true', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryLocations },
        },
        features: {
          status: {
            FEATURE_CFS: true,
            FEATURE_PUDO: true,
          },
        },
      }
      const unfilteredDeliveryLocations = getDeliveryLocations(state)
      expect(unfilteredDeliveryLocations).toMatchSnapshot()
      expect(unfilteredDeliveryLocations.length).toBe(3)
    })
  })

  /* eslint-disable  quote-props,quotes,indent */

  describe(getEnrichedDeliveryLocations.name, () => {
    it('returns the correct enriched delivery locations for a CFSI only basket', () => {
      const deliveryLocations = getEnrichedDeliveryLocations(
        stateBurtonCfsiOnlyBasket
      )
      expect(deliveryLocations.length).toBe(3)
      expect(deliveryLocations).toEqual([
        {
          additionalDescription: 'Next or Named Day Delivery',
          deliveryLocationType: 'HOME',
          deliveryMethods: [],
          description: 'Standard Delivery',
          iconUrl: '/assets/burton/images/lorry-icon.svg',
          label:
            'Home Delivery Standard Delivery (up to 4 days) Next Day or Named Day Delivery (UK) Worldwide Delivery (times and prices vary)',
          selected: false,
          title: 'Home Delivery',
        },
        {
          additionalDescription: 'Express Delivery (next day)',
          deliveryLocationType: 'STORE',
          deliveryMethods: [
            {
              additionalDescription: 'Collection date Friday 29 September 2017',
              cost: '2.95',
              deliveryOptions: [],
              deliveryType: 'STORE_EXPRESS',
              label: 'Collect In Store Exp Next Day(Excl Sun)',
              selected: false,
              enabled: false,
              shipModeId: 45022,
            },
            {
              additionalDescription: 'Collection date Friday 29 September 2017',
              cost: '3.00',
              deliveryOptions: [],
              deliveryType: 'STORE_IMMEDIATE',
              label: 'Collect From Store Today',
              selected: false,
              enabled: true,
              shipModeId: 50522,
            },
            {
              additionalDescription: 'Collection date Thursday 5 October 2017',
              deliveryOptions: [],
              deliveryType: 'STORE_STANDARD',
              label: 'Collect In Store Std 2-7 Days',
              selected: true,
              enabled: true,
              shipCode: 'Retail Store Standard',
              shipModeId: 45021,
            },
          ],
          description: 'Free Collect In Store Std 2-7 Days',
          iconUrl: '/assets/burton/images/cfs.svg',
          label:
            'Collect from Store Standard Delivery (2 to 7 working days) Next Day Delivery',
          selected: true,
          title: 'Collect from Store',
        },
        {
          additionalDescription: '',
          deliveryLocationType: 'PARCELSHOP',
          deliveryMethods: [],
          description: 'Thousands of local shops open early and late',
          iconUrl: '/assets/burton/images/hermes-icon.svg',
          label:
            'Collect from ParcelShop - UK only Thousands of local shops open early and late Next Day Delivery',
          selected: false,
          title: 'Collect from ParcelShop',
        },
      ])
    })
    it('returns the correct delivery locations for CFSI and not CFSI basket', () => {
      const deliveryLocations = getEnrichedDeliveryLocations(
        stateBurtonCfsiAndNotCfsiProducts
      )
      expect(deliveryLocations.length).toBe(3)
      expect(deliveryLocations).toEqual([
        {
          additionalDescription: 'Next or Named Day Delivery',
          deliveryLocationType: 'HOME',
          deliveryMethods: [],
          description: 'Standard Delivery',
          iconUrl: '/assets/burton/images/lorry-icon.svg',
          label:
            'Home Delivery Standard Delivery (up to 4 days) Next Day or Named Day Delivery (UK) Worldwide Delivery (times and prices vary)',
          selected: false,
          title: 'Home Delivery',
        },
        {
          additionalDescription: 'Express Delivery (next day)',
          deliveryLocationType: 'STORE',
          deliveryMethods: [
            {
              additionalDescription: 'Collection date Tuesday 3 October 2017',
              cost: '2.95',
              deliveryOptions: [],
              deliveryType: 'STORE_EXPRESS',
              label: 'Collect In Store Exp Next Day(Excl Sun)',
              selected: false,
              enabled: false,
              shipModeId: 45022,
            },
            {
              additionalDescription: 'Collection date Monday 2 October 2017',
              cost: '3.00',
              deliveryOptions: [],
              deliveryType: 'STORE_IMMEDIATE',
              label: 'Collect From Store Today',
              selected: false,
              enabled: true,
              shipModeId: 50522,
            },
            {
              additionalDescription: 'Collection date Friday 6 October 2017',
              deliveryOptions: [],
              deliveryType: 'STORE_STANDARD',
              label: 'Collect In Store Std 2-7 Days',
              selected: true,
              enabled: true,
              shipCode: 'Retail Store Standard',
              shipModeId: 45021,
            },
          ],
          description: 'Free Collect In Store Std 2-7 Days',
          iconUrl: '/assets/burton/images/cfs.svg',
          label:
            'Collect from Store Standard Delivery (2 to 7 working days) Next Day Delivery',
          selected: true,
          title: 'Collect from Store',
        },
        {
          additionalDescription: '',
          deliveryLocationType: 'PARCELSHOP',
          deliveryMethods: [],
          description: 'Thousands of local shops open early and late',
          iconUrl: '/assets/burton/images/hermes-icon.svg',
          label:
            'Collect from ParcelShop - UK only Thousands of local shops open early and late Next Day Delivery',
          selected: false,
          title: 'Collect from ParcelShop',
        },
      ])
    })
  })

  describe('getSelectedStoreDetails', () => {
    it('returns the details of the selected store', () => {
      const storeDetails = { address1: 'some store...' }
      const state = { checkout: { orderSummary: { storeDetails } } }
      expect(getSelectedStoreDetails(state)).toBe(storeDetails)
    })
  })

  describe('getSelectedDeliveryStoreType', () => {
    it('returns `shop` when selected delivery store is a parcel shop', () => {
      const state = {
        checkout: { orderSummary: { deliveryStoreCode: 'S2536' } },
      }
      expect(getSelectedDeliveryStoreType(state)).toBe('shop')
    })

    it('returns `store` when selected delivery store is not a parcel shop', () => {
      const state = {
        checkout: { orderSummary: { deliveryStoreCode: '2536' } },
      }
      expect(getSelectedDeliveryStoreType(state)).toBe('store')
    })
  })

  describe('isDeliveryStoreChoiceAccepted', () => {
    it('returns true when the store details exists in the order summary', () => {
      const state = { checkout: { orderSummary: { storeDetails: {} } } }
      expect(isDeliveryStoreChoiceAccepted(state)).toBe(true)
      // This is because when the order summary api accepts the choice of store,
      // the store details will then be added to the order summary in the state
    })

    it('returns false when the store details exists in the order summary', () => {
      const state = { checkout: { orderSummary: { storeDetails: undefined } } }
      expect(isDeliveryStoreChoiceAccepted(state)).toBe(false)
      // This is because when the order summary api declines the choice of store,
      // the store details will not be added to the order summary in the state
    })
  })

  describe('hasSelectedStore', () => {
    it('should return `true` if the store is not updating and there are store details', () => {
      const state = {
        checkout: {
          storeUpdating: false,
          orderSummary: {
            storeDetails: {},
          },
        },
      }
      expect(hasSelectedStore(state)).toBe(true)
    })

    it('should return `false` if the store is updating', () => {
      const state = {
        checkout: {
          storeUpdating: true,
          orderSummary: {
            storeDetails: {},
          },
        },
      }
      expect(hasSelectedStore(state)).toBe(false)
    })

    it('should return `false` if the there are no store details', () => {
      const state = {
        checkout: {
          storeUpdating: false,
        },
      }
      expect(hasSelectedStore(state)).toBe(false)
    })
  })

  describe('getPaymentType', () => {
    it('should return the payment type when it is available', () => {
      const value = 'test-payment-type'
      const state = {
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value,
                },
              },
            },
          },
        },
      }
      expect(getPaymentType(state)).toBe(value)
    })

    it('should return undefined when the payment type is not available', () => {
      expect(getPaymentType({})).toBeUndefined()
    })
  })

  describe('getCardNumber', () => {
    it('should return the card number when it is available', () => {
      const value = 'test-card-number'
      const state = {
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                cardNumber: {
                  value,
                },
              },
            },
          },
        },
      }
      expect(getCardNumber(state)).toBe(value)
    })

    it('should return undefined when the card number is not available', () => {
      expect(getCardNumber({})).toBeUndefined()
    })
  })

  describe('getOrderCost', () => {
    it('should return `undefined` if no delivery locations', () => {
      const orderSummary = { basket: {} }
      expect(getOrderCost({ checkout: { orderSummary } })).toBeUndefined()
    })

    it('should return `undefined` if no basket', () => {
      const orderSummary = { deliveryLocations: [] }
      expect(getOrderCost({ checkout: { orderSummary } })).toBeUndefined()
    })

    it('should add shipping cost to subtotal', () => {
      const orderSummary = {
        deliveryLocations: [
          {
            selected: true,
            deliveryMethods: [
              {
                selected: true,
                cost: '4.00',
                deliveryOptions: [],
              },
            ],
          },
        ],
        basket: {
          subTotal: '29.00',
        },
      }
      expect(getOrderCost({ checkout: { orderSummary } })).toBe(33.0)
    })

    it('should remove any discounts', () => {
      const orderSummary = {
        deliveryLocations: [
          {
            selected: true,
            deliveryMethods: [
              {
                selected: true,
                cost: '4.00',
                deliveryOptions: [],
              },
            ],
          },
        ],
        basket: {
          subTotal: '29.00',
          discounts: [{ value: '2.00' }, { value: '5.00' }],
        },
      }
      expect(getOrderCost({ checkout: { orderSummary } })).toBe(26.0)
    })
  })

  describe('getDeliveryPageFormNames', () => {
    it('should return correct form names', () => {
      expect(getDeliveryPageFormNames({})).toEqual([
        'yourDetails',
        'yourAddress',
        'findAddress',
      ])
    })

    it('should include delivery instructions form if displayed', () => {
      const state = {
        checkout: {
          orderSummary: {
            deliveryDetails: {
              address: {
                country: 'United Kingdom',
              },
            },
            deliveryLocations: [
              {
                selected: true,
                deliveryLocationType: 'HOME',
              },
            ],
          },
        },
      }
      expect(getDeliveryPageFormNames(state)).toEqual([
        'yourDetails',
        'yourAddress',
        'findAddress',
        'deliveryInstructions',
      ])
    })
  })

  describe('getDeliveryPaymentPageFormNames', () => {
    it('should return correct form names and order', () => {
      expect(getDeliveryPaymentPageFormNames({})).toEqual([
        'yourAddress',
        'findAddress',
        'yourDetails',
        'newFindAddress',
        'newAddress',
        'newDetails',
        'newDeliverToAddress',
        'billingDetails',
        'billingAddress',
        'billingFindAddress',
        'billingCardDetails',
        'giftCard',
        'order',
      ])
    })

    it('should include delivery instructions form if displayed', () => {
      const state = {
        checkout: {
          orderSummary: {
            deliveryDetails: {
              address: {
                country: 'United Kingdom',
              },
            },
            deliveryLocations: [
              {
                selected: true,
                deliveryLocationType: 'HOME',
              },
            ],
          },
        },
      }
      expect(getDeliveryPaymentPageFormNames(state)).toEqual([
        'yourAddress',
        'findAddress',
        'yourDetails',
        'newFindAddress',
        'newAddress',
        'newDetails',
        'newDeliverToAddress',
        'billingDetails',
        'billingAddress',
        'billingFindAddress',
        'billingCardDetails',
        'deliveryInstructions',
        'giftCard',
        'order',
      ])
    })
  })

  describe('getDeliveryPaymentPageFormErrors', () => {
    const formsState = {
      checkout: {
        yourAddress: {
          errors: {
            address1: 'This field is required',
          },
        },
        somethingElse: {
          errors: {
            something: 'This field is required',
          },
        },
      },
    }
    it('should return correct Errors', () => {
      expect(getDeliveryPaymentPageFormErrors({ forms: formsState })).toEqual({
        yourAddress: {
          address1: 'This field is required',
        },
      })
    })
  })

  describe('extractDiscountInfo', () => {
    it('takes from orderSummary if its there', () => {
      const state = {
        checkout: {
          orderSummary: {
            basket: {
              discounts: [
                {
                  label: 'Topshop Card- £5 Welcome offer',
                  value: '5.00',
                },
              ],
            },
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([
        {
          label: 'Topshop Card- £5 Welcome offer',
          value: '5.00',
        },
      ])
    })

    it('Handles 1 discount in order completed', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            discounts: [
              {
                value: '0.09',
                label: 'Monty Test 9p off',
              },
            ],
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([
        {
          value: '0.09',
          label: 'Monty Test 9p off',
        },
      ])
    })

    it('Handles multiple discounts in Order Completed', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            discounts: [
              {
                value: '0.09',
                label: 'Monty Test 9p off',
              },
              {
                value: '0.07',
                label: 'Monty Test 7p off',
              },
            ],
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([
        {
          value: '0.09',
          label: 'Monty Test 9p off',
        },
        {
          value: '0.07',
          label: 'Monty Test 7p off',
        },
      ])
    })

    it('should return an empty array if Order Summary and Order Completed are empty', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {},
        },
      }
      expect(extractDiscountInfo(state)).toEqual([])
    })

    it('Handles $', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            discounts: [
              {
                label: 'Monty Test £5.00 off',
                value: '5.00',
              },
              {
                label: 'Monty Test £10.00 off',
                value: '10.00',
              },
            ],
          },
        },
      }

      expect(extractDiscountInfo(state)).toEqual([
        {
          label: 'Monty Test £5.00 off',
          value: '5.00',
        },
        {
          label: 'Monty Test £10.00 off',
          value: '10.00',
        },
      ])
    })

    it('Handles €', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            discounts: [
              {
                label: 'Monty Test 5,00€ off',
                value: '5,00',
              },
              {
                label: 'Monty Test 10,00€ off',
                value: '10,00',
              },
            ],
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([
        {
          label: 'Monty Test 5,00€ off',
          value: '5,00',
        },
        {
          label: 'Monty Test 10,00€ off',
          value: '10,00',
        },
      ])
    })

    it('Handles € cents', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            discounts: [
              {
                label: 'Topshop Card -€0.75 Welcome offer',
                value: '-0,75 €',
              },
            ],
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([
        {
          label: 'Topshop Card -€0.75 Welcome offer',
          value: '-0,75 €',
        },
      ])
    })

    it('Handles £ UNICODE', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            discounts: [
              {
                label: 'Topshop Card -£5 Welcome offer',
                value: '-\u00A35.00',
              },
            ],
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([
        {
          label: 'Topshop Card -£5 Welcome offer',
          value: '-£5.00',
        },
      ])
    })

    it('Handles number responses (instead of strings)', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            discounts: [
              {
                label: 'Topshop Card- £5 Welcome offer',
                value: '-5.99',
              },
            ],
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([
        {
          label: 'Topshop Card- £5 Welcome offer',
          value: '-5.99',
        },
      ])
    })
  })

  describe('Handles no discounts scenarios', () => {
    it('Handles undefined responses', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            totalOrdersDiscountLabel: '',
            totalOrdersDiscount: undefined,
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([])
    })

    it('Handles null responses', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            totalOrdersDiscountLabel: '',
            totalOrdersDiscount: null,
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([])
    })

    it('Handles empty string responses', () => {
      const state = {
        checkout: {
          orderSummary: {},
          orderCompleted: {
            totalOrdersDiscountLabel: '',
            totalOrdersDiscount: '',
          },
        },
      }
      expect(extractDiscountInfo(state)).toEqual([])
    })
  })

  describe('getSubTotal', () => {
    it('returns undefined if no order Completed and no order summary', () => {
      const state = {
        checkout: {},
      }
      expect(getSubTotal(state)).toEqual(undefined)
    })

    it('returns order Summary if its there', () => {
      const state = {
        checkout: {
          orderSummary: {
            basket: {
              subTotal: '5.00',
            },
          },
        },
      }
      expect(getSubTotal(state)).toEqual('5.00')
    })

    it('Uses subtotal if its there', () => {
      const state = {
        checkout: {
          orderCompleted: {
            subTotal: '26.00',
          },
        },
      }
      expect(getSubTotal(state)).toEqual('26.00')
    })

    it('Calculates sub total if its not there', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryCost: '5.00',
            totalOrderPrice: '30.00',
          },
        },
      }
      expect(getSubTotal(state)).toEqual('25.00')
    })
  })

  describe('getTotal', () => {
    it('returns undefined if no state is available', () => {
      expect(getTotal({})).toEqual(undefined)
    })

    it('returns total via Order Summary', () => {
      const state = {
        checkout: {
          orderSummary: {
            basket: {
              total: '5.00',
            },
          },
        },
      }
      expect(getTotal(state)).toEqual('5.00')
    })

    it('returns total via Order Completed', () => {
      const state = {
        checkout: {
          orderCompleted: {
            totalOrderPrice: '26.00',
          },
        },
      }
      expect(getTotal(state)).toEqual('26.00')
    })
  })

  describe('isCollectFromOrder', () => {
    it('returns undefined if no order completed and no order summary', () => {
      const state = {
        checkout: {},
      }
      expect(isCollectFromOrder(state)).toEqual(undefined)
    })

    it('returns true if CFS Standard', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryCarrier: 'Retail Store Standard',
          },
        },
      }
      expect(isCollectFromOrder(state)).toEqual(true)
    })
    it('returns true if CFS Express', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryCarrier: 'Retail Store Express',
          },
        },
      }
      expect(isCollectFromOrder(state)).toEqual(true)
    })
    it('returns true if Parcel shop', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryCarrier: 'Retail Store Collection',
          },
        },
      }
      expect(isCollectFromOrder(state)).toEqual(true)
    })

    it('returns false if not CFS Standard/CFS Express/Parcel shop', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryCarrier: 'Home Delivery Network',
          },
        },
      }
      expect(isCollectFromOrder(state)).toEqual(false)
    })

    it('returns false if not CFS Standard/CFS Express/Parcel shop', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryCarrier: 'Parcelnet',
          },
        },
      }
      expect(isCollectFromOrder(state)).toEqual(false)
    })

    it('returns true if there is a deliveryStoreCode', () => {
      const state = {
        checkout: {
          orderCompleted: {},
          orderSummary: {
            deliveryStoreCode: 'AAAAA',
          },
        },
      }
      expect(isCollectFromOrder(state)).toEqual(true)
    })

    it('returns false if there is no order summary and not Retail', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryCarrier: 'Parcelnet',
          },
          orderSummary: {
            basket: {},
          },
        },
      }
      expect(isCollectFromOrder(state)).toEqual(false)
    })
  })

  describe('getDeliveryDate', () => {
    it('returns delivery Date if its there', () => {
      const state = {
        checkout: {
          orderCompleted: {
            deliveryDate: '1/1/2017',
          },
          orderSummary: {
            estimatedDelivery: 'No later than 2/2/2017',
          },
        },
      }
      expect(getDeliveryDate(state)).toEqual('1/1/2017')
    })

    it('reverts to estimated delivery if its not there', () => {
      const state = {
        checkout: {
          orderSummary: {
            estimatedDelivery: 'No later than 2/2/2017',
          },
        },
      }
      expect(getDeliveryDate(state)).toEqual('2/2/2017')
    })
  })

  describe(isSavePaymentDetailsEnabled.name, () => {
    it('returns the savePaymentDetailsEnabled when defined', () => {
      const state = {
        checkout: {
          savePaymentDetails: true,
        },
      }
      expect(isSavePaymentDetailsEnabled(state)).toEqual(true)
    })
    it('returns false when not defined', () => {
      const state = {}
      expect(isSavePaymentDetailsEnabled(state)).toEqual(false)
    })
  })

  describe(shouldUpdateOrderSummaryStore.name, () => {
    it('should return false if there is no store in orderSummary', () => {
      const state = {
        checkout: { orderSummary: {} },
      }
      expect(shouldUpdateOrderSummaryStore(state)).toBe(false)
    })
    it('should return false if there is no store selected for checkout', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryStoreCode: 'TS0001' },
          deliveryStore: {},
        },
      }
      expect(shouldUpdateOrderSummaryStore(state)).toBe(false)
    })
    it('should return false if both storeCodes are equal', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryStoreCode: 'TS0001' },
          deliveryStore: { deliveryStoreCode: 'TS0001' },
        },
      }
      expect(shouldUpdateOrderSummaryStore(state)).toBe(false)
    })
    it('should return false if new checkoutSelectedStore has been selected but no item was added in the bag', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryStoreCode: 'TS0001' },
          deliveryStore: { deliveryStoreCode: 'TS0007' },
          deliveryStoreDetails: { storeId: 'TS0001' },
        },
      }
      expect(shouldUpdateOrderSummaryStore(state)).toBe(false)
    })
    it('should return true if both orderSummaryStore and checkoutSelectedStore storeCodes are not equal', () => {
      const state = {
        checkout: {
          orderSummary: { deliveryStoreCode: 'TS0001' },
          deliveryStore: { deliveryStoreCode: 'TS0007' },
        },
        selectedBrandFulfilmentStore: { storeId: 'TS0007' },
      }
      expect(shouldUpdateOrderSummaryStore(state)).toBe(true)
    })
  })

  describe(getSelectedDeliveryType.name, () => {
    it('should return undefined if there is no selected deliveryLocation', () => {
      const state = {
        checkout: {
          orderSummary: {
            deliveryLocations: [
              {
                deliveryLocationType: 'HOME',
                deliveryMethods: [],
                label: 'Home Delivery Standard',
                selected: false,
              },
            ],
          },
        },
      }
      expect(getSelectedDeliveryType(state)).toBe(undefined)
    })
    describe('with populated deliveryMethods', () => {
      it('returns selectedDeliveryType', () => {
        const state = {
          checkout: {
            orderSummary: {
              deliveryLocations: [
                {
                  deliveryLocationType: 'HOME',
                  deliveryMethods: [
                    {
                      label: 'Next or Named Day Delivery',
                      deliveryType: 'HOME_EXPRESS',
                      selected: true,
                      deliveryOptionExternalId: 'n1',
                    },
                  ],
                  label: 'Home Delivery Standard',
                  selected: true,
                },
              ],
            },
          },
        }
        expect(getSelectedDeliveryType(state)).toBe('HOME_EXPRESS')
      })
    })
    describe('when deliveryMethods are not populated', () => {
      it('returns default HOME deliveryType', () => {
        const state = {
          checkout: {
            orderSummary: {
              deliveryLocations: [
                {
                  deliveryLocationType: 'HOME',
                  deliveryMethods: [],
                  label: 'Home Delivery Standard',
                  selected: true,
                },
              ],
            },
          },
          routing: {
            location: {
              pathname: '/checkout/delivery',
            },
          },
        }
        expect(getSelectedDeliveryType(state)).toBe('HOME_STANDARD')
      })
      it('returns default STORE deliveryType', () => {
        const state = {
          checkout: {
            orderSummary: {
              deliveryLocations: [
                {
                  deliveryLocationType: 'STORE',
                  deliveryMethods: [],
                  label: 'undefined',
                  selected: true,
                },
              ],
            },
          },
          routing: {
            location: {
              pathname: '/checkout/delivery',
            },
          },
          features: {
            status: {
              FEATURE_CFS: true,
            },
          },
        }
        expect(getSelectedDeliveryType(state)).toBe('STORE_STANDARD')
      })
    })
    it('returns deliveryType according to the deliveryOption selected in the basket', () => {
      const state = {
        checkout: {
          orderSummary: {
            basket: {
              deliveryOptions: [
                {
                  deliveryOptionId: 45019,
                  label: 'Free Collect From Store Standard £0.00',
                  selected: false,
                  deliveryOptionExternalId: 'retail_store_standard',
                },
                {
                  deliveryOptionId: 45020,
                  label: 'Collect From Store Express £3.00',
                  selected: true,
                  deliveryOptionExternalId: 'retail_store_express',
                },
              ],
            },
            deliveryLocations: [
              {
                deliveryLocationType: 'STORE',
                deliveryMethods: [],
                label: 'undefined',
                selected: true,
              },
            ],
          },
        },
        features: {
          status: {
            FEATURE_CFS: true,
          },
        },
      }
      expect(getSelectedDeliveryType(state)).toBe('STORE_EXPRESS')
    })
  })

  describe(getShipModeId.name, () => {
    describe('when there is a selected Delivery Method', () => {
      it('returns selectedDeliveryOption shipModeId when the selected Method has deliveryOptions', () => {
        const state = {
          checkout: {
            orderSummary: {
              deliveryLocations: [
                {
                  deliveryLocationType: 'HOME',
                  label:
                    'Home Delivery Standard (UK up to 4 days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
                  selected: true,
                  deliveryMethods: [
                    {
                      shipModeId: 26504,
                      shipCode: 'S',
                      deliveryType: 'HOME_STANDARD',
                      label: 'UK Standard up to 4 days',
                      additionalDescription: 'Up to 4 days',
                      cost: '3.95',
                      selected: true,
                      deliveryOptions: [],
                    },
                  ],
                },
              ],
            },
          },
        }
        expect(getShipModeId(state)).toBe(26504)
      })
      it('returns selectedDeliveryMethod shipModeId when the selected Method has no deliveryOptions available', () => {
        const state = {
          checkout: {
            orderSummary: {
              deliveryLocations: [
                {
                  deliveryLocationType: 'HOME',
                  label:
                    'Home Delivery Standard (UK up to 4 days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
                  selected: true,
                  deliveryMethods: [
                    {
                      deliveryType: 'HOME_EXPRESS',
                      label: 'Next or Named Day Delivery',
                      additionalDescription: '',
                      selected: true,
                      deliveryOptions: [
                        {
                          shipModeId: 28005,
                          dayText: 'Thu',
                          dateText: '14 Dec',
                          nominatedDate: '2017-12-14',
                          price: '6.00',
                          selected: false,
                        },
                        {
                          shipModeId: 28006,
                          dayText: 'Fri',
                          dateText: '15 Dec',
                          nominatedDate: '2017-12-15',
                          price: '6.00',
                          selected: false,
                        },
                        {
                          shipModeId: 28007,
                          dayText: 'Sat',
                          dateText: '16 Dec',
                          nominatedDate: '2017-12-16',
                          price: '6.00',
                          selected: true,
                        },
                        {
                          shipModeId: 28002,
                          dayText: 'Mon',
                          dateText: '18 Dec',
                          nominatedDate: '2017-12-18',
                          price: '6.00',
                          selected: false,
                        },
                        {
                          shipModeId: 28003,
                          dayText: 'Tue',
                          dateText: '19 Dec',
                          nominatedDate: '2017-12-19',
                          price: '6.00',
                          selected: false,
                        },
                        {
                          shipModeId: 28004,
                          dayText: 'Wed',
                          dateText: '20 Dec',
                          nominatedDate: '2017-12-20',
                          price: '6.00',
                          selected: false,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        }
        expect(getShipModeId(state)).toBe(28007)
      })
    })
    describe('when there is no selected Delivery Method populated get ShipModeId from the basket selected option', () => {
      it('returns selectedDeliveryOption shipModeId from the basket options', () => {
        const state = {
          checkout: {
            orderSummary: {
              basket: {
                deliveryOptions: [
                  {
                    deliveryOptionId: 45019,
                    label: 'Free Collect From Store Standard £0.00',
                    selected: true,
                    deliveryOptionExternalId: 'retail_store_standard',
                  },
                ],
              },
              deliveryLocations: [
                {
                  deliveryLocationType: 'STORE',
                  label:
                    'Collect from Store Standard (3-7 working days) Express (next day)',
                  selected: true,
                  deliveryMethods: [],
                },
              ],
            },
          },
          features: {
            status: {
              FEATURE_CFS: true,
            },
          },
        }
        expect(getShipModeId(state)).toBe(45019)
      })
      it('returns ParcelShop shipModeId from the basket options if locationType is PARCELSHOP and user is in checkout', () => {
        const state = {
          checkout: {
            orderSummary: {
              basket: {
                deliveryOptions: [
                  // last MiniBag selection was CFS, therefore remains as selected
                  {
                    deliveryOptionId: 45019,
                    label: 'Free Collect From Store Standard £0.00',
                    selected: true,
                    deliveryOptionExternalId: 'retail_store_standard',
                  },
                  {
                    deliveryOptionId: 47524,
                    label: 'Collect from ParcelShop £4.00',
                    selected: false,
                    deliveryOptionExternalId: 'retail_store_collection',
                  },
                ],
              },
              deliveryLocations: [
                {
                  deliveryLocationType: 'PARCELSHOP',
                  label:
                    'Collect from ParcelShop - UK only Thousands of local shops open early and late Next Day Delivery',
                  selected: true,
                  deliveryMethods: [],
                },
              ],
            },
          },
          features: {
            status: {
              FEATURE_PUDO: true,
            },
          },
          routing: {
            location: {
              pathname: '/checkout/delivery/collect-from-store',
            },
          },
        }
        expect(getShipModeId(state)).toBe(47524)
      })
      it('returns undefined otherwise', () => {
        expect(getShipModeId({})).toBeUndefined()
      })
    })
  })

  describe('getDeliveryCountry', () => {
    let state = {}
    beforeEach(() => {
      state = {
        forms: {
          checkout: {
            yourAddress: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
          },
        },
        checkout: {
          orderSummary: {
            deliveryDetails: {
              address: {
                country: 'United Kingdom1',
              },
              country: 'United Kingdom2',
            },
            shippingCountry: 'United Kingdom4',
          },
        },
        shippingDestination: {
          destination: 'United Kingdom5',
        },
      }
    })
    test('first it tries to get the delivery country from the delivery address', () => {
      expect(getDeliveryCountry(state)).toBe('United Kingdom')
    })
    test('then if falls back to the country from the address in the delivery details of the order summary', () => {
      delete state.forms
      expect(getDeliveryCountry(state)).toBe('United Kingdom1')
    })
    test('then it falls back to the country property from delivery details of the order summary', () => {
      delete state.forms
      delete state.checkout.orderSummary.deliveryDetails.address
      expect(getDeliveryCountry(state)).toBe('United Kingdom2')
    })
    test('then it falls back to the shipping country of the order summary', () => {
      delete state.forms
      delete state.checkout.orderSummary.deliveryDetails.address
      delete state.checkout.orderSummary.deliveryDetails.country
      expect(getDeliveryCountry(state)).toBe('United Kingdom4')
    })
    test('and finally it falls back to the global shipping destination from state', () => {
      delete state.forms
      delete state.checkout
      expect(getDeliveryCountry(state)).toBe('United Kingdom5')
    })
  })

  describe('getBillingCountry', () => {
    let state = {}
    beforeEach(() => {
      state = {
        forms: {
          checkout: {
            billingAddress: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
          },
        },
        checkout: {
          orderSummary: {
            billingDetails: {
              address: {
                country: 'United Kingdom1',
              },
            },
          },
        },
        shippingDestination: {
          destination: 'United Kingdom2',
        },
      }
    })
    test('first it tries tries to get the billing country from the your address in the checkout forms', () => {
      expect(getBillingCountry(state)).toBe('United Kingdom')
    })
    test('then if falls back to the country from the address in the billing details of the order summary', () => {
      delete state.forms
      expect(getBillingCountry(state)).toBe('United Kingdom1')
    })
    test('and finally it falls back to the global shipping destination from state', () => {
      delete state.forms
      delete state.checkout
      expect(getBillingCountry(state)).toBe('United Kingdom2')
    })
  })

  describe('getSelectedDeliveryMethods', () => {
    it('return empty when no delivery methods', () => {
      expect(getSelectedDeliveryMethods({})).toEqual([])
    })

    it('return delivery methods from state', () => {
      const deliveryMethods = [
        {
          shipModeId: 26504,
          shipCode: 'S',
          deliveryType: 'HOME_STANDARD',
          label: 'UK Standard up to 4 working days',
          additionalDescription: 'Up to 4 working days',
          cost: '4.00',
          selected: true,
          deliveryOptions: [],
        },
        {
          deliveryType: 'HOME_EXPRESS',
          label: 'Express / Nominated day delivery',
          additionalDescription: '',
          selected: false,
          deliveryOptions: [
            {
              shipModeId: 28007,
              dayText: 'Sat',
              dateText: '05 Aug',
              nominatedDate: '2017-08-05',
              price: '6.00',
              selected: true,
            },
            {
              shipModeId: 28002,
              dayText: 'Mon',
              dateText: '07 Aug',
              nominatedDate: '2017-08-07',
              price: '6.00',
              selected: false,
            },
            {
              shipModeId: 28003,
              dayText: 'Tue',
              dateText: '08 Aug',
              nominatedDate: '2017-08-08',
              price: '6.00',
              selected: false,
            },
            {
              shipModeId: 28004,
              dayText: 'Wed',
              dateText: '09 Aug',
              nominatedDate: '2017-08-09',
              price: '6.00',
              selected: false,
            },
            {
              shipModeId: 28005,
              dayText: 'Thu',
              dateText: '10 Aug',
              nominatedDate: '2017-08-10',
              price: '6.00',
              selected: false,
            },
            {
              shipModeId: 28006,
              dayText: 'Fri',
              dateText: '11 Aug',
              nominatedDate: '2017-08-11',
              price: '6.00',
              selected: false,
            },
          ],
        },
      ]
      const store = mockStore(orderSummaryUkStandard)
      expect(getSelectedDeliveryMethods(store)).toEqual(deliveryMethods)
    })
  })

  describe('shouldShowCollectFromStore', () => {
    it('handles no checkout', () => {
      expect(shouldShowCollectFromStore()).toEqual(false)
    })

    it('handles checkout with no showCollectFromStore', () => {
      expect(shouldShowCollectFromStore({ checkout: {} })).toEqual(false)
    })

    it('handles checkout with showCollectFromStore = false', () => {
      expect(
        shouldShowCollectFromStore({
          checkout: { showCollectFromStore: false },
        })
      ).toEqual(false)
    })

    it('handles checkout with showCollectFromStore = true', () => {
      expect(
        shouldShowCollectFromStore({ checkout: { showCollectFromStore: true } })
      ).toEqual(true)
    })
  })

  describe('getNewlyConfirmedOrder', () => {
    it('returns false if state is not valid', () => {
      expect(getNewlyConfirmedOrder()).toBe(false)
      expect(getNewlyConfirmedOrder(null)).toBe(false)
    })
    it('returns newlyConfirmedOrder value if found', () => {
      expect(
        getNewlyConfirmedOrder({
          checkout: { newlyConfirmedOrder: false },
        })
      ).toBe(false)
      expect(
        getNewlyConfirmedOrder({
          checkout: { newlyConfirmedOrder: true },
        })
      ).toBe(true)
    })
  })

  describe('getDeliveryStoreForOrderUpdate', () => {
    it('should return `null` if the is no store', () => {
      expect(getDeliveryStoreForOrderUpdate({})).toBe(null)
    })
    it('should return null if the deliveryLocation type selected does not match with the store type selected', () => {
      const state = {
        checkout: {
          orderSummary: {
            shippingCountry: 'United Kingdom',
            deliveryLocations: [
              { deliveryLocationType: 'HOME', selected: false },
              { deliveryLocationType: 'STORE', selected: true },
              { deliveryLocationType: 'PARCELSHOP', selected: false },
            ],
          },
          deliveryStore: {
            deliveryStoreCode: 'S08137',
          },
        },
      }
      expect(getDeliveryStoreForOrderUpdate(state)).toBe(null)
    })
    it('should return delivery store when matches the selected deliveryLocation type', () => {
      const state = {
        checkout: {
          orderSummary: {
            shippingCountry: 'United Kingdom',
            deliveryLocations: [
              { deliveryLocationType: 'HOME', selected: false },
              { deliveryLocationType: 'STORE', selected: true },
              { deliveryLocationType: 'PARCELSHOP', selected: false },
            ],
          },
          deliveryStore: {
            deliveryStoreCode: 'TS0002',
          },
        },
        features: {
          status: {
            FEATURE_CFS: true,
          },
        },
      }
      expect(getDeliveryStoreForOrderUpdate(state)).toEqual(
        state.checkout.deliveryStore
      )
    })

    // EXP-313
    describe('storeWithParcel is true', () => {
      it('should return delivery store when resolved store code is STORE and storeWithParcel is true', () => {
        const state = {
          checkout: {
            orderSummary: {
              shippingCountry: 'United Kingdom',
              deliveryLocations: [
                { deliveryLocationType: 'HOME', selected: false },
                { deliveryLocationType: 'STORE', selected: true },
                { deliveryLocationType: 'PARCELSHOP', selected: false },
              ],
            },
            deliveryStore: {
              deliveryStoreCode: 'TS0002',
            },
            storeWithParcel: true,
          },
          features: {
            status: {
              FEATURE_CFS: true,
            },
          },
        }
        expect(getDeliveryStoreForOrderUpdate(state)).toEqual(
          state.checkout.deliveryStore
        )
      })
      it('should return delivery store when resolved store code is PARCELSHOP and storeWithParcel is true', () => {
        const state = {
          checkout: {
            orderSummary: {
              shippingCountry: 'United Kingdom',
              deliveryLocations: [
                { deliveryLocationType: 'HOME', selected: false },
                { deliveryLocationType: 'STORE', selected: true },
                { deliveryLocationType: 'PARCELSHOP', selected: false },
              ],
            },
            deliveryStore: {
              deliveryStoreCode: 'S0002',
            },
            storeWithParcel: true,
          },
          features: {
            status: {
              FEATURE_CFS: true,
            },
          },
        }
        expect(getDeliveryStoreForOrderUpdate(state)).toEqual(
          state.checkout.deliveryStore
        )
      })
      it('should return null if withStoreParcel is true but no deliveryStore exists (home delivery)', () => {
        const state = {
          checkout: {
            orderSummary: {
              shippingCountry: 'United Kingdom',
              deliveryLocations: [
                { deliveryLocationType: 'HOME', selected: true },
                { deliveryLocationType: 'STORE', selected: false },
                { deliveryLocationType: 'PARCELSHOP', selected: false },
              ],
            },
            // no deliveryStore because home delivery
            storeWithParcel: true,
          },
          features: {
            status: {
              FEATURE_CFS: true,
            },
          },
        }
        expect(getDeliveryStoreForOrderUpdate(state)).toBe(null)
      })
    })
  })

  describe('getThreeDSecurePrompt', () => {
    it('returns null if state is not valid', () => {
      expect(getThreeDSecurePrompt()).toBe(null)
      expect(getThreeDSecurePrompt(null)).toBe(null)
    })

    it('returns threeDSecurePrompt value if found', () => {
      expect(
        getThreeDSecurePrompt({
          checkout: { threeDSecurePrompt: null },
        })
      ).toBe(null)
      expect(
        getThreeDSecurePrompt({
          checkout: { threeDSecurePrompt: 'test-prompt' },
        })
      ).toBe('test-prompt')
    })
  })

  describe('getSelectedPaymentMethod', () => {
    it('should return a selected payment method', () => {
      expect(getSelectedPaymentMethod(state)).toEqual(
        state.checkout.selectedPaymentMethod
      )
    })
  })

  describe('isSelectedPaymentMethodKlarna', () => {
    it('should return a true if klarna payment is selected', () => {
      expect(
        isSelectedPaymentMethodKlarna({
          ...state,
          checkout: {
            selectedPaymentMethod: 'KLRNA',
          },
        })
      ).toBeTruthy()
    })

    it('should return a false if klarna payment is not selected', () => {
      expect(isSelectedPaymentMethodKlarna(state)).toBeFalsy()
    })
  })

  describe('getCheckoutPaymentButtonLabel', () => {
    it('should return the default label', () => {
      expect(getCheckoutPaymentButtonLabel(state)).toEqual('Order and Pay Now')
    })

    it('should return the Klarna label', () => {
      expect(
        getCheckoutPaymentButtonLabel({
          ...state,
          checkout: {
            ...state.checkout,
            selectedPaymentMethod: 'KLRNA',
          },
        })
      ).toEqual('Pay with Klarna')
    })

    it('should return the Paypal label', () => {
      expect(
        getCheckoutPaymentButtonLabel({
          ...state,
          checkout: {
            ...state.checkout,
            selectedPaymentMethod: 'PYPAL',
          },
        })
      ).toEqual('Pay via PayPal')
    })

    it('should return the Clearpay label', () => {
      expect(
        getCheckoutPaymentButtonLabel({
          ...state,
          checkout: {
            ...state.checkout,
            selectedPaymentMethod: 'CLRPY',
          },
        })
      ).toEqual('Proceed to Clearpay')
    })

    it('should return the default label if total is 0', () => {
      expect(
        getCheckoutPaymentButtonLabel({
          ...state,
          checkout: {
            ...state.checkout,
            selectedPaymentMethod: 'PYPAL',
            orderSummary: {
              ...state.checkout.orderSummary,
              basket: {
                ...state.checkout.orderSummary,
                total: '0.00',
              },
            },
          },
        })
      ).toEqual('Order and Pay Now')
    })
  })

  describe('getCheckoutOrderErrorPaymentDetails', () => {
    it('should return a falsy value when orderErrorPaymentDetails does not exist in the state', () => {
      expect(getCheckoutOrderErrorPaymentDetails({})).toBeFalsy()
    })

    it('should return orderErrorPaymentDetails value if found', () => {
      expect(
        getCheckoutOrderErrorPaymentDetails({
          checkout: { orderErrorPaymentDetails: null },
        })
      ).toBe(null)
      expect(
        getCheckoutOrderErrorPaymentDetails({
          checkout: { orderErrorPaymentDetails: 'test-data' },
        })
      ).toBe('test-data')
    })
  })

  describe('getCheckoutPrePaymentConfig', () => {
    it('should return prePaymentConfig value if found', () => {
      expect(
        getCheckoutPrePaymentConfig({
          checkout: { prePaymentConfig: null },
        })
      ).toBe(null)
      expect(
        getCheckoutPrePaymentConfig({
          checkout: { prePaymentConfig: 'test-data' },
        })
      ).toBe('test-data')
    })
  })

  describe('getCheckoutFinalisedOrder', () => {
    it('should return finalisedOrder value if found', () => {
      expect(
        getCheckoutFinalisedOrder({
          checkout: { finalisedOrder: null },
        })
      ).toBe(null)

      const finalisedOrder = {}
      expect(
        getCheckoutFinalisedOrder({
          checkout: { finalisedOrder },
        })
      ).toBe(finalisedOrder)
    })
  })

  describe('shouldMountDDCIFrame', () => {
    it('should allow DDC IFrame to be mounted in the right conditions', () => {
      expect(
        shouldMountDDCIFrame({
          features: {
            status: {
              FEATURE_PSD2_PUNCHOUT_POPUP: false,
              FEATURE_PSD2_3DS2: false,
            },
          },
          checkout: { prePaymentConfig: null },
        })
      ).toBe(false)
      expect(
        shouldMountDDCIFrame({
          features: {
            status: {
              FEATURE_PSD2_PUNCHOUT_POPUP: true,
              FEATURE_PSD2_3DS2: true,
            },
          },
          checkout: { prePaymentConfig: null },
        })
      ).toBe(false)
      expect(
        shouldMountDDCIFrame({
          features: {
            status: {
              FEATURE_PSD2_PUNCHOUT_POPUP: false,
              FEATURE_PSD2_3DS2: false,
            },
          },
          checkout: { prePaymentConfig: {} },
        })
      ).toBe(false)
      expect(
        shouldMountDDCIFrame({
          features: {
            status: {
              FEATURE_PSD2_PUNCHOUT_POPUP: true,
              FEATURE_PSD2_3DS2: true,
            },
          },
          checkout: { prePaymentConfig: {} },
        })
      ).toBe(true)
    })
  })

  describe('isGuestOrder', () => {
    it('returns true if it is a guest order', () => {
      const state = {
        checkout: {
          orderSummary: {
            isGuestOrder: true,
          },
        },
      }
      expect(isGuestOrder(state)).toBeTruthy()
    })
    it('returns false if it is not a guest order', () => {
      const state = {
        checkout: {
          orderSummary: {},
        },
      }
      expect(isGuestOrder(state)).toBeFalsy()
    })
  })
  describe('paymentMethodsAreOpen', () => {
    it('should default to `false`', () => {
      const value = paymentMethodsAreOpen()
      expect(value).toBe(false)
    })

    it('should be `true` if `checkout.paymentMethodsAreOpen` state is true', () => {
      const value = paymentMethodsAreOpen({
        checkout: {
          paymentMethodsAreOpen: true,
        },
      })
      expect(value).toBe(true)
    })
  })

  describe('storedCardHasExpired', () => {
    describe('The card type cannot expire (eg. Klarna, Paypal)', () => {
      it('should return `false` and dont check for expiration date', () => {
        const output = storedCardHasExpired(savedCards.OTHER)
        expect(output).toBe(false)
      })
    })

    describe('The card type can expire', () => {
      describe('The month/year contain invalid characters', () => {
        it('should return `true`', () => {
          const output = storedCardHasExpired(savedCards.INVALID)
          expect(output).toBe(true)
        })
      })

      describe('The card has expired', () => {
        it('should return `true`', () => {
          const output = storedCardHasExpired(savedCards.EXPIRED)
          expect(output).toBe(true)
        })
      })
    })

    describe('The card has not expired', () => {
      it('should return `false`', () => {
        const output = storedCardHasExpired(savedCards.VALID)
        expect(output).toBe(false)
      })
    })
  })

  describe('getProgressTrackerSteps', () => {
    describe('New user is on /checkout/payment', () => {
      it('should return the correct steps', () => {
        const state = {
          account: {
            user: {},
          },
          routing: {
            location: {
              pathname: '/checkout/payment',
            },
          },
        }

        const output = getProgressTrackerSteps(state)
        expect(output).toEqual(trackerSteps.NEW_CUSTOMER_STEPS)
      })
    })

    describe('Returning user is on /checkout/delivery-payment', () => {
      it('should return the correct steps', () => {
        const state = {
          account: {
            user: {
              billingDetails: {
                addressDetailsId: 2283515,
              },
            },
          },
          routing: {
            location: {
              pathname: '/checkout/delivery-payment',
            },
          },
        }

        const output = getProgressTrackerSteps(state)
        expect(output).toEqual(trackerSteps.RETURNING_CUSTOMER_STEPS)
      })
    })

    describe('Guest checkout user is on /guest/checkout/payment', () => {
      it('should return the correct steps', () => {
        const state = {
          checkout: {
            orderSummary: {
              isGuestOrder: true,
            },
          },
          routing: {
            location: {
              pathname: '/guest/checkout/payment',
            },
          },
        }

        const output = getProgressTrackerSteps(state)
        expect(output).toEqual(trackerSteps.GUEST_CUSTOMER_STEPS)
      })
    })
  })

  describe('isOrderCoveredByGiftCards', () => {
    it('defaults to false', () => {
      expect(isOrderCoveredByGiftCards({})).toBe(false)
    })

    it('picks the value from the state', () => {
      expect(
        isOrderCoveredByGiftCards({
          checkout: {
            orderSummary: { basket: { isOrderCoveredByGiftCards: true } },
          },
        })
      ).toBe(true)

      expect(
        isOrderCoveredByGiftCards({
          checkout: {
            orderSummary: { basket: { isOrderCoveredByGiftCards: false } },
          },
        })
      ).toBe(false)
    })
  })

  describe('isGiftCardRedemptionEnabled', () => {
    it('defaults to false', () => {
      expect(isGiftCardRedemptionEnabled({})).toBe(false)
    })

    it('picks the value from the state', () => {
      expect(
        isGiftCardRedemptionEnabled({
          checkout: {
            orderSummary: { basket: { isGiftCardRedemptionEnabled: true } },
          },
        })
      ).toBe(true)

      expect(
        isGiftCardRedemptionEnabled({
          checkout: {
            orderSummary: { basket: { isGiftCardRedemptionEnabled: false } },
          },
        })
      ).toBe(false)
    })
  })

  describe('isGiftCardValueThresholdMet', () => {
    it('defaults to false', () => {
      expect(isGiftCardValueThresholdMet({})).toBe(false)
    })

    it('picks the value from the state', () => {
      expect(
        isGiftCardValueThresholdMet({
          checkout: {
            orderSummary: { basket: { isGiftCardValueThresholdMet: true } },
          },
        })
      ).toBe(true)

      expect(
        isGiftCardValueThresholdMet({
          checkout: {
            orderSummary: { basket: { isGiftCardValueThresholdMet: false } },
          },
        })
      ).toBe(false)
    })
  })

  describe('giftCardRedemptionPercentage', () => {
    it('defaults to 100', () => {
      expect(giftCardRedemptionPercentage({})).toBe(100)
    })

    it('picks the value from the state', () => {
      expect(
        giftCardRedemptionPercentage({
          checkout: {
            orderSummary: { basket: { giftCardRedemptionPercentage: 50 } },
          },
        })
      ).toBe(50)

      expect(
        giftCardRedemptionPercentage({
          checkout: {
            orderSummary: { basket: { giftCardRedemptionPercentage: 7 } },
          },
        })
      ).toBe(7)
    })

    it('returns zero when set to 0', () => {
      expect(
        giftCardRedemptionPercentage({
          checkout: {
            orderSummary: { basket: { giftCardRedemptionPercentage: 0 } },
          },
        })
      ).toBe(0)
    })
  })
})
