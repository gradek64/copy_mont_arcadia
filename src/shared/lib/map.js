export const getMapUrl = () =>
  process.browser && window && window.navigator.userAgent.indexOf('Safari') > -1
    ? 'maps.apple.com'
    : 'google.com/maps'
