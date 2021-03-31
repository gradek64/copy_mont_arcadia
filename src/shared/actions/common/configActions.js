export const setConfig = (config) => {
  return {
    type: 'SET_CONFIG',
    config,
  }
}

export const setBrandHostnames = (langHostnames) => {
  return {
    type: 'SET_BRAND_HOSTNAMES',
    langHostnames,
  }
}

export const setThirdPartySiteUrls = (thirdPartySiteUrls) => {
  return {
    type: 'SET_THIRD_PARTY_SITE_URLS',
    thirdPartySiteUrls,
  }
}

export const isDayLightSavingTime = (isDaylightSavingTime) => {
  return {
    type: 'IS_DAYLIGHT_SAVING_TIME',
    isDaylightSavingTime,
  }
}

export const setAssets = (assets) => {
  return {
    type: 'SET_ASSETS',
    assets,
  }
}

export const setEnvCookieMessage = (envCookieMessage) => {
  return {
    type: 'SET_ENV_COOKIE_MESSAGE',
    envCookieMessage,
  }
}
