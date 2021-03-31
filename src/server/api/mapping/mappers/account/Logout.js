import Mapper from '../../Mapper'

import Boom from 'boom'
import { logoutCookies } from './cookies'

export default class Logout extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/NotUser'
  }

  validateParameters() {
    const { appId, userId, userToken } = this.payload || {}
    if (appId && typeof appId !== 'string') {
      throw Boom.badData(
        `Incorrect parameter type provided for 'appId'. Expected string, received ${typeof appId}`
      )
    }
    if (userToken && typeof userToken !== 'string') {
      throw Boom.badData(
        `Incorrect parameter type provided for 'userToken'. Expected string, received ${typeof userToken}`
      )
    }
    if (appId && userToken && !userId) {
      throw Boom.badData(
        `userId is required when userToken and appId are present in request`
      )
    }
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { orderIdForCopy = '.', appId, userId, userToken } =
      this.payload || {}

    this.validateParameters()

    this.method = 'post'
    this.payload = {
      catalogId,
      langId,
      orderIdForCopy,
      rememberMe: false,
      storeId,
      URL: 'OrderItemDisplay',
      appId,
      userId,
      userToken,
    }
  }

  mapResponse(res) {
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
      setCookies: logoutCookies(),
    }
  }

  mapResponseBody(body) {
    if (body.isLoggedIn !== false) {
      throw Boom.badGateway(['User was not logged out'], [body])
    }
    return {}
  }
}

export const logoutSpec = {
  summary: 'Log out an authenticated user',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        properties: {
          appId: {
            type: 'string',
            description: 'App id assigned to a native app',
            example: '0000Skr6gZ7X2GaSI80fK3c0U0U',
          },
          userId: {
            type: 'string',
            description: 'User id assigned to a native app session',
            example: 12345,
          },
          userToken: {
            type: 'string',
            description: 'Token assigned to a native app session',
            example: '0000Skr6gZ7X2GaSI80fK3c0U0H',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'User successfully logged out',
      schema: {
        type: 'object',
        properties: {
          jsessionid: {
            type: 'string',
            example: '0000Fxe6tM7K2TnFV80sX3p0H0H',
          },
        },
      },
    },
  },
}
