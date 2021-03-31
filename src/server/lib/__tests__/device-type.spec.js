import { deviceTypeFromUserAgent } from '../device-type'
import parser from 'ua-parser-js'

jest.mock('ua-parser-js')

describe('#deviceTypeFromUserAgent', () => {
  it('returns "desktop" by default if no user agent argument provided', () => {
    expect(parser).not.toHaveBeenCalled()
    expect(deviceTypeFromUserAgent()).toEqual('desktop')
  })
  it('returns "desktop" if the device type is not deduceable from the user agent', () => {
    parser.mockImplementation(() => undefined)
    expect(deviceTypeFromUserAgent('fake user agent')).toEqual('desktop')
  })
  it('returns the device type sniffed from the user agent', () => {
    parser.mockImplementation(() => ({
      device: { type: 'sniffedDeviceType' },
    }))
    expect(deviceTypeFromUserAgent('whatever')).toEqual('sniffedDeviceType')
  })
})
