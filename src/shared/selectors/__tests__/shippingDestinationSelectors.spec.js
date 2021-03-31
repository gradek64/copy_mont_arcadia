import { getShippingDestination } from '../shippingDestinationSelectors'

describe('shipping destination selectors', () => {
  describe(getShippingDestination.name, () => {
    it('should return the currency symbol', () => {
      const state = {
        shippingDestination: {
          destination: 'United Kingdom',
        },
      }
      expect(getShippingDestination(state)).toBe('United Kingdom')
    })
  })
})
