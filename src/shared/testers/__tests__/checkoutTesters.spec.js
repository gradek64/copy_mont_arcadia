import * as checkoutTesters from '../checkoutTesters'

describe('Checkout Testers', () => {
  describe('isDeliveryLocationSelected', () => {
    it('should return `true` if `selected` property is `true`', () => {
      expect(
        checkoutTesters.isDeliveryLocationSelected({ selected: true })
      ).toBe(true)
    })

    it('should return `false` if `selected` property is `false`', () => {
      expect(
        checkoutTesters.isDeliveryLocationSelected({ selected: false })
      ).toBe(false)
    })

    it('should return `false` if `selected` property does not exist', () => {
      expect(checkoutTesters.isDeliveryLocationSelected({})).toBe(false)
    })
  })

  describe('isDeliveryMethodSelected', () => {
    it('should return `true` if `selected` property is `true`', () => {
      expect(checkoutTesters.isDeliveryMethodSelected({ selected: true })).toBe(
        true
      )
    })

    it('should return `false` if `selected` property is `false`', () => {
      expect(
        checkoutTesters.isDeliveryMethodSelected({ selected: false })
      ).toBe(false)
    })

    it('should return `false` if `selected` property does not exist', () => {
      expect(checkoutTesters.isDeliveryMethodSelected({})).toBe(false)
    })
  })

  describe('isDeliveryMethodOfType', () => {
    it('should return `true` if `deliveryType` property is equal to supplied type', () => {
      expect(
        checkoutTesters.isDeliveryMethodOfType('HOME_STANDARD', {
          deliveryType: 'HOME_STANDARD',
        })
      ).toBe(true)
    })

    it('should return `false` if `deliveryType` property is not equal to supplied type', () => {
      expect(
        checkoutTesters.isDeliveryMethodOfType('HOME_STANDARD', {
          deliveryType: 'HOME_EXPRESS',
        })
      ).toBe(false)
    })

    it('should return `false` if `deliveryType` property does not exist', () => {
      expect(checkoutTesters.isDeliveryMethodOfType('HOME_STANDARD', {})).toBe(
        false
      )
    })
  })

  describe('isDeliveryOptionSelected', () => {
    it('should return `true` if `selected` property is `true`', () => {
      expect(checkoutTesters.isDeliveryOptionSelected({ selected: true })).toBe(
        true
      )
    })

    it('should return `false` if `selected` property is `false`', () => {
      expect(
        checkoutTesters.isDeliveryOptionSelected({ selected: false })
      ).toBe(false)
    })

    it('should return `false` if `selected` property does not exist', () => {
      expect(checkoutTesters.isDeliveryOptionSelected({})).toBe(false)
    })
  })
})
