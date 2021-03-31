import { isEmpty } from 'ramda'
import dataLayer from '../../../shared/analytics/dataLayer'
import { addPostDispatchListeners } from './analytics-middleware'
import {
  getCurrentProduct,
  getPageType,
  getCategoryTitle,
} from '../../../shared/selectors/productSelectors'
import { getCurrencyCode } from '../../../shared/selectors/configSelectors'
import * as DataMapper from './data-mapper'
import { GTM_CATEGORY } from '../../../shared/analytics'

export const transformProduct = (product, list, pageType, categoryTitle) => ({
  ...DataMapper.product(product, list, pageType, categoryTitle),
  quantity: '1',
})

const productViewEvent = (
  rawProduct,
  currencyCode,
  pageType,
  categoryTitle
) => {
  const { list = '' } = rawProduct
  const product = transformProduct(rawProduct, list, pageType, categoryTitle)

  dataLayer.push(
    {
      ecommerce: {
        currencyCode,
        detail: {
          actionField: { list: list || product.category },
          products: [product],
        },
      },
    },
    null,
    'detail'
  )
}

export const productQuickViewListener = (action, store) => {
  if (isEmpty(action.product)) {
    return
  }
  productViewEvent(action.product, getCurrencyCode(store.getState()))
}

export const pageLoadedListener = (action, store) => {
  if (
    action.payload.pageName !== GTM_CATEGORY.PDP &&
    action.payload.pageName !== GTM_CATEGORY.BUNDLE
  ) {
    return
  }
  const state = store.getState()
  productViewEvent(
    getCurrentProduct(state),
    getCurrencyCode(state),
    getPageType(state),
    getCategoryTitle(state)
  )
}

export default () => {
  addPostDispatchListeners('PAGE_LOADED', pageLoadedListener)
  addPostDispatchListeners('SET_PRODUCT_QUICKVIEW', productQuickViewListener)
  addPostDispatchListeners('UPDATE_SWATCH', productQuickViewListener)
}
