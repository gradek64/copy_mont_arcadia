import { fixOrderSummary } from '../../../src/shared/lib/checkout-utilities/order-summary'
import europeanOrderSummary from '../../mocks/european-order-summary'
import americanOrderSummary from '../../mocks/american-order-summary'
import { mockSummary } from '../../mocks/orderSummarySaved'
import { omit } from 'ramda'

const countries = ['Germany', 'France', 'United Kingdom']

test('It should use the address from user account if orderSummary is malformed', () => {
  expect.assertions(1)
  const user = {
    billingDetails: {
      address: {
        address1: 'Address Line 1 Billing',
        address2: 'Address Line 2',
        city: 'myCity',
        postcode: '99999',
        country: 'Germany',
        state: '',
      },
    },
    deliveryDetails: {
      address: {
        address1: 'Address Line 1 Delivery',
        address2: 'Address Line 2',
        city: 'myCity',
        postcode: '99999',
        country: 'Germany',
        state: '',
      },
    },
  }
  const actual = fixOrderSummary(europeanOrderSummary, user, countries)
  const expected = {
    ...europeanOrderSummary,
    billingDetails: {
      ...europeanOrderSummary.billingDetails,
      address: user.billingDetails.address,
    },
    deliveryDetails: {
      ...europeanOrderSummary.deliveryDetails,
      address: user.deliveryDetails.address,
    },
    shippingCountry: user.deliveryDetails.address.country,
  }

  expect(actual).toEqual(expected)
})

test('It should use the original address if valid', () => {
  expect.assertions(1)
  const user = {
    billingDetails: {
      address: {
        address1: 'Address Line 1 Billing',
        address2: 'Address Line 2',
        city: 'myCity',
        postcode: '99999',
        country: 'Germany',
        state: '',
      },
    },
    deliveryDetails: {
      address: {
        address1: 'Address Line 1 Delivery',
        address2: 'Address Line 2',
        city: 'myCity',
        postcode: '99999',
        country: 'Germany',
        state: '',
      },
    },
  }
  const actual = fixOrderSummary(mockSummary.orderSummary, user, countries)
  const expected = mockSummary.orderSummary
  expect(actual).toEqual(expected)
})

test('It should use the delivery address country as the shippingCountry if its missing', () => {
  expect.assertions(1)
  const user = {
    billingDetails: {},
    deliveryDetails: {},
  }
  const actual = fixOrderSummary(americanOrderSummary, user, ['United States'])
  const expected = {
    ...americanOrderSummary,
    shippingCountry: americanOrderSummary.deliveryDetails.address.country,
  }

  expect(actual).toEqual(expected)
})

test('It should use the config country if the shippingCountry and user address are missing', () => {
  expect.assertions(1)
  const user = {
    deliveryDetails: {
      address: {},
    },
  }
  const orderSummary = {
    ...americanOrderSummary,
    deliveryDetails: {
      ...americanOrderSummary.deliveryDetails,
      address: omit(['country'], americanOrderSummary.deliveryDetails.address),
    },
  }
  const actual = fixOrderSummary(orderSummary, user, ['United States'], {
    country: 'test',
  })
  const expected = {
    ...orderSummary,
    shippingCountry: 'test',
    deliveryDetails: {
      ...orderSummary.deliveryDetails,
      address: {},
    },
  }

  expect(actual).toEqual(expected)
})
