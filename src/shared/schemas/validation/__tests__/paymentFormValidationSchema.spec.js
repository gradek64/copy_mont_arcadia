import { getPaymentMethodFormValidationSchema } from '../paymentFormValidationSchema'

describe('Payment Form Validation Schema functions', () => {
  describe(getPaymentMethodFormValidationSchema.name, () => {
    const createState = ({ paymentTypeValue }) => ({
      forms: {
        account: {
          myCheckoutDetails: {
            paymentCardDetailsMCD: {
              fields: {
                paymentType: {
                  value: paymentTypeValue,
                },
              },
            },
          },
        },
      },
      paymentMethods: [
        { type: 'CARD', value: 'VISA' },
        { type: 'CARD', value: 'AMEX' },
        { type: 'OTHER_CARD', value: 'ACCNT' },
      ],
    })
    const state = createState({ paymentTypeValue: 'VISA' })
    it('returns validation schema for VISA', () => {
      const result = getPaymentMethodFormValidationSchema(state)
      expect(result).toHaveProperty('cardNumber')
      expect(result).toHaveProperty('expiryMonth')
      expect((result) => result.cardNumber).toBeInstanceOf(Function)
      expect((result) => result.expiryMonth).toBeInstanceOf(Function)
    })
    it('returns validation schema for ACCNT card', () => {
      const result = getPaymentMethodFormValidationSchema(
        createState({ paymentTypeValue: 'ACCNT' })
      )
      expect(result).toHaveProperty('cardNumber')
      expect(result).toHaveProperty('expiryMonth')
      expect((result) => result.cardNumber).toBeInstanceOf(Function)
      expect((result) => result.expiryMonth).toBeInstanceOf(Function)
    })
    it('returns error message when card number is not 16 digits', () => {
      const result = getPaymentMethodFormValidationSchema(state)
      expect(
        result.cardNumber({ cardNumber: '1234' }, 'cardNumber', (v) => v)
      ).toBe('A 16 digit card number is required')
    })
    it('returns error message when expiryMonth is expired', () => {
      const result = getPaymentMethodFormValidationSchema(state)
      expect(result.expiryMonth({ expiryMonth: 10, expiryYear: 2016 })).toBe(
        'Please select a valid expiry date'
      )
    })
    it('returns undefined when type card does not exists', () => {
      const state = createState({ paymentTypeValue: 'NOEXISTS' })
      const result = getPaymentMethodFormValidationSchema(state)
      expect(result).toEqual({})
    })
  })
})
