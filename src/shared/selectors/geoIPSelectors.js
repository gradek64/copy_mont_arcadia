const rootGeoIPSelector = (state) => state.geoIP || {}

export const getGeoIPUserISOPreference = (state) => {
  const { userISOPreference } = rootGeoIPSelector(state)

  return userISOPreference
}

export const getGeoIPUserRegionPreference = (state) => {
  const { userRegionPreference } = rootGeoIPSelector(state)

  return userRegionPreference
}

export const getGeoIPUserLanguagePreference = (state) => {
  const { userLanguagePreference } = rootGeoIPSelector(state)

  return userLanguagePreference
}

export const getGeoIPGeoISO = (state) => {
  const { geoISO } = rootGeoIPSelector(state)

  return geoISO
}
