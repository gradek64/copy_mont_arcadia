import { hasDeliveryAddress, hasCreditCard } from '../checkout-helpers'

const user = {
  deliveryDetails: {
    addressDetailsId: 1,
  },
  billingDetails: {
    addressDetailsId: 1,
  },
  hasBillingDetails: true,
  hasDeliveryDetails: true,
  creditCard: {
    cardNumberHash: true,
  },
}

describe('Checkout Routing Helpers', () => {
  describe('hasDeliveryAddress', () => {
    it('should return whether user has a delivery address', () => {
      expect(hasDeliveryAddress(user)).toBe(true)
    })
  })

  describe('hasCreditCard', () => {
    it('should return whether user has a credit card', () => {
      expect(hasCreditCard(user)).toBe(true)
    })
  })
})
