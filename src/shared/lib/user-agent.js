let _isIOS // cache result as it won't change
/**
 * Returns true if the user agent resembles that of an iOS device
 */
export function isIOS() {
  if (!process.browser) {
    throw new Error('User agent functions cannot be called on the server')
  }

  if (_isIOS === undefined) {
    const userAgent = navigator.userAgent
    _isIOS = /iP(?:hone|[ao]d)/i.test(userAgent)
  }

  return _isIOS
}
