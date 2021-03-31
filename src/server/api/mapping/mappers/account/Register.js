import Boom from 'boom'
import { pathOr } from 'ramda'

import Mapper from '../../Mapper'
import transform from '../../transforms/logon'
import { encodeUserId } from '../../../../lib/bazaarvoice-utils'
import { registerAccountPayloadConstants } from '../../constants/registerAccount'
import { registerCookies, logonHeaders } from './cookies'
import emailServiceStoreMap from '../../../hostsConfig/store_email_service_map.json'

export default class RegisterAccount extends Mapper {
  async mapEndpoint() {
    // We need the following variable to deduce which endpoint to call in case of User Registration.
    //
    // The cookie "tempUser" will be returned by WCS with a value of "Y" in the response of the
    // GET /order-summary which happens for a Guest User which adds to bag and starts the checkout journey.
    //
    // The scenario we need to handle is the one where a Guest User starts the checkout journey (temporary
    // User set on WCS) and then goes to the Account to Register.
    const isTemporaryUser = await this.getCookieFromStore(
      'tempUser',
      this.headers.cookie
    )

    this.destinationEndpoint =
      isTemporaryUser === 'Y'
        ? '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
        : '/webapp/wcs/stores/servlet/UserRegistrationAdd'
    this.logonFormEndpoint = '/webapp/wcs/stores/servlet/LogonForm'
  }

  mapRequestParameters() {
    const {
      catalogId,
      langId,
      siteId: storeId,
      storeCode,
      currencyCode: preferredCurrency,
    } = this.storeConfig

    const defaultServiceId = emailServiceStoreMap[storeCode || 'tsuk']

    const {
      email: create_logonId,
      password: logonPassword,
      passwordConfirm: logonPasswordVerify,
      subscribe,
      appId,
      rememberMe,
      source = 'MYACCOUNT',
      mergeGuestOrder,
    } = this.payload
    this.payload = {
      ...registerAccountPayloadConstants,
      catalogId,
      preferredLanguage: langId,
      storeId,
      source,
      preferredCurrency,
      create_logonId,
      logonPassword,
      logonPasswordVerify,
      challengeQuestion: '-',
      challengeAnswer: '-',
      subscribe: subscribe ? 'YES' : 'NO',
      redirectURL: `UserRegistrationForm?langId=${langId}&storeId=${storeId}&catalogId=${catalogId}&new=Y&returnPage=`,
      checkUserAccountUrl: `UserIdExists?storeId=${storeId}&catalogId=${catalogId}&URL=UserRegistrationAjaxView&ErrorViewName=UserRegistrationAjaxView&action=check`,
      defaultServiceId,
      appId,
      rememberMe: !!rememberMe, // assume false if rememberMe is not received
      mergeGuestOrder,
    }
    this.logonFormQuery = {
      langId,
      storeId,
      catalogId,
      new: 'Y',
      returnPage: '',
      personalizedCatalog: false,
      reLogonURL: 'LogonForm',
    }
  }

  mapResponseBody(body) {
    if (!body.success || body.success === 'false')
      return this.mapResponseError(body)

    return {
      ...transform(body, true),
      userToken: this.userToken,
      userId: this.userId,
    }
  }

  mapResponse(res) {
    const body = this.mapResponseBody(res.body)
    const bvToken = encodeUserId(body.userTrackingId)

    return {
      jsessionid: res.jsessionid,
      body,
      setCookies: registerCookies(bvToken),
      setHeaders: logonHeaders(bvToken),
    }
  }

  mapWCSErrorCodes = {
    2030: 409,
    2230: 406,
    2220: 406,
    2210: 406,
    2050: 406,
    2080: 406,
    2200: 406,
    ERROR_INVALID_LOGONID: 406,
  }

  mapResponseError(body) {
    const { wcsErrorCode } = pathOr({}, ['data'], body)
    throw body.message && !wcsErrorCode ? Boom.badData(body.message) : body
  }

  async execute() {
    this.mapRequestParameters()
    await this.mapEndpoint()
    try {
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        {},
        this.payload,
        this.method,
        this.headers
      )
      if (res.body.errorCode) this.mapErrorCode(res)
      if (res.body.success !== true) return this.mapResponseError(res.body)
      this.userToken = res.body.userToken
      this.userId = res.body.userId
      return this.mapResponse(
        await this.sendRequestToApi(
          this.destinationHostname,
          this.logonFormEndpoint,
          this.logonFormQuery,
          {},
          'get',
          this.headers,
          res.jsessionid
        )
      )
    } catch (apiResponseError) {
      return this.mapResponseError(apiResponseError)
    }
  }
}

export const registerSpec = {
  summary: 'Register a new user account',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      description: 'Account register credentials',
      schema: {
        type: 'object',
        required: ['email', 'password', 'passwordConfirm', 'subscribe'],
        properties: {
          email: {
            type: 'string',
            example: 'monty@desktop.com',
          },
          password: {
            type: 'string',
            example: 'test123',
          },
          passwordConfirm: {
            type: 'string',
            example: 'test123',
          },
          subscribe: {
            type: 'boolean',
            example: false,
          },
          appId: {
            type: 'string',
            example: '407090000',
          },
          rememberMe: {
            type: 'boolean',
            example: false,
          },
          source: {
            type: 'string',
            description: 'Idenifies the page this request was made from',
            example: 'CHECKOUT',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'New account summary',
      schema: {
        type: 'object',
        properties: {
          basketItemCount: {
            type: 'number',
            example: 0,
          },
          billingDetails: {
            $ref: '#/definitions/userDetails',
          },
          creditCard: {
            type: 'object',
            example: {
              type: 'VISA',
              cardNumberHash: 'tjOBl4zzS+ueTZQWartO5l968iOmCOix',
              cardNumberStar: '************1111',
              expiryMonth: '02',
              expiryYear: '2018',
            },
          },
          deliveryDetails: {
            $ref: '#/definitions/userDetails',
          },
          email: {
            type: 'string',
            example: 'monty@desktop.com',
          },
          exists: {
            type: 'boolean',
            example: true,
          },
          firstName: {
            type: 'string',
            example: 'Asdf',
          },
          hasBillingDetails: {
            type: 'boolean',
            example: false,
          },
          hasCardNumberHash: {
            type: 'boolean',
            example: false,
          },
          hasDeliveryDetails: {
            type: 'boolean',
            example: false,
          },
          hasPaypal: {
            type: 'boolean',
            example: false,
          },
          lastName: {
            type: 'string',
            example: 'asdfasdf',
          },
          title: {
            type: 'string',
            example: 'Mr',
          },
          userTrackingId: {
            type: 'number',
            example: 2470078,
          },
          userToken: {
            type: 'string',
            example: 'a1b2c3d41531130353',
            description:
              'Only returned when the appId has been provided in the request',
          },
          userId: {
            type: 'number',
            example: 3639011,
            description:
              'Only returned when the appId has been provided in the request',
          },
          expId1: {
            type: 'string',
            example:
              'ba01f790419dc0f27b69b4184943286dd0e738ff8dbf4287d138c0cb0409ba09',
            description: 'hash of email_id for exponea',
          },
          expId2: {
            type: 'string',
            example:
              '8335c4e067a04af8a4cdb3aa688379d7e3e2625e0c1e7e39e7024bf21ba7bf57',
            description: 'hash of member_id for exponea',
          },
        },
      },
    },
  },
}
