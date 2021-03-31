// remove the domain, if applicable
export const getRouteFromUrl = (url = '') => {
  const urlMatch = url.match(/^(?:.*\/\/[^/]+)?(\/.*)/, '')
  return urlMatch ? urlMatch[1] : null
}

export const removeQueryFromPathname = (url = '') => {
  return url.split('?')[0]
}

export function getProductRouteFromId(pathname, id, localise) {
  const productWord = localise('product')
  const currentPathRegex = new RegExp(
    // eslint-disable-next-line no-useless-escape
    `^\/[\\d\\w\\s]+\/[\\d\\w\\s]+\/(?=(${productWord}))`,
    'g'
  )
  const urlMatch = pathname && id && pathname.match(currentPathRegex)

  return urlMatch && urlMatch.length
    ? `${urlMatch[0]}${productWord}/${id}`
    : null
}

export function getProductRouteFromParams(...args) {
  return `/${args.join('/')}`
}
