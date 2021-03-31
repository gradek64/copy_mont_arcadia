import {
  __,
  contains,
  defaultTo,
  either,
  equals,
  filter,
  find,
  path,
  pathOr,
  pipe,
  pluck,
  propEq,
  where,
} from 'ramda'
import {
  getCreditCardType,
  selectBillingCountry,
  selectDeliveryCountry,
  selectStoredPaymentDetails,
} from './common/accountSelectors'
import { createSelector } from 'reselect'
import { combineCardOptions } from '../lib/checkout-utilities/utils'
import {
  getBillingCardPaymentType,
  getMCDDeliveryCountry,
  getMCDBillingCountry,
  getSelectedPaymentType,
} from './formsSelectors'
import {
  isFeatureApplePayEnabled,
  isFeatureClearPayEnabled,
} from './featureSelectors'
import { isClearPayAvailable } from './clearPaySelectors'
import { isApplePayAvailable } from './applePaySelectors'

import * as paymentTypes from '../constants/paymentTypes'
import applePayPaymentMethods from '../constants/applepayPaymentMethods'
import {
  paymentsMethodsConfigDefault,
  paymentsMethodsConfig,
} from '../../server/config/paymentConfig'

const filterPaymentMethods = (
  isFeatureApplePayEnabled,
  isFeatureClearPayEnabled,
  paymentMethods
) =>
  paymentMethods.filter(({ value }) => {
    switch (value) {
      case paymentTypes.APPLEPAY:
        return isFeatureApplePayEnabled
      case paymentTypes.CLEARPAY:
        return isFeatureClearPayEnabled
      default:
        return true
    }
  })

export const getPaymentMethods = createSelector(
  [
    isFeatureApplePayEnabled,
    isFeatureClearPayEnabled,
    (state) => state.paymentMethods || [],
  ],
  filterPaymentMethods
)

export const getPaymentOptionKlarna = createSelector(
  [getPaymentMethods],
  (paymentMethods) => {
    return (
      paymentMethods.find((paymentMethod) => paymentMethod.value === 'KLRNA') ||
      {}
    )
  }
)

export const getApplePayCardPaymentMethods = createSelector(
  getPaymentMethods,
  (paymentMethods) =>
    paymentMethods.reduce((acc, item) => {
      if (item.type === 'CARD') {
        const applePayPaymentMethod = applePayPaymentMethods[item.value]

        if (applePayPaymentMethod) {
          acc.push(applePayPaymentMethods[item.value])
        }
      }

      return acc
    }, [])
)

export const getPaymentMethodByOptionType = createSelector(
  [getPaymentMethods, (state, type) => type],
  (paymentMethods, type) => {
    let result

    if (type === 'CARD') {
      const options = paymentMethods.filter(({ type }) => type === 'CARD')
      result = {
        value: 'CARD',
        type: 'CARD',
        label: 'Credit/Debit Card',
        description: options.map((option) => option.label).join(', '),
        paymentTypes: options,
      }
    } else {
      result = paymentMethods.filter((option) => type === option.value)[0]
    }

    return result
  }
)

function useSvg(filename) {
  return filename.replace(/.gif/, '.svg')
}

export const getCardIcons = createSelector(
  [getPaymentMethods],
  (paymentMethods) =>
    paymentMethods
      .filter((method) => method.type === 'CARD')
      .map((method) => useSvg(method.icon))
      .filter((icon) => !!icon)
)

export function getPaymentOptionByType(state, type) {
  const paymentMethod = getPaymentMethodByOptionType(state, type)
  if (paymentMethod) {
    const icons =
      'icon' in paymentMethod
        ? [useSvg(paymentMethod.icon)]
        : getCardIcons(state)
    const result = {
      ...paymentMethod,
      icons,
    }
    delete result.icon
    return result
  }
  return {}
}

export function getPaymentMethodByValue(state, value) {
  return getPaymentMethods(state).filter((m) => {
    return m.value === value
  })[0]
}

export function isPaymentMethodsLoaded(state) {
  return getPaymentMethods(state).length > 0
}

export function getSelectedPaymentOptionType(state) {
  if (!getPaymentMethods(state).length) return

  const value = path(
    [
      'forms',
      'checkout',
      'billingCardDetails',
      'fields',
      'paymentType',
      'value',
    ],
    state
  )
  const method = getPaymentMethodByValue(state, value)

  return method && method.type === 'CARD' ? 'CARD' : value
}

/**
 * Function that returns PaymentMethod type (CARD, OTHER_CARD, OTHER, ...) by providing the value (VISA, PYPAL, ...)
 * Note: If current value doesn't exists, then returns CARD as a default type
 * @param {object} state
 * @param {string} value
 */
export function getPaymentMethodTypeByValue(
  state,
  value,
  defaultValue = 'CARD'
) {
  const paymentMethods = getPaymentMethods(state)
  const paymentMethodFound = paymentMethods.find(
    (payment) => payment.value === value
  )

  return paymentMethodFound ? paymentMethodFound.type : defaultValue
}

export const isCardOrAccountCard = (state, paymentType) => {
  const typeValue = getPaymentMethodTypeByValue(state, paymentType, null)
  return typeValue === 'CARD' || typeValue === 'OTHER_CARD'
}

export const isCard = (state, paymentType) =>
  getPaymentMethodTypeByValue(state, paymentType, null) === 'CARD'

export const selectPaymentMethods = (state) => getPaymentMethods(state)

export const selectUnfilteredPaymentMethods = (state) => state.paymentMethods || []

const defaultToEmptyObject = defaultTo({})

const filterPaymentMethodsByDeliveryAndBillingCountry = (
  deliveryCountry,
  billingCountry,
  paymentMethods
) => {
  const paymentMethodValidForDeliveryAndBillingCountry = where({
    deliveryCountry: either(equals(undefined), contains(deliveryCountry)),
    billingCountry: either(equals(undefined), contains(billingCountry)),
  })

  return filter(paymentMethodValidForDeliveryAndBillingCountry, paymentMethods)
}

export const selectPaymentMethodsValidForDeliveryAndBillingCountry = createSelector(
  selectDeliveryCountry,
  selectBillingCountry,
  selectPaymentMethods,
  filterPaymentMethodsByDeliveryAndBillingCountry
)

/**
 * A selector to get specific payment config
 *
 * @param {String} paymentMethod
 * @return {PaymentConfig}
 */
export const getPaymentConfig = (paymentMethod) => {
  const paymentMethodConfig = paymentsMethodsConfig[paymentMethod] || {}

  return {
    ...paymentsMethodsConfigDefault,
    ...paymentMethodConfig,
  }
}

/**
 * A selector used to get all payment methods valid for Footer Icons
 *
 * @param {String} selectDeliveryCountry Delivery country 
 * @param {String} selectBillingCountry Billing country
 * @param {Array} paymentMethods payment methods available, filtered by feature fags
 * @return {Array} we return an array of all the payment methods icons we want to show in the footer
 * This Array is filtered using the paymentConfigs, billing country, and delivery country
 */
const filterPaymentMethodsByCountryAndPaymentConfig = (
  deliveryCountry,
  billingCountry,
  paymentMethods
) =>
  paymentMethods.filter((paymentMethod) => {
    const { alwaysShowIconInFooter } = getPaymentConfig(paymentMethod.value)
    return (
      alwaysShowIconInFooter ||
      ((paymentMethod.deliveryCountry === undefined ||
        paymentMethod.deliveryCountry.includes(deliveryCountry)) &&
        (paymentMethod.billingCountry === undefined ||
          paymentMethod.billingCountry.includes(billingCountry)))
    )
  })

export const selectPaymentMethodsValidForFooter = createSelector(
  selectDeliveryCountry,
  selectBillingCountry,
  selectPaymentMethods,
  filterPaymentMethodsByCountryAndPaymentConfig
)

export const filterAvailablePaymentMethodsForMCD = createSelector(
  getMCDDeliveryCountry,
  getMCDBillingCountry,
  selectPaymentMethods,
  filterPaymentMethodsByDeliveryAndBillingCountry
)

// Formerly called getPaymentOptionTypes, was only used on
// My Checkout Details
export const getMCDAvailablePaymentMethodTypes = createSelector(
  [filterAvailablePaymentMethodsForMCD],
  (paymentMethods) => {
    const types = []
    let hasCards = false

    paymentMethods.forEach((method) => {
      if (method.type === 'CARD') {
        hasCards = true
      } else if (method.value !== paymentTypes.CLEARPAY) {
        types.push(method.value)
      }
    })

    if (hasCards) {
      types.unshift('CARD')
    }

    return types
  }
)

export const selectPaymentMethodForStoredPaymentDetails = createSelector(
  selectStoredPaymentDetails,
  selectPaymentMethods,
  ({ type }, paymentMethods) =>
    defaultToEmptyObject(find(propEq('value', type))(paymentMethods))
)

export const selectCombinedPaymentMethods = createSelector(
  selectPaymentMethodsValidForDeliveryAndBillingCountry,
  (paymentMethods) => combineCardOptions(paymentMethods)
)

export const selectDecoratedCombinedPaymentMethods = createSelector(
  selectCombinedPaymentMethods,
  (combinedPaymentMethods) =>
    combinedPaymentMethods.map(
      ({ label, description, value, type, icon, paymentTypes = [] }) => {
        const icons = icon ? [icon] : paymentTypes.map(({ icon }) => icon)
        return {
          label,
          description,
          value,
          type,
          icons,
          paymentTypes,
        }
      }
    )
)

/**
 * A selector used to get all payment methods filtered by availability
 * We use the selectDecoratedCombinedPaymentMethods to get combined payment methods, in the data
 * structure our PaymentMethodOptions component wants, and then filter these according to whether
 * the payment method is available to pay with or not.
 *
 * @param {Array} selectDecoratedCombinedPaymentMethods selector of combined payment methods
 * @param {Boolean} isApplePayAvailable selector for checking if apple pay is available
 * @param {Boolean} isClearPayAvailable selector for checking if clear pay is available
 * @return {Array} return an array of all the payment methods that are available to pay with
 */
export const getEnabledDecoratedCombinedPaymentMethods = createSelector(
  selectDecoratedCombinedPaymentMethods,
  isApplePayAvailable,
  isClearPayAvailable,
  (combinedPaymentMethod, isApplePayAvailable, isClearPayAvailable) =>
    combinedPaymentMethod.filter((paymentMethod) => {
      if(paymentMethod.value === paymentTypes.APPLEPAY){
        return isApplePayAvailable
      } else if(paymentMethod.value === paymentTypes.CLEARPAY) {
        return isClearPayAvailable
      }
      return true
    })
)

export const getCombinedPaymentMethodByPaymentMethodValue = (
  combinedPaymentMethods,
  value,
  defaultResult
) => {
  const filter = (combinedPaymentMethod) => {
    const checkIfBankCard = pipe(
      pathOr([], ['paymentTypes'], __),
      pluck('value'),
      contains(value)
    )
    const checkIfOther = propEq('value', value)

    return either(checkIfBankCard, checkIfOther)(combinedPaymentMethod)
  }

  return defaultTo(defaultResult)(find(filter)(combinedPaymentMethods))
}

export const getSelectedPaymentTypeFromForms = createSelector(
  selectDecoratedCombinedPaymentMethods,
  getBillingCardPaymentType,
  (combinedPaymentMethods, paymentType) =>
    getCombinedPaymentMethodByPaymentMethodValue(
      combinedPaymentMethods,
      paymentType,
      combinedPaymentMethods[0]
    )
)

export const getSelectedPaymentTypeFromFormsWithoutDefaultResult = createSelector(
  selectDecoratedCombinedPaymentMethods,
  getBillingCardPaymentType,
  (combinedPaymentMethods, paymentType) =>
    getCombinedPaymentMethodByPaymentMethodValue(
      combinedPaymentMethods,
      paymentType,
      undefined
    )
)

export const getSavedPaymentTypeFromAccount = createSelector(
  selectDecoratedCombinedPaymentMethods,
  getCreditCardType,
  (combinedPaymentMethods, paymentType) =>
    getCombinedPaymentMethodByPaymentMethodValue(
      combinedPaymentMethods,
      paymentType,
      undefined
    )
)

/**
 * A selector to get the current payment config
 *
 * @param {ReduxState} state
 * @return {PaymentConfig}
 */
export const getCurrentPaymentConfig = (state) => {
  const selectedPaymentType = getSelectedPaymentType(state)

  const paymentMethodConfig = paymentsMethodsConfig[selectedPaymentType] || {}

  return {
    ...paymentsMethodsConfigDefault,
    ...paymentMethodConfig,
  }
}
