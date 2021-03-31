import * as actions from '../configActions'

describe('Config Actions', () => {
  it('setConfig(config)', () => {
    const config = {
      analyticsId: 'arcadiatsmobile',
      brandCode: 'ts',
      region: 'uk',
    }
    expect(actions.setConfig(config)).toEqual({
      type: 'SET_CONFIG',
      config,
    })
  })
  it('setBrandHostnames(langHostnames)', () => {
    const langHostnames = {
      hostname: 'm.topshop.com',
      defaultLanguage: 'English',
    }
    expect(actions.setBrandHostnames(langHostnames)).toEqual({
      type: 'SET_BRAND_HOSTNAMES',
      langHostnames,
    })
  })
  it('setThirdPartySiteUrls(thirdPartySiteUrls)', () => {
    const thirdPartySiteUrls = {
      Singapore: 'sg.topshop.com',
    }
    expect(actions.setThirdPartySiteUrls(thirdPartySiteUrls)).toEqual({
      type: 'SET_THIRD_PARTY_SITE_URLS',
      thirdPartySiteUrls,
    })
  })
  it('isDayLightSavingTime(isDaylightSavingTime)', () => {
    expect(actions.isDayLightSavingTime(true)).toEqual({
      type: 'IS_DAYLIGHT_SAVING_TIME',
      isDaylightSavingTime: true,
    })
  })
  it('setAssets(assets)', () => {
    const assets = { js: { 'common/bundle': 'assets/common/bundle.js' } }
    expect(actions.setAssets(assets)).toEqual({
      type: 'SET_ASSETS',
      assets,
    })
  })

  it('setEnvCookieMessage(envCookieMessage)', () => {
    const envCookieMessage = true
    expect(actions.setEnvCookieMessage(envCookieMessage)).toEqual({
      type: 'SET_ENV_COOKIE_MESSAGE',
      envCookieMessage,
    })
  })
})
