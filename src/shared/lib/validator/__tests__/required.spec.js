import { mockLocalise } from 'test/unit/helpers/test-component'
import { required, requiredCurried } from '../validators'

describe('required', () => {
  describe('required validator', () => {
    it('should error when no value or null value is passed', () => {
      expect(required({ key: '' }, 'key', jest.fn(mockLocalise))).toBe(
        'This field is required'
      )
      expect(required({ key: null }, 'key', jest.fn(mockLocalise))).toBe(
        'This field is required'
      )
      expect(required({}, 'key', jest.fn(mockLocalise))).toBe(
        'This field is required'
      )
      expect(required({ key: {} }, 'key', jest.fn(mockLocalise))).toBe(
        'This field is required'
      )
    })

    it('should return undefined when a value os provided', () => {
      expect(required({ key: 'test' }, 'key', jest.fn(mockLocalise))).toBe(
        undefined
      )
      expect(required({ key: true }, 'key', jest.fn(mockLocalise))).toBe(
        undefined
      )
      expect(required({ key: 1 }, 'key', jest.fn(mockLocalise))).toBe(undefined)
    })
  })

  describe('required wt. custom message', () => {
    it('should return custom message', () => {
      const customMessage = 'There was problem ... just saying!'
      expect(
        requiredCurried(customMessage)({}, 'key', jest.fn(mockLocalise))
      ).toBe(customMessage)
    })
  })
})
