import * as ValueUtils from '../values'

describe('values', () => {
  describe('isNilOrEmpty', () => {
    it('returns true if given value is undefined', () => {
      expect(ValueUtils.isNilOrEmpty(undefined)).toBe(true)
    })

    it('returns true if given value is null', () => {
      expect(ValueUtils.isNilOrEmpty(null)).toBe(true)
    })

    it('returns true if given value is an empty object', () => {
      expect(ValueUtils.isNilOrEmpty({})).toBe(true)
    })

    it('returns true if given value is an empty array', () => {
      expect(ValueUtils.isNilOrEmpty([])).toBe(true)
    })

    it('returns true if given value is an empty string', () => {
      expect(ValueUtils.isNilOrEmpty('')).toBe(true)
    })

    it('returns false for valid values', () => {
      expect(ValueUtils.isNilOrEmpty({ foo: 'bar' })).toBe(false)
      expect(ValueUtils.isNilOrEmpty(['foo'])).toBe(false)
      expect(ValueUtils.isNilOrEmpty('foo')).toBe(false)
      expect(ValueUtils.isNilOrEmpty(() => undefined)).toBe(false)
      expect(ValueUtils.isNilOrEmpty(1)).toBe(false)
    })
  })

  describe('isUUIDv4', () => {
    it('returns false for undefined', () => {
      expect(ValueUtils.isUUIDv4()).toBe(false)
    })

    it('returns false for an object', () => {
      expect(ValueUtils.isUUIDv4({})).toBe(false)
    })

    it('returns false for an array', () => {
      expect(ValueUtils.isUUIDv4([])).toBe(false)
    })

    it('returns false for a number', () => {
      expect(ValueUtils.isUUIDv4(123)).toBe(false)
    })

    it('returns false for null', () => {
      expect(ValueUtils.isUUIDv4(null)).toBe(false)
    })

    it('returns false for the empty string', () => {
      expect(ValueUtils.isUUIDv4('')).toBe(false)
    })

    it('returns false for incorrectly structured UUID values', () => {
      expect(ValueUtils.isUUIDv4('4e86c758459b44dcb7184b462c5b34fb')).toBe(
        false
      )
      expect(ValueUtils.isUUIDv4('2714b3f9-de964e4a86ea-04d2d9368d39')).toBe(
        false
      )
      expect(ValueUtils.isUUIDv4('9eb79518433d-4c23-b1025add81342350')).toBe(
        false
      )
    })

    it('returns false for valid UUID values with excess whitespace', () => {
      expect(ValueUtils.isUUIDv4(' 4e86c758-459b-44dc-b718-4b462c5b34fb')).toBe(
        false
      )
      expect(ValueUtils.isUUIDv4('2714b3f9-de96-4e4a-86ea-04d2d9368d39 ')).toBe(
        false
      )
      expect(
        ValueUtils.isUUIDv4(' 9eb79518-433d-4c23-b102-5add81342350 ')
      ).toBe(false)
      expect(
        ValueUtils.isUUIDv4('\t4e86c758-459b-44dc-b718-4b462c5b34fb')
      ).toBe(false)
      expect(
        ValueUtils.isUUIDv4('2714b3f9-de96-4e4a-86ea-04d2d9368d39\t')
      ).toBe(false)
      expect(
        ValueUtils.isUUIDv4('\t9eb79518-433d-4c23-b102-5add81342350\t')
      ).toBe(false)
    })

    it('returns true for valid lowercase UUID values', () => {
      expect(ValueUtils.isUUIDv4('4e86c758-459b-44dc-b718-4b462c5b34fb')).toBe(
        true
      )
      expect(ValueUtils.isUUIDv4('2714b3f9-de96-4e4a-86ea-04d2d9368d39')).toBe(
        true
      )
      expect(ValueUtils.isUUIDv4('9eb79518-433d-4c23-b102-5add81342350')).toBe(
        true
      )
    })

    it('returns true for valid uppercase UUID values', () => {
      expect(ValueUtils.isUUIDv4('4E86C758-459B-44DC-B718-4B462C5B34FB')).toBe(
        true
      )
      expect(ValueUtils.isUUIDv4('2714B3F9-DE96-4E4A-86EA-04D2D9368D39')).toBe(
        true
      )
      expect(ValueUtils.isUUIDv4('9EB79518-433D-4C23-B102-5ADD81342350')).toBe(
        true
      )
    })
  })
})
