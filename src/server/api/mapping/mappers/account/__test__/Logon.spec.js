import * as utils from '../../../__test__/utils'
import Logon from '../Logon'

jest.mock('../../../../requests/utils')

describe('Logon', () => {
  const env = process.env.WCS_ENVIRONMENT
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.WCS_ENVIRONMENT = 'prod'
  })

  afterAll(() => {
    process.env.WCS_ENVIRONMENT = env
  })

  const getCookieFromStore = jest.fn(() => Promise.resolve('Y'))
  const execute = utils.buildExecutor(Logon, {
    headers: {
      cookie: 'jsessionid=123; ',
      'BRAND-CODE': 'tsuk',
    },
    method: 'post',
    payload: {
      password: 'password123',
      username: 'test@test.com',
      rememberMe: true,
    },
    query: {},
    getCookieFromStore,
  })

  it('login guest with bag success', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
      },
      jsessionid: '123',
    })
    utils.setWCSResponse(
      {
        body: {
          subscriptionId: '1',
          basketItemsCount: '1',
          Account: [
            {
              userTrackingId: '0',
              creditCard: {
                cardNumberHash: '************1234',
                type: 'VISA',
              },
              deliveryDetails: {},
              billingDetails: {
                email: 'test@test.com',
                nameAndPhone: {
                  title: 'Mr',
                  firstName: 'Dave',
                  lastName: 'Normington',
                },
              },
            },
          ],
        },
      },
      { n: 1 }
    )
    utils.setUserSession({ cookies: ['tempUser=Y'] })

    const res = await execute()

    utils.expectRequestMadeWith({
      hostname: 'https://www.topshop.com',
      endpoint: '/webapp/wcs/stores/servlet/Logon',
      query: {},
      payload: {
        URL: 'OrderItemMove?page=account&URL=OrderCalculate?URL=LogonAjaxView',
        calculationUsageId: -1,
        catalogId: '33057',
        continue: 1,
        createIfEmpty: 1,
        deleteIfEmpty: '*',
        fromOrderId: '*',
        langId: '-1',
        login: true,
        logonId: 'test@test.com',
        logonPassword: 'password123',
        proceedWithMerge: 'Y',
        qntyToCheckMergeAcitivty: 0,
        reLogonURL: 'LogonAjaxView',
        redirectURL:
          'LogonForm?langId=-1&storeId=12556&catalogId=33057&new=Y&returnPage=&personalizedCatalog=false&reLogonURL=LogonForm',
        rememberMe: true,
        storeId: 12556,
        toOrderId: '.',
        updatePrices: 1,
      },
      method: 'post',
      headers: {
        'BRAND-CODE': 'tsuk',
        cookie: 'jsessionid=123; ',
      },
    })

    utils.expectRequestMadeWith(
      {
        hostname: 'https://www.topshop.com',
        endpoint:
          '/webapp/wcs/stores/servlet/LogonForm?langId=-1&storeId=12556&catalogId=33057&new=Y&returnPage=&personalizedCatalog=false&reLogonURL=LogonForm',
        query: {},
        payload: {},
        method: 'get',
        headers: {
          'BRAND-CODE': 'tsuk',
          cookie: 'jsessionid=123; ',
        },
        sessionKey: '123',
        noPath: true,
      },
      1
    )

    expect(res.body.basketItemCount).toBe(1)
    expect(res.body.billingDetails.nameAndPhone.firstName).toBe('Dave')
    expect(res.body.creditCard.cardNumberHash).toBe('************1234')
    expect(res.setCookies[1].name).toBe('bagCount')
    expect(res.setCookies[1].value).toBe('1')
  })

  it('login from native app with appId but without userToken and userId', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
        userToken: '_a_user_token_',
        userId: 123456,
      },
      jsessionid: '123',
    })
    utils.setWCSResponse(
      {
        body: {
          subscriptionId: '1',
          basketItemsCount: '0',
          title: 'Mr',
          firstName: 'Dave',
          lastName: 'Normington',
        },
      },
      { n: 1 }
    )
    utils.setUserSession()

    const res = await execute({
      payload: {
        email: 'test@test.com',
        password: 'password123',
        rememberMe: false,
        appId: '1234-1234-1234-1234',
      },
    })

    utils.expectRequestMadeWithPartial({
      payload: expect.objectContaining({
        appId: '1234-1234-1234-1234',
      }),
    })

    expect(res.body.userToken).toBe('_a_user_token_')
    expect(res.body.userId).toBe(123456)

    expect(res.body.basketItemCount).toBe(0)
    expect(res.body.firstName).toBe('Dave')
    expect(res.setCookies[1].name).toBe('bagCount')
    expect(res.setCookies[1].value).toBe('0')
  })

  it('login from native app with appId, userToken and userId', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
        userToken: '_a_user_token_',
        userId: 123456,
      },
      jsessionid: '123',
    })
    utils.setWCSResponse(
      {
        body: {
          subscriptionId: '1',
          basketItemsCount: '0',
          title: 'Mr',
          firstName: 'Dave',
          lastName: 'Normington',
        },
      },
      { n: 1 }
    )
    utils.setUserSession()

    const res = await execute({
      payload: {
        appId: '1234-1234-1234-1234',
        userToken: '_a_user_token_',
        userId: 123456,
      },
    })

    utils.expectRequestMadeWithPartial({
      payload: expect.objectContaining({
        appId: '1234-1234-1234-1234',
        userToken: '_a_user_token_',
        userId: 123456,
      }),
    })

    expect(res.body.userToken).toBe('_a_user_token_')
    expect(res.body.userId).toBe(123456)
  })

  it('login with optimized response and without Account details', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
        isAccountResponse: true,
        userId: 123456,
      },
      jsessionid: '123',
    })

    getCookieFromStore.mockReturnValueOnce(Promise.resolve(null))

    const res = await execute()

    utils.expectRequestMadeWithPartial({
      payload: expect.objectContaining({
        proceedWithMerge: '',
      }),
    })

    expect(res.body.userId).toBe(123456)
    expect(res.body.firstName).toBe('')
    expect(res.body.billingDetails.nameAndPhone.firstName).toBe('')
    expect(res.body.creditCard.cardNumberHash).toBe('')
  })

  it('login with optimized response and with Account details', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
        isAccountResponse: true,
        userId: 123456,
        Account: [
          {
            userTrackingId: '0',
            creditCard: {
              cardNumberHash: '************1234',
              type: 'VISA',
            },
            deliveryDetails: {},
            billingDetails: {
              email: 'test@test.com',
              nameAndPhone: {
                title: 'Mr',
                firstName: 'Dave',
                lastName: 'Normington',
              },
            },
          },
        ],
      },
      jsessionid: '123',
    })

    getCookieFromStore.mockReturnValueOnce(Promise.resolve(null))

    const res = await execute()

    utils.expectRequestMadeWithPartial({
      payload: expect.objectContaining({
        proceedWithMerge: '',
      }),
    })

    expect(res.body.userId).toBe(123456)
    expect(res.body.firstName).toBe('Dave')
    expect(res.body.billingDetails.nameAndPhone.firstName).toBe('Dave')
    expect(res.body.creditCard.cardNumberHash).toBe('************1234')
  })

  it('login guest no bag success', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
      },
      jsessionid: '123',
    })
    utils.setWCSResponse(
      {
        body: {
          subscriptionId: '1',
          basketItemsCount: '0',
          title: 'Mr',
          firstName: 'Dave',
          lastName: 'Normington',
        },
      },
      { n: 1 }
    )
    getCookieFromStore.mockReturnValueOnce(Promise.resolve(null))

    const res = await execute()

    utils.expectRequestMadeWithPartial({
      payload: expect.objectContaining({
        proceedWithMerge: '',
      }),
    })

    expect(res.body.basketItemCount).toBe(0)
    expect(res.body.firstName).toBe('Dave')
    expect(res.setCookies[1].name).toBe('bagCount')
    expect(res.setCookies[1].value).toBe('0')
  })

  it('login failed - wrong credentials', async () => {
    utils.setWCSResponse({
      body: {
        loginSuccess: false,
        message: 'Oh noes! You probs got your password wrong :(',
      },
    })
    utils.setUserSession()

    try {
      await execute({
        payload: {
          password: 'password124',
          username: 'test@test.com',
          rememberMe: false,
        },
      })
    } catch (e) {
      expect(e.output.statusCode).toEqual(422)
      expect(e.message).toBe('Oh noes! You probs got your password wrong :(')
    }
  })

  it('login error - backend error on first request', async () => {
    utils.setWCSResponse(
      Promise.reject({
        errorMessage1: 'Some obscure error message',
      })
    )
    utils.setUserSession()

    try {
      await execute()
    } catch (e) {
      expect(e.output.statusCode).toEqual(422)
      expect(e.message).toBe('Some obscure error message')
    }
  })

  it('login error - backend error on second request', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
      },
      jsessionid: '123',
    })
    utils.setWCSResponse(Promise.reject('Some obscure error message'), { n: 1 })
    utils.setUserSession()

    try {
      await execute()
    } catch (e) {
      expect(e.output.statusCode).toEqual(502)
      expect(e.message).toBe('Error: Some obscure error message')
    }
  })

  it('password reset scenario', async () => {
    utils.setWCSResponse({
      body: {
        passwordResetForm: {
          logonId: 'test@test.com',
        },
      },
    })
    utils.setUserSession()

    const res = await execute()

    expect(res.body).toEqual({
      email: 'test@test.com',
      isPwdReset: true,
      exists: true,
    })
  })

  describe('errorCodes', () => {
    it('should throw a 401 if wcs responds with errorCode 2030', async () => {
      const res = {
        body: {
          errorCode: 2030,
          message: 'emergency!',
        },
      }
      utils.setWCSResponse(res)
      utils.setUserSession()

      try {
        await execute()
        throw new Error('didnt reject as expected')
      } catch (e) {
        const { message } = res.body
        expect(e.output.statusCode).toBe(401)
        expect(e.message).toBe(message)
      }
    })

    it('should throw a 403 if wcs responds with errorCode 2301', async () => {
      const res = {
        body: {
          errorCode: 2301,
          message: 'emergency!',
        },
      }
      utils.setWCSResponse(res)
      utils.setUserSession()

      try {
        await execute()
        throw new Error('didnt reject as expected')
      } catch (e) {
        const { message } = res.body
        expect(e.output.statusCode).toEqual(403)
        expect(e.message).toBe(message)
      }
    })

    it('should throw a 423 if wcs responds with errorCode 2110', async () => {
      const res = {
        body: {
          errorCode: 2110,
          message: 'emergency!',
        },
      }
      utils.setWCSResponse(res)
      utils.setUserSession()

      try {
        await execute()
        throw new Error('didnt reject as expected')
      } catch (e) {
        const { message } = res.body
        expect(e.output.statusCode).toEqual(423)
        expect(e.message).toBe(message)
      }
    })
  })

  describe('Invalid payloads', () => {
    it('should return a 400 bad request for an empty object', async () => {
      const logon = new Logon({
        payload: {},
      })
      utils.setUserSession()
      try {
        await logon.execute()
      } catch (e) {
        expect(e.output.statusCode).toEqual(400)
        expect(e.message).toBe('Payload is required')
      }
    })
    it('should return a 400 bad request for a falsy payload ', async () => {
      const logon = new Logon({
        payload: false,
      })
      utils.setUserSession()
      try {
        await logon.execute()
      } catch (e) {
        expect(e.output.statusCode).toEqual(400)
        expect(e.message).toBe('Payload is required')
      }
    })
  })
})
