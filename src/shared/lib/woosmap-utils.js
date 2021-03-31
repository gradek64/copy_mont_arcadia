import superagent from 'superagent'

const preferredISOsToCountryString = (preferredISOs) =>
  preferredISOs.map((country) => `country:${country}`).join('|')

export const woosmapFetch = (preferredISOs, searchTerm) => {
  const countries = preferredISOsToCountryString(preferredISOs)
  const url = `https://api.woosmap.com/localities/autocomplete/?components=${countries}&input=${searchTerm}&key=${
    window.WOOSMAP_API_KEY
  }`

  return superagent('GET', url)
    .then((res) => {
      return res.body.localities.map((p) => ({
        key: p.public_id,
        description: p.description,
        location: {
          lat: p.location.lat,
          long: p.location.lng,
        },
      }))
    })
    .catch((err) => {
      if (window.NREUM && window.NREUM.noticeError)
        window.NREUM.noticeError(err, { extraDetail: 'woosmap-error' })
      throw err
    })
}
