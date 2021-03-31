import { path } from 'ramda'
// @note: This function help on server side render to extract data from POST/GET redirect payment request
// And create the correct payload for each type of payment need a PUT/ORDER request

export default ({ url, payload, query, info }) => {
  // In this scenario we handle the payments which do not end up with a redirection from the Payment
  // Gateway to the /order-complete page e.g.: no 3D, no PayPal, no Masterpass, ... .
  // In these scenarios the redirection to the order-complete page is done client side once the
  // client receives the response for the create order request.
  // In order to handle the refresh of the order-complete page we need to return the orderId to the
  // server side renderer so that it can save it in the store so that it can be used to call
  // the order-history/orderId as part of the PUT /order (one of the needs of ssr)
  // and retrieve the order details to display on the thank you page.
  if (query.orderId && query.noRedirectionFromPaymentGateway === 'true') {
    return {
      orderId: query.orderId,
      ga: query.ga,
      hostname: info.hostname,
    }
  }

  // CASE 1) POST REQUEST : 3D Secure / Verified by Visa (VBV)
  if ((query && query.MD) || (payload && payload.MD)) {
    const orderPayload = {
      // @NOTE not sure why we look at both query & payload
      orderId: query.orderId || payload.orderId,
      ga: query.ga || payload.ga,
      hostname: info.hostname,
      md: query.MD || payload.MD,
      paRes: query.PaRes || payload.PaRes,
      authProvider: 'VBV',
    }
    return orderPayload
  }

  // CASE 2) KLARNA
  if (query.klarnaOrderId) {
    // CASE 2) GET REQUEST : KLARNA
    const order = query.klarnaOrderId
    const orderPayload = {
      order, // Should it be orderId??
      authProvider: 'KLRNA',
    }
    return orderPayload
  }

  // CASE 3) GET REQUEST : PAYPAL-ALIPAY-CHINAUNION-IDEAL-SOFORT
  if (Object.keys(query).length) {
    const matchOrder = /orderId=(.*?)&/.exec(url.search) // @NOTE should extract orderId from query instead?
    const orderId = path([1], matchOrder)
    const matchPaymentMethod = /paymentMethod=(.*?)\//.exec(url.search) // @NOTE should extract paymentMethod from query instead?
    const paymentMethod = path([1], matchPaymentMethod)

    if (orderId) {
      // CASE 3A) PAYPAL (need special payload)
      if (paymentMethod === 'PYPAL') {
        const orderPayload = {
          ga: query.ga,
          hostname: info.hostname,
          policyId: query.policyId,
          payerId: query.PayerID,
          userApproved: query.userApproved,
          orderId,
          token: query.token,
          tranId: query.tran_id,
          authProvider: 'PYPAL',
        }
        return orderPayload
      }

      // CASE 3B) ALIPAY - CHINAUNION - IDEAL - SOFORT
      return {
        ...query,
        hostname: info.hostname,
        orderId,
        transId: query.tran_id, // @NOTE previously query.trans_id
        authProvider: paymentMethod,
      }
    }
  }

  // OTHERS CASE : ERROR ??
  return false
}
