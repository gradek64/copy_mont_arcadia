import Boom from 'boom'
import { path, pathOr } from 'ramda'
import Mapper from '../../Mapper'
import { extractCookie } from '../../../../../shared/lib/cookie'
import orderTransform from '../../transforms/order'
import * as serverSideAnalytics from './server_side_analytics'
import { isApps } from '../../utils/headerUtils'

// Change payload received from Monty before sending it to WCS
const transformPayload = (payload, storeConfig) => {
  const { catalogId, langId, siteId: storeId } = storeConfig
  const {
    policyId,
    payerId: PayerId,
    userApproved,
    orderId,
    token,
    tranId: tran_id,
    authProvider,
  } = payload

  if (authProvider === 'PYPAL') {
    return {
      langId,
      storeId,
      catalogId,
      policyId,
      PayerId,
      userApproved,
      orderId,
      token,
      tran_id,
      authProvider,
      notifyShopper: 0,
      notifyOrderSubmitted: 0,
    }
  } else if (authProvider === 'CLRPY') {
    return {
      ...payload,
      langId,
      storeId,
      catalogId,
    }
  }

  return payload
}

/*
 * In this mapper we are going to call the endpoint which has been passed from WCS as a cookie in the POST /order response
 * ("https://ts.stage.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPaymentCallBack?orderId=2093607&catalogId=33057&policyId=40006&tran_id=550267&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0").
 * To the existing query parameters we need to concatenate also the parameters PaRes and MD whose value can be retrieved from
 * the Client's payload.
 */
export default class ConfirmOrder extends Mapper {
  mapResponseBody(body, currencySymbol = '£') {
    const mappedResponse = orderTransform(
      body,
      currencySymbol,
      this.storeConfig.currencyCode
    )

    const response = { body: mappedResponse && mappedResponse.completedOrder }

    if (!isApps(this.headers)) {
      serverSideAnalytics.logPurchase({
        completedOrder: pathOr({}, ['completedOrder'], mappedResponse),
        analyticsId: path(['payload', 'ga'], this),
        headerBrandCode: path(['headers', 'brand-code'], this),
        userId: path(['userId'], body), // a.k.a. Member ID in WCS
        promoCodes: path(['promoCodes'], body),
        analyticsHost: path(['payload', 'hostname'], this),
      })
    }

    return response
  }

  mapResponseError(res) {
    throw Boom.badData(res.status || res)
  }

  execute() {
    const { authProvider } = this.payload

    if (['PYPAL', 'MPASS', 'CLRPY'].includes(authProvider)) {
      const payload = transformPayload(this.payload, this.storeConfig)

      // ADP-3271: Throw an error if authProvider = PYPAL and there is no PayerId so it can be captured in
      // updateOrder action
      // To be implemented as part of ADP-3362
      return this.sendRequestToApi(
        this.destinationHostname,
        '/webapp/wcs/stores/servlet/PunchoutPaymentCallBack',
        {},
        payload,
        'post',
        this.headers,
        undefined
      )
        .then((res) => {
          if (res.body && res.body.success === false) {
            throw Boom.create(502, 'Payment Error', {
              message:
                res.body.errorMessage || 'Error while trying to complete order',
            })
          }
          return this.mapResponseBody(res.body)
        })
        .catch((err) => {
          if (err.data && err.data.message) {
            throw Boom.create(502, err.data.message)
          }
          return this.mapResponseError(err)
        })
    } else if (
      /.*\b(ALIPY|SOFRT|CUPAY|IDEAL).*$/i.test(this.payload.paymentMethod)
    ) {
      //
      // Upon returning from the ALIPAY/SOFORT/CUPAY/IDEAL external payment site
      //
      const { paymentMethod, paymentStatus } = this.payload
      if (paymentStatus !== 'AUTHORISED')
        throw Boom.create(502, 'Payment was not authorised')

      const url =
        typeof paymentMethod === 'string' &&
        paymentMethod.slice(paymentMethod.indexOf('/') + 1)

      return this.sendRequestToApi(
        url,
        '',
        {},
        this.payload,
        'post',
        this.headers,
        undefined,
        true
      )
        .then((res) => {
          return this.mapResponseBody(res.body)
        })
        .catch((err) => {
          return this.mapResponseError(err)
        })
    }

    //
    // 3D Secure journeys -> DEPRECATED DUE TO PSD2_PUNCHOUT_POPUP FEATURE
    //
    return this.getSession(this.headers.cookie)
      .then((session) => {
        // retrieve paymentCallBackUrl cookie
        const cookies =
          (session && session.cookies) || this.cookieCapture.readForServer()
        if (!cookies)
          throw Boom.badData('order confirmation: cannot retrieve user session')
        return extractCookie('paymentCallBackUrl', cookies)
      })
      .then((paymentCallBackUrl) => {
        // call WCS
        if (paymentCallBackUrl) {
          const { paRes: PaRes, md: MD } = this.payload
          const url = `${paymentCallBackUrl}`

          // hostname, path, query, payload, method = 'get', headers = {}, jsessionid
          return this.sendRequestToApi(
            url,
            '',
            {},
            { PaRes, MD },
            'post',
            this.headers,
            undefined,
            true
          )
        }
        throw Boom.create(412, 'Missing paymentCallBackUrl in ConfirmOrder')
      })
      .then((res) => {
        // {
        //   "title":"Punchout Payment Result",
        //   "redirectURL":"http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/OrderProcess?catalogId=33057&orderId=700395666&storeId=12556"}
        // }
        if (!res || !res.body || !res.body.redirectURL)
          throw Boom.create(502, 'Payment Error', {
            message:
              res.body.errorMessage ||
              'order confirmation: unexpected response from WCS',
          })

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
        if (
          !res ||
          !res.body ||
          !res.body.OrderConfirmation ||
          !res.body.orderId
        )
          throw Boom.create(502, 'Payment Error', {
            message:
              res.body.errorMessage ||
              'order confirmation: malformed response from WCS',
          })

        return this.mapResponseBody(res.body)
      })
      .catch((err) => {
        if (err.data && err.data.message) {
          throw Boom.create(502, err.data.message)
        }
        // If Missing paymentCallbackUrl cookie
        if (err.output.statusCode === 412) {
          throw Boom.create(412, err.message)
        }
        throw Boom.badData(err)
      })
  }
}

export const confirmOrderSpec = {
  summary: 'Updates WCS with credentials from a third party payment site.',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description:
        'Depending on the payment type, this will contain a key, token, or other value that is passed to WCS to confirm the payment was authorised on the third party site. See https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/417366020/PUT+order+payloads for examples for each payment type.',
      schema: {
        type: 'object',
      },
    },
  ],
  responses: {
    200: {
      description: 'Payment is approved and order is confirmed',
      schema: {
        schema: {
          $ref: '#/definitions/orderCompleted',
        },
      },
    },
  },
}
