import {
  getCookies,
  createGetSession,
  isAuthenticated,
  createGetCookieFromStore,
  doNotGenerateSession,
} from '../sessionUtils'

jest.mock('@ag-digital/pantry', () => jest.fn())
import WcsCookieCaptureMock from '../../../__mocks__/cookie-capture.mock'
import pantry from '@ag-digital/pantry'
import { userAgentsNoSession } from '../../../requests/constants'

describe('sessionUtils', () => {
  describe('#getCookies', () => {
    it('should return null if the object passed does not contain cookies', async () => {
      await expect(getCookies({})).resolves.toBe(null)
    })

    it('should return null if the cookies in the object passed are not an array', async () => {
      await expect(getCookies({ cookies: {} })).resolves.toBe(null)
    })

    it('should return a resolved promise with a cookies array when passed a session object that contains it', async () => {
      await expect(getCookies({ cookies: ['foo=bar'] })).resolves.toEqual([
        'foo=bar',
      ])
    })
  })

  describe('#getSession', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('With No Cookies on the request', () => {
      const cookieCapture = new WcsCookieCaptureMock({
        hasWcsCookies: jest.fn(() => false),
      })
      const getSession = createGetSession(cookieCapture)

      it('should return a rejected promise if it is unable to extract the jessionid', async () => {
        await expect(getSession()).rejects.toBe('No jsessionid')
      })

      it('should use the pantry library to return a resolved promise containing a session', async () => {
        global.process.env.REDIS_HOST_FOR_SESSION_STORE = 'host'
        global.process.env.REDIS_PORT_FOR_SESSION_STORE = 'port'

        const retrieveSessionMock = jest.fn(() => Promise.resolve('session'))
        pantry.mockReturnValue({ retrieveSession: retrieveSessionMock })

        await expect(
          getSession(
            'cookieIWant=hereItIs; iDoNotWantThis=one; jsessionid=jsessionid'
          )
        ).resolves.toBe('session')
        expect(pantry).toHaveBeenCalledTimes(1)
        expect(pantry).toHaveBeenCalledWith({ host: 'host', port: 'port' })
        expect(retrieveSessionMock).toHaveBeenCalledTimes(1)
        expect(retrieveSessionMock).toHaveBeenCalledWith('jsessionid')
      })
    })

    describe('With WCS Cookies on the request', () => {
      const cookieCapture = new WcsCookieCaptureMock({
        hasWcsCookies: jest.fn(() => true),
      })
      const getSession = createGetSession(cookieCapture)

      it("shouldn't retrieve session from pantry when cookieCapture has wcs cookies present", async () => {
        global.process.env.REDIS_HOST_FOR_SESSION_STORE = 'host'
        global.process.env.REDIS_PORT_FOR_SESSION_STORE = 'port'

        const retrieveSessionMock = jest.fn(() => Promise.resolve('session'))
        const pantryRtnObject = { retrieveSession: retrieveSessionMock }
        pantry.mockReturnValue(pantryRtnObject)

        await expect(
          getSession(
            'cookieIWant=hereItIs; iDoNotWantThis=one; jsessionid=jsessionid'
          )
        ).toBe(pantryRtnObject)
        expect(pantry).toHaveBeenCalledTimes(1)
        expect(pantry).toHaveBeenCalledWith({ host: 'host', port: 'port' })
        expect(retrieveSessionMock).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('#getCookieFromStore', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('With NO WCS cookies from client', () => {
      const cookieCapture = new WcsCookieCaptureMock({
        hasWcsCookies: jest.fn(() => false),
      })
      const getCookieFromStore = createGetCookieFromStore(cookieCapture)

      it('returns false if no arguments provided', async () => {
        await expect(getCookieFromStore()).resolves.toBe(null)
      })
      it('returns null if the cookie cannot be found', async () => {
        global.process.env.REDIS_HOST_FOR_SESSION_STORE = 'host'
        global.process.env.REDIS_PORT_FOR_SESSION_STORE = 'port'
        const retrieveSessionMock = jest.fn(() =>
          Promise.resolve({
            cookies: ['cookieA=a', 'cookieSomething=cookieValue'],
          })
        )
        pantry.mockReturnValue({ retrieveSession: retrieveSessionMock })
        await expect(
          getCookieFromStore('cookieName', 'jsessionid=a;')
        ).resolves.toBe(null)
      })
      it('returns the value of the cookie searched', async () => {
        global.process.env.REDIS_HOST_FOR_SESSION_STORE = 'host'
        global.process.env.REDIS_PORT_FOR_SESSION_STORE = 'port'
        const retrieveSessionMock = jest.fn(() =>
          Promise.resolve({ cookies: ['cookieA=a', 'cookieName=cookieValue'] })
        )
        pantry.mockReturnValue({ retrieveSession: retrieveSessionMock })
        await expect(
          getCookieFromStore(
            'cookieName',
            'cookieIWant=hereItIs; iDoNotWantThis=one; jsessionid=a'
          )
        ).resolves.toBe('cookieValue')
      })
    })

    describe('With WCS cookies from client', () => {
      const cookieCapture = new WcsCookieCaptureMock({
        hasWcsCookies: jest.fn(() => true),
        readForServer: jest.fn(() => ['cookieA=a', 'wcsCookie=cookieValue']),
      })
      const getCookieFromStore = createGetCookieFromStore(cookieCapture)

      it('returns client captured cookies when cookieCapture has captured wcs cookies and has named cookie', async () => {
        global.process.env.REDIS_HOST_FOR_SESSION_STORE = 'host'
        global.process.env.REDIS_PORT_FOR_SESSION_STORE = 'port'
        pantry.mockReturnValue(Promise.resolve())
        await expect(
          getCookieFromStore(
            'wcsCookie',
            'cookieIWant=hereItIs; iDoNotWantThis=one; jsessionid=a'
          )
        ).resolves.toBe('cookieValue')
      })

      it('returns null if cookieName not present in cookie capture coookies', async () => {
        global.process.env.REDIS_HOST_FOR_SESSION_STORE = 'host'
        global.process.env.REDIS_PORT_FOR_SESSION_STORE = 'port'
        pantry.mockReturnValue(Promise.resolve(null))
        await expect(
          getCookieFromStore('cookieName', 'jsessionid=a;')
        ).resolves.toBe(null)
      })
    })
  })

  describe('#doNotGenerateSession', () => {
    describe('Ensure equivalent identification as the userAgentsNoSession list', () => {
      const testUserAgentSession = (userAgent) =>
        it(`Following useragent should return true: ${userAgent}`, () => {
          expect(
            doNotGenerateSession({
              userAgentCallingApi: userAgent,
            })
          ).toBe(true)
        })

      userAgentsNoSession.forEach(testUserAgentSession)
    })

    it("should return false if provided values for userAgentCallingSsr and userAgentCallingApi aren't listed in userAgentNoSession", () => {
      expect(
        doNotGenerateSession({
          userAgentCallingSsr: 'random',
          userAgentCallingApi: 'string',
        })
      ).toBe(false)
    })

    describe('Exclusions', () => {
      it('should return false for Headless Chrome user agent', () => {
        const headlessChrome =
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/84.0.4147.105 Safari/537.36'
        expect(
          doNotGenerateSession({
            userAgentCallingApi: headlessChrome,
          })
        ).toBe(false)
        expect(
          doNotGenerateSession({
            userAgentCallingSsr: headlessChrome,
          })
        ).toBe(false)
      })
      describe("shouldn't identify node-superagent as a bot", () => {
        it('should return false for current node-superagent/3.7.0', () => {
          expect(
            doNotGenerateSession({
              userAgentCallingApi: 'node-superagent/3.7.0',
            })
          ).toBe(false)
        })
        it('should return false for future versions e.g. node-superagent/4.7.0', () => {
          expect(
            doNotGenerateSession({
              userAgentCallingApi: 'node-superagent/4.7.0',
            })
          ).toBe(false)
        })
      })
    })
  })

  describe('isAuthenticated', () => {
    it('should return false if the argument passed is not a string containing cookies', () => {
      expect(isAuthenticated()).toBe(false)
      expect(isAuthenticated([])).toBe(false)
    })

    it('should return false if there is no "authenticated" cookie', () => {
      expect(isAuthenticated('foo=bar;')).toBe(false)
    })

    it('should return true if there is an "authenticated" cookie with value "yes"', () => {
      expect(isAuthenticated('authenticated=yes;')).toBe(true)
    })
  })
})
