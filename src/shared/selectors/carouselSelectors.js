const rootSelector = (state) => state.carousel || {}

export const getCarousel = (state, name) => {
  const carousels = rootSelector(state)

  return carousels[name] || {}
}

export const getCarouselSelectedIndex = (state, name) => {
  const carousel = getCarousel(state, name)

  return carousel.current
}
