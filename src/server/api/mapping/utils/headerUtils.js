import { path } from 'ramda'

function isApps(headers = {}) {
  const deviceTypeHeader = path(['monty-client-device-type'], headers)
  return deviceTypeHeader === 'apps'
}

export { isApps }
