import nock from 'nock'
import {
  getGoogleTagManagerEnvOptions,
  constructGoogleTagManagerEnvParams,
  getGoogleTagManagerQueryParams,
  getGoogleTagManagerId,
  validateGoogleRecaptchaToken,
} from '../google-utils'
import { PRODUCTION } from '../env-utils'

const defaultOptions = {
  preview: 'env-2',
  auth: 'KjqKsMcjQCyHKsiapFIgRg',
  cookiesWin: 'x',
}
const production = {
  preview: 'env-2',
  auth: 'KjqKsMcjQCyHKsiapFIgRg',
  cookiesWin: 'x',
}
const acc1 = {
  preview: 'env-646',
  auth: 'T_TpLY-CjlBTqbLyPEtkrw',
  cookiesWin: 'x',
}

describe('/server/lib: google-utils', () => {
  let processEnv

  beforeEach(() => {
    processEnv = process.env
    nock.cleanAll()
  })

  afterEach(() => {
    process.env = processEnv
  })

  describe('getGoogleTagManagerEnvOptions()', () => {
    it('should throw error when no env, production or default is provided', () => {
      let error
      try {
        getGoogleTagManagerEnvOptions({}, PRODUCTION)
      } catch (e) {
        error = e
      }
      expect(error.message).toBe(
        'Missing default GTM Environment settings from site config'
      )
    })
    it('should return acc1 object when acc1 env is passed and is provided in gtmOptions', () => {
      expect(getGoogleTagManagerEnvOptions({ acc1 }, 'acc1')).toBe(acc1)
    })
    it('should return production when isProduction is true and production config provided in gtmOptions', () => {
      expect(getGoogleTagManagerEnvOptions({ production }, PRODUCTION)).toBe(
        production
      )
    })
    it('should return default if no env provided and isProduction is false', () => {
      process.env.NODE_ENV = 'test'
      expect(getGoogleTagManagerEnvOptions({ default: defaultOptions })).toBe(
        defaultOptions
      )
    })
    it("should return default if isProduction is true but production config isn't defined in gtmOptions", () => {
      expect(
        getGoogleTagManagerEnvOptions({ default: defaultOptions }, PRODUCTION)
      ).toBe(defaultOptions)
    })
    it("should return default if an env is selected but isn't defined in gtmOptions", () => {
      expect(
        getGoogleTagManagerEnvOptions({ default: defaultOptions }, 'acc1')
      ).toBe(defaultOptions)
    })
  })
  describe('constuctGoogleTagManagerEnvParams()', () => {
    it("should return an empty string if envOptions aren't provided", () => {
      expect(constructGoogleTagManagerEnvParams()).toBe('')
    })
    it('should return empty string if envOptions is missing any required properties (auth, preview and cookiesWin)', () => {
      // all are missing
      expect(constructGoogleTagManagerEnvParams({})).toBe('')
      // cookiesWin is missing
      expect(
        constructGoogleTagManagerEnvParams({ auth: '1', preview: '2' })
      ).toBe('')
      // preview is missing
      expect(
        constructGoogleTagManagerEnvParams({ auth: '1', cookiesWin: '2' })
      ).toBe('')
      // auth is missing
      expect(
        constructGoogleTagManagerEnvParams({ preview: '1', cookiesWin: '2' })
      ).toBe('')
    })
    it('should return expected query string when all required properties are provided in envOptions', () => {
      const auth = 'auth'
      const preview = 'preview'
      const cookiesWin = 'cookiesWin'
      const envOptions = { auth, preview, cookiesWin }
      const expectedQueryString = `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=${cookiesWin}`
      expect(constructGoogleTagManagerEnvParams(envOptions)).toBe(
        expectedQueryString
      )
    })
  })
  describe('getGoogleTagManagerQueryParams', () => {
    it('should construct query params from acc1 defined variables when ENVIRONMENT_NAME set to acc1', () => {
      process.env.NODE_ENV = PRODUCTION
      process.env.ENVIRONMENT_NAME = 'acc1'
      const googleTagManager = {
        environment: { acc1, production, default: defaultOptions },
      }
      const { auth, preview, cookiesWin } = acc1
      const expectedQueryParams = `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=${cookiesWin}`
      expect(getGoogleTagManagerQueryParams(googleTagManager)).toBe(
        expectedQueryParams
      )
    })
    it("should construct query params from production config when ENVRIONMENT_NAME isn't in gtmOptions and NODE_ENV is production", () => {
      process.env.NODE_ENV = PRODUCTION
      process.env.ENVIRONMENT_NAME = 'random'
      const googleTagManager = {
        environment: { acc1, production, default: defaultOptions },
      }
      const { auth, preview, cookiesWin } = production
      const expectedQueryParams = `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=${cookiesWin}`
      expect(getGoogleTagManagerQueryParams(googleTagManager)).toBe(
        expectedQueryParams
      )
    })
    it('should construct query params from production config when ENVRIONMENT_NAME is set to a production mapped value', () => {
      process.env.NODE_ENV = 'test'
      process.env.ENVIRONMENT_NAME = 'production_coreapi_g'
      const googleTagManager = {
        environment: { acc1, production, default: defaultOptions },
      }
      const { auth, preview, cookiesWin } = production
      const expectedQueryParams = `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=${cookiesWin}`
      expect(getGoogleTagManagerQueryParams(googleTagManager)).toBe(
        expectedQueryParams
      )
    })
    it("should construct query params from default config when not production and ENVIRONMENT_NAME isn't in gtmOptions", () => {
      process.env.NODE_ENV = 'test'
      process.env.ENVIRONMENT_NAME = 'random'
      const googleTagManager = {
        environment: { acc1, production, default: defaultOptions },
      }
      const { auth, preview, cookiesWin } = defaultOptions
      const expectedQueryParams = `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=${cookiesWin}`
      expect(getGoogleTagManagerQueryParams(googleTagManager)).toBe(
        expectedQueryParams
      )
    })
  })

  describe('getGoogleTagManagerId', () => {
    const configId = 'config-id'
    const config = {
      googleTagManager: {
        id: configId,
      },
    }
    it('should return the id from the set google tag manager override', () => {
      const override = 'env-override-id'
      process.env.GOOGLE_TAG_MANAGER_OVERRIDE = override
      expect(getGoogleTagManagerId(config)).toBe(override)
    })
    it('should return the id defined in the config if no override present', () => {
      delete process.env.GOOGLE_TAG_MANAGER_OVERRIDE
      expect(getGoogleTagManagerId(config)).toBe(configId)
    })
  })

  describe('validateGoogleRecaptchaToken', () => {
    it('should return a response without `error-codes` if success property is true', async () => {
      const responseMock = {
        success: true,
        challenge_ts: '2020-06-26T09:13:34.488Z',
        hostname: 'www.topshop.com',
      }
      const nockScope = nock('https://www.google.com/recaptcha')
        .post('/api/siteverify')
        .reply(200, responseMock)

      return validateGoogleRecaptchaToken('topshop', 'token').then((res) => {
        expect(nockScope.isDone()).toBe(true)
        expect(res).toEqual(responseMock)
      })
    })

    it('should return a response with `error-codes` if success property is false', async () => {
      const responseMock = {
        success: false,
        challenge_ts: '2020-06-26T09:13:34.488Z',
        hostname: 'www.topshop.com',
        'error-codes': ['missing-input-secret'],
        errorMessage: 'Recaptcha Errors: missing-input-secret',
      }
      const nockScope = nock('https://www.google.com/recaptcha')
        .post('/api/siteverify')
        .reply(200, responseMock)

      return validateGoogleRecaptchaToken('topshop', 'token').then((res) => {
        expect(nockScope.isDone()).toBe(true)
        expect(res).toEqual(responseMock)
      })
    })

    it('should return error if request fails', async () => {
      const nockScope = nock('https://www.google.com/recaptcha')
        .post('/api/siteverify')
        .reply(400, {})

      return validateGoogleRecaptchaToken('topshop', 'token').catch((error) => {
        expect(nockScope.isDone()).toBe(true)
        expect(error.message).toEqual('Bad Request')
      })
    })
  })
})
