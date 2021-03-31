import dataLayer from '../dataLayer'
import { calculatePayloadSize } from '../analytics-utils'
import { nrBrowserLogError } from '../../../client/lib/logger'
import { path } from 'ramda'

const MAX_PAYLOAD_SIZE_LIMIT = 8192

export const pushApiResponseEvent = (data) => {
  if (process.browser) {
    dataLayer.push(data, null, 'apiResponse')
  }
}

export const pushClickEvent = (data) => {
  if (process.browser) {
    const base = {
      ec: '',
      ea: '',
      el: window.location.href,
      ev: '',
    }
    dataLayer.push(
      {
        ...base,
        ...data,
      },
      null,
      'clickevent'
    )
  }
}

export const pushErrorMessage = (errorMessage) => {
  if (process.browser) {
    dataLayer.push({ errorMessage }, null, 'errorMessage')
  }
}

export const analyticsGlobalNavClickEvent = (action) => {
  return pushClickEvent({
    ec: 'globalnavigation',
    ea: action,
  })
}

export const analyticsPlpClickEvent = (action) => {
  return pushClickEvent({
    ec: 'plp',
    ea: action,
  })
}

export const analyticsSearchClickEvent = (action) => {
  return pushClickEvent({
    ec: 'search',
    ea: action,
  })
}

export const analyticsPdpClickEvent = (action) => {
  return pushClickEvent({
    ec: 'pdp',
    ea: action,
  })
}

export const analyticsShoppingBagClickEvent = (action) => {
  return pushClickEvent({
    ec: 'shoppingBag',
    ...action,
  })
}

export const analyticsRegisterClickEvent = (action) => {
  return pushClickEvent({
    ec: 'register',
    ...action,
  })
}

export const analyticsErrorEvent = (action) => {
  return dataLayer.push(action, null, 'errorMessage')
}

export const analyticsLoginClickEvent = (action) => {
  return pushClickEvent({
    ec: 'signin',
    ...action,
  })
}

export const analyticsFormErrorEvent = (formId, errorMessage) => {
  analyticsErrorEvent({
    form: formId,
    errorMessage,
  })
}

export const analyticsBagDrawerCheckoutClickEvent = (pageType, action) => {
  return pushClickEvent({
    ec: pageType,
    ea: action,
  })
}

/**
 * see tag manager docs: https://developers.google.com/tag-manager/enhanced-ecommerce#product-clicks
 */
export const pushProductClickEvent = (productObj, list) => {
  if (process.browser && productObj) {
    const { name, id, price, brand, category, position } = productObj
    dataLayer.push(
      {
        ecommerce: {
          click: {
            actionField: list ? { list } : {},
            products: [
              {
                name,
                id,
                price,
                brand,
                category,
                position,
              },
            ],
          },
        },
      },
      'productClickSchema',
      'productClick'
    )
  }
}

export const pushDisplayEvent = (payload, eventName) => {
  if (process.browser) {
    dataLayer.push(payload, null, eventName)
  }
}

export const pushDeliveryOptionChangeEvent = (deliveryOption) => {
  if (process.browser) {
    dataLayer.push({ deliveryOption }, null, 'deliveryOptionChanged')
  }
}

export const pushInputValidationStatus = ({ id, validationStatus }) => {
  if (process.browser) {
    dataLayer.push({ id, validationStatus }, null, 'formValidation')
  }
}

export const pushDeliveryMethodChangeEvent = ({ deliveryMethod }) => {
  if (process.browser) {
    dataLayer.push({ deliveryMethod }, null, 'deliveryMethodChanged')
  }
}

/**
 * TODO : this function is **updated** in order to make working the new filter
 * TODO and the old filter. Refactor with the correct payload when old filter
 * TODO will be deprecated.
 */
export const pushFilterUsedEvent = ({ payload }) => {
  if (process.browser) {
    dataLayer.push({ ...payload }, null, 'filterUsed')
  }
}

export const pushOrderCompleteEvent = (payload) => {
  if (process.browser) {
    dataLayer.push(payload, null, 'orderComplete')
  }
}

export const pushPurchaseEvent = ({ payload }) => {
  if (process.browser) {
    dataLayer.push(payload, null, 'purchase')

    if (calculatePayloadSize(payload) > MAX_PAYLOAD_SIZE_LIMIT) {
      const error = new Error('Purchase Event GA payload exceeded')
      const orderId = path(
        ['ecommerce', 'purchase', 'actionField', 'id'],
        payload
      )
      nrBrowserLogError(`Order ID: ${orderId}`, error)
    }
  }
}

export const pushPurchaseErrorEvent = ({ payload }) => {
  if (process.browser) {
    dataLayer.push(payload, null, 'purchaseError')
  }
}
