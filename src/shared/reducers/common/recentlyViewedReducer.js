import { contains } from 'ramda'
import createReducer from '../../lib/create-reducer'
import { loadRecentlyViewedState } from '../../../client/lib/storage'

function updateOrPrependProduct(product, productsList) {
  const productIndex = productsList.findIndex(
    ({ productId }) => productId === product.productId
  )
  return productIndex === -1
    ? [product, ...productsList.slice(0, 9)]
    : [
        ...productsList.slice(0, productIndex),
        product,
        ...productsList.slice(productIndex + 1),
      ]
}

const initialState = loadRecentlyViewedState()

export default createReducer(initialState, {
  ADD_RECENTLY_VIEWED_PRODUCT: (state, { product }) => {
    return contains(product, state)
      ? state
      : updateOrPrependProduct(product, state)
  },
  DELETE_RECENTLY_VIEWED_PRODUCT: (state, { productId }) => {
    const updatedProducts = state.filter((p) => p.productId !== productId)

    if (updatedProducts.length === state.length) return state

    return updatedProducts
  },
})
