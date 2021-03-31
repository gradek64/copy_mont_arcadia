import { pathOr } from 'ramda'
import { getItem } from '../../../client/lib/cookie/utils'

let dataLayer

if (process.browser) {
  dataLayer = require('../../analytics/dataLayer').default
} else {
  dataLayer = {
    push: (event) => event,
  }
}

// @NOTE To be deleted. Initial GA implementation, Gary confirms we can get rid of all GAEvent records
const sendEvent = (eventCategory, eventAction, eventLabel, eventValue) => {
  return (dispatch, getState) => {
    if (process.browser) {
      const state = getState()
      const buildVersion = pathOr('', ['debug', 'buildInfo', 'tag'], state)
      const storeCode = pathOr('', ['config', 'storeCode'], state)
      const source = getItem('source') || ''
      const traceId = getItem('traceId2') || ''

      const event = {
        eventCategory,
        eventAction: `${eventAction}`,
        eventLabel,
        eventValue,
        custom: {
          buildVersion,
          brandCode: storeCode,
          source,
          traceId,
        },
      }

      dataLayer.push(event, null, 'GAEvent')
      dispatch({
        type: 'GOOGLE_ANALYTICS_SEND_EVENT',
        event,
      })
    }
  }
}

export { sendEvent }
