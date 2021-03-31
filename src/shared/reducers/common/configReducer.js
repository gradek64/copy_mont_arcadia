import createReducer from '../../lib/create-reducer'

// See server/config/index.js for initial state. Action should only get called in server side renderer.
// Treat config as read only
export default createReducer(
  {},
  {
    SET_CONFIG: (state, { config }) => config,
    SET_BRAND_HOSTNAMES: (state, { langHostnames }) => ({
      ...state,
      langHostnames,
    }),
    SET_THIRD_PARTY_SITE_URLS: (state, { thirdPartySiteUrls }) => ({
      ...state,
      thirdPartySiteUrls,
    }),
    IS_DAYLIGHT_SAVING_TIME: (state, { isDaylightSavingTime }) => ({
      ...state,
      isDaylightSavingTime,
    }),
    SET_ASSETS: (state, { assets }) => ({ ...state, assets }),
    SET_ENV_COOKIE_MESSAGE: (state, { envCookieMessage }) => ({
      ...state,
      envCookieMessage,
    }),
  }
)
