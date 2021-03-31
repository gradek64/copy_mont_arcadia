import { DAY_IN_MS } from '../../../shared/constants/time'

export const removeItem = (key, path = '/') => {
  if (!process.browser) return null
  window.document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=${path}`
}

export const getItem = (key) => {
  if (!process.browser) return null
  const cookie = ` ${window.document.cookie}`
  const regex = new RegExp(` ${key}=([^;]*[^;])`)
  const matches = cookie.match(regex)
  return (matches && matches.length && matches[1]) || undefined
}

function parseOptionsToString(options = {}) {
  const optionsToParse = { ...options }

  if (!options.path) {
    optionsToParse.path = '/'
  }

  if (options.expires) {
    const date = new Date()
    const now = date.getTime()

    date.setTime(now + options.expires)

    optionsToParse.expires = date.toGMTString()
  }

  const parsedOptionsString = Object.keys(optionsToParse)
    .map((key) => `${key}=${optionsToParse[key]}`)
    .join(';')

  return `;${parsedOptionsString}`
}

/**
 * @param  {String} key
 * @param  {String} value
 * @param  {Object} options
 * @property {String} options.path
 * @property {Number} options.expires Time to expire in milliseconds
 * @return {undefined}
 */
export const setItemWithOptions = (key, value, options) => {
  if (!process.browser) return null

  const parsedOptionsString = parseOptionsToString(options)

  window.document.cookie = `${key}=${value}${parsedOptionsString}`
}

export const setItem = (key, value, day) => {
  if (!process.browser) return null

  if (day) {
    return setItemWithOptions(key, value, {
      expires: day * DAY_IN_MS,
    })
  }

  return setItemWithOptions(key, value)
}

export const hasItem = (key) => (process.browser ? !!getItem(key) : null)
