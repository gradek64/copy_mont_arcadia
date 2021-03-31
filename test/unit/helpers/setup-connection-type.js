export default function setupConnectionType (effectiveType) {
  if (!window.navigator.connection) {
    Object.defineProperty(window.navigator, 'connection', {
      value: { effectiveType },
    })
  } else {
    window.navigator.connection.effectiveType = effectiveType
  }
}
