import {
  extractClientId,
  getBrandDisplayName,
  envSsaEnableReporting,
  envSsaPoolProperty,
} from '../core'

const SSA_ENABLE_REPORTING = global.process.env.SSA_ENABLE_REPORTING
const SSA_POOL_PROPERTY = global.process.env.SSA_POOL_PROPERTY

describe('Interface utilities', () => {
  describe('extractClientId', () => {
    it('should not throw when analyticsId is undefined', () => {
      expect(() => extractClientId()).not.toThrow()
    })

    it('should return undefined when no client ID can be extracted', () => {
      const noneGoogleForm = '9ea8228d-1899-4112-94ea-8350128b22a9'
      expect(extractClientId(noneGoogleForm)).toBeUndefined()
    })

    it('should return client ID when the analytics ID originates from Google Analytics', () => {
      const testClientID = '1524909754.1544283648'
      const testAnalyticsId = `GA1.2.${testClientID}`
      expect(extractClientId(testAnalyticsId)).toBe(testClientID)
    })

    it('should consistently extract client ID despite changes in version and number of sub domains', () => {
      const testClientID = '1524909754.1544283648'
      expect(extractClientId(`GA1.1.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA1.2.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA1.3.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA1.4.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA1.5.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA2.2.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA3.3.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA4.4.${testClientID}`)).toBe(testClientID)
      expect(extractClientId(`GA5.5.${testClientID}`)).toBe(testClientID)
    })
  })

  describe('getBrandDisplayName', () => {
    it('should return the display name of a known brand', () => {
      expect(getBrandDisplayName('br')).toBe('Burton')
      expect(getBrandDisplayName('ms')).toBe('Miss Selfridge')
    })

    it('should return an empty string for an unknown brand', () => {
      expect(getBrandDisplayName('zz')).toBe('')
    })
  })

  describe('envSsaEnableReporting', () => {
    afterEach(() => {
      global.process.env.SSA_ENABLE_REPORTING = SSA_ENABLE_REPORTING
    })

    it('should return true when is SSA_ENABLE_REPORTING is set to boolean true in the environment', () => {
      global.process.env.SSA_ENABLE_REPORTING = true
      expect(envSsaEnableReporting()).toBe(true)
    })

    it("should return true when is SSA_ENABLE_REPORTING is set to the string 'true' in the environment", () => {
      global.process.env.SSA_ENABLE_REPORTING = 'true'
      expect(envSsaEnableReporting()).toBe(true)
    })

    it('should return false otherwise', () => {
      global.process.env.SSA_ENABLE_REPORTING = false
      expect(envSsaEnableReporting()).toBe(false)

      global.process.env.SSA_ENABLE_REPORTING = 'false'
      expect(envSsaEnableReporting()).toBe(false)

      global.process.env.SSA_ENABLE_REPORTING = 'active'
      expect(envSsaEnableReporting()).toBe(false)

      global.process.env.SSA_ENABLE_REPORTING = ''
      expect(envSsaEnableReporting()).toBe(false)

      global.process.env.SSA_ENABLE_REPORTING = undefined
      expect(envSsaEnableReporting()).toBe(false)
    })
  })

  describe('envSsaPoolProperty', () => {
    afterEach(() => {
      global.process.env.SSA_POOL_PROPERTY = SSA_POOL_PROPERTY
    })

    it('should return the value of SSA_POOL_PROPERTY when set as a string in the environment', () => {
      global.process.env.SSA_POOL_PROPERTY = 'arcadia'
      expect(envSsaPoolProperty()).toBe('arcadia')
    })

    it('should return null otherwise', () => {
      global.process.env.SSA_POOL_PROPERTY = ''
      expect(envSsaPoolProperty()).toBe(null)

      global.process.env.SSA_POOL_PROPERTY = false
      expect(envSsaPoolProperty()).toBe(null)

      global.process.env.SSA_POOL_PROPERTY = true
      expect(envSsaPoolProperty()).toBe(null)

      global.process.env.SSA_POOL_PROPERTY = undefined
      expect(envSsaPoolProperty()).toBe(null)
    })
  })
})
