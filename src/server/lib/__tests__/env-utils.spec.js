import {
  getEnvironmentName,
  isProduction,
  isWCSProduction,
  DEFAULT,
  PRODUCTION,
  getBrandedEnvironmentVariable,
  getBrandedEnvironmentVariableByRegion,
} from '../env-utils'

describe('src/server/lib/env-utils', () => {
  let processEnv

  beforeEach(() => {
    processEnv = process.env
  })

  afterEach(() => {
    process.env = processEnv
  })

  describe('getEnvironmentName()', () => {
    it("should return default when ENVIRONMENT_NAME isn't set as a variable", () => {
      delete process.env.ENVIRONMENT_NAME
      const envName = getEnvironmentName()
      expect(envName).toBe(DEFAULT)
    })

    it("should return 'production' if ENVRIONMENT_NAME is set to 'production_coreapi_g'", () => {
      process.env.ENVIRONMENT_NAME = 'production_coreapi_g'
      const envName = getEnvironmentName()
      expect(envName).toBe(PRODUCTION)
    })

    it("should return 'production' if ENVRIONMENT_NAME is set to 'production_coreapi'", () => {
      process.env.ENVIRONMENT_NAME = 'production_coreapi'
      const envName = getEnvironmentName()
      expect(envName).toBe(PRODUCTION)
    })

    it("should return the set ENVIRONMENT_NAME if it doesn't have a mapped value", () => {
      const ACC1 = 'acc1'
      process.env.ENVIRONMENT_NAME = ACC1
      const envName = getEnvironmentName()
      expect(envName).toBe(ACC1)
    })
  })

  describe('isProduction()', () => {
    it("should return true when NODE_ENV is 'production'", () => {
      process.env.NODE_ENV = PRODUCTION
      expect(isProduction()).toBe(true)
    })

    it("should return false when NODE_ENV is not 'production'", () => {
      process.env.NODE_ENV = DEFAULT
      expect(isProduction()).toBe(false)
    })
  })

  describe('isWCSProduction()', () => {
    it("should return true when WCS_ENVIRONMENT is 'production'", () => {
      process.env.WCS_ENVIRONMENT = 'prod'
      expect(isWCSProduction()).toBe(true)
    })

    it("should return false when WCS_ENVIRONMENT is not 'production'", () => {
      process.env.WCS_ENVIRONMENT = 'tst1'
      expect(isWCSProduction()).toBe(false)
    })
  })

  describe('getBrandedEnvironmentVariable()', () => {
    const topshopTestEnv = 'topshoptestenv'
    const generalTestEnv = 'generaltestenv'
    process.env.TEST_ENV_TOPSHOP = topshopTestEnv
    process.env.TEST_ENV = generalTestEnv

    it('should retrieve a branded environment variable if it is defined', () => {
      const args = {
        variable: 'TEST_ENV',
        brandName: 'topshop',
      }
      expect(getBrandedEnvironmentVariable(args)).toBe(topshopTestEnv)
    })

    it('should fall back to the the unbranded environment variable if one exists', () => {
      const args = {
        variable: 'TEST_ENV',
        brandName: 'topman',
      }
      expect(getBrandedEnvironmentVariable(args)).toBe(generalTestEnv)
    })

    it("should return undefined if the environment variable doesn't exist", () => {
      const args = {
        variable: 'DIFF_ENV',
        brandName: 'topshop',
      }
      expect(getBrandedEnvironmentVariable(args)).toBeUndefined()
    })
    it('should throw an error if no brandname is provided', () => {
      const args = {
        variable: 'TEST_ENV',
      }
      let error
      try {
        getBrandedEnvironmentVariable(args)
      } catch (e) {
        error = e
      }
      expect(error.message).toBe('Brandname is required')
    })
  })

  describe('getBrandedEnvironmentVariableByRegion()', () => {
    const topshopUSTestEnv = 'topshopUStestenv'
    const generalTestEnv = 'generaltestenv'
    process.env.TEST_ENV_TOPSHOP_US = topshopUSTestEnv
    process.env.TEST_ENV = generalTestEnv

    it('should retrieve a branded environment variable by region if it is defined', () => {
      const args = {
        variable: 'TEST_ENV',
        brandName: 'topshop',
        region: 'us',
      }
      expect(getBrandedEnvironmentVariableByRegion(args)).toBe(topshopUSTestEnv)
    })

    it('should fall back to the the base environment variable if one exists', () => {
      const args = {
        variable: 'TEST_ENV',
        brandName: 'topman',
        region: 'us',
      }
      expect(getBrandedEnvironmentVariableByRegion(args)).toBe(generalTestEnv)
    })

    it("should return undefined if the environment variable doesn't exist", () => {
      const args = {
        variable: 'DIFF_ENV',
        brandName: 'topshop',
        region: 'us',
      }
      expect(getBrandedEnvironmentVariableByRegion(args)).toBeUndefined()
    })
    it('should throw an error if no brandname is provided', () => {
      const args = {
        variable: 'TEST_ENV',
        region: 'us',
      }
      let error
      try {
        getBrandedEnvironmentVariableByRegion(args)
      } catch (e) {
        error = e
      }
      expect(error.message).toBe('Brandname and Region are required')
    })

    it('should throw an error if no region is provided', () => {
      const args = {
        variable: 'TEST_ENV',
        brandName: 'topshop',
      }
      let error
      try {
        getBrandedEnvironmentVariableByRegion(args)
      } catch (e) {
        error = e
      }
      expect(error.message).toBe('Brandname and Region are required')
    })

    it('should throw an error if no brandname and no region are provided', () => {
      const args = {
        variable: 'TEST_ENV',
      }
      let error
      try {
        getBrandedEnvironmentVariableByRegion(args)
      } catch (e) {
        error = e
      }
      expect(error.message).toBe('Brandname and Region are required')
    })
  })
})
