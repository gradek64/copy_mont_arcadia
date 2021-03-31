import { isIOS } from '../user-agent'

describe('user-agent', () => {
  describe('isIOS', () => {
    describe('On the server', () => {
      it('should throw if called on the server', () => {
        global.process.browser = false

        expect(isIOS).toThrowError()
      })
    })

    describe('In the browser', () => {
      beforeAll(() => {
        global.process.browser = true
      })

      afterAll(() => {
        global.process.browser = false
      })

      let userAgentModule
      let userAgentGetter
      beforeEach(() => {
        // reset to clear any caching
        jest.resetModules()
        Object.defineProperty(window.navigator, 'userAgent', {
          configurable: true,
          get: () => 'user agent string',
        })
        // need to require module on each run due to caching of result
        userAgentModule = require('../user-agent')
        userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get')
      })

      it('should return false for non-iOS user agents', () => {
        userAgentGetter.mockReturnValueOnce('SOME USER AGENT')
        const result = userAgentModule.isIOS()
        expect(result).toBe(false)
      })

      it('should return true if the user agent is iPhone like', () => {
        const iPhoneUserAgent =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
        userAgentGetter.mockReturnValueOnce(iPhoneUserAgent)

        const result = userAgentModule.isIOS()
        expect(result).toBe(true)
      })

      it('should return true if the user agent is iPad like', () => {
        const iPadUserAgent =
          'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
        userAgentGetter.mockReturnValueOnce(iPadUserAgent)

        const result = userAgentModule.isIOS()
        expect(result).toBe(true)
      })

      it('should return true if the user agent is iPod like', () => {
        const iPodUserAgent =
          'Mozilla/5.0 (iPod touch; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B511 Safari/9537.53'
        userAgentGetter.mockReturnValueOnce(iPodUserAgent)

        const result = userAgentModule.isIOS()
        expect(result).toBe(true)
      })

      it('should cache the first result', () => {
        const iPhoneUserAgent =
          'Mozilla/5.0 (iPod touch; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B511 Safari/9537.53'
        userAgentGetter.mockReturnValueOnce(iPhoneUserAgent)

        const iosResult = userAgentModule.isIOS()

        userAgentGetter.mockReturnValueOnce('some other user agent')
        const otherResult = userAgentModule.isIOS()

        expect(iosResult).toBe(otherResult)
      })
    })
  })
})
