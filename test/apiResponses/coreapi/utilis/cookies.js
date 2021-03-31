import { parseCookieString } from '../../../../src/server/api/requests/utils'

const getCookiesFromResponse = (response) => {
  return (response && response.header && response.header['set-cookie']) || []
}

export const processClientCookies = () => {
  let oldCookies = []

  const mergeCookies = (response) => {
    const newCookies = getCookiesFromResponse(response)
    const cookies = []
    const newCookieNames = []

    // parse newCookies
    for (let i = 0; i < newCookies.length; i++) {
      const { name, value } = parseCookieString(newCookies[i])
      newCookieNames.push(name)
      cookies.push(`${name}=${value}`)
    }

    // check old cookies for any that aren't already in request
    for (let i = 0; i < oldCookies.length; i++) {
      const { name, value } = parseCookieString(oldCookies[i])
      if (!newCookieNames.includes(name)) {
        cookies.push(`${name}=${value}`)
      }
    }

    oldCookies = [...cookies]
    return cookies
  }

  return {
    mergeCookies,
  }
}
