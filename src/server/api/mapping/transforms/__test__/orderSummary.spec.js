import { path } from 'ramda'
import orderSummaryTransform, * as fragments from '../orderSummary'

jest.mock('../basket')
import basketTransform from '../basket'

jest.mock('../logon')
import * as logonFragments from '../logon'

jest.mock('../../../../lib/logger')
import * as logger from '../../../../lib/logger'

import wcsPreCheckout from '../../../../../../test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/wcs-registered.json'
import montyOrderSummary from '../../../../../../test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/hapiMonty-registered.json'

import wcsNTUStore from '../../../../../../test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/wcs-store-standard.json'
import montyNTUStore from '../../../../../../test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/hapi-store-standard.json'

import wcsUserRegistrationForm from '../../../../../../test/apiResponses/order-summary/guest/home-delivery/wcs-guest.json'
import montyGuestOrderSummary from '../../../../../../test/apiResponses/order-summary/guest/home-delivery/hapiMonty-guest.json'

const wcsDeliveryOptionWithSelectedAsBoolean = {
  enabled: true,
  dayText: 'Sat',
  dateText: '09 Dec',
  shipModeId: '28007',
  nominatedDate: '2017-12-09',
  price: 7.5,
  selected: true,
  available_date: '28007',
  shipmode_28007: '2017-12-09',
}

const montyHapiDeliveryOptionSelected = {
  dateText: '09 Dec',
  dayText: 'Sat',
  enabled: true,
  nominatedDate: '2017-12-09',
  price: '7.50',
  selected: true,
  shipModeId: 28007,
}

describe('orderSummary transform functions', () => {
  describe('deliveryPrice', () => {
    const { deliveryPriceFragment } = fragments

    it('should return false if the price is not a valid number', () => {
      expect(deliveryPriceFragment('foo')).toBeFalsy()
      expect(deliveryPriceFragment('NaN')).toBeFalsy()
      expect(deliveryPriceFragment({})).toBeFalsy()
    })

    it('should convert string numbers to fixed string value numbers', () => {
      expect(deliveryPriceFragment('23')).toBe('23.00')
    })

    it('should convert numeric numbres to fixed value string numbers', () => {
      expect(deliveryPriceFragment(42)).toBe('42.00')
    })
  })

  describe('getDeliveryType', () => {
    const { getDeliveryType } = fragments
    describe('given an array of deliveryTypes', () => {
      it('should return the deliveryType that is selected', () => {
        expect(
          getDeliveryType([
            {
              deliveryLocationType: 'MARS',
              selected: true,
            },
            {
              deliveryLocationType: 'VENUS',
              selected: false,
            },
            {
              deliveryLocationType: 'HOME',
              selected: false,
            },
          ])
        ).toBe('MARS')
      })

      it('should return false if none are selected', () => {
        expect(
          getDeliveryType([
            {
              deliveryLocationType: 'FAR',
              selected: false,
            },
            {
              deliveryLocationType: 'FURTHER',
              selected: false,
            },
          ])
        ).toBeFalsy()
      })

      it('should return false if the array does not contain any objects', () => {
        expect(getDeliveryType([undefined])).toBeFalsy()
      })
    })

    describe('given an empty array', () => {
      it('should return false', () => {
        expect(getDeliveryType([])).toBeFalsy()
      })
    })
  })

  describe('expressDeliveryOptionFragment', () => {
    const { expressDeliveryOptionFragment } = fragments
    it('should return a default deliveryOption object if values are not found', () => {
      expect(expressDeliveryOptionFragment({})).toEqual({
        shipModeId: 0,
        dayText: '',
        dateText: '',
        nominatedDate: '',
        price: 'N/A',
        enabled: false,
        selected: false,
      })
    })

    it('should transform an expressDeliveryOption object from WCS into a format expected by Monty', () => {
      expect(
        expressDeliveryOptionFragment(
          path(
            [
              'orderSummary',
              'deliveryoptionsform',
              'expressDelivery',
              'deliveryDates',
              'deliveryOptions',
              1,
            ],
            wcsPreCheckout
          )
        )
      ).toEqual(
        path(
          ['deliveryLocations', 0, 'deliveryMethods', 1, 'deliveryOptions', 0],
          montyOrderSummary
        )
      )
    })

    it('trasforms a delivery options where the "selected" property is set to true', () => {
      expect(
        expressDeliveryOptionFragment(wcsDeliveryOptionWithSelectedAsBoolean)
      ).toEqual(montyHapiDeliveryOptionSelected)
    })

    it('trasforms a delivery options where the "selected" property is set to "true"', () => {
      expect(
        expressDeliveryOptionFragment({
          ...wcsDeliveryOptionWithSelectedAsBoolean,
          selected: 'true',
        })
      ).toEqual(montyHapiDeliveryOptionSelected)
    })

    it('transforms a delivery options where the "selected" property is not "true" or true', () => {
      const falsySelectedValues = ['', false, 'false', null, undefined]
      const montyHapiDeliveryOptionUnselected = {
        ...montyHapiDeliveryOptionSelected,
        selected: false,
      }
      falsySelectedValues.forEach((falsySelected) => {
        expect(
          expressDeliveryOptionFragment({
            ...wcsDeliveryOptionWithSelectedAsBoolean,
            selected: falsySelected,
          })
        ).toEqual(montyHapiDeliveryOptionUnselected)
      })
    })
  })

  describe('expressDeliveryFragment', () => {
    const { expressDeliveryFragment } = fragments
    it('should return a default expressDelivery object if values are not found', () => {
      expect(expressDeliveryFragment({})).toEqual({
        deliveryType: 'HOME_EXPRESS',
        label: '',
        additionalDescription: '',
        cost: false,
        shipCode: false,
        selected: false,
        enabled: false,
        deliveryOptions: [],
      })
    })

    it('should transform a expressDelivery object from WCS into a format expected by Monty', () => {
      expect(
        expressDeliveryFragment(
          path(
            ['orderSummary', 'deliveryoptionsform', 'expressDelivery'],
            wcsPreCheckout
          )
        )
      ).toEqual(
        path(['deliveryLocations', 0, 'deliveryMethods', 1], montyOrderSummary)
      )
    })

    it('transforms "price" to "cost" as expected', () => {
      const wcsExpressDeliveryFragment = { price: 1.23 }
      const montyExpressDeliveryFragment = {
        deliveryType: 'HOME_EXPRESS',
        label: '',
        additionalDescription: '',
        cost: '1.23',
        shipCode: false,
        selected: false,
        enabled: false,
        deliveryOptions: [],
      }
      expect(expressDeliveryFragment(wcsExpressDeliveryFragment)).toEqual(
        montyExpressDeliveryFragment
      )

      const invalidPrices = [
        '',
        '1.23',
        [],
        ['a'],
        {},
        { a: 'a' },
        null,
        false,
        undefined,
      ]

      invalidPrices.forEach((price) => {
        expect(expressDeliveryFragment({ price })).toEqual({
          ...montyExpressDeliveryFragment,
          cost: false,
        })
      })
    })

    it('maps correctly delivery options with no numneric price', () => {
      const wcsExpressDeliveryWithDeliveryOptions = {
        label: '',
        additionalDescription: '',
        deliveryDates: {
          deliveryOptions: [
            {
              shipModeId: '',
              dayText: '',
              dateText: '',
              nominatedDate: '',
              price: 'N/A',
              selected: '',
              enabled: false,
            },
            {
              shipModeId: '',
              dayText: '',
              dateText: '',
              nominatedDate: '',
              price: '1',
              selected: '',
              enabled: false,
            },
          ],
        },
        selected: '',
        enabled: false,
        price: 0,
        shipCode: false,
      }

      expect(
        expressDeliveryFragment(wcsExpressDeliveryWithDeliveryOptions)
      ).toEqual({
        additionalDescription: '',
        cost: '0.00',
        deliveryOptions: [
          {
            dateText: '',
            dayText: '',
            enabled: false,
            nominatedDate: '',
            price: '1.00',
            selected: false,
            shipModeId: 0,
          },
        ],
        deliveryType: 'HOME_EXPRESS',
        enabled: false,
        label: '',
        selected: false,
        shipCode: false,
      })
    })

    it('transforms "shipCode" as expected', () => {
      const wcsExpressDeliveryFragment = { shipCode: '123' }
      const montyExpressDeliveryFragment = {
        deliveryType: 'HOME_EXPRESS',
        label: '',
        additionalDescription: '',
        cost: false,
        shipCode: '123',
        selected: false,
        enabled: false,
        deliveryOptions: [],
      }
      expect(expressDeliveryFragment(wcsExpressDeliveryFragment)).toEqual(
        montyExpressDeliveryFragment
      )

      const invalidShipCodes = [
        0,
        1.23,
        [],
        ['a'],
        {},
        { a: 'a' },
        null,
        false,
        undefined,
      ]

      invalidShipCodes.forEach((shipCode) => {
        expect(expressDeliveryFragment({ shipCode })).toEqual({
          ...montyExpressDeliveryFragment,
          shipCode: false,
        })
      })
    })
  })

  describe('deliveryMethodFragment', () => {
    const { deliveryMethodFragment } = fragments

    it('should return a default deliveryMethod object if values are not found', () => {
      expect(deliveryMethodFragment({})).toEqual({
        shipModeId: 0,
        cost: 0,
        deliveryType: '',
        label: '',
        additionalDescription: '',
        enabled: false,
        estimatedDeliveryDate: '',
        selected: false,
        deliveryOptions: [],
      })
    })

    it('should transform a deliveryMethod object form WCS into a format expected by Monty', () => {
      expect(
        deliveryMethodFragment(
          path(
            ['orderSummary', 'deliveryoptionsform', 'deliveryMethods', 0],
            wcsPreCheckout
          )
        )
      ).toEqual(
        path(['deliveryLocations', 0, 'deliveryMethods', 0], montyOrderSummary)
      )
    })
  })

  describe('deliveryLocationLabelFragment', () => {
    const { deliveryLocationLabelFragment } = fragments

    it('should return an empty string if the label for the delivery location is not found ', () => {
      expect(
        deliveryLocationLabelFragment(
          'JUPITER',
          path(['orderSummary', 'deliveryLocationTypeForm'], wcsPreCheckout)
        )
      ).toBe('')
    })

    it('should correctly obtain the label for the delivery location from WCS and map it in the response', () => {
      expect(
        deliveryLocationLabelFragment(
          'HOME',
          path(['orderSummary', 'deliveryLocationTypeForm'], wcsPreCheckout)
        )
      ).toBe(
        'Home Delivery Standard (UK up to 4 working days; worldwide varies) Express (UK next or nominated day; worldwide varies)'
      )
    })
  })

  describe('deliveryLocationMethodsFragment', () => {
    const { deliveryLocationMethodsFragment } = fragments

    it('should return an empty array if the selected value is false', () => {
      expect(deliveryLocationMethodsFragment(false)).toEqual([])
    })
  })

  describe('deliveryLocationFragment', () => {
    const { deliveryLocationFragment } = fragments

    it('should return a default deliveryLocation object if values are not found', () => {
      expect(deliveryLocationFragment({}, {})).toEqual({
        deliveryLocationType: '',
        label: '',
        enabled: false,
        selected: false,
        deliveryMethods: [],
      })
    })

    it('should transform a deliveryLocation object from WCS into a format expected by Monty', () => {
      expect(
        deliveryLocationFragment(
          path(
            [
              'orderSummary',
              'deliveryLocationTypeForm',
              'deliveryLocations',
              0,
            ],
            wcsPreCheckout
          ),
          path(['orderSummary', 'deliveryLocationTypeForm'], wcsPreCheckout),
          path(['orderSummary', 'deliveryoptionsform'], wcsPreCheckout)
        )
      ).toEqual(path(['deliveryLocations', 0], montyOrderSummary))
    })
  })

  describe('deliveryLocationsFragment', () => {
    const { deliveryLocationsFragment } = fragments
    it('should return an array with a default HOME deliveryLocation object if required values are not found', () => {
      expect(deliveryLocationsFragment({}, {})).toEqual([
        {
          deliveryLocationType: 'HOME',
          deliveryMethods: [],
          enabled: true,
          label: 'HOME',
          selected: true,
        },
      ])
    })

    it('should transform a deliveryLocations array from WCS to a format expected by Monty', () => {
      expect(
        deliveryLocationsFragment(
          path(['orderSummary', 'deliveryLocationTypeForm'], wcsPreCheckout),
          path(['orderSummary', 'deliveryoptionsform'], wcsPreCheckout)
        )
      ).toEqual(montyOrderSummary.deliveryLocations)
    })
  })

  describe('deliveryDetailsFragment', () => {
    const { deliveryDetailsFragment } = fragments
    logonFragments.detailsFragment.mockReturnValue(
      montyOrderSummary.deliveryDetails
    )
    it('should transform a deliveryDetails object from WCS into a format expected by Monty', () => {
      expect(
        deliveryDetailsFragment(
          path(['orderSummary', 'deliveryoptionsform'], wcsPreCheckout)
        )
      ).toEqual(montyOrderSummary.deliveryDetails)
    })
  })

  describe('creditCardFragment', () => {
    const { creditCardFragment } = fragments

    it('should return default creditCard object if values are not found', () => {
      expect(creditCardFragment({})).toEqual({
        cardNumberStar: '',
        type: '',
      })
    })

    it('should transform a creditCard object from WCS into a format expected by Monty', () => {
      expect(
        creditCardFragment(
          path(
            ['orderSummary', 'OrderCalculateForm', 'CreditCard'],
            wcsPreCheckout
          )
        )
      ).toEqual(montyOrderSummary.creditCard)
    })
  })

  describe('addressNameFragment', () => {
    const { addressNameFragment } = fragments

    it('should return an empty string if the argument passed to it is not an array', () => {
      expect(addressNameFragment({})).toBe('')
    })

    it('should return an empty string if none of the address lines are valid, or if the array is empty', () => {
      expect(addressNameFragment([])).toEqual('')
      expect(addressNameFragment([42, {}, [], false])).toBe('')
    })

    it('should omit undefined or non-string values from the address', () => {
      expect(addressNameFragment(['foo', 42, null, 'bar', {}])).toBe('foo, bar')
    })

    it('should add an ellipsis only if the address is longer than 37 characters', () => {
      expect(
        addressNameFragment(['This', 'address', 'is', 'not', 'long'])
      ).toBe('This, address, is, not, long')
      expect(
        addressNameFragment([
          'However',
          'this',
          'address',
          'is',
          'longer',
          'than',
          'the',
          'other',
          'one',
          'oops',
        ])
      ).toBe('However, this, address, is, longer, t...')
    })

    it('should format an addressName for Monty based on an address passed to it from WCS', () => {
      expect(
        addressNameFragment([
          '42 Wallaby Way',
          'Sydney',
          'New South Wales',
          '12345',
          'AUSTRALIA',
        ])
      ).toBe('42 Wallaby Way, Sydney, New South Wal...')
    })
  })

  describe('savedAddressFragment', () => {
    const { savedAddressFragment } = fragments

    describe('if values are available', () => {
      it('should transform them', () => {
        expect(
          savedAddressFragment({
            title: 'Mr',
            firstName: 'Foo',
            lastName: 'Bar',
            telephone: '1234567890',
            address1: '10 Downing Street',
            address2: 'Whitehall',
            city: 'London',
            state: '',
            country: 'United Kingdom',
            postcode: 'W1 1AG',
            addressId: 833611,
            addressDeleteURL:
              'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/AddressBookDelete?storeId=12556&catalogId=33057&orderId=700337052&addressId=833611&langId=-1&sourcePage=OrderSubmitForm',
            selected: true,
          })
        ).toEqual({
          address1: '10 Downing Street',
          address2: 'Whitehall',
          addressName: 'Whitehall, London, W1 1AG, United Kin...',
          city: 'London',
          firstName: 'Foo',
          id: 833611,
          lastName: 'Bar',
          postcode: 'W1 1AG',
          selected: true,
          state: '',
          title: 'Mr',
          country: 'United Kingdom',
          telephone: '1234567890',
        })
      })
    })

    describe('if values are not available', () => {
      it('should return default values', () => {
        expect(savedAddressFragment({})).toEqual({
          address1: '',
          address2: '',
          addressName: '',
          city: '',
          firstName: '',
          id: 0,
          lastName: '',
          postcode: '',
          selected: false,
          state: '',
          title: '',
          country: '',
          telephone: '',
        })
      })
    })
  })

  describe('estimatedDeliveryFragment', () => {
    const { estimatedDeliveryFragment } = fragments

    it('should return an empty array if there is no estimatedDelivery value in the Basket passed to it', () => {
      expect(estimatedDeliveryFragment({})).toEqual([])
    })

    it('should return an array containing an estimatedDelivery string with html entities removed', () => {
      expect(
        estimatedDeliveryFragment({
          estimatedDelivery: 'Tomorrow&nbsp;morning',
        })
      ).toEqual(['Tomorrow morning'])
    })
  })

  describe('storeDetails fragment', () => {
    const { storeDetailsFragment } = fragments

    describe('given store details from WCS', () => {
      it('should transform them correctly', () => {
        expect(
          storeDetailsFragment(
            path(['orderSummary', 'OrderDeliveryOption'], wcsNTUStore)
          )
        ).toEqual(montyNTUStore.storeDetails)
      })
    })

    describe('given no store details from WCS', () => {
      it('should return false', () => {
        expect(
          storeDetailsFragment({
            storeAddress1: '',
            storeAddress2: '',
            storeCity: '',
            storeState: '',
            shippingCountry: '',
            storePostCode: '',
          })
        ).toBeFalsy()
      })
    })

    describe('given partial store details from WCS', () => {
      it('should transform them correctly', () => {
        expect(
          storeDetailsFragment({
            storeAddress1: 'Oxford Street',
            storeAddress2: '',
            storeCity: 'London',
            storeState: '',
            shippingCountry: 'United Kingdom',
            storePostCode: '',
          })
        ).toEqual({
          address1: 'Oxford Street',
          address2: '',
          city: 'London',
          state: '',
          country: 'United Kingdom',
          postcode: '',
          storeName: '',
        })
      })
    })
  })

  describe('orderSummaryTransform', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    describe('response objects', () => {
      it('should be transformed correctly', () => {
        basketTransform.mockReturnValue(montyOrderSummary.basket)
        logonFragments.detailsFragment
          .mockReturnValueOnce(montyOrderSummary.billingDetails)
          .mockReturnValueOnce(montyOrderSummary.deliveryDetails)
        expect(orderSummaryTransform(wcsPreCheckout.orderSummary)).toEqual(
          montyOrderSummary
        )
      })
    })

    it('should transform a UserRegistrationForm body from WCS into a format expected by Monty', () => {
      basketTransform.mockReturnValue(montyGuestOrderSummary.basket)
      logonFragments.detailsFragment.mockReturnValue({}) // Details not returned in Guest journey
      expect(
        orderSummaryTransform(wcsUserRegistrationForm.orderSummary)
      ).toEqual(montyGuestOrderSummary)
    })

    it('should return a default orderSummary object if values cannot be found', () => {
      basketTransform.mockReturnValue({})
      logonFragments.detailsFragment.mockReturnValue({})
      expect(orderSummaryTransform()).toEqual({
        basket: {},
        deliveryLocations: [
          {
            deliveryLocationType: 'HOME',
            deliveryMethods: [],
            enabled: true,
            label: 'HOME',
            selected: true,
          },
        ],
        giftCards: [],
        deliveryInstructions: '',
        smsMobileNumber: '',
        shippingCountry: '',
        savedAddresses: [],
        ageVerificationDeliveryConfirmationRequired: false,
        estimatedDelivery: [],
      })
    })

    it('should use the basket transform function to create the basket object in the response', () => {
      basketTransform.mockReturnValue('basket')
      logonFragments.detailsFragment.mockReturnValue({})
      expect(
        orderSummaryTransform(
          { MiniBagForm: { Basket: 'WCS Basket' } },
          false,
          '£'
        )
      ).toEqual({
        basket: 'basket',
        deliveryLocations: [
          {
            deliveryLocationType: 'HOME',
            deliveryMethods: [],
            enabled: true,
            label: 'HOME',
            selected: true,
          },
        ],
        giftCards: [],
        deliveryInstructions: '',
        smsMobileNumber: '',
        shippingCountry: '',
        savedAddresses: [],
        ageVerificationDeliveryConfirmationRequired: false,
        estimatedDelivery: [],
      })

      expect(basketTransform).toHaveBeenCalledTimes(1)
      expect(basketTransform).toHaveBeenCalledWith('WCS Basket', '£')
    })

    it('should use the basket transform function when out of stock', () => {
      basketTransform.mockReturnValue('basket')
      logonFragments.detailsFragment.mockReturnValue({})
      const basket = {
        discounts: [],
        products: {
          Product: [
            {
              outOfStock: true,
            },
          ],
        },
      }
      expect(orderSummaryTransform({ Basket: basket }, false, '£')).toEqual(
        'basket'
      )
      expect(basketTransform).toHaveBeenCalledTimes(1)
      expect(basketTransform).toHaveBeenCalledWith(basket, '£')
    })

    it('should use the basket transform function when exceed quantity', () => {
      basketTransform.mockReturnValue('basket')
      logonFragments.detailsFragment.mockReturnValue({})
      const basket = {
        discounts: [],
        products: {
          Product: [
            {
              exceedsAllowedQty: true,
            },
          ],
        },
      }
      expect(orderSummaryTransform({ Basket: basket }, false, '£')).toEqual(
        'basket'
      )
      expect(basketTransform).toHaveBeenCalledTimes(1)
      expect(basketTransform).toHaveBeenCalledWith(basket, '£')
    })

    it('should use the basket transform function when messageForBuyer', () => {
      basketTransform.mockReturnValue('basket')
      logonFragments.detailsFragment.mockReturnValue({})

      const basket = { messageForBuyer: 'ERRROR' }
      expect(orderSummaryTransform({ Basket: basket }, false, '£')).toEqual(
        'basket'
      )

      expect(basketTransform).toHaveBeenCalledTimes(1)
      expect(basketTransform).toHaveBeenCalledWith(basket, '£')
    })

    it('should use the details fragment from the logon transform to create the billingDetails and deliveryDetails objects in the response', () => {
      basketTransform.mockReturnValue({})
      logonFragments.detailsFragment.mockReturnValue({ firstName: 'foo' })

      expect(
        orderSummaryTransform({
          OrderCalculateForm: { billingDetails: { firstName: 'foo' } },
          deliveryoptionsform: {
            deliveryDetails: { firstName: 'bar' },
            selectedAddressID: '1234',
          },
        })
      ).toEqual({
        basket: {},
        deliveryLocations: [
          {
            deliveryLocationType: 'HOME',
            deliveryMethods: [],
            enabled: true,
            label: 'HOME',
            selected: true,
          },
        ],
        giftCards: [],
        deliveryInstructions: '',
        smsMobileNumber: '',
        shippingCountry: '',
        billingDetails: { firstName: 'foo' },
        deliveryDetails: {
          firstName: 'foo',
          addressDetailsId: 1234,
        },
        savedAddresses: [],
        ageVerificationDeliveryConfirmationRequired: false,
        estimatedDelivery: [],
      })

      expect(logonFragments.detailsFragment).toHaveBeenCalledTimes(2)
      expect(logonFragments.detailsFragment.mock.calls[0]).toEqual([
        { firstName: 'foo' },
      ])
      expect(logonFragments.detailsFragment.mock.calls[1]).toEqual([
        { firstName: 'bar' },
      ])
    })

    it('should return the guestUserEmail from the billingDetails if existing', () => {
      basketTransform.mockReturnValue({})
      logonFragments.detailsFragment.mockReturnValue({ firstName: 'foo' })

      expect(
        orderSummaryTransform({
          isGuestOrder: true,
          OrderCalculateForm: {
            billingDetails: { firstName: 'bar', email: 'email@mail.com' },
          },
        })
      ).toEqual({
        basket: {},
        deliveryLocations: [
          {
            deliveryLocationType: 'HOME',
            deliveryMethods: [],
            enabled: true,
            label: 'HOME',
            selected: true,
          },
        ],
        giftCards: [],
        deliveryInstructions: '',
        smsMobileNumber: '',
        shippingCountry: '',
        billingDetails: {
          firstName: 'foo',
        },
        savedAddresses: [],
        ageVerificationDeliveryConfirmationRequired: false,
        estimatedDelivery: [],
        email: 'email@mail.com',
        isGuestOrder: true,
      })
    })
  })
})

describe('#checkForInvalidDeliveryMethodData', () => {
  beforeEach(jest.clearAllMocks)

  it('should not log an error if a selected delivery method is provided', () => {
    const deliveryMethods = [
      { label: 'super fast n super cheap delivery', selected: true },
    ]
    fragments.deliveryMethodsFragment({ deliveryMethods })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('should log an error if deliveryMethods are provided but none are selected', () => {
    const fakeDeliveryMethods = [{ label: 'carrier pidgeon', selected: false }]

    expect(logger.error).not.toHaveBeenCalled()
    fragments.deliveryMethodsFragment({ deliveryMethods: fakeDeliveryMethods })
    expect(logger.error).toHaveBeenCalledWith(
      'ADP-195 checkForInvalidDeliveryMethodData() Invalid deliveryMethods data: neither deliveryMethods nor expressDelivery are selected',
      { deliveryMethods: fakeDeliveryMethods, expressDelivery: undefined }
    )
  })

  it('should not log an error if an express delivery option is provided', () => {
    const expressDelivery = { label: 'v speedy', selected: true }
    fragments.deliveryMethodsFragment({ expressDelivery })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('should log an error if only express delivery is provided and it is not selected', () => {
    const expressDelivery = { label: 'v speedy', selected: false }
    expect(logger.error).not.toHaveBeenCalled()
    fragments.deliveryMethodsFragment({ expressDelivery })
    expect(logger.error).toHaveBeenCalledWith(
      'ADP-195 checkForInvalidDeliveryMethodData() Invalid deliveryMethods data: neither deliveryMethods nor expressDelivery are selected',
      { deliveryMethods: [], expressDelivery }
    )
  })

  it('should log an error if the delivery methods are transformed badly', () => {
    const deliveryMethods = [
      { label: 'method1', selected: false },
      { label: 'method2', selected: true },
      { label: 'method3', selected: false },
    ]
    const transformedArray = [
      { label: 'method1', selected: false },
      { label: 'method2', selected: false },
      { label: 'method3', selected: false },
    ]
    expect(logger.error).not.toHaveBeenCalled()
    fragments.checkForInvalidDeliveryMethodData({
      deliveryMethods,
      transformedArray,
    })
    expect(logger.error).toHaveBeenCalledWith(
      'ADP-195 checkForInvalidDeliveryMethodData() Invalid deliveryMethods data: neither deliveryMethods nor expressDelivery are selected after transformation',
      { deliveryMethods, expressDelivery: undefined, transformedArray }
    )
  })
})
