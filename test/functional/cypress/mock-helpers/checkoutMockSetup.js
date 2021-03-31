import {
  authStateCookieUpdate,
  setBagCountCookie,
  setUpMocksForRouteList,
} from '../lib/helpers'
import payments from '../fixtures/checkout/payments.json'
import routes from '../constants/routes'

export default class checkoutMocks {
  mocksForCheckout = (selectedEndpoints = {}) => {
    const {
      setAuthStateCookie,
      bagCountCookie,
      getAccount,
      getAccount401,
      login,
      getOrderSummary,
      getOrderSummaryByOrder,
      getOrderSummaryByOrder401,
      putOrderSummary,
      putOrderSummary401,
      putCustomerDetails,
      deleteDeliveryAddress,
      postOrder,
      postOrder422,
      postKlarnaSession,
      putKlarnaSession,
      postPaymentWithPSD2,
      searchAddress,
      searchAddressResult,
      searchAddressByCountryCode,
      countryCode,
    } = selectedEndpoints

    authStateCookieUpdate(setAuthStateCookie)
    setBagCountCookie(bagCountCookie)

    const checkoutRoutes = [
      getAccount && {
        method: 'GET',
        url: routes.account.account,
        response: getAccount,
        alias: 'account',
      },
      getAccount401 && {
        method: 'GET',
        url: routes.account.account,
        response: getAccount401,
        status: 401,
        alias: 'account-401',
        headers: {
          'Set-Cookie':
            'authenticated=partial; Path=/; Domain=.local.m.topshop.com; Max-Age=600',
        },
      },
      login && {
        method: 'POST',
        url: routes.account.login,
        response: login,
        alias: 'login',
      },
      getOrderSummary && {
        method: 'GET',
        url: routes.checkout.orderSummary,
        response: getOrderSummary,
        alias: 'order-summary',
      },
      getOrderSummaryByOrder && {
        method: 'GET',
        url: routes.checkout.orderSummaryById,
        response: getOrderSummaryByOrder,
        alias: 'order-summary',
      },
      getOrderSummaryByOrder401 && {
        method: 'GET',
        url: routes.checkout.orderSummaryById,
        response: getOrderSummaryByOrder401,
        status: 401,
        alias: 'get-order-summary-401',
      },
      putOrderSummary && {
        method: 'PUT',
        url: routes.checkout.orderSummary,
        response: putOrderSummary,
        alias: 'put-order-summary',
      },
      putOrderSummary401 && {
        method: 'PUT',
        url: routes.checkout.orderSummary,
        response: putOrderSummary401,
        status: 401,
        alias: 'put-order-summary-401',
      },
      putCustomerDetails && {
        method: 'PUT',
        url: routes.account.customerDetails,
        response: putCustomerDetails,
        alias: 'update-customer-details',
      },
      deleteDeliveryAddress && {
        method: 'DELETE',
        url: routes.checkout.orderSummaryDeliveryAddress,
        response: deleteDeliveryAddress,
        alias: 'delete-delivery-address',
      },
      postOrder && {
        method: 'POST',
        url: routes.order,
        response: postOrder,
        alias: 'order-complete',
      },
      postOrder422 && {
        method: 'POST',
        url: routes.order,
        response: postOrder422,
        status: 422,
        alias: 'order-complete-422',
      },
      postKlarnaSession && {
        method: 'POST',
        url: routes.klarnaSession,
        response: postKlarnaSession,
        alias: 'post-klarna-session',
        headers: {
          'Set-Cookie':
            'klarnaSessionId=setKlarnaSessionCookie.sessionId; Path=/; Domain=.local.m.topshop.com; expiry=Date.now() + 2147483647' +
            'klarnaClientToken=setKlarnaSessionCookie.clientToken; Path=/; Domain=.local.m.topshop.com; expiry=Date.now() + 2147483647',
        },
      },
      putKlarnaSession && {
        method: 'PUT',
        url: routes.klarnaSession,
        response: putKlarnaSession,
        alias: 'put-klarna-session',
      },
      searchAddress && {
        method: 'GET',
        url: routes.address.address,
        response: searchAddress,
        alias: 'find-address',
      },
      searchAddressByCountryCode && {
        method: 'GET',
        url: routes.address.addressByCountryCode(countryCode),
        response: searchAddressByCountryCode,
        alias: 'find-address-cnty',
      },
      postPaymentWithPSD2 && {
        method: 'POST',
        url: routes.order,
        response: postPaymentWithPSD2,
        alias: 'payment-complete-PSD2',
      },
      searchAddressResult && {
        method: 'GET',
        url: `${routes.address.returnAddressResult(
          searchAddress[0].moniker
        )}?country=GBR`,
        response: searchAddressResult,
        alias: 'find-address-result',
      },
      {
        method: 'GET',
        url: routes.payments,
        response: payments,
        alias: 'payments',
      },
    ]
    setUpMocksForRouteList(checkoutRoutes)
    return this
  }

  mocksForShoppingBag = (selectedEndpoints = {}) => {
    const {
      setAuthStateCookie,
      addToBag,
      updateItem,
      removeFromBag,
      removeFromBag401,
      addPromotionCode,
      addPromotionCode401,
      addPromotionCode406,
      addPromotionCode422,
      removePromotionCode,
      removePromotionCode401,
      getItems,
      fetchItem,
      changeDeliveryType,
      postBagTransfer,
    } = selectedEndpoints

    authStateCookieUpdate(setAuthStateCookie)

    const shoppingBagRoutes = [
      addToBag && {
        method: 'POST',
        url: routes.shoppingBag.addItem2,
        response: addToBag,
        alias: 'add-to-bag',
      },
      updateItem && {
        method: 'PUT',
        url: routes.shoppingBag.updateItem,
        response: updateItem,
        alias: 'update-bag',
      },
      removeFromBag && {
        method: 'DELETE',
        url: routes.shoppingBag.deleteItem,
        response: removeFromBag,
        alias: 'delete-bag-item',
      },
      removeFromBag401 && {
        method: 'DELETE',
        url: routes.shoppingBag.deleteItem,
        response: removeFromBag401,
        status: 401,
        alias: 'delete-bag-item-401',
      },
      addPromotionCode && {
        method: 'POST',
        url: routes.shoppingBag.addPromotionCode,
        response: addPromotionCode,
        alias: 'add-promo',
      },
      addPromotionCode401 && {
        method: 'POST',
        url: routes.shoppingBag.addPromotionCode,
        response: addPromotionCode401,
        status: 401,
        alias: 'add-promo-401',
      },
      addPromotionCode406 && {
        method: 'POST',
        url: routes.shoppingBag.addPromotionCode,
        response: addPromotionCode406,
        status: 406,
        alias: 'add-promo-406',
      },
      addPromotionCode422 && {
        method: 'POST',
        url: routes.shoppingBag.addPromotionCode,
        response: addPromotionCode422,
        status: 422,
        alias: 'add-promo-422',
      },
      removePromotionCode && {
        method: 'DELETE',
        url: routes.shoppingBag.delPromotionCode,
        response: removePromotionCode,
        alias: 'remove-promo',
      },
      removePromotionCode401 && {
        method: 'DELETE',
        url: routes.shoppingBag.delPromotionCode,
        response: removePromotionCode401,
        status: 401,
        alias: 'del-promo-401',
      },
      getItems && {
        method: 'GET',
        url: routes.shoppingBag.getItems,
        response: getItems,
        alias: 'get-items',
      },
      fetchItem && {
        method: 'GET',
        url: routes.shoppingBag.fetchItemSizesAndQuantities,
        response: fetchItem,
        alias: 'get-item',
      },
      changeDeliveryType && {
        method: 'PUT',
        url: routes.shoppingBag.delivery,
        response: changeDeliveryType,
        alias: 'change-delivery-minibag',
      },
      postBagTransfer && {
        method: 'POST',
        url: routes.shoppingBag.bagTransfer,
        response: postBagTransfer,
        alias: 'post-bag-transfer',
      },
      {
        method: 'GET',
        url: routes.payments,
        response: payments,
        alias: 'payments',
      },
    ]
    setUpMocksForRouteList(shoppingBagRoutes)
    return this
  }
}
