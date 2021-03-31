export const changeURL = (url) => {
  if (process.browser) window.location.href = url
}

export const getHostname = () => process.browser && window.location.hostname

export const getHost = () => process.browser && window.location.host

export const getOrigin = () => process.browser && window.location.origin

export const getPort = () => process.browser && window.location.port

export const getProtocol = () => process.browser && window.location.protocol

export const getSearch = () => process.browser && window.location.search

export const isProductionBrandHost = (host, productionHost) => {
  if (productionHost.startsWith('www')) {
    productionHost = productionHost.substring(3)
  }
  return host.endsWith(productionHost)
}
