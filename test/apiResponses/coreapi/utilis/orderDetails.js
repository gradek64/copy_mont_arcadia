jest.unmock('superagent')

import superagent from 'superagent'
import { headers, userCredentialsOrdersAndReturnsProfile } from '../utilis'
import eps from '../routes_tests'
import { logInResponse } from './userAccount'
import { processClientCookies } from '../utilis/cookies'

export const getOrderHistory = async (jsessionid) => {
  const response = await superagent
    .get(eps.myAccount.orderHistory.path)
    .set(headers)
    .set({ Cookie: jsessionid })
  return {
    body: response.body,
    jsessionid,
  }
}

export const getOrderHistoryResponse = async (cookies = '') => {
  return superagent
    .get(eps.myAccount.orderHistory.path)
    .set(headers)
    .set({ Cookie: cookies })
}

export const loginAndGetOrderHistory = async () => {
  const userResponse = await logInResponse({
    payload: userCredentialsOrdersAndReturnsProfile,
  })
  const jsessionid = userResponse.headers['set-cookie'].toString().split(',')[0]
  return getOrderHistory(jsessionid)
}

export const loginAndGetOrderHistoryWithCookies = async () => {
  const { mergeCookies } = processClientCookies()
  const userResponse = await logInResponse({
    payload: userCredentialsOrdersAndReturnsProfile,
  })
  const userCookies = mergeCookies(userResponse)
  const orderHistoryResponse = await getOrderHistoryResponse(userCookies)
  const cookies = mergeCookies(orderHistoryResponse)
  return {
    cookies,
    response: orderHistoryResponse,
  }
}

export const loginAndGetOrderHistoryResponse = async () => {
  const userResponse = await logInResponse({
    payload: userCredentialsOrdersAndReturnsProfile,
  })
  const jsessionid = userResponse.headers['set-cookie'].toString().split(',')[0]
  return getOrderHistoryResponse(jsessionid)
}

export const savedOrderIds = async () => {
  const response = await loginAndGetOrderHistory()
  const orders = response.body.orders
  return {
    ids: orders.map((obj) => obj.orderId),
    jsessionid: response.jsessionid,
    response,
  }
}

export const savedOrderIdsWithCookies = async () => {
  const { response, cookies } = await loginAndGetOrderHistoryWithCookies()
  const orders = response.body.orders
  return {
    ids: orders.map((obj) => obj.orderId),
    cookies,
    response,
  }
}

export const getOrderDetails = async (orderId, cookies = '') => {
  const responseBody = await superagent
    .get(eps.myAccount.orderHistoryDetails.path(orderId))
    .set(headers)
    .set({ Cookie: cookies })
  return responseBody.body
}

export const getOrderDetailsForAllOfOrderHistory = async () => {
  const { ids, jsessionid, response } = await savedOrderIds()
  const populateTestDataWithOrderDetails = async (orderId) => {
    const orderDetails = await getOrderDetails(orderId, jsessionid)
    return {
      orderId,
      orderDetails,
    }
  }
  const promises = ids.map(populateTestDataWithOrderDetails)
  const orderHistory = await Promise.all(promises)
  return {
    historyDetails: orderHistory,
    response,
  }
}

export const getOrderDetailsForAllOfOrderHistoryCookies = async () => {
  const { ids, cookies, response } = await savedOrderIdsWithCookies()
  const populateTestDataWithOrderDetails = async (orderId) => {
    const orderDetails = await getOrderDetails(orderId, cookies)
    return {
      orderId,
      orderDetails,
    }
  }
  const promises = ids.map(populateTestDataWithOrderDetails)
  const orderHistory = await Promise.all(promises)
  return {
    historyDetails: orderHistory,
    response,
  }
}
