import { isMobile } from '../../selectors/viewportSelectors'

let hasWindowOnLoadAlreadyFired = false
let intersectionObserver
const images = {
  deferred: [],
}

export const isGoodNetwork = () => {
  // see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType#Value
  try {
    return window.navigator.connection.effectiveType === '4g'
  } catch (e) {
    return false
  }
}

export const getIntersectionObserverRootMargin = () => {
  const shouldReturnHighMargin = !isGoodNetwork() || isMobile()
  return shouldReturnHighMargin ? '100% 0px 100% 0px' : '50% 0px 50% 0px'
}

export const deferredLoadImage = (element) => {
  if (hasWindowOnLoadAlreadyFired) {
    element.dispatchEvent(new Event('load'))
  } else {
    images.deferred.push(element)
  }
}

export const lazyLoadImage = (element) => {
  if (intersectionObserver !== undefined) {
    intersectionObserver.observe(element)
  } else {
    element.dispatchEvent(new Event('load'))
  }
}

export const unobserveLazyImage = (el) => {
  if (
    intersectionObserver !== undefined &&
    typeof intersectionObserver.unobserve === 'function'
  ) {
    intersectionObserver.unobserve(el)
  }
}

export const setupLoaders = (window) => {
  hasWindowOnLoadAlreadyFired = false

  if (typeof window.IntersectionObserver === 'function') {
    const config = {
      // when the root element is null, IntersectionObserver uses the viewport
      root: null,
      // we observe 20% more up+down (you can only use px/% units in rootMargin)
      rootMargin: getIntersectionObserverRootMargin(),
      threshold: [0],
    }
    intersectionObserver = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const isIntersecting =
          typeof entry.isIntersecting === 'boolean'
            ? entry.isIntersecting
            : true

        if (isIntersecting) {
          entry.target.dispatchEvent(new Event('load'))
          unobserveLazyImage(entry.target)
        }
      })
    }, config)
  }

  const oldWindowOnLoad = window.onload
  window.onload = () => {
    images.deferred.forEach((element) =>
      element.dispatchEvent(new Event('load'))
    )
    images.deferred = []
    hasWindowOnLoadAlreadyFired = true
    if (oldWindowOnLoad) oldWindowOnLoad()
  }
}
