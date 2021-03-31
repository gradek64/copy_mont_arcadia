import { path } from 'ramda'

import createReducer from '../../lib/create-reducer'

// FIXME: This is a temporary hack, to be removed when the backend gives us
// the title without an appended brand name.
const hackPageTitle = (title = '') => {
  const lastIndex = title.lastIndexOf(' | ')
  return lastIndex === -1 ? title : title.substring(0, lastIndex)
}

export const INITIAL_STATE = {
  activeRefinements: [],
  refinements: [],
  sortOptions: [],
  breadcrumbs: [],
  products: undefined,
  totalProducts: 0,
  categoryTitle: undefined,
  categoryDescription: undefined,
  isLoadingAll: undefined,
  isLoadingMore: undefined,
  title: '',
  selectedProductSwatches: {},
}

export default createReducer(INITIAL_STATE, {
  SET_PRODUCTS: (
    state,
    {
      body,
      body: {
        activeRefinements,
        searchTerm,
        totalProducts,
        products,
        breadcrumbs,
        categoryTitle,
      },
    }
  ) => ({
    ...state,
    ...body,
    title: hackPageTitle(body.title),
    activeRefinements,
    searchTerm,
    breadcrumbs,
    totalProducts: totalProducts ? Number(totalProducts) : 0,
    products: products || undefined,
    categoryTitle,
    isLoadingAll: false,
    isLoadingMore: false,
  }),
  PRODUCTS_NOT_FOUND: () => ({
    ...INITIAL_STATE,
    isLoadingAll: false,
    isLoadingMore: false,
  }),
  SET_PRODUCTS_LOCATION: (state, { location }) => ({
    ...state,
    location: { ...location },
  }),
  REMOVE_PRODUCTS_LOCATION: (state) => ({
    ...state,
    location: {},
  }),
  REMOVE_PRODUCTS: (state) => ({
    ...state,
    totalProducts: 0,
    products: undefined,
  }),
  ADD_TO_PRODUCTS: (state, { products }) => ({
    ...state,
    products: state.products ? [...state.products, ...products] : products,
  }),
  LOADING_PRODUCTS: (state, { loading }) => ({
    ...state,
    categoryTitle: loading || state.categoryTitle,
    isLoadingAll: true,
  }),
  LOADING_MORE_PRODUCTS: (state, { isLoadingMore }) => ({
    ...state,
    isLoadingMore,
  }),
  SELECT_SWATCH: (state, { productId, swatchIndex }) => {
    const { products = [], selectedProductSwatches = {} } = state
    const product = products.find((product) => product.productId === productId)
    const productSwatchId = path(
      ['colourSwatches', swatchIndex, 'swatchProduct', 'productId'],
      product
    )
    if (selectedProductSwatches[productId] === productSwatchId) {
      return state
    }
    return {
      ...state,
      selectedProductSwatches: {
        ...selectedProductSwatches,
        [productId]: productSwatchId,
      },
    }
  },
  RESET_PRODUCTS_STATE: () => INITIAL_STATE,
})
