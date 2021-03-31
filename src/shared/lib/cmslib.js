import cmsConsts from '../constants/cmsConsts'

export function findCmsFeaturePagePrefixIn(url) {
  let featurePrefixInUrl
  if (url && typeof url === 'string') {
    const prefixes = cmsConsts.FEATURE_PAGE_PREFIXES
    featurePrefixInUrl = prefixes.find((prefix) => {
      return url.startsWith(prefix)
    })
  }
  return featurePrefixInUrl
}

export function isNotEspot(contentType) {
  return contentType !== cmsConsts.ESPOT_CONTENT_TYPE
}

export function resizeIframe(iframe, iframeNewHeight) {
  if (!process.browser) return

  if (iframe && !iframe.height && iframeNewHeight) {
    const header = document.querySelector('.Header')
    if (header) iframeNewHeight -= header.offsetHeight

    iframe.height = `${iframeNewHeight}px`
  }
}

export function getRedirectPage({ hiddenFields = [] }, redirectName) {
  const field = hiddenFields.find(
    ({ name, value }) =>
      name && value && name === redirectName && value.trim() !== ''
  )
  return field ? field.value : false
}
