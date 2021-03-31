import testReducer from '../configReducer'

describe('Config Reducer', () => {
  describe('SET_CONFIG', () => {
    it('should set config', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_CONFIG',
            config: {
              analyticsId: 'arcadiatsmobile',
              brandCode: 'ts',
              region: 'uk',
            },
          }
        )
      ).toEqual({
        analyticsId: 'arcadiatsmobile',
        brandCode: 'ts',
        region: 'uk',
      })
    })
  })
  describe('SET_BRAND_HOSTNAMES', () => {
    it('should set brand hostnames', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_BRAND_HOSTNAMES',
            langHostnames: {
              hostname: 'm.topshop.com',
              defaultLanguage: 'English',
            },
          }
        )
      ).toEqual({
        langHostnames: {
          hostname: 'm.topshop.com',
          defaultLanguage: 'English',
        },
      })
    })
  })
  describe('SET_THIRD_PARTY_SITE_URLS', () => {
    it('should set third party urls', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_THIRD_PARTY_SITE_URLS',
            thirdPartySiteUrls: {
              Singapore: 'sg.topshop.com',
            },
          }
        )
      ).toEqual({
        thirdPartySiteUrls: {
          Singapore: 'sg.topshop.com',
        },
      })
    })
  })
  describe('IS_DAYLIGHT_SAVING_TIME', () => {
    it('should set isDaylightSavingTime', () => {
      expect(
        testReducer(
          {},
          {
            type: 'IS_DAYLIGHT_SAVING_TIME',
            isDaylightSavingTime: true,
          }
        )
      ).toEqual({
        isDaylightSavingTime: true,
      })
    })
  })
  describe('SET_ASSETS', () => {
    it('should set assets', () => {
      const fakeAssets = { js: { 'common/bundle': 'assets/common/bundle.js' } }
      expect(
        testReducer(
          {},
          {
            type: 'SET_ASSETS',
            assets: fakeAssets,
          }
        )
      ).toEqual({
        assets: fakeAssets,
      })
    })
  })

  describe('SET_ENV_COOKIE_MESSAGE', () => {
    it('should set envCookieMessage', () => {
      const envCookieMessage = true
      expect(
        testReducer(
          {},
          {
            type: 'SET_ENV_COOKIE_MESSAGE',
            envCookieMessage,
          }
        )
      ).toEqual({
        envCookieMessage,
      })
    })
  })
})
