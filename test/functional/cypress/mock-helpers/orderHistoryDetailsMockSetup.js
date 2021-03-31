import { setUpMocksForRouteList, setNewCookieExpiry } from '../lib/helpers'

export const setupMocksForOrderHistoryDetails = (orderHistory) => {
  const cookieExpiry = setNewCookieExpiry(3600)
  cy.setCookie('topshop-cookie-message', cookieExpiry)
  cy.setCookie('authenticated', 'yes')
  const requiredRoutes = [
    {
      method: 'GET',
      url: 'api/account/order-history',
      response: orderHistory,
      alias: 'order-history',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9509808',
      response: 'fixture:my-account/order-history-details-9509808.json',
      alias: 'order-history-9509808',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9507631',
      response: 'fixture:my-account/order-history-details-9507631.json',
      alias: 'order-history-9507631',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9509773',
      response: 'fixture:my-account/order-history-details-9509773.json',
      alias: 'order-history-9509773',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9507090',
      response: 'fixture:my-account/order-history-details-9507090.json',
      alias: 'order-history-9507090',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9509696',
      response: 'fixture:my-account/order-history-details-9509696.json',
      alias: 'order-history-9509696',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9507091',
      response: 'fixture:my-account/order-history-details-9507091.json',
      alias: 'order-history-9507091',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9507092',
      response: 'fixture:my-account/order-history-details-9507092.json',
      alias: 'order-history-9507092',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9507632',
      response: 'fixture:my-account/order-history-details-9507632.json',
      alias: 'order-history-9507632',
    },
    {
      method: 'GET',
      url: 'api/account/order-history/9572052',
      response: 'fixture:my-account/order-history-details-9572052.json',
      alias: 'order-history-9572052',
    },
  ]
  setUpMocksForRouteList(requiredRoutes)
}

export const setupMocksForMyOrders = (orderHeaders, orderDetails) => {
  cy.setCookie('authenticated', 'yes')
  const routes = [
    {
      method: 'GET',
      url: 'api/account/order-history',
      response: orderHeaders,
      alias: 'order-history',
    },
    {
      method: 'GET',
      url: /\/api\/account\/order-history\/([0-9])+/g,
      response: orderDetails,
      alias: 'order-history-details',
    },
  ]
  setUpMocksForRouteList(routes)
}
