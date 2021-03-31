import { heShallowEncode } from './html-entities'
import { uniq } from 'ramda'

function decode(str) {
  try {
    // In node this can possibly throw an error - URIError: Uncaught error: URI malformed
    return decodeURIComponent(str)
  } catch (e) {
    return ''
  }
}

export function splitQuery(search) {
  if (!search) return {}
  const queries = search.split('?')[1]
  return queries
    ? queries.split('&').reduce((prev, curr) => {
        const [key, value] = curr.split('=')
        const decoded = key === 'hash' ? value : decode(value)
        return {
          ...prev,
          [key]: heShallowEncode(decoded.replace(/\+/g, ' ')),
        }
      }, {})
    : {}
}

export function joinQuery(query) {
  const keys = Object.keys(query).filter(
    (key) => typeof key === 'string' && key.trim().length > 0
  )

  return keys.length
    ? `?${keys
        .map(
          (value) =>
            `${encodeURIComponent(value)}=${encodeURIComponent(query[value])}`
        )
        .join('&')}`
    : ''
}

export function removeQuery(url) {
  return url && url.includes('?') ? url.split('?')[0] : url
}

const DOMAIN_REGEX = /([\w|.]+)\//
export function replaceDomain(url, replacement) {
  const matches = url && url.match(DOMAIN_REGEX)
  return matches && matches.length > 1
    ? url.replace(matches[1], replacement)
    : url
}

export function sanitiseRefinement(refinement) {
  // only include strings or numbers
  return (
    Array.isArray(refinement) &&
    refinement.filter((item) => {
      return typeof item === 'string' || typeof item === 'number'
    })
  )
}

// encodes an object into a URI safe string (example: { colour: ['black', 'blue'], size: ['8'] } becomes 'colour:black,colour:blue,size:8' )
export const keyValueEncodeURI = (keyValueObject) => {
  if (typeof keyValueObject !== 'object' || keyValueObject === null)
    return undefined
  if (typeof keyValueObject !== 'object' || keyValueObject === null) return ''

  return Object.keys(keyValueObject)
    .map((key) => {
      return uniq(keyValueObject[key]).map((value) => {
        return `${encodeURIComponent(key)}:${encodeURIComponent(value)}`
      })
    })
    .join(',')
}

// decodes a URI safe string initially created by keyValueEncodeURI() (example: 'colour:black,colour:blue,size:8' becomes { colour: ['black', 'blue'], size: ['8'] } )
export const keyValueDecodeURI = (keyValueEncodedURIString) => {
  if (typeof keyValueEncodedURIString !== 'string') return {}

  const keyValueDecoded = keyValueEncodedURIString // example: 'colour:black,colour:blue,size:8' >> starting example value of `keyValueEncodedURIString`
    .split(',') // example: ['colour:black', 'colour:blue', 'size:8']
    .reduce((acc, curr) => {
      const key = decode(curr.split(':')[0]) // example: 'colour'
      const value = decode(curr.split(':')[1]) // example: 'black'
      if (acc[key]) {
        acc[key].push(value) // if array exists, just push onto array
      } else {
        acc[key] = [value] // else create array with an initial value
      }
      return acc
    }, {})

  const sanitised = Object.keys(keyValueDecoded).reduce((result, key) => {
    const refinement = sanitiseRefinement(keyValueDecoded[key])
    return refinement && refinement.length
      ? { ...result, [key]: refinement }
      : result
  }, {})

  // Special rule for price - gotta have two
  if (sanitised.price && sanitised.price.length < 2) {
    delete sanitised.price
  }
  return sanitised // example: { colour: ['black', 'blue'], size: ['8'] }
}
