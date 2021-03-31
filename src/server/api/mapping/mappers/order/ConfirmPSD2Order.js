import Boom from 'boom'
import { path, pathOr } from 'ramda'
import Mapper from '../../Mapper'
import orderTransform from '../../transforms/order'
import * as serverSideAnalytics from './server_side_analytics'
import { isApps } from '../../utils/headerUtils'

/*
 * In this mapper we are going to call the endpoint which has been passed from WCS as a cookie in the POST /order response
 * ("https://ts.stage.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPaymentCallBack?orderId=2093607&catalogId=33057&policyId=40006&tran_id=550267&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0").
 * To the existing query parameters we need to concatenate also the parameters PaRes and MD whose value can be retrieved from
 * the Client's payload.
 */
export default class ConfirmPSD2Order extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/OrderProcess'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}

    this.method = 'get'
    this.query = {
      langId: `${langId}`,
      storeId: `${storeId}`,
      catalogId: `${catalogId}`,
      orderId: this.payload.orderId,
    }
  }

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

  execute() {
    this.mapRequestParameters()
    this.mapEndpoint()
    return this.sendRequestToApi(
      this.destinationHostname,
      this.destinationEndpoint,
      this.query,
      {},
      this.method,
      this.headers,
      undefined,
      true
    )
      .then((res) => {
        if (
          !res ||
          !res.body ||
          !res.body.OrderConfirmation ||
          !res.body.orderId ||
          (Object.prototype.hasOwnProperty.call(res.body, 'success') &&
            res.body.success === false)
        ) {
          const message =
            (res && res.body && res.body.errorMessage) ||
            'PSD2 order confirmation: malformed response from WCS'
          throw Boom.create(502, message)
        }

        return this.mapResponseBody(res.body)
      })
      .catch((err) => {
        throw err.isBoom
          ? err
          : Boom.badData(err.message || 'Unable to confirm PSD2 order')
      })
  }
}

export const confirmPSD2OrderSpec = {
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
        $ref: '#/definitions/orderCompleted',
      },
    },
  },
}
