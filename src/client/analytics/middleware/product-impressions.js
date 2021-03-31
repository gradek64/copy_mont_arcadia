import { path } from 'ramda'
import dataLayer from '../../../shared/analytics/dataLayer'
import { addPostDispatchListeners } from './analytics-middleware'
import * as DataMapper from './data-mapper'
import { getCurrencyCode } from '../../../shared/selectors/configSelectors'
import { GTM_LIST_TYPES } from '../../../shared/analytics'

let currentPageBatchCount = 1

const pushToDataLayer = (data) => {
  dataLayer.push(
    {
      ecommerce: {
        ...data,
      },
    },
    null,
    'impression'
  )
}

export const transformProducts = (products, list, pageType, categoryTitle) => {
  return products.map((product) => {
    return {
      ...DataMapper.product(product, list, pageType, categoryTitle),
      quantity: '1',
      position: currentPageBatchCount.toString(),
    }
  })
}

export const transformRecommendations = ({
  products,
  currencyCode,
  pageType,
}) => {
  return products.map((recommendation) => {
    return {
      ...DataMapper.recommendation(recommendation, currencyCode, pageType),
    }
  })
}

export const productImpressions = (products = [], state, list = '') => {
  const currencyCode = getCurrencyCode(state)
  const { pageType } = state
  const categoryTitle = path(['products', 'categoryTitle'], state)
  const impressions = transformProducts(products, list, pageType, categoryTitle)
  pushToDataLayer({ currencyCode, impressions })
}

export const recommendationsImpressions = (products = [], state) => {
  const currencyCode = getCurrencyCode(state)
  const { pageType } = state
  const impressions = transformRecommendations({
    products,
    currencyCode,
    pageType,
  })
  pushToDataLayer({ currencyCode, impressions })
}

export const setProductsListener = (action, store) => {
  currentPageBatchCount = 1
  productImpressions(action.body.products, store.getState())
}

export const addToProductsListener = (action, store) => {
  currentPageBatchCount++
  productImpressions(action.products, store.getState())
}

export const setRecommendationsListener = (action, store) => {
  recommendationsImpressions(action.recommendations, store.getState())
}

export const setRecentlyViewedListener = (action, store) => {
  const state = store.getState()
  const { recentlyViewed } = state
  productImpressions(recentlyViewed, state, GTM_LIST_TYPES.PDP_RECENTLY_VIEWED)
}

export default () => {
  addPostDispatchListeners('SET_PRODUCTS', setProductsListener)
  addPostDispatchListeners('ADD_TO_PRODUCTS', addToProductsListener)
  addPostDispatchListeners('SET_RECOMMENDATIONS', setRecommendationsListener)
  addPostDispatchListeners('PAGE_LOADED', setRecentlyViewedListener)
}
