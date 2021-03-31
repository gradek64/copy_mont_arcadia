import { getItem } from './cookie/utils'

// waits for newrelic to be available on the window
function getNewRelic(cb) {
  if (!window.NREUM) return // newrelic agent will never be available

  if (window.newrelic) return cb(window.newrelic)
  setTimeout(getNewRelic.bind(null, cb), 10)
}

export default function initNewRelicBrowser(window) {
  getNewRelic((newrelic) => {
    newrelic.setCustomAttribute('requestDomain', window.location.host)

    if (window.screen) {
      if (window.screen.orientation)
        newrelic.setCustomAttribute(
          'screenOrientation',
          window.screen.orientation
        )
      if (window.screen.height)
        newrelic.setCustomAttribute('screenHeight', window.screen.height)
      if (window.screen.width)
        newrelic.setCustomAttribute('screenWidth', window.screen.width)
      if (window.screen.colorDepth)
        newrelic.setCustomAttribute('colorDepth', window.screen.colorDepth)
      if (window.screen.pixelDepth)
        newrelic.setCustomAttribute('pixelDepth', window.screen.pixelDepth)
    }

    const sessionKey = getItem('jsessionid')
    if (sessionKey) newrelic.setCustomAttribute('sessionKey', sessionKey)

    if (window.navigator && window.navigator.connection) {
      const conn = window.navigator.connection
      if (conn.type) newrelic.setCustomAttribute('connection.type', conn.type)
      if (conn.effectiveType)
        newrelic.setCustomAttribute(
          'connection.effectiveType',
          conn.effectiveType
        )
      if (conn.rtt) newrelic.setCustomAttribute('connection.rtt', conn.rtt)
    }
  })
}
