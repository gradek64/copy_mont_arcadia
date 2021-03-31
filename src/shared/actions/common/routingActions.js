import createLocation from 'history/lib/createLocation'
import { splitQuery } from '../../lib/query-helper'

export function updateLocationServer(url, hostname) {
  const baseLocation = createLocation(url)
  const search = baseLocation.search
  return {
    type: 'UPDATE_LOCATION_SERVER',
    location: {
      ...baseLocation,
      hostname,
      protocol: 'https:',
      search,
      query: splitQuery(search),
    },
  }
}

export function urlRedirectServer({ url, permanent = false }) {
  return {
    type: 'URL_REDIRECT_SERVER',
    redirect: {
      url,
      permanent,
    },
  }
}

export function setPageStatusCode(statusCode) {
  return {
    type: 'SET_PAGE_STATUS_CODE',
    statusCode,
  }
}

export function removeFromVisited(index) {
  return {
    type: 'REMOVE_FROM_VISITED',
    index,
  }
}
