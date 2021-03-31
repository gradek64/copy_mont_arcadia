import { isApps } from '../headerUtils'

describe('headerUtils', () => {
  it('returns true for monty apps', () => {
    expect(isApps({ 'monty-client-device-type': 'apps' })).toBe(true)
  })

  it('returns false for other monty device types', () => {
    expect(isApps({ 'monty-client-device-type': 'desktop' })).toBe(false)
  })
})
