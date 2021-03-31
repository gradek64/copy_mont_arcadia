export const isIE11 = () => {
  if (!process.browser) return false
  return !!navigator.userAgent.match(/Trident/i)
}

export const isFF = () => {
  if (!process.browser) return false
  return !!navigator.userAgent.match(/Firefox/i)
}
