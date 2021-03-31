import { getSiteConfig } from '../../../src/server/config'

test('function should return config for m.topshop.com', () => {
  const hostname = 'm.topshop.com'
  expect(getSiteConfig(hostname).brandName).toBe('topshop')
  expect(getSiteConfig(hostname).storeCode).toBe('tsuk')
  expect(getSiteConfig(hostname).region).toBe('uk')
})

test('function should return config for m.fr.topshop.com', () => {
  const hostname = 'm.fr.topshop.com'
  expect(getSiteConfig(hostname).brandName).toBe('topshop')
  expect(getSiteConfig(hostname).storeCode).toBe('tsfr')
  expect(getSiteConfig(hostname).region).toBe('fr')
})
