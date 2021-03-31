/**
 * Server Side Analytics sends information to Google Analytics.
 *
 * It is used in cases where conventional client-side reporting to Google Analytics may
 * be considered unreliable by comparison and the accuracy of the reporting matters.
 *
 * The 'universal-analytics' package is the backbone of the system:
 *   https://www.npmjs.com/package/universal-analytics
 *
 * More information on the Measurement Protocol used to communicate with Google
 * Analytics can be found here:
 *   https://developers.google.com/analytics/devguides/collection/protocol/v1/
 */

import { pathOr, path } from 'ramda'

import {
  extractClientId,
  getVisitor,
  logEnhancedEcommercePurchase,
  logSsr,
} from './core'

import {
  extractHostName,
  extractBrandCodeFromHeader,
} from '../../../../../config'

/**
 * Logs a purchase to Google Analytics, combining the order information
 * with the context in which the order took place from the client side.
 *
 * @param  {Object} params
 * @param  {Object} params.completedOrder  Order details curated from WCS
 * @param  {String} params.analyticsId     Unique identifier representing a client (optional)
 * @param  {String} params.headerBrandCode Arcadia brand code
 * @param  {String} params.userId          Unique identifer representing a registered user (optional)
 * @param  {Array}  params.promoCodes      Promotion / Coupon codes applied to the purchase (optional)
 * @param  {String} params.analyticsHost   The hostname of the site the purchase is made from
 * @return {Undefined}
 */
export function logPurchase({
  completedOrder,
  analyticsId,
  headerBrandCode,
  userId,
  promoCodes,
  analyticsHost,
}) {
  const hostname = extractHostName(analyticsHost)
  const brandCode = extractBrandCodeFromHeader(headerBrandCode)
  const clientId = extractClientId(analyticsId)
  const visitor = getVisitor(brandCode, clientId, userId)

  const transactionInfo = {
    transactionId: path(['orderId'], completedOrder),
    revenue: path(['totalOrderPrice'], completedOrder),
    shipping: path(['deliveryCost'], completedOrder),
    currencyCode: path(['currencyConversion', 'currencyRate'], completedOrder),
  }

  const lineItems = pathOr([], ['orderLines'], completedOrder)

  logEnhancedEcommercePurchase(
    visitor,
    brandCode,
    transactionInfo,
    lineItems,
    promoCodes,
    hostname
  )
}

/**
 * Logs an ecommerce event hit for Server Side Render for /order-complete
 *
 * @param  {Object} params
 * @param  {Object} params.completedOrder  Order details curated from WCS
 * @param  {String} params.analyticsId     Unique identifier representing a client (optional)
 * @param  {String} params.headerBrandCode Arcadia brand code
 * @param  {String} params.analyticsHost   The hostname of the site the purchase is made from
 * @return {Undefined}
 */
export function logSsrOrderComplete({
  completedOrder,
  analyticsId,
  headerBrandCode,
  analyticsHost,
}) {
  const hostname = extractHostName(analyticsHost)
  const brandCode = extractBrandCodeFromHeader(headerBrandCode)
  const clientId = extractClientId(analyticsId)
  const visitor = getVisitor(brandCode, clientId)

  const transactionInfo = {
    transactionId: path(['orderId'], completedOrder),
  }

  logSsr(visitor, transactionInfo, hostname, 'order-complete')
}
