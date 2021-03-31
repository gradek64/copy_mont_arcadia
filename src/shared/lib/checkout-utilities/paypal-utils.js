export const PAYPAL_SDK_SRC = 'https://www.paypal.com/sdk/js'

export const loadScript = (clientID, currencyCode = 'GBP') => {
  if (document) {
    return new Promise((resolve) => {
      const src = `${PAYPAL_SDK_SRC}?client-id=${clientID}&currency=${currencyCode}&intent=order`
      window.loadScript({ src, isAsync: true, onload: resolve })
    })
  }
  return Promise.reject()
}
