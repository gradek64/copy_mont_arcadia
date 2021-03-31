import superagent from 'superagent'
import url from 'url'
import querystring from 'querystring'

import { serverSideRendererLite } from './server-side-renderer'
import { deviceTypes } from '../api/requests/constants'
import { getMontyHeaderDeviceType } from '../api/requests/utils'
import paymentsHelper from '../lib/payments-helper'
import { extractCookie } from '../../shared/lib/cookie'
import { createGetSessionFromKey } from '../api/mapping/utils/sessionUtils'
import WcsCookieCapture from '../lib/wcs-cookie-capture'

export const buildMontyHeader = ({ deviceType, isMobileHostname }) => {
  const montyHeader = getMontyHeaderDeviceType(deviceType)

  return isMobileHostname === 'true' && deviceType !== deviceTypes.apps
    ? `m${montyHeader}`
    : montyHeader
}

export const sendWcsRequest = async ({
  wcsUrl,
  orderPayload: { paRes, md },
  montyHeader,
  cookies,
  jsessionid,
}) => {
  const payload = { PaRes: paRes, MD: md }

  const response = await superagent
    .post(wcsUrl)
    .send(payload)
    .set('monty', montyHeader)
    .set('Cookie', cookies)
    .set('sessionKey', jsessionid)
    .set('Content-Type', 'application/x-www-form-urlencoded')

  return response.body
}

export const getQueryParams = (urlString) => {
  const parsedRedirectURL = url.parse(urlString)
  return querystring.parse(parsedRedirectURL.query || '')
}

export const serialiseQueryParams = (params) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

const isString = (data) => typeof data === 'string' && data.length

export const punchoutSequence = () => async (request) => {
  const orderPayload = paymentsHelper(request)

  if (!orderPayload) {
    throw new Error('No order payload found')
  }

  const montyHeader = buildMontyHeader({
    deviceType: request.headers['monty-client-device-type'],
    isMobileHostname: request.headers['monty-mobile-hostname'],
  })

  const cookieCapture = new WcsCookieCapture(request.state)
  // session will only be returned with cookies if there aren't
  // wcs cookies set on the client
  const session = await createGetSessionFromKey(cookieCapture)(
    request.state.jsessionid
  )

  // if session.cookies is undefined, cookies should have been captured
  // in the cookieCapture instance
  let cookies
  if (session.cookies) {
    cookies = session.cookies
  } else if (!session.cookies && cookieCapture.hasWcsCookies()) {
    cookies = cookieCapture.readForServer()
  } else {
    // This shouldn't happen, but just in case
    cookies = []
  }

  const wcsUrl = extractCookie('paymentCallBackUrl', cookies)

  const punchoutParams = await sendWcsRequest({
    wcsUrl,
    orderPayload,
    montyHeader,
    cookies,
    jsessionid: request.state.jsessionid,
  })

  const { paymentMethod } = request.query
  const redirectParams = {
    ...getQueryParams(punchoutParams.redirectURL),
    ...(isString(paymentMethod) && { paymentMethod }),
    ...(orderPayload.ga && { ga: orderPayload.ga }),
    ...(orderPayload.hostname && { hostname: orderPayload.hostname }),
  }

  const confirmParams = serialiseQueryParams(redirectParams)
  const confirmationUrl = `/psd2-order-confirm?${confirmParams}`

  // Handlebars template context
  return {
    lang: 'en',
    title: punchoutParams.title,
    nextUrl: confirmationUrl,
  }
}

export const failureSequence = async (request, error) => {
  const { paymentMethod, orderId } = request.query
  const punchoutError = error instanceof Error ? error.message : error

  const failureParams = {
    ...(isString(paymentMethod) && { paymentMethod }),
    ...(isString(orderId) && { orderId }),
    ...(isString(punchoutError) && { error: punchoutError }),
  }

  const serialisedParams = Object.keys(failureParams).length
    ? `?${serialiseQueryParams(failureParams)}`
    : ''

  const failureUrl = `/psd2-order-failure${serialisedParams}`

  // Handlebars template context
  return {
    lang: 'en',
    title: 'Punchout Error',
    nextUrl: failureUrl,
  }
}

export default function psd2OrderPunchoutHandler(request, reply) {
  return serverSideRendererLite({
    template: 'punchout',
    buildContext: punchoutSequence(),
    failureTemplate: 'punchout',
    failureBuildContext: failureSequence,
    failureCode: 502,
    request,
    reply,
  })
}
