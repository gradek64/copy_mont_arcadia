export function getViewport() {
  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  const h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )

  return { width: w, height: h }
}

export function touchDetection() {
  // navigator.maxTouchPoints works on IE10/11 and Surface
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  )
}
