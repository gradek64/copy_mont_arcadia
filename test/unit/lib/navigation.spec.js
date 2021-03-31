import { fromSeoUrlToRedirectionUrl } from '../../../src/shared/lib/navigation'

test('"fromSeoUrlToRedirectionUrl" returns false in case of empty arguments', () => {
  const result = fromSeoUrlToRedirectionUrl('', '')
  expect(result).toBe(false)
})

test('"fromSeoUrlToRedirectionUrl" returns the "url" pathname property in case of "menuLinks" as empty array', () => {
  const result = fromSeoUrlToRedirectionUrl('abc', [])
  expect(result).toBe('abc')
})

test('"fromSeoUrlToRedirectionUrl" returns the "redirectionUrl" value of the menuLink where "seoUrl" equals the "url.pathname" property', () => {
  const result = fromSeoUrlToRedirectionUrl('abc', [
    { seoUrl: 'abc', redirectionUrl: 'ghi' },
  ])
  expect(result).toBe('ghi')
})

test('"fromSeoUrlToRedirectionUrl" returns the "redirectionUrl" value of the first menuLink where "seoUrl" equals the "url.pathname" property', () => {
  const result = fromSeoUrlToRedirectionUrl('abc', [
    { seoUrl: 'abc', redirectionUrl: 'ghi' },
    { seoUrl: 'abc', redirectionUrl: 'lmn' },
  ])
  expect(result).toBe('ghi')
})
