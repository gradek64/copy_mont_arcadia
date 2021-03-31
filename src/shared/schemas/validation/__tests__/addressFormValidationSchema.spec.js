import {
  getYourDetailsSchema,
  getFindAddressSchema,
} from '../addressFormValidationSchema'

describe('Address Form Validation Schema functions', () => {
  describe(getYourDetailsSchema.name, () => {
    it('returns validation schema for Details form', () => {
      const result = getYourDetailsSchema('United Kingdom')
      const expectedSchema = {
        firstName: [
          'noEmoji',
          'required',
          expect.any(Function),
          expect.any(Function),
        ],
        lastName: [
          'noEmoji',
          'required',
          expect.any(Function),
          expect.any(Function),
        ],
        telephone: ['required', 'ukPhoneNumber', 'noEmoji'],
      }

      expect(result).toEqual(expectedSchema)
      expect((result) => result.deliverToAddress).toBeInstanceOf(Function)
    })
  })
  describe(getFindAddressSchema.name, () => {
    const rules = { postcodeRequired: true, pattern: '/[abc]/' }

    it('returns default validation schema with no options object', () => {
      const result = getFindAddressSchema(rules)
      const expectedSchema = {
        postcode: ['required', expect.any(Function), 'noEmoji'],
        houseNumber: 'noEmoji',
        findAddress: expect.any(Function),
        selectAddress: expect.any(Function),
      }

      expect(result).toEqual(expectedSchema)
      expect((result) => result.deliverToAddress).toBeInstanceOf(Function)
    })
    it('returns default validation schema with { hasFoundAddresses: true }', () => {
      const result = getFindAddressSchema(rules, { hasFoundAddresses: true })
      const expectedSchema = {
        postcode: ['required', expect.any(Function), 'noEmoji'],
        houseNumber: 'noEmoji',
        findAddress: [],
        selectAddress: expect.any(Function),
      }

      expect(result).toEqual(expectedSchema)
      expect((result) => result.deliverToAddress).toBeInstanceOf(Function)
    })
    it('returns default validation schema with { hasSelectedAddress: true }', () => {
      const result = getFindAddressSchema(rules, { hasSelectedAddress: true })
      const expectedSchema = {
        postcode: ['required', expect.any(Function), 'noEmoji'],
        houseNumber: 'noEmoji',
        findAddress: expect.any(Function),
        selectAddress: [],
      }

      expect(result).toEqual(expectedSchema)
      expect((result) => result.deliverToAddress).toBeInstanceOf(Function)
    })
  })
})
