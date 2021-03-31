export default function removeHttp(url) {
  if (url.indexOf('http://localhost') !== -1) {
    return url
  }
  if (url.indexOf('http://') !== -1) {
    return url.substring(5)
  }
  if (url.indexOf('https://') !== -1) {
    return url.substring(6)
  }
  return url
}
