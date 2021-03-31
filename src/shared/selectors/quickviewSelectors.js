export const getQuickview = (state) => state.quickview || {}

export const getQuickviewActiveItem = (state) => {
  const { activeItem } = getQuickview(state)

  return activeItem || {}
}

export const getQuickViewProduct = (state) => {
  const { product } = getQuickview(state)

  return product || {}
}

export const getQuickViewProductId = (state) => {
  const { productId } = getQuickview(state)

  return productId || {}
}

export const shouldShowQuickviewError = (state) => {
  const { showError } = getQuickview(state)

  return !!showError
}

export const getQuickviewQuantity = (state) => {
  const { selectedQuantity } = getQuickview(state)

  return selectedQuantity || 1
}
