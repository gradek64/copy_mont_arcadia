import {
  findCmsFeaturePagePrefixIn,
  resizeIframe,
  getRedirectPage,
} from '../../../src/shared/lib/cmslib'
import * as cmsFormContent from '../../mocks/cms-form-content.json'

test('#findCmsFeaturePagePrefixIn returns undefined for undefined argument', () => {
  expect(findCmsFeaturePagePrefixIn()).toBe(undefined)
})

test('#findCmsFeaturePagePrefixIn returns undefined for argument as integer', () => {
  expect(findCmsFeaturePagePrefixIn(1)).toBe(undefined)
})

test('#findCmsFeaturePagePrefixIn returns undefined for argument as empty string', () => {
  expect(findCmsFeaturePagePrefixIn('')).toBe(undefined)
})

test('#findCmsFeaturePagePrefixIn returns undefined if argument does not contain one of the prefixes', () => {
  expect(findCmsFeaturePagePrefixIn('unexisting prefix')).toBe(undefined)
})

test('#findCmsFeaturePagePrefixIn the prefix if the argument is prefixed with one of the possible prefixes 1', () => {
  expect(findCmsFeaturePagePrefixIn('/size-guide/123')).toBe('/size-guide/')
})

test('#findCmsFeaturePagePrefixIn the prefix if the argument is prefixed with one of the possible prefixes 2', () => {
  expect(findCmsFeaturePagePrefixIn('/content/123')).toBe('/content/')
})

test('#resizeIframe not in browser: does not modify the iframe argument', () => {
  global.process.browser = false
  document.querySelector = function documentQuerySelector() {
    return { offsetHeight: 10 }
  }
  const iframe = {}

  resizeIframe(iframe, 100)

  expect(iframe).toEqual({})
})

test('#resizeIframe in browser: does not modify the iframe argument in case of iframe with height', () => {
  global.process.browser = true
  document.querySelector = function documentQuerySelector() {
    return { offsetHeight: 10 }
  }
  const iframe = { height: 10 }

  resizeIframe(iframe, 100)

  expect(iframe).toEqual({ height: 10 })
  global.process.browser = false
})

test('#resizeIframe in browser: does not resize the iframe in case of missing iframeNewHeight argument', () => {
  global.process.browser = true
  document.querySelector = function documentQuerySelector() {
    return { offsetHeight: 10 }
  }
  const iframe = {}

  resizeIframe(iframe)

  expect(iframe).toEqual({})
  global.process.browser = false
})

test('#resizeIframe in browser: does not resize the iframe in case iframeNewHeight argument set to 0', () => {
  global.process.browser = true
  document.querySelector = function documentQuerySelector() {
    return { offsetHeight: 10 }
  }
  const iframe = {}

  resizeIframe(iframe, 0)

  expect(iframe).toEqual({})
  global.process.browser = false
})

test('#resizeIframe in browser: resizes to the new height without subtracting anything in case of missing header in the document', () => {
  global.process.browser = true
  document.querySelector = function documentQuerySelector() {
    return null
  }
  const iframe = {}

  resizeIframe(iframe, 1)

  expect(iframe).toEqual({ height: '1px' })
  global.process.browser = false
})

test('#resizeIframe in browser: resizes to the new height minus the header height', () => {
  global.process.browser = true
  document.querySelector = function documentQuerySelector() {
    return { offsetHeight: 1 }
  }
  const iframe = {}

  resizeIframe(iframe, 2)

  expect(iframe).toEqual({ height: '1px' })
  global.process.browser = false
})

test('#redirect cmsForm : check if is a valid successURL to redirect', () => {
  expect(getRedirectPage(cmsFormContent, 'successURL')).toEqual(
    'http://ts.stage.arcadiagroup.ltd.uk/en/tsuk/category/denim-competition-2016-success-5185574/home?TS=1453296919494&amp;competition=yes'
  )
})

test('#redirect cmsForm : check if is not a valid failureURL to redirect', () => {
  expect(getRedirectPage(cmsFormContent, 'failureURL')).toBe(false)
})

test('#redirect cmsForm : false if dont exist redirect url ', () => {
  expect(getRedirectPage(cmsFormContent, 'someDontExist')).toBe(false)
})
