import { setItem } from '../../../client/lib/cookie/utils'

export function updateMediaType(media) {
  return {
    type: 'UPDATE_MEDIA_TYPE',
    media,
  }
}

export function updateWindow(dimensions) {
  return {
    type: 'UPDATE_WINDOW',
    data: dimensions,
  }
}

export function updatePageHeight(pageHeight) {
  return {
    type: 'UPDATE_PAGE_HEIGHT',
    pageHeight,
  }
}

export function updateAgent(iosAgent) {
  return {
    type: 'UPDATE_AGENT',
    iosAgent,
  }
}

export function updateTouch(touch) {
  return {
    type: 'UPDATE_TOUCH',
    touch,
  }
}

// Handlers

export function setAndUpdateMediaType(media) {
  // Save into cookie the deviceType
  if (process.browser) setItem('viewport', media, 30)
  return (dispatch) => {
    dispatch(updateMediaType(media))
  }
}
