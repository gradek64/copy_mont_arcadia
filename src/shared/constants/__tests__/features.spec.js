import {
  SUPPORTED_FEATURES,
  DEVELOPMENT_FEATURES,
  ALL_FEATURES,
} from '../features'

describe('features', () => {
  it('contains all features in the correct format', () => {
    Object.entries(ALL_FEATURES).forEach(([name, value]) => {
      expect(name).toBe(value)
    })
  })

  it('contains supported features in the correct format', () => {
    Object.entries(SUPPORTED_FEATURES).forEach(([name, value]) => {
      expect(name).toBe(value)
    })
  })

  it('contains development features in the correct format', () => {
    Object.entries(DEVELOPMENT_FEATURES).forEach(([name, value]) => {
      expect(name).toBe(value)
    })
  })
})
