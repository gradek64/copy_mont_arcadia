import parser from 'ua-parser-js'
import { path } from 'ramda'
import { deviceTypes } from '../api/requests/constants'

export function deviceTypeFromUserAgent(userAgentHeader) {
  let deviceType = deviceTypes.desktop // NOTE: as parser does not recognise desktop devices
  if (userAgentHeader) {
    const parsedUa = parser(userAgentHeader)
    deviceType = path(['device', 'type'], parsedUa)
      ? parsedUa.device.type
      : deviceType
  }
  return deviceType
}
