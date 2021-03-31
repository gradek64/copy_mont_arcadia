import geoIPReducer from '../geoIPReducer'
import * as geoIPActions from '../../../actions/common/geoIPActions'

describe('geoIPReducer', () => {
  it('defaultState is correct', () => {
    expect(geoIPReducer(undefined, { type: 'hello' })).toEqual({
      redirectURL: '',
      hostname: '',
      geoISO: '',
      storedGeoPreference: '',
      userISOPreference: '',
      userRegionPreference: '',
      userLanguagePreference: '',
    })
  })

  it('returns the state', () => {
    const state = { redirectURL: 'http://foo.com', userGeoPreference: 'US' }
    expect(geoIPReducer(state, { type: 'FOO' })).toBe(state)
  })

  it('sets the redirect url', () => {
    const newRedirectUrl = 'http://newredirect.url'
    const defaultState = geoIPReducer(undefined, { type: 'hello' })
    expect(
      geoIPReducer(defaultState, {
        type: 'SET_GEOIP_REDIRECT_URL',
        redirectURL: newRedirectUrl,
      })
    ).toEqual({ ...defaultState, redirectURL: newRedirectUrl })
    expect(
      geoIPReducer(
        defaultState,
        geoIPActions.setGeoIPRedirectInfo(newRedirectUrl)
      )
    ).toEqual({ ...defaultState, redirectURL: newRedirectUrl })
  })

  it('sets the request data', () => {
    const defaultState = geoIPReducer(undefined, { type: 'hello' })
    expect(
      geoIPReducer(
        defaultState,
        geoIPActions.setGeoIPRequestData({
          hostname: 'foo',
          geoISO: 'bar',
          storedGeoPreference: 'baz',
          userISOPreference: 'qux',
          userRegionPreference: 'quux',
          userLanguagePreference: 'quuz',
        })
      )
    ).toEqual({
      ...defaultState,
      hostname: 'foo',
      geoISO: 'bar',
      storedGeoPreference: 'baz',
      userISOPreference: 'qux',
      userRegionPreference: 'quux',
      userLanguagePreference: 'quuz',
    })
  })

  it('sets the request data with bad stuff', () => {
    const defaultState = geoIPReducer(undefined, { type: 'hello' })
    expect(
      geoIPReducer(
        defaultState,
        geoIPActions.setGeoIPRequestData({
          hostname: 'foo',
          geoISO: undefined,
          storedGeoPreference: undefined,
          geoLang: undefined,
          geoRegion: undefined,
        })
      )
    ).toEqual({
      ...defaultState,
      hostname: 'foo',
      geoISO: '',
      storedGeoPreference: '',
    })
  })
})
