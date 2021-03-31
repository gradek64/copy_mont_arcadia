import { moveCarouselForward, moveCarouselBack } from './carousel-actions'
import { sendAnalyticsClickEvent, GTM_CATEGORY } from '../../../analytics'

const carouselKeyToAnalyticsCategory = {
  bundles: GTM_CATEGORY.PDP,
  productDetail: GTM_CATEGORY.PDP,
  overlayCarousel: GTM_CATEGORY.PDP,
}

function analyticsClickEvent(carouselKey, action) {
  const category = carouselKeyToAnalyticsCategory[carouselKey]
  return category
    ? sendAnalyticsClickEvent({ category, action, label: 'image carousel' })
    : undefined
}

export function forwardCarousel(carouselKey) {
  return (dispatch) => {
    dispatch(moveCarouselForward(carouselKey))

    const clickEventAction = analyticsClickEvent(carouselKey, 'next')
    if (clickEventAction) {
      dispatch(clickEventAction)
    }
  }
}

export function backCarousel(carouselKey) {
  return (dispatch) => {
    dispatch(moveCarouselBack(carouselKey))

    const clickEventAction = analyticsClickEvent(carouselKey, 'previous')
    if (clickEventAction) {
      dispatch(clickEventAction)
    }
  }
}
