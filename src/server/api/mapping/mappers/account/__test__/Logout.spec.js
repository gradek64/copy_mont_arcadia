import * as utils from '../../../__test__/utils'
import Logout from '../Logout'

jest.mock('../cookies', () => ({
  logoutCookies: jest.fn(),
}))

describe('Logout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const defaults = {
    headers: {
      cookie: 'jsessionid=123; ',
      'BRAND-CODE': 'tsuk',
    },
    method: 'post',
    payload: {},
    query: {},
  }

  const execute = utils.buildExecutor(Logout, defaults)

  it('logout web user with success', async () => {
    utils.setWCSResponse({
      body: {
        isLoggedIn: false,
      },
      jsessionid: '123',
    })
    await execute()
    utils.expectRequestMadeWith({
      hostname: false,
      endpoint: `/webapp/wcs/stores/servlet/NotUser`,
      query: {},
      payload: {
        catalogId: '33057',
        langId: '-1',
        orderIdForCopy: '.',
        rememberMe: false,
        storeId: 12556,
        URL: 'OrderItemDisplay',
      },
      method: 'post',
      headers: {
        'BRAND-CODE': 'tsuk',
        cookie: 'jsessionid=123; ',
      },
    })
  })

  describe('Native app data provided', () => {
    it('logout native app user with success, when appId, userId & userToken provided', async () => {
      utils.setWCSResponse({
        body: {
          isLoggedIn: false,
        },
        jsessionid: '123',
      })
      await execute({
        ...defaults,
        payload: {
          appId: '1234-1234-1234-1234-1234',
          userId: 12345,
          userToken: '1234-1234-1234-1234-1234',
        },
      })
      utils.expectRequestMadeWith({
        hostname: false,
        endpoint: `/webapp/wcs/stores/servlet/NotUser`,
        query: {},
        payload: {
          catalogId: '33057',
          langId: '-1',
          orderIdForCopy: '.',
          rememberMe: false,
          storeId: 12556,
          URL: 'OrderItemDisplay',
          appId: '1234-1234-1234-1234-1234',
          userId: 12345,
          userToken: '1234-1234-1234-1234-1234',
        },
        method: 'post',
        headers: {
          'BRAND-CODE': 'tsuk',
          cookie: 'jsessionid=123; ',
        },
      })
    })

    it('errors if appId is of an incorrect type', async () => {
      expect(() =>
        execute({
          ...defaults,
          payload: {
            appId: [],
            userId: '12345',
            userToken: 'userToken',
          },
        })
      ).toThrow()
    })

    it('errors if userId is missing', async () => {
      expect(() =>
        execute({
          ...defaults,
          payload: {
            appId: 'appId',
            userToken: 'userToken',
            userId: undefined,
          },
        })
      ).toThrow()
    })

    it('errors if userToken is of an incorrect type', async () => {
      expect(() =>
        execute({
          ...defaults,
          payload: {
            appId: 'appId',
            userId: '1224',
            userToken: [],
          },
        })
      ).toThrow()
    })
  })

  it('errors if isLoggedIn is not present', async () => {
    utils.setWCSResponse({
      body: {
        isLoggedIn: undefined,
      },
      jsessionid: '123',
    })

    await utils.expectFailedWith(execute(), {
      statusCode: 502,
      message: 'User was not logged out',
    })
  })

  it('errors if isLoggedIn is true', async () => {
    utils.setWCSResponse({
      body: {
        isLoggedIn: true,
      },
      jsessionid: '123',
    })
    await utils.expectFailedWith(execute(), {
      statusCode: 502,
      message: 'User was not logged out',
    })
  })
})
