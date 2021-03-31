import paymentValidationRules from '../../../../../constants/paymentValidationRules'

jest.mock('../../../../../lib/validator/validators', () => ({
  requiredCurried: jest.fn(),
  hasLength: jest.fn(),
  cardExpiry: jest.fn(),
}))
const {
  requiredCurried,
  hasLength,
  cardExpiry,
} = require('../../../../../lib/validator/validators')

import {
  getDeliveryInstructionsSchema,
  getOrderSchema,
  getCardSchema,
  getFindAddressSchema,
  guestUserSchema,
} from '../validationSchemas'
import { smsMobileNumber } from '../../../../../lib/validator/validators'

describe('Validation Schemas', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getFindAddressSchema', () => {
    it('should return default expectations', () => {
      requiredCurried
        .mockImplementationOnce(() => 'findAddress validator')
        .mockImplementationOnce(() => 'selectAddress validator')
      expect(getFindAddressSchema()).toEqual({
        country: 'country',
        houseNumber: 'noEmoji',
        postcode: [],
        findAddress: 'findAddress validator',
        selectAddress: 'selectAddress validator',
      })
      expect(requiredCurried).toBeCalledWith('Please click on FIND ADDRESS')
      expect(requiredCurried).toBeCalledWith('Please select an address')
    })

    it('should return empty validation for findAddress and selectAddress', () => {
      expect(
        getFindAddressSchema([], {
          hasFoundAddresses: true,
          hasSelectedAddress: true,
        })
      ).toEqual({
        country: 'country',
        houseNumber: 'noEmoji',
        postcode: [],
        findAddress: [],
        selectAddress: [],
      })
      expect(requiredCurried).not.toBeCalled()
    })
  })

  describe('getDeliveryInstructionsSchema', () => {
    it('should return an object with 2 validators when the country is UK', () => {
      expect(getDeliveryInstructionsSchema('United Kingdom')).toEqual({
        deliveryInstructions: 'noEmoji',
        smsMobileNumber,
      })
    })

    it('should return an object with deliveryInstructions validator when the country is not UK', () => {
      expect(getDeliveryInstructionsSchema('not UK')).toEqual({
        deliveryInstructions: 'noEmoji',
      })
    })
  })

  describe('getOrderSchema', () => {
    it('should make `isAcceptedTermsAndConditions` a required field', () => {
      expect(getOrderSchema()).toEqual({
        isAcceptedTermsAndConditions: ['required'],
      })
    })
  })

  describe('getCardSchema', () => {
    it('should return an empty object with cardNumber, cvv and expiryMonth when no type set', () => {
      expect(getCardSchema()).toEqual({
        cardNumber: '',
        cvv: '',
        expiryDate: '',
        expiryMonth: '',
      })
    })
    it('should return an object with cardNumber, cvv and expiryMonth validators when type VISA', () => {
      const type = 'VISA'
      expect(getCardSchema(type)).toEqual({
        cardNumber: [
          hasLength(
            paymentValidationRules[type].cardNumber.message,
            paymentValidationRules[type].cardNumber.length
          ),
          'numbersOnly',
        ],
        cvv: [
          'cvvValidation',
          hasLength(
            paymentValidationRules[type].cvv.message,
            paymentValidationRules[type].cvv.length
          ),
        ],
        expiryMonth: cardExpiry(type),
      })
    })
    it('should return an object with cardNumber, cvv and expiryMonth validators when type AMEX', () => {
      const type = 'AMEX'
      expect(getCardSchema(type)).toEqual({
        cardNumber: [
          hasLength(
            paymentValidationRules[type].cardNumber.message,
            paymentValidationRules[type].cardNumber.length
          ),
          'numbersOnly',
        ],
        cvv: [
          'cvvValidation',
          hasLength(
            paymentValidationRules[type].cvv.message,
            paymentValidationRules[type].cvv.length
          ),
        ],
        expiryMonth: cardExpiry(type),
      })
    })
    const l = (msg) => msg
    it('should return correct cvv error message for Visa if not 3 digits', () => {
      hasLength.mockImplementationOnce(() => () => '')
      hasLength.mockImplementationOnce(() => () => '3 digits required')
      cardExpiry.mockImplementationOnce(() => () => '')
      expect(getCardSchema('VISA').cvv[1]({ cvv: 12 }, 'cvv', l)).toBe(
        '3 digits required'
      )
    })

    it('should not return cvv error message for Visa if exactly 3 digits', () => {
      hasLength.mockImplementationOnce(() => () => '')
      hasLength.mockImplementationOnce(() => () => null)
      cardExpiry.mockImplementationOnce(() => () => '')
      expect(getCardSchema('VISA').cvv[1]({ cvv: 123 }, 'cvv', l)).toBeNull()
    })

    it('should return correct cvv error message for AMEX if not 4 digits', () => {
      hasLength.mockImplementationOnce(() => () => '')
      hasLength.mockImplementationOnce(() => () => '4 digits required')
      cardExpiry.mockImplementationOnce(() => () => '')
      expect(getCardSchema('AMEX').cvv[1]({ cvv: 123 }, 'cvv', l)).toBe(
        '4 digits required'
      )
    })

    it('should not return cvv error message for Visa if exactly 3 digits', () => {
      hasLength.mockImplementationOnce(() => () => '')
      hasLength.mockImplementationOnce(() => () => null)
      cardExpiry.mockImplementationOnce(() => () => '')
      expect(getCardSchema('AMEX').cvv[1]({ cvv: 1234 }, 'cvv', l)).toBeNull()
    })

    it('available validators should contain a numbersOnly check', () => {
      hasLength.mockImplementationOnce(() => () => '')
      hasLength.mockImplementationOnce(() => () => null)
      cardExpiry.mockImplementationOnce(() => () => '')
      expect(getCardSchema('VISA').cvv[0]).toBe('cvvValidation')
    })
  })

  describe('guestDeliverySchema', () => {
    it('should return the guest delivery email validation schema', () => {
      expect(guestUserSchema()).toEqual({
        email: 'email',
      })
    })
  })
})
