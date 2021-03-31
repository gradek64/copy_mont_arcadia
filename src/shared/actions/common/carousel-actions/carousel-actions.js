export function initCarousel(key, max, initialIndex) {
  return {
    type: 'INIT_CAROUSEL',
    key,
    max,
    initialIndex,
  }
}

export function setCarouselIndex(key, index) {
  return {
    type: 'SET_CAROUSEL_INDEX',
    key,
    current: index,
  }
}

export function setCurrentItemReference(key, currentItemReference) {
  return {
    type: 'SET_CURRENT_ITEM_REFERENCE',
    key,
    currentItemReference,
  }
}

export function moveCarouselForward(key) {
  return {
    type: 'FORWARD_CAROUSEL',
    key,
  }
}

export function moveCarouselBack(key) {
  return {
    type: 'BACK_CAROUSEL',
    key,
  }
}

export function carouselZoom(key, zoom) {
  return {
    type: 'ZOOM_CAROUSEL',
    key,
    zoom,
  }
}

export function carouselPan(key, panX, panY) {
  return {
    type: 'PAN_CAROUSEL',
    key,
    panX,
    panY,
  }
}
