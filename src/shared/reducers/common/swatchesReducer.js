import createReducer from '../../lib/create-reducer'

const initialState = {
  products: {},
}

const defaultProduct = {
  page: 0,
  selected: 0,
}

const getProduct = (products, productId) =>
  products[productId] ? products[productId] : { ...defaultProduct }

const updateProducts = (products, productId, prop, updater) => {
  const product = getProduct(products, productId)
  return {
    ...products,
    [productId]: { ...product, [prop]: updater(product[prop]) },
  }
}

export default createReducer(initialState, {
  NEXT_SWATCHES: (state, { productId }) => ({
    ...state,
    products: updateProducts(
      state.products,
      productId,
      'page',
      (val) => val + 1
    ),
  }),
  PREV_SWATCHES: (state, { productId }) => ({
    ...state,
    products: updateProducts(
      state.products,
      productId,
      'page',
      (val) => val - 1
    ),
  }),
  SELECT_SWATCH: (state, { productId, swatchIndex }) => ({
    ...state,
    products: updateProducts(
      state.products,
      productId,
      'selected',
      () => swatchIndex
    ),
  }),
  RESET_SWATCHES_PAGE: (state) => ({
    ...state,
    products: Object.keys(state.products).reduce((prev, curr) => {
      return { ...prev, [curr]: { ...state.products[curr], page: 0 } }
    }, {}),
  }),
})
