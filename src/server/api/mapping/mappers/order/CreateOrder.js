import Boom from 'boom'
import { path, pathOr } from 'ramda'
import Mapper from '../../Mapper'
import orderTransform from '../../transforms/order'
import { clearKlarnaCookies } from './cookies/index'
import { createOrderErrorCodes } from '../../constants/wcsErrorCodes'
import * as serverSideAnalytics from './server_side_analytics'
import { isApps } from '../../utils/headerUtils'
import {
  removeBillingShippingStateDiacritics,
  removeCanadaDiacritics,
  removeDiacritics,
  removeStateDiacritics,
} from '../../utils/genericUtils'
import { createRawThreeDSecure1Form } from '../../../../../shared/lib/checkout-utilities/create-three-d-secure-form'
import { validateGoogleRecaptchaToken } from '../../../../lib/google-utils'
import emailServiceStoreMap from '../../../hostsConfig/store_email_service_map.json'
import { setCustomAttribute } from '../../../../lib/logger'

// Partly Copied from the old (scrApi) monty handler src/server/handlers/order.js.
// This function extracts from the headers the first one in 'x-forwarded-for' which is set by AKAMAI and is necessary in order to be able to pass to the Payment
// Gateways downstream the IP of the Client so that we avoid Fraud detection.
const extractClientIP = (headers) => {
  const header = headers && headers['x-forwarded-for'] // `header` is; '', '217.22.82.162', or '217.22.82.162, 2.20.133.114, ...'
  if (typeof header === 'string' && header.length > 0) {
    return header.split(',')[0]
  }
  return '127.0.0.1'
}

const createBillingPayload = (montyPayload = {}, storeConfig = {}) => {
  const { catalogId, langId, siteId: storeId } = storeConfig
  const {
    orderDeliveryOption: {
      orderId = '',
      deliveryStoreCode = '',
      shippingCountry = '',
    } = {},
    billingDetails: {
      address: {
        address1: billingAddress1 = '',
        address2: billingAddress2 = '',
        city: billingCity = '',
        state: billingState,
        country: billingCountry = '',
        postcode: billingPostcode = '',
      } = {},
      nameAndPhone: {
        firstName: billingFirstName = '',
        lastName: billingLastName = '',
        telephone: billingTelephone = '',
        title: billingTitle = '',
      } = {},
    } = {},
  } = montyPayload

  return {
    storeId,
    catalogId,
    orderId,
    langId,
    shipping_nickName: `Default_${
      deliveryStoreCode ? 'Store' : 'Shipping'
    }_${storeId}`,

    billing_nickName: `Default_Billing_${storeId}`,
    billing_personTitle: removeDiacritics(billingTitle),
    billing_firstName: removeDiacritics(billingFirstName),
    billing_lastName: removeDiacritics(billingLastName),
    billing_phone1: billingTelephone,
    billing_country: removeDiacritics(billingCountry),
    billing_address1: removeDiacritics(billingAddress1),
    billing_address2: removeDiacritics(billingAddress2),
    billing_city: removeDiacritics(billingCity),
    billing_zipCode: billingPostcode,

    billing_state_input: removeStateDiacritics(billingState, shippingCountry),
    billing_state_select: removeStateDiacritics(billingState, shippingCountry),
    billing_state_select_canada: removeCanadaDiacritics(
      billingState,
      shippingCountry
    ),
    billing_state_hidden: removeBillingShippingStateDiacritics(billingState),

    // dependant on shipping
    DTS_Shipping: deliveryStoreCode ? 'true' : 'false', // true for store delivery
    preferredLanguage: '',
    preferredCurrency: '',

    // constants
    ShippingCountryInList: 'true', // always true
    proceed: '',
    registerType: 'R',
    returnPage: 'ShoppingBag',
    fromBillingPage: 'y',
    source: 'CHECKOUT',
    isoCode: '',
    page: 'account',
    editRegistration: 'Y',
    editSection: 'CB',
    outOrderItemName: '',
    URL: 'OrderCalculate?URL=OrderPrepare?URL=AddressUpdateAjaxView',
    errorViewName: 'AddressUpdateAjaxView',
    billing_errorViewName: 'DeliveryPaymentPageUpdateAjaxView',
    lookupHouseNumber: '',
    lookupPostcode: '',
    montyUserAction: 'billing',
    subscribe: '',
    addressResults: '1',
  }
}

const createDeliveryPayload = (montyPayload = {}, storeConfig = {}) => {
  const { catalogId, langId, siteId: storeId } = storeConfig
  const {
    orderDeliveryOption: {
      orderId = '',
      // shipModeId = '',
      deliveryStoreCode,
      shippingCountry = '',
    } = {},
    deliveryAddress: {
      address1 = '',
      address2 = '',
      city = '',
      state = '',
      country = '',
      postcode = '',
    } = {},
    deliveryNameAndPhone: {
      firstName = '',
      lastName = '',
      telephone = '',
      title = '',
    } = {},
  } = montyPayload

  return {
    orderId,
    storeId,
    catalogId,
    langId,
    shipping_nickName: `Default_${
      deliveryStoreCode ? 'Store' : 'Shipping'
    }_${storeId}`,
    shipping_personTitle: removeDiacritics(title),
    shipping_firstName: removeDiacritics(firstName),
    shipping_lastName: removeDiacritics(lastName),
    shipping_phone1: telephone,
    shipping_country: removeDiacritics(country),
    shipping_address1: removeDiacritics(address1),
    shipping_address2: removeDiacritics(address2),
    shipping_city: removeDiacritics(city),
    shipping_state_input: removeStateDiacritics(state, shippingCountry),
    shipping_state_select: removeStateDiacritics(state, shippingCountry),
    shipping_state_select_canada: removeCanadaDiacritics(
      state,
      shippingCountry
    ),
    shipping_state_hidden: removeBillingShippingStateDiacritics(state),

    shipping_zipCode: postcode,
    // shipModeId, ? mayby need to pass

    // dependant on shipping
    deliveryOptionType: deliveryStoreCode ? 'S' : 'H', // delivery dependant H home, S for other
    field1: deliveryStoreCode, // store delivery, store id eg TS0001

    // constants
    URL: 'ProcessDeliveryDetails',
    proceed: '',
    registerType: 'R',
    returnPage: 'ShoppingBag',
    isoCode: '',
    page: 'account',
    editRegistration: 'Y',
    editSection: '',
    outOrderItemName: '',
    actionType: 'updateCountryAndOrderItems',
    shipping_errorViewName: 'UserRegistrationForm',
    lookupHouseNumber: '',
    lookupPostcode: '',
    status: 'P',
    errorViewName: 'AddressUpdateAjaxView',
    preferredLanguage: '',
    preferredCurrency: '',
    sourcePage: '',
    montyUserAction: 'shipping',
  }
}

const createGuestUserPayloads = (montyPayload = {}, storeConfig = {}) => {
  const { catalogId, langId, siteId: storeId, currencyCode } = storeConfig
  const {
    orderDeliveryOption: {
      orderId = '',
      shipCode = '',
      shipModeId = '',
      deliveryStoreCode = '',
      shippingCountry = '',
      nominatedDate = '',
    } = {},
    deliveryAddress: {
      address1 = '',
      address2 = '',
      city = '',
      state = '',
      country = '',
      postcode = '',
    } = {},
    deliveryNameAndPhone: {
      firstName = '',
      lastName = '',
      telephone = '',
      title = '',
    } = {},
    deliveryInstructions = '',
    smsMobileNumber = '',
    billingDetails: {
      address: {
        address1: billingAddress1 = '',
        address2: billingAddress2 = '',
        city: billingCity = '',
        state: billingState,
        country: billingCountry = '',
        postcode: billingPostcode = '',
      } = {},
      nameAndPhone: {
        firstName: billingFirstName = '',
        lastName: billingLastName = '',
        telephone: billingTelephone = '',
        title: billingTitle = '',
      } = {},
    } = {},
    accountCreate: {
      email = '',
      password = '',
      passwordConfirm = '',
      subscribe = '',
    } = {},
  } = montyPayload

  const updateDeliveryAddressPayload = {
    smsAlerts: smsMobileNumber,
    orderId,
    storeId,
    catalogId,
    langId,
    shipping_nickName: `Default_${
      deliveryStoreCode ? 'Store' : 'Shipping'
    }_${storeId}`,
    shipping_personTitle: removeDiacritics(title),
    shipping_firstName: removeDiacritics(firstName),
    shipping_lastName: removeDiacritics(lastName),
    shipping_phone1: telephone,
    shipping_country: removeDiacritics(country),
    shipping_address1: removeDiacritics(address1),
    shipping_address2: removeDiacritics(address2),
    shipping_city: removeDiacritics(city),

    shipping_state_input: removeStateDiacritics(state, shippingCountry),
    shipping_state_select: removeStateDiacritics(state, shippingCountry),
    shipping_state_select_canada: removeCanadaDiacritics(
      state,
      shippingCountry
    ),
    shipping_state_hidden: removeBillingShippingStateDiacritics(state),

    shipping_zipCode: postcode,
    shipModeId,
    deliveryInstructions,
    available_date: deliveryStoreCode ? undefined : shipModeId,
    carrier_instructions: deliveryInstructions,
    carrier_mobile: smsMobileNumber,
    orderItemShipMode: shipModeId,
    orderItemShipCode: shipCode,

    // dependant on shipping
    deliveryOptionType: deliveryStoreCode ? 'S' : 'H', // delivery dependant H home, S for other
    field1: deliveryStoreCode, // store delivery, store id eg TS0001

    preferredLanguage: langId,
    preferredCurrency: currencyCode,

    // constants
    URL: 'ProcessDeliveryDetails?actionType=updateDeliveryDetails',
    proceed: 'Y', // Pass Y
    registerType: 'R',
    returnPage: 'ShoppingBag',
    isoCode: '',
    page: 'account',
    editRegistration: 'Y',
    editSection: '',
    outOrderItemName: '',
    actionType: 'updateCountryAndOrderItems',
    sourcePage: 'DeliveryPage',
    shipping_errorViewName: 'UserRegistrationForm',
    lookupHouseNumber: '',
    lookupPostcode: '',
    addressResults: '',
    status: 'P',
    errorViewName: 'UserRegistrationForm',
    nominatedDate,
    redirectPageChange: 'Y',
    montyUserAction: 'shipping',
  }

  const registerPayload = email
    ? {
        create_logonId: email,
        logonPassword: password,
        logonPasswordVerify: passwordConfirm,
        subscribe: subscribe ? 'YES' : 'NO',
      }
    : {}
  const billingAddressPayload = {
    ...registerPayload,
    storeId,
    catalogId,
    orderId,
    langId,
    shipping_nickName: `Default_${
      deliveryStoreCode ? 'Store' : 'Shipping'
    }_${storeId}`,
    shipping_personTitle: removeDiacritics(title),
    shipping_firstName: removeDiacritics(firstName),
    shipping_lastName: removeDiacritics(lastName),
    shipping_phone1: telephone,
    shipping_phone2: smsMobileNumber,
    shipping_country: removeDiacritics(country),
    shipping_address1: removeDiacritics(address1),
    shipping_address2: removeDiacritics(address2),
    shipping_state: removeBillingShippingStateDiacritics(state),
    shipping_city: removeDiacritics(city),
    shipping_zipCode: postcode,

    saved_title: removeDiacritics(title),
    saved_firstName: removeDiacritics(firstName),
    saved_lastName: removeDiacritics(lastName),
    saved_addressLine1: removeDiacritics(address1),
    saved_addressLine2: removeDiacritics(address2),
    saved_townCity: removeDiacritics(city),
    saved_state: removeBillingShippingStateDiacritics(state),
    saved_postcode: postcode,
    saved_country: removeDiacritics(country),
    saved_telephone: telephone,

    billing_nickName: `Default_Billing_${storeId}`,
    billing_personTitle: removeDiacritics(billingTitle),
    billing_firstName: removeDiacritics(billingFirstName),
    billing_lastName: removeDiacritics(billingLastName),
    billing_phone1: billingTelephone,
    billing_country: removeDiacritics(billingCountry),
    billing_address1: removeDiacritics(billingAddress1),
    billing_address2: removeDiacritics(billingAddress2),
    billing_city: removeDiacritics(billingCity),
    billing_zipCode: billingPostcode,

    billing_state_input: removeStateDiacritics(billingState, shippingCountry),
    billing_state_select: removeStateDiacritics(billingState, shippingCountry),
    billing_state_select_canada: removeCanadaDiacritics(
      billingState,
      shippingCountry
    ),
    billing_state_hidden: removeBillingShippingStateDiacritics(billingState),

    // dependant on shipping
    DTS_Shipping: deliveryStoreCode ? 'true' : 'false', // true for store delivery
    preferredLanguage: langId,
    preferredCurrency: currencyCode,

    // constants
    ShippingCountryInList: 'true', // always true
    proceed: 'Y',
    registerType: 'R',
    returnPage: 'ShoppingBag',
    fromBillingPage: 'y',
    source: 'CHECKOUT',
    isoCode: '',
    page: 'account',
    editRegistration: 'Y',
    editSection: 'NA',
    outOrderItemName: '',
    shipping_addressType: 'SB', // SB for ever
    shipping_primary: '0',
    URL: 'OrderCalculate?URL=OrderPrepare?URL=PaymentPageUpdateAjaxView',
    errorViewName: 'PaymentPageUpdateAjaxView',
    billing_errorViewName: 'UserRegistrationForm',
    lookupHouseNumber: '',
    lookupPostcode: '',
    montyUserAction: 'billing',
  }

  return {
    updateDeliveryAddressPayload,
    billingAddressPayload,
  }
}

const createGuestCheckoutUserPayloads = (
  montyPayload = {},
  storeConfig = {}
) => {
  const {
    orderDeliveryOption: { shipModeId = '', deliveryStoreCode = '' } = {},
    deliveryAddress: {
      address1 = '',
      address2 = '',
      city = '',
      state = '',
      country = '',
      postcode = '',
    } = {},
    deliveryNameAndPhone: {
      firstName = '',
      lastName = '',
      telephone = '',
      title = '',
    } = {},
    deliveryInstructions = '',
    smsMobileNumber = '',
    signUpGuest = false,
    billingDetails: {
      address: {
        address1: billingAddress1 = '',
        address2: billingAddress2 = '',
        city: billingCity = '',
        state: billingState = '',
        country: billingCountry = '',
        postcode: billingPostcode = '',
      } = {},
      nameAndPhone: {
        firstName: billingFirstName = '',
        lastName: billingLastName = '',
        telephone: billingTelephone = '',
        title: billingTitle = '',
      } = {},
    } = {},
  } = montyPayload
  const { storeCode } = storeConfig
  const serviceID = emailServiceStoreMap[storeCode || 'tsuk']

  return {
    shipping_personTitle: removeDiacritics(title),
    shipping_firstName: removeDiacritics(firstName),
    shipping_lastName: removeDiacritics(lastName),
    shipping_phone1: telephone,
    shipping_phone2: smsMobileNumber,
    shipping_country: removeDiacritics(country),
    shipping_address1: removeDiacritics(address1),
    shipping_address2: removeDiacritics(address2),
    shipping_state: removeBillingShippingStateDiacritics(state),
    shipping_city: removeDiacritics(city),
    shipping_zipCode: postcode,

    // dependant on shipping
    deliveryOptionType: deliveryStoreCode ? 'S' : 'H', // delivery dependant H home, S for other
    shipping_field1: deliveryStoreCode, // store delivery, store id eg TS0001

    shipModeId,
    deliveryInstructions,
    available_date: deliveryStoreCode ? undefined : shipModeId,
    carrier_instructions: deliveryInstructions,
    carrier_mobile: smsMobileNumber,

    billing_personTitle: removeDiacritics(billingTitle),
    billing_firstName: removeDiacritics(billingFirstName),
    billing_lastName: removeDiacritics(billingLastName),
    billing_phone1: billingTelephone,
    billing_country: removeDiacritics(billingCountry),
    billing_address1: removeDiacritics(billingAddress1),
    billing_address2: removeDiacritics(billingAddress2),
    billing_city: removeDiacritics(billingCity),
    billing_state: removeBillingShippingStateDiacritics(billingState),
    billing_zipCode: billingPostcode,
    signUpGuest,
    ...(signUpGuest && {
      source: 'CHECKOUT',
      default_service_id: serviceID,
    }),
  }
}

export default class CreateOrder extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = !this.hasCheckoutProfile
      ? '/webapp/wcs/stores/servlet/ConfirmAndPay'
      : '/webapp/wcs/stores/servlet/OrderCalculate'
    this.method = 'post'
  }

  mapRequestParameters() {
    const userAgent = (this.headers && this.headers['user-agent']) || ''

    const { catalogId, langId, siteId: storeId } = this.storeConfig
    // {"smsMobileNumber":"","remoteIpAddress":"127.0.0.1","cardCvv":"123","orderDeliveryOption":{"orderId":2195209,"shippingCountry":"United Kingdom","shipCode":"S","deliveryType":"HOME_STANDARD","shipModeId":26504},"deliveryInstructions":"","returnUrl":"http://local.m.topshop.com:8080/order-complete-v1?paymentMethod=VISA","cardNumberHash":"tjOBl4zzS+ueTZQWartO5l968iOmCOix"}
    const {
      cardNumberHash,
      cardCvv,
      orderDeliveryOption: {
        orderId,
        shipCode,
        nominatedDate = '',
        deliveryType,
      } = {},
      deliveryInstructions,
      authToken,
      returnUrl,
      smsMobileNumber = '',
      paymentToken,
      dfReferenceId,
      challengeWindowSize,
      isGuestOrder,
      email,
      ddcDowngradeReason,
    } = this.payload

    const guestCheckoutPayload = {
      email,
      isGuestOrder,
      deliveryType,
      ...createGuestCheckoutUserPayloads(this.payload, this.storeConfig),
    }

    if (paymentToken && typeof paymentToken !== 'string')
      throw Boom.badRequest(
        'paymentToken must be a JSON string with header (keys, transaction id and hash), signature, version and data'
      )

    const hasDfReferenceId = Object.prototype.hasOwnProperty.call(
      this.payload,
      'dfReferenceId'
    )

    // saving it before the overwriting of this.payload. We need to use it in the response when we will create the 3D Secure form.
    this.orderCompleteReturnUrl = returnUrl

    let cardBrand = (this.payload.creditCard || {}).type

    const {
      expiryYear: cardExpiryYear,
      expiryMonth: cardExpiryMonth,
      cardNumber: cardNumberStar,
    } = this.payload.creditCard || {}

    this.payload = {
      ipAddress: extractClientIP(this.headers),
      orderId,
      userAgent,
      deliveryInstructions,
      shipCode,
      langId,
      storeId,
      catalogId,
      errorViewName: 'DoPaymentErrorView',
      contentType: '*/*',
      acceptHeader: '*/*',
      notifyShopper: '0',
      notifyOrderSubmitted: '0',
      smsAlerts: smsMobileNumber, // need logic to set this, what is needed 'y', 'yes', 'true'?
      nominatedDate,
      TERMSANDCONDITIONS_OPTIN: 'true',
      // save_details is a new property in the incoming request payload,
      // by default set the outgoing request save_details = 'on' to maintain
      // current behaviour
      save_details: this.payload.save_details === false ? undefined : 'on',
      auth_token: authToken,

      billing_address_id: this.billingAddressId, // need if new address
      addressId: this.addressId, // need if new address
      paymentToken,
    }

    // This sets the payload for the guest checkout. We need to pass extra properties to the usual payload.
    if (isGuestOrder) {
      this.payload = {
        ...this.payload,
        ...guestCheckoutPayload,
      }
    }

    if (authToken) {
      // If the customer has selected the payment option "Klarna" it is required
      // to send WCS this parameter (apiMethod: 'payments') to update the klarna
      // api method call from credits to payments. When ADP-1022 is fully tested
      // and merged into production. WCS should update the klarna api method and
      // this logic can be removed from here and KlarnaSession.js (ADP-1155).

      this.payload = {
        ...this.payload,
        apiMethod: 'payments',
      }
    }

    if (cardCvv && cardCvv !== '0') {
      // cardSecurityNumber was part of the main payload and unconditionally sent to WCS in the request.
      // Moved here to follow Cogz suggestion in order to make it work the create Order with Gift Card.

      this.payload = {
        ...this.payload,
        cardSecurityNumber: cardCvv,
      }
    }

    // PSD2 - 3D Secure Flex support
    if (hasDfReferenceId && challengeWindowSize) {
      this.payload = {
        ...this.payload,
        dfReferenceId,
        challengeWindowSize,
        returnUrl,
      }

      if (ddcDowngradeReason) {
        this.payload = {
          ...this.payload,
          ddcDowngradeReason,
        }
      }
    }

    if (this.hasCheckoutProfile) {
      // URL was part of the main payload and unconditionally sent to WCS in the request.
      // Moved here to follow Cogz suggestion in order to make it work the create Order with Gift Card.

      this.payload = {
        ...this.payload,
        URL: 'OrderPrepare?URL=ConfirmAndPay',
      }
    }

    const isPayPal = /paymentMethod=PYPAL/.test(returnUrl)
    const isMasterpass = /paymentMethod=MPASS/.test(returnUrl)

    if (paymentToken) {
      cardBrand = 'APPLE'
    }

    const card =
      isPayPal || isMasterpass
        ? {
            cardBrand: isPayPal ? 'PYPAL' : 'MPASS',
            // Once the Dual Run starts the mobile parameter will be a bit confusing given that it will contain the return URL
            // for both monty-mobile and monty-desktop.
            // This parameter should be renamed to "returnUrl" but before to do that
            // a modification on WCS side needs to be applied.
            mobile: returnUrl,
          }
        : {
            cardExpiryYear,
            cardExpiryMonth,
            cardNumberStar,
            cardBrand,
            cardNumber: cardNumberHash,
          }

    this.payload = {
      ...this.payload,
      ...card,
    }

    // Exclude KLRNA and ACCNT payments from getting a mobile url as they don't redirect
    if (!/.*\b(KLRNA|ACCNT|APPLE).*$/i.test(returnUrl)) {
      this.payload.mobile = returnUrl
    }

    this.query = {}
  }

  mapResponseBody(body) {
    const { currencySymbol, currencyCode } = this.storeConfig

    if (body.confirmationTitle) {
      //
      // KLARNA, ACCOUNT CARD
      //

      const transformedBody = orderTransform(body, currencySymbol, currencyCode)

      if (!isApps(this.headers)) {
        serverSideAnalytics.logPurchase({
          completedOrder: pathOr({}, ['completedOrder'], transformedBody),
          analyticsId: path(['cookies', '_ga'], this),
          headerBrandCode: path(['headers', 'brand-code'], this),
          userId: path(['userId'], body), // a.k.a. Member ID in WCS
          promoCodes: path(['promoCodes'], body),
          analyticsHost: path(['headers', 'host'], this),
        })
      }

      return Promise.resolve(transformedBody)
    } else if (body.cardBrand === 'PYPAL' || body.cardBrand === 'MPASS') {
      //
      // PAYPAL, MASTERPASS
      //

      // errorRedirectURL is returned if the user provides an incorrect US delivery address. Any billing address is accepted.
      // redirectURL could be potentially returned as error from a third party plugin. It seems to be a rare case but we are handling it anyway.
      const {
        punchOutRepayURL,
        paymentRedirectURL,
        errorRedirectURL,
        redirectURL,
        token,
        tranId,
        policyId,
      } = body

      const errRedirectUrl = errorRedirectURL || redirectURL

      if (errRedirectUrl) {
        return this.sendRequestToApi(
          this.destinationHostname,
          `/webapp/wcs/stores/servlet/${errRedirectUrl}`,
          {},
          {},
          'post',
          this.headers
        ).then((res) => {
          const { body = {} } = res
          if (body.errorMessage && body.success === false) {
            return this.mapResponseError(body)
          }
          throw Boom.badGateway(
            `create order (PayPal) unexpected response: ${errRedirectUrl}`
          )
        })
      }

      return this.sendRequestToApi(
        this.destinationHostname,
        `/webapp/wcs/stores/servlet/${punchOutRepayURL}`,
        {},
        {},
        'post',
        this.headers
      ).then((res) => {
        this.mapErrorCode(res)

        if (!res || !res.body || !res.body.orderId)
          throw Boom.badGateway(
            'create order (PayPal): unexpected response for punchOutRepayURL request'
          )

        return {
          paypalUrl: paymentRedirectURL,
          paymentUrl: paymentRedirectURL,
          token,
          tranId,
          policyId,
        }
      })
    } else if (body.formEncoded) {
      //
      // 3D VISA, MASTERCARD, AMEX
      //
      const {
        TermUrl: originalTermUrl,
        piId,
        punchOutRepayURL,
        action,
        MD: md,
        PaReq: paReq,
        '3DSChallengeWindowSize': challengeWindowSize,
        challengeJwt,
        threeDSVersion,
        challengeUrl,
      } = body

      // WCS will only respond with these properties if a dfReferenceId is passed in the
      // request. This ensures that only clients configured to issue such a request will
      // receive 3DS Flex challenge details in response.
      const hasThreeDSFlexProperties = Boolean(
        challengeWindowSize && challengeJwt && threeDSVersion && challengeUrl
      )

      return this.sendRequestToApi(
        this.destinationHostname,
        `/webapp/wcs/stores/servlet/${punchOutRepayURL}`,
        {},
        {},
        'post',
        this.headers
      )
        .then((res) => {
          this.mapErrorCode(res)

          if (!res || !res.body || !res.body.orderId) {
            throw Boom.badGateway(
              'create order (3D): unexpected response for punchOutRepayURL request'
            )
          }

          // @TODO This continues to be made available on the response for the sake of the
          // apps, and can be removed when they no longer need it.
          //
          // Monty no longer uses the inner vbvForm, and instead constructs the form on the
          // front end from the original return URL, action, md, and paReq.
          const threeDSecureForm = createRawThreeDSecure1Form({
            action,
            md,
            paReq,
            orderCompleteReturnUrl: this.orderCompleteReturnUrl,
            includeSubmitScript: true,
          })

          const threeDSFlexResponse = {
            piId,
            md,
            challengeWindowSize,
            challengeJwt,
            threeDSVersion,
            challengeUrl,
          }

          const threeDS1Response = {
            vbvForm: {
              // "termUrl":"http://local.m.topshop.com:8080/order-complete?paymentMethod=MCARD"
              // "termUrl":"http://local.m.topshop.com:8080/order-complete?paymentMethod=AMEX"
              termUrl: this.orderCompleteReturnUrl,
              originalTermUrl,
              vbvForm: threeDSecureForm,
              piId,
              action,
              md,
              paReq,
            },
          }

          return hasThreeDSFlexProperties
            ? threeDSFlexResponse
            : threeDS1Response
        })
        .catch((err) => {
          const { wcsErrorCode } = pathOr({}, ['data'], err)
          throw wcsErrorCode ? err : Boom.badGateway(err)
        })
    } else if (
      body.paymentRedirectURL &&
      /^.*\b(ALIPY|SOFRT|CUPAY|IDEAL).*$/i.test(body.cardBrand)
    ) {
      //
      // SOFRT, ALIPY, CUPAY, IDEAL
      //
      return this.sendRequestToApi(
        this.destinationHostname,
        `/webapp/wcs/stores/servlet/PunchoutPaymentRepay?orderId=${body.orderId}&piId=${body.piId}&requesttype=ajax`,
        {},
        {},
        'post',
        this.headers
      )
        .then((res) => {
          this.mapErrorCode(res)

          if (!res || !res.body || !res.body.orderId) {
            throw Boom.badGateway(
              `create order ${body.cardBrand} : unexpected response for punchOutRepayURL request`
            )
          }
          return { paymentUrl: body.paymentRedirectURL } // This triggers Monty client to redirect to that site.
        })
        .catch((err) => {
          return this.mapResponseError(err)
        })
    } else if (body.paymentRedirectURL) {
      //
      // no 3D VISA, MASTERCARD, AMEX, MASTERO
      //
      const { punchOutRepayURL, paymentRedirectURL } = body

      return this.sendRequestToApi(
        this.destinationHostname,
        `/webapp/wcs/stores/servlet/${punchOutRepayURL}`,
        {},
        {},
        'post',
        this.headers
      )
        .then((res) => {
          this.mapErrorCode(res)

          if (!res || !res.body || !res.body.orderId)
            throw Boom.badGateway(
              'create order (no 3D): unexpected response for punchOutRepayURL request'
            )

          return this.sendRequestToApi(
            paymentRedirectURL,
            '',
            {},
            {},
            'get',
            this.headers,
            undefined,
            true
          )
        })
        .then((res) => {
          this.mapErrorCode(res)

          if (!res || !res.body || !res.body.redirectURL)
            throw Boom.badGateway(
              'create order (no 3D): unexpected response for paymentRedirectURL request'
            )

          return this.sendRequestToApi(
            res.body.redirectURL,
            '',
            {},
            {},
            'get',
            this.headers,
            undefined,
            true
          )
        })
        .then((res) => {
          this.mapErrorCode(res)

          if (!res || !res.body || !res.body.OrderConfirmation)
            throw Boom.badGateway(
              'create order (no 3D): unexpected OrderConfirmation response'
            )

          const transformedBody = orderTransform(
            res.body,
            currencySymbol,
            currencyCode
          )

          if (!isApps(this.headers)) {
            serverSideAnalytics.logPurchase({
              completedOrder: pathOr({}, ['completedOrder'], transformedBody),
              analyticsId: path(['cookies', '_ga'], this),
              headerBrandCode: path(['headers', 'brand-code'], this),
              userId: path(['body', 'userId'], res), // a.k.a. Member ID in WCS
              promoCodes: path(['body', 'promoCodes'], res),
              analyticsHost: path(['headers', 'host'], this),
            })
          }

          return transformedBody
        })
        .catch((err) => {
          const { wcsErrorCode } = pathOr({}, ['data'], err)
          throw wcsErrorCode ? err : Boom.badGateway(err)
        })
    } else if (body.cardBrand === 'CLRPY') {
      const {
        success,
        paymentToken,
        cardBrand,
        orderId,
        errorMessage,
        expires,
        policyId,
        tranId,
      } = body

      return Promise.resolve({
        success,
        paymentToken,
        cardBrand,
        orderId,
        errorMessage,
        expires,
        policyId,
        tranId,
      })
    }

    // If none of the response conditions are met, return a 422.
    return this.mapResponseError(body)
  }

  mapResponseError(error = {}) {
    if (error.isBoom) {
      throw error
    }

    throw error.errorMessage
      ? Boom.badData(
          error.errorMessage,
          /* Some error messages are not explicit. Passing additional
           * data to support the developer understand what the issue might be.
           * Currently this additional error data is only for Klarna payment option.
           * */
          error.excMsgParm ? { error: error.excMsgParm } : {}
        )
      : error
  }

  mapResponse(res = {}) {
    return this.mapResponseBody(res.body).then((transformedBody) => ({
      jsessionid: res.jsessionid,
      body: transformedBody,
      // Klarna cookies are created even if a user chooses Klarna and then chooses another method. They should always be cleared.
      setCookies: clearKlarnaCookies(),
    }))
  }

  async wcsUserRegistrationUpdate({ payload }) {
    const { body } = await this.sendRequestToApi(
      this.destinationHostname,
      `/webapp/wcs/stores/servlet/UserRegistrationUpdate`,
      {},
      payload,
      'post',
      this.headers
    )

    return body
  }

  assertResponseError({ responseBody, defaultErrorMessage }) {
    const {
      success,
      errorMessage,
      orderSummary: { errorMessage: orderSummaryErrorMessage } = {},
    } = responseBody

    if (success === false || errorMessage || orderSummaryErrorMessage) {
      if (errorMessage) {
        this.mapErrorCode({ body: responseBody })
      } else if (orderSummaryErrorMessage) {
        this.mapResponseError({ errorMessage: orderSummaryErrorMessage })
      } else {
        this.mapResponseError({ errorMessage: defaultErrorMessage })
      }
    }
  }

  async registerGuest() {
    const {
      updateDeliveryAddressPayload,
      billingAddressPayload,
    } = createGuestUserPayloads(this.payload, this.storeConfig)

    // TODO Ask Karthi if this updated is neeeded.
    const updateDeliveryAddressBody = await this.wcsUserRegistrationUpdate({
      payload: updateDeliveryAddressPayload,
    })

    this.assertResponseError({
      responseBody: updateDeliveryAddressBody,
      defaultErrorMessage: 'Unable to add delivery address',
    })

    const addressId = path(
      ['ConfirmAndPayCardDetailsForm', 'addressId'],
      updateDeliveryAddressBody
    )

    if (!addressId) {
      this.mapResponseError(
        Boom.notAcceptable('Unable to determine delivery address')
      )
    }

    this.addressId = addressId

    const billingAddressBody = await this.wcsUserRegistrationUpdate({
      payload: billingAddressPayload,
    })

    this.assertResponseError({
      responseBody: billingAddressBody,
      defaultErrorMessage: 'Unable to add billing address',
    })

    const billingAddressId = path(
      ['ConfirmAndPayCardDetailsForm', 'billing_address_id'],
      billingAddressBody
    )

    if (!billingAddressId) {
      this.mapResponseError(
        Boom.notAcceptable('Unable to determine billing address')
      )
    }

    this.billingAddressId = billingAddressId
  }

  async changeDeliveryAddress() {
    const deliveryAddressBody = await this.wcsUserRegistrationUpdate({
      payload: createDeliveryPayload(this.payload, this.storeConfig),
    })

    this.assertResponseError({
      responseBody: deliveryAddressBody,
      defaultErrorMessage: 'Unable to add delivery address',
    })

    const addressId = path(
      ['orderSummary', 'OrderCalculateForm', 'addressId'],
      deliveryAddressBody
    )

    if (!addressId) {
      this.mapResponseError(
        Boom.notAcceptable('Unable to determine delivery address')
      )
    }

    this.addressId = addressId
  }

  async changeBillingAddress() {
    const billingAddressBody = await this.wcsUserRegistrationUpdate({
      payload: createBillingPayload(this.payload, this.storeConfig),
    })

    this.assertResponseError({
      responseBody: billingAddressBody,
      defaultErrorMessage: 'Unable to add billing address',
    })

    const billingAddressId = path(
      ['orderSummary', 'OrderCalculateForm', 'billing_address_id'],
      billingAddressBody
    )

    if (!billingAddressId) {
      this.mapResponseError(
        Boom.notAcceptable('Unable to determine billing address')
      )
    }

    this.billingAddressId = billingAddressId
  }

  mapWCSErrorCodes = createOrderErrorCodes

  async execute() {
    const checkoutProfileValue = await this.getCookieFromStore(
      'profileExists',
      this.headers.cookie
    )
    const { isGuestOrder, isGuestRecaptchaEnabled = false } = this.payload

    this.hasCheckoutProfile =
      !this.payload.accountCreate && checkoutProfileValue === 'Y'

    if (!isGuestOrder) {
      if (
        !this.hasCheckoutProfile &&
        this.payload.deliveryAddress &&
        this.payload.billingDetails
      ) {
        await this.registerGuest()
      } else {
        if (this.payload.deliveryAddress) {
          await this.changeDeliveryAddress()
        }
        if (this.payload.billingDetails) {
          await this.changeBillingAddress()
        }
      }
    }

    const { brandName, recaptchaToken } = this.payload

    if (isGuestRecaptchaEnabled && recaptchaToken) {
      const recaptcha = await validateGoogleRecaptchaToken(
        brandName,
        recaptchaToken
      )

      if (!recaptcha.success) {
        this.mapResponseError(Boom.notAcceptable(recaptcha.errorMessage))
      }
    } else if (isGuestRecaptchaEnabled && !recaptchaToken) {
      setCustomAttribute('isRecaptchaTokenNull', true)
    }

    return super.execute()
  }
}

export const createOrderSpec = {
  summary: 'Create an order',
  description: 'Creating an order for different "paymentTypes"',
  parameters: [
    {
      name: 'Card payload - (New_User)',
      in: 'body',
      description:
        'The details of the order to be processed by payment type CARD as a new customer',
      schema: {
        type: 'object',
        properties: {
          billingDetails: {
            type: 'object',
            properties: {
              address: {
                type: 'object',
                properties: {
                  address1: {
                    type: 'string',
                  },
                  address2: {
                    type: 'string',
                  },
                  city: {
                    type: 'string',
                  },
                  state: {
                    type: 'string',
                  },
                  country: {
                    type: 'string',
                  },
                  postcode: {
                    type: 'string',
                  },
                },
              },
              nameAndPhone: {
                type: 'object',
                properties: {
                  firstName: {
                    type: 'string',
                  },
                  lastName: {
                    type: 'string',
                  },
                  telephone: {
                    type: 'string',
                  },
                  title: {
                    type: 'string',
                  },
                },
              },
            },
          },
          cardCvv: {
            type: 'string',
          },
          creditCard: {
            type: 'object',
            properties: {
              cardNumber: {
                type: 'string',
              },
              expiryMonth: {
                type: 'string',
              },
              expiryYear: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: ['ACCNT', 'AMEX', 'MCARD', 'SWTCH', 'VISA'],
                example: 'VISA',
              },
            },
            authToken: {
              type: 'string',
            },
          },
          deliveryAddress: {
            type: 'object',
            properties: {
              address1: {
                type: 'string',
              },
              address2: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
              country: {
                type: 'string',
              },
              postcode: {
                type: 'string',
              },
              state: {
                type: 'string',
              },
            },
          },
          deliveryInstructions: {
            type: 'string',
          },
          deliveryNameAndPhone: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              telephone: {
                type: 'string',
              },
              title: {
                type: 'string',
              },
            },
          },
          orderDeliveryOption: {
            type: 'object',
            properties: {
              deliveryStoreCode: {
                type: 'string',
                description: 'Only for collect from store and parcel shop',
              },
              orderId: {
                type: 'string',
              },
              shipCode: {
                type: 'string',
              },
              shipModeId: {
                type: 'string',
              },
              shippingCountry: {
                type: 'string',
              },
            },
          },
          paymentType: {
            type: 'string',
            enum: ['ACCNT', 'AMEX', 'MCARD', 'SWTCH', 'VISA'],
            example: 'VISA',
            description: 'Identifies which payment card type',
          },
          punchoutReturnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/psd2-order-punchout?orderId=8359831&paymentMethod=VISA',
          },
          remoteIpAddress: {
            type: 'string',
          },
          returnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/order-complete?orderId=8359831&paymentMethod=VISA',
          },
          save_details: {
            type: 'boolean',
            example: true,
          },
          smsMobileNumber: {
            type: 'string',
          },
          dfReferenceId: {
            type: 'string',
            description:
              'The SessionId returned by client-side Device Data Collection (DDC)',
          },
          challengeWindowSize: {
            type: 'string',
            enum: ['fullPage', '250x400', '390x400', '500x600', '600x400'],
            example: '390x400',
            description:
              'Challenge Window size the issuer should use to the display the challenge',
          },
          ddcDowngradeReason: {
            type: 'string',
            enum: ['DDC_RESPONSE_TIMEOUT', 'DDC_3DS2_UNSUPPORTED'],
            example: 'DDC_3DS2_UNSUPPORTED',
            description:
              'Reason for Device Data Collection (DDC) initiating a security downgrade',
          },
        },
      },
    },
    {
      name: 'Card payload - (Returning User)',
      in: 'body',
      description:
        'The details of the order to be processed by payment type CARD as a returning customer',
      schema: {
        type: 'object',
        properties: {
          cardCvv: {
            type: 'string',
          },
          cardNumberHash: {
            type: 'string',
            required: true,
          },
          deliveryInstructions: {
            type: 'string',
          },
          orderDeliveryOption: {
            type: 'object',
            properties: {
              deliveryStoreCode: {
                type: 'string',
                description: 'Only for collect from store and parcel shop',
              },
              orderId: {
                type: 'string',
              },
              shipCode: {
                type: 'string',
              },
              shipModeId: {
                type: 'string',
              },
              shippingCountry: {
                type: 'string',
              },
            },
          },
          paymentType: {
            type: 'string',
            enum: ['ACCNT', 'AMEX', 'MCARD', 'SWTCH', 'VISA'],
            example: 'VISA',
            description: 'Identifies which payment card type',
          },
          punchoutReturnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/psd2-order-punchout?orderId=8359831&paymentMethod=VISA',
          },
          remoteIpAddress: {
            type: 'string',
          },
          returnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/order-complete?orderId=8359831&paymentMethod=VISA',
          },
          save_details: {
            type: 'boolean',
            example: true,
          },
          smsMobileNumber: {
            type: 'string',
          },
          dfReferenceId: {
            type: 'string',
            description:
              'The SessionId returned by client-side Device Data Collection (DDC)',
          },
          challengeWindowSize: {
            type: 'string',
            enum: ['fullPage', '250x400', '390x400', '500x600', '600x400'],
            example: '390x400',
            description:
              'Challenge Window size the issuer should use to the display the challenge',
          },
          ddcDowngradeReason: {
            type: 'string',
            enum: ['DDC_RESPONSE_TIMEOUT', 'DDC_3DS2_UNSUPPORTED'],
            example: 'DDC_3DS2_UNSUPPORTED',
            description:
              'Reason for Device Data Collection (DDC) initiating a security downgrade',
          },
        },
      },
    },
    {
      name: 'Klarna Payload',
      in: 'body',
      description:
        'The details of the order to be processed by payment type Klarna',
      schema: {
        type: 'object',
        properties: {
          authToken: {
            type: 'string',
            description:
              'The authToken is provided by the Klarna SDK authorize method',
            example: '8ea20527-7179-7fb6-a7e4-267ffa98ad86',
            required: true,
          },
          cardCvv: {
            type: 'string',
            example: 0,
          },
          creditCard: {
            type: 'object',
            properties: {
              cardNumber: {
                type: 'string',
                example: '0',
              },
              expiryMonth: {
                type: 'string',
              },
              expiryYear: {
                type: 'string',
              },
              type: {
                type: 'string',
                example: 'KLRNA',
              },
            },
            authToken: {
              type: 'string',
            },
          },
          deliveryInstructions: {
            type: 'string',
            example: '',
          },
          orderDeliveryOption: {
            type: 'object',
            properties: {
              orderId: {
                type: 'string',
              },
              shipCode: {
                type: 'string',
              },
              shipModeId: {
                type: 'string',
              },
              deliveryStoreCode: {
                type: 'string',
              },
              shippingCountry: {
                type: 'string',
              },
            },
          },
          paymentType: {
            type: 'string',
            example: 'KLRNA',
            required: true,
          },
          punchoutReturnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/psd2-order-punchout?orderId=8359831&paymentMethod=KLRNA',
          },
          remoteIpAddress: {
            type: 'string',
            example: '127.0.0.1',
          },
          returnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/order-complete?orderId=8359831&paymentMethod=KLRNA',
          },
          save_details: {
            type: 'boolean',
            example: true,
          },
          smsMobileNumber: {
            type: 'string',
            example: '',
          },
        },
      },
    },
    {
      name: 'Paypal Payload',
      in: 'body',
      description:
        'The details of the order to be processed by payment type Paypal',
      schema: {
        type: 'object',
        properties: {
          cardCvv: {
            type: 'string',
            example: 0,
          },
          creditCard: {
            type: 'object',
            properties: {
              cardNumber: {
                type: 'string',
                example: '0',
              },
              expiryMonth: {
                type: 'string',
              },
              expiryYear: {
                type: 'string',
              },
              type: {
                type: 'string',
                example: 'PYPAL',
              },
            },
          },
          deliveryInstructions: {
            type: 'string',
            example: '',
          },
          orderDeliveryOption: {
            type: 'object',
            properties: {
              orderId: {
                type: 'string',
              },
              shipCode: {
                type: 'string',
              },
              shipModeId: {
                type: 'string',
              },
              deliveryStoreCode: {
                type: 'string',
              },
              shippingCountry: {
                type: 'string',
              },
            },
          },
          paymentType: {
            type: 'string',
            example: 'PYPAL',
            required: true,
          },
          punchoutReturnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/psd2-order-punchout?orderId=8359831&paymentMethod=PYPAL',
          },
          remoteIpAddress: {
            type: 'string',
            example: '127.0.0.1',
          },
          returnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/order-complete?orderId=8359831&paymentMethod=PYPAL',
          },
          save_details: {
            type: 'boolean',
            example: true,
          },
          smsMobileNumber: {
            type: 'string',
            example: '',
          },
        },
      },
    },
    {
      name: 'Apple Pay Payload',
      in: 'body',
      description:
        'The details of the order to be processed by payment type Apple Pay',
      schema: {
        type: 'object',
        properties: {
          paymentToken: {
            type: 'string',
            required: true,
            description: 'This property is only for Apps',
          },
          cardCvv: {
            type: 'string',
            example: 0,
          },
          creditCard: {
            type: 'object',
            properties: {
              cardNumber: {
                type: 'string',
                example: '0',
              },
              expiryMonth: {
                type: 'string',
              },
              expiryYear: {
                type: 'string',
              },
              type: {
                type: 'string',
                example: 'PYPAL',
              },
            },
          },
          deliveryInstructions: {
            type: 'string',
            example: '',
          },
          orderDeliveryOption: {
            type: 'object',
            properties: {
              orderId: {
                type: 'string',
              },
              shipCode: {
                type: 'string',
              },
              shipModeId: {
                type: 'string',
              },
              deliveryStoreCode: {
                type: 'string',
              },
              shippingCountry: {
                type: 'string',
              },
            },
          },
          paymentType: {
            type: 'string',
            example: 'APPLE',
            required: true,
          },
          punchoutReturnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/psd2-order-punchout?orderId=8359831&paymentMethod=APPLE',
          },
          remoteIpAddress: {
            type: 'string',
            example: '127.0.0.1',
          },
          returnUrl: {
            type: 'string',
            description: 'Should contain a paymentMethod query param',
            example:
              'http://www.topshop.com/order-complete?orderId=8359831&paymentMethod=APPLE',
          },
          save_details: {
            type: 'boolean',
            example: true,
          },
          smsMobileNumber: {
            type: 'string',
            example: '',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description:
        'In cases where no third party verification is required, the successful response will be a completed order object. If third party authentication is required, the response will contain a paymentRedirectUrl which the client will automatically use to redirect the user.',
      schema: {
        type: 'object',
        properties: {
          completedOrder: {
            type: 'object',
            properties: {
              billingAddress: {
                type: 'object',
                properties: {
                  address1: {
                    type: 'string',
                    example: '123 Sesame Street',
                  },
                  address2: {
                    type: 'string',
                    example: '',
                  },
                  address3: {
                    type: 'string',
                    example: 'London',
                  },
                  country: {
                    type: 'string',
                    example: 'United Kingdeom',
                  },
                  name: {
                    type: 'string',
                    example: 'Bob Barker',
                  },
                },
              },
              currencyConversion: {
                type: 'object',
                properties: {
                  currencyRate: {
                    type: 'string',
                    example: 'GBP',
                  },
                },
              },
              deliveryAddress: {
                type: 'object',
                properties: {
                  address1: {
                    type: 'string',
                    example: '1 Oxford Circus',
                  },
                  address2: {
                    type: 'string',
                    example: 'West End',
                  },
                  address3: {
                    type: 'string',
                    example: 'London',
                  },
                  country: {
                    type: 'string',
                    example: 'United Kingdom',
                  },
                  name: {
                    type: 'string',
                    example: 'Bob Barker',
                  },
                },
              },
              deliveryCarrier: {
                type: 'string',
                example: '',
              },
              deliveryCost: {
                type: 'string',
                example: '4.00',
              },
              deliveryDate: {
                type: 'string',
                example: '12 January 2018',
              },
              deliveryMethod: {
                type: 'string',
                example: 'Standard Delivery',
              },
              deliveryPrice: {
                type: 'string',
                example: '4.00',
              },
              orderId: {
                type: 'number',
                example: 700381254,
              },
              orderLines: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    colour: {
                      type: 'string',
                      example: 'BLUE',
                    },
                    discount: {
                      type: 'string',
                      example: '10.00',
                    },
                    discountPrice: {
                      type: 'string',
                      example: '30.00',
                    },
                    imageUrl: {
                      type: 'string',
                      example: 'https://stage.topshop.com/image',
                    },
                    lineNo: {
                      type: 'string',
                      example: '1A1A1A',
                    },
                    productId: {
                      type: 'string',
                      example: '31313131',
                    },
                    name: {
                      type: 'string',
                      example: 'Blue dress',
                    },
                    nonRefundable: {
                      type: 'boolean',
                      example: false,
                    },
                    quantity: {
                      type: 'quantity',
                      example: 1,
                    },
                    size: {
                      type: 'string',
                      example: '12',
                    },
                    total: {
                      type: 'string',
                      example: '30.00',
                    },
                    unitPrice: {
                      type: 'string',
                      example: '40.00',
                    },
                  },
                },
              },
              paymentDetails: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    cardNumberStar: {
                      type: 'string',
                      example: '************1111',
                    },
                    paymentMethod: {
                      type: 'string',
                      example: 'VISA',
                    },
                    totalCost: {
                      type: 'string',
                      example: '34.00',
                    },
                  },
                },
              },
              returnPossible: {
                type: 'boolean',
                example: false,
              },
              returnRequested: {
                type: 'boolean',
                example: false,
              },
              returning_buyer: {
                type: 'boolean',
                example: true,
              },
              subTotal: {
                type: 'string',
                example: '30.00',
              },
              totalOrderPrice: {
                type: 'string',
                example: '34.00',
              },
              totalOrdersDiscount: {
                type: 'string',
                example: '10.00',
              },
              totalOrdersDiscountLabel: {
                type: 'string',
                example: '',
              },
              userType: {
                description:
                  'G: Guest order; R: Returning customer placed an order; A: Customer placed an order but not registered on same day; S: Customer placed' +
                  ' an order registering on same day;',
                type: 'string',
                enum: ['G', 'R', 'A', 'S'],
                example: 'S',
              },
              discounts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: {
                      type: 'string',
                      example: 'Monty Test 7p off',
                    },
                    value: {
                      type: 'string',
                      example: '0.07',
                    },
                  },
                },
              },
              isRegisteredEmail: {
                type: 'boolean',
                example: true,
              },
              guestUserEmail: {
                type: 'string',
                example: 'guestuseremail@mail.com',
              },
            },
          },
        },
        paymentRedirectUrl:
          'http://foo.bar.com/authorisepayment&token=whatever',
      },
    },
  },
}
