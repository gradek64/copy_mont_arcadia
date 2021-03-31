import { path, pathOr } from 'ramda'
import universalAnalytics from 'universal-analytics'
import uuidv4 from 'uuid/v4'

import { getSiteConfigs } from '../../../../../config'
import * as logger from '../../../../../lib/logger'

const TRACKING_MAP = {
  TESTING: 'UA-99206402-27',
  ts: 'UA-99206402-1', // Topshop
  tm: 'UA-99206402-2', // Topman
  ev: 'UA-99206402-3', // Evans
  br: 'UA-99206402-4', // Burton
  wl: 'UA-99206402-5', // Wallis
  dp: 'UA-99206402-6', // Dorothy Perkins
  ms: 'UA-99206402-7', // Miss Selfridge
}

export function getBrandDisplayName(brandCode) {
  const byBrandCode = (config) => config.brandCode === brandCode
  const brandConfig = getSiteConfigs().find(byBrandCode)
  return pathOr('', ['brandDisplayName'], brandConfig)
}

export function extractClientId(analyticsId) {
  // Format: GAv.c.r.t
  //
  // GA = Google Analytics
  // v  = Version number
  // c  = Number of components under the TLD e.g.
  //        2 on m.topshop.com
  //        3 on m.burton.co.uk
  // r  = Random number
  // t  = Timestamp
  //
  // Taken together, r.t is the Client ID
  // The reason why we need to extract the client id here is that GA requires it but
  // provides no guidance on its structure. Thanks Google... 🤷‍♂️
  const gaFormat = /^GA\d\.\d\.(\d+\.\d+)$/
  const matches = gaFormat.exec(analyticsId)
  return matches ? matches[1] : undefined
}

export function envSsaEnableReporting() {
  return process.env.SSA_ENABLE_REPORTING === 'true'
}

export function envSsaPoolProperty() {
  switch (process.env.SSA_POOL_PROPERTY) {
    case '':
    case 'undefined':
    case 'null':
    case 'false':
    case 'true':
      return null

    default:
      return process.env.SSA_POOL_PROPERTY
  }
}

/**
 * Creates a visitor instance that can be used to build and send hits to
 * Google Analytics using the Measurement Protocol.
 *
 * Automatically generates a clientId if not supplied.
 *
 * @param  {String} brandCode   Arcadia brand code
 * @param  {String} [clientId]  Unique code used to track a client
 * @param  {String} [userId]    Unique code used to a registered user
 * @return {Object}             Visitor instance
 */
export function getVisitor(brandCode, clientId, userId) {
  const poolProperty = envSsaPoolProperty()
  if (poolProperty) {
    brandCode = poolProperty
  }

  const trackingId = pathOr(TRACKING_MAP.TESTING, [brandCode], TRACKING_MAP)

  const options = { enableBatching: false }

  if (!(clientId && typeof clientId === 'string')) {
    logger.info('server-side-analytics clientId missing, generating UUID')
    clientId = uuidv4()
  }

  if (userId && typeof userId === 'string') {
    options.uid = userId
  }

  // Sets the following Measurement Protocol parameters:
  // Protocol Version:              v = 1
  // Tracking ID / Web Property ID: tid = TRACKING_MAP[brandCode] || TRACKING_MAP.TESTING
  // Client ID:                     cid = clientId
  // User ID:                       uid = userId (only set when provided)
  return universalAnalytics(trackingId, clientId, options)
}

/**
 * Logs a purchase as a transaction hit followed by item hits.
 *
 * @param  {Object} visitor         Visitor instance created by getVisitor()
 * @param  {Object} transactionInfo Details common to the whole transaction
 * @param  {Array}  lineItems       Details of all purchased items
 * @return {Undefined}
 */
export function logStandardEcommercePurchase(
  visitor,
  transactionInfo,
  lineItems
) {
  if (!visitor) {
    return
  }

  // Sets the following Measurement Protocol parameters:
  // Hit type: t = transaction
  visitor = visitor.transaction({
    /* Transaction ID */ ti: pathOr(
      'Missing transactionId',
      ['transactionId'],
      transactionInfo
    ),
    /* Revenue        */ tr: pathOr(0, ['revenue'], transactionInfo),
    /* Shipping       */ ts: pathOr(0, ['shipping'], transactionInfo),
    /* Currency Code  */ cu: pathOr(
      'Missing currencyCode',
      ['currencyCode'],
      transactionInfo
    ),
    /* Product Action */ pa: 'purchase',
  })

  if (Array.isArray(lineItems)) {
    visitor = lineItems.reduce(
      (accVisitor, lineItem) =>
        // Sets the following Measurement Protocol parameters:
        // Hit type: t = item
        accVisitor.item({
          /* Item Price       */ ip: pathOr(0, ['total'], lineItem),
          /* Item Quantity    */ iq: pathOr(0, ['quantity'], lineItem),
          /* Item Code (SKU)  */ ic: pathOr(
            'Missing lineNo',
            ['lineNo'],
            lineItem
          ),
          /* Item Name        */ in: pathOr('Missing name', ['name'], lineItem),
          /* Item Category    */ iv: '', // TODO Need a source for this
        }),
      visitor
    )
  }

  if (envSsaEnableReporting()) {
    visitor.send((error) => {
      if (error) {
        logger.error('server-side-analytics send() failed', error)
      }
    })
  }
}

/**
 * Logs a purchase as an event hit containing enhanced ecommerce information.
 *
 * @param  {Object} visitor         Visitor instance created by getVisitor()
 * @param  {String} brandCode       Arcadia brand code
 * @param  {Object} transactionInfo Details common to the whole transaction
 * @param  {Array}  lineItems       Details of all purchased items
 * @param  {Array}  promoCodes      Promotion / Coupon codes applied to the purchase
 * @param  {String} hostname        The hostname of the site the purchase is made from
 * @return {Undefined}
 */
export function logEnhancedEcommercePurchase(
  visitor,
  brandCode,
  transactionInfo,
  lineItems,
  promoCodes = [],
  hostname = 'm.topshop.com'
) {
  if (!visitor) {
    return
  }

  /* Caution, unwary engineer:
   * 
   * You would think that an 'Enhanced' Ecommerce 'transaction' hit would be like a normal
   * Ecommerce 'transaction' hit with extra information, because that seems like a reasonable
   * design choice.
   * 
   * And you'd be wrong!
   * 
   * Because Google have decided that an Enhanced Ecommerce transaction is in fact an 'event'
   * hit carrying transaction information. Consequently, we will be building our own event parameter
   * object instead of relying on the transaction functions of the universal-analytics module.
   *
   * See the section on 'Enhanced Ecommerce Tracking' for more:
   *   https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
   *   
   * To compound the brilliance of this design choice, Google's own Hit Builder
   * (https://ga-dev-tools.appspot.com/hit-builder/) will declare a conventional 'transaction'
   * hit containing Enhanced Ecommerce parameters to be valid when it is not, in direct
   * contravention of their own developer documentation.
   */

  const detectPromoCode = (codeDefinition) => {
    const promoCode = path(['voucherCodes'], codeDefinition)
    return promoCode && typeof promoCode === 'string'
  }

  // cg1 and cg2 are identical deliberately for reporting purposes. For other events cg2 would be a
  // subcategory of cg1; there is no subcategory for Order Complete but it still needs filling in.
  const groupBrand = (brandCode) =>
    brandCode ? brandCode.toUpperCase() : 'TESTING'
  const contentGroup = `${groupBrand(brandCode)}:Order-Confirmed`

  const eventParams = {
    /* Document location URL */ dl: `https://${hostname}/order-complete`,
    /* Data Source           */ ds: 'coreApi',
    /* Content Group         */ cg1: contentGroup,
    /* Content Group         */ cg2: contentGroup,
    /* Event Category        */ ec: 'ecommerce',
    /* Event Action          */ ea: 'purchase',
    /* Event Label           */ el: pathOr(
      'Missing transactionId',
      ['transactionId'],
      transactionInfo
    ),
    /* Non-Interaction Hit   */ ni: 1,
  }

  const transactionParams = {
    /* Transaction ID */ ti: pathOr(
      'Missing transactionId',
      ['transactionId'],
      transactionInfo
    ),
    /* Revenue        */ tr: pathOr(0, ['revenue'], transactionInfo),
    /* Shipping       */ ts: pathOr(0, ['shipping'], transactionInfo),
    /* Currency Code  */ cu: pathOr(
      'Missing currencyCode',
      ['currencyCode'],
      transactionInfo
    ),
    /* Product Action */ pa: 'purchase',
  }

  /* Coupon Code (optional) */
  const promoCode = promoCodes.find(detectPromoCode)
  if (promoCode) {
    transactionParams.tcc = promoCode.voucherCodes
  }

  // Indices start from 1 in the Measurement Protocol, not 0.
  const productParams = Array.isArray(lineItems)
    ? lineItems.reduce(
        (acc, lineItem, itemIndex) => ({
          ...acc,
          /* Product SKU      */ [`pr${itemIndex + 1}id`]: pathOr(
            'Missing lineNo',
            ['lineNo'],
            lineItem
          ),
          /* Product Name     */ [`pr${itemIndex + 1}nm`]: pathOr(
            'Missing name',
            ['name'],
            lineItem
          ),
          /* Product Price    */ [`pr${itemIndex + 1}pr`]: pathOr(
            0,
            ['total'],
            lineItem
          ),
          /* Product Brand    */ [`pr${itemIndex + 1}br`]: getBrandDisplayName(
            brandCode
          ),
          /* Product Quantity */ [`pr${itemIndex + 1}qt`]: pathOr(
            0,
            ['quantity'],
            lineItem
          ),
          /* Product Category */ [`pr${itemIndex + 1}ca`]: '', // TODO Need a source for this
        }),
        {}
      )
    : {}

  const params = {
    ...eventParams,
    ...transactionParams,
    ...productParams,
  }

  // Sets the following Measurement Protocol parameters:
  // Hit type: t = event
  visitor = visitor.event(params)

  if (envSsaEnableReporting()) {
    visitor.send((error) => {
      if (error) {
        logger.error('server-side-analytics send() failed', error)
      }
    })
  }
}

/**
 * Logs an ecommerce event hit for Server Side Render for the given path
 *
 * @param  {Object} visitor         Visitor instance created by getVisitor()
 * @param  {Object} transactionInfo Details common to the whole transaction
 * @param  {String} hostname        The hostname of the site the purchase is made from
 * @param  {String} path            The page path
 * @return {Undefined}
 */
export function logSsr(
  visitor,
  transactionInfo,
  hostname = 'm.topshop.com',
  path
) {
  if (!visitor) {
    return
  }

  const params = {
    /* Document location URL */ dl: `https://${hostname}/${path}`,
    /* Data Source           */ ds: 'coreApi',
    /* Event Category        */ ec: 'ecommerce',
    /* Event Action          */ ea: 'server side render',
    /* Event Label           */ el: pathOr(
      'Missing transactionId',
      ['transactionId'],
      transactionInfo
    ),
    /* Non-Interaction Hit   */ ni: 1,
  }

  // Sets the following Measurement Protocol parameters:
  // Hit type: t = event
  visitor = visitor.event(params)

  if (envSsaEnableReporting()) {
    visitor.send((error) => {
      if (error) {
        logger.error('server-side-analytics send() failed', error)
      }
    })
  }
}
