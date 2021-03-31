import dataLayer from '../../../shared/analytics/dataLayer'
import { addPostDispatchListeners } from './analytics-middleware'
import * as DataMapper from './data-mapper'
import * as Logger from '../../../client/lib/logger'
import { getCheckoutOrderSummaryProducts } from '../../../shared/selectors/checkoutSelectors'
import { getCurrencyCode } from '../../../shared/selectors/configSelectors'

export const pageLoadedListener = (action, store) => {
  const state = store.getState()
  const bagProducts = getCheckoutOrderSummaryProducts(state)
  const currencyCode = getCurrencyCode(state)
  const checkoutSteps = {
    'checkout-login': 1,
    'delivery-details': 2,
    'payment-details': 3,
    'delivery-payment': 4,
  }
  const checkoutStep = checkoutSteps[action.payload.pageName]

  if (checkoutStep) {
    const data = {
      ecommerce: {
        currencyCode,
        checkout: {
          actionField: {
            step: checkoutStep,
          },
          products: bagProducts.map((product) => DataMapper.product(product)),
        },
      },
    }
    dataLayer.push(data, null, 'checkout')
    Logger.info(`gtm.checkoutstep${checkoutStep}`, { dataLayer: data })
  }
}

export default () => {
  addPostDispatchListeners('PAGE_LOADED', pageLoadedListener)
}
