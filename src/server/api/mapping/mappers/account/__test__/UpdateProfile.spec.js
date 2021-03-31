import * as utils from '../../../__test__/utils'
import UpdateProfile from '../UpdateProfile'
import logonTransform from '../../../transforms/logon'
import {
  updateProfileConstants,
  logonFormConstants,
} from '../../../constants/updateProfile'
import { authenticatedCookies } from '../cookies'

jest.mock('../../../transforms/logon')
jest.mock('../cookies', () => ({
  authenticatedCookies: jest.fn(),
}))

const payloadFromMonty = {
  email: 'monty@desktop.com',
  firstName: 'Karthi',
  lastName: 'D',
  title: 'Mr',
}

const payloadToWCS = {
  ...updateProfileConstants,
  catalogId: '33057',
  langId: '-1',
  storeId: 12556,
  errorViewName: 'UserRegistrationForm',
  personTitle: 'Mr',
  firstName: 'Karthi',
  lastName: 'D',
  logonId: 'monty@desktop.com',
  origLogonId: 'monty@desktop.com',
  tempEmail1: '12556monty@desktop.com',
  nickName: '12556monty@desktop.com',
  default_service_id: 8,
  subscribe: 'NO',
}

const logonFormParameters = {
  catalogId: '33057',
  langId: '-1',
  storeId: 12556,
  ...logonFormConstants,
}

const responseBody = { body: 'WCS Logon response' }

const transformedBody = { body: 'Monty response' }

const execute = utils.buildExecutor(UpdateProfile)

describe('UpdateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls WCS', async () => {
    logonTransform.mockReturnValue(transformedBody)
    authenticatedCookies.mockReturnValue('cookie')
    utils.setWCSResponse({ jsessionid: 1, body: {} })
    utils.setWCSResponse({ jsessionid: 1, body: responseBody }, { n: 1 })

    const res = await execute({
      payload: payloadFromMonty,
      method: 'put',
      query: {},
    })

    utils.expectRequestMadeWith({
      hostname: false,
      endpoint: '/webapp/wcs/stores/servlet/UserRegistrationUpdate',
      payload: payloadToWCS,
      method: 'post',
      query: {},
    })
    utils.expectRequestMadeWith(
      {
        hostname: false,
        endpoint: '/webapp/wcs/stores/servlet/LogonForm',
        method: 'get',
        query: logonFormParameters,
        payload: {},
        sessionKey: 1,
      },
      1
    )
    expect(res).toEqual({
      jsessionid: 1,
      body: transformedBody,
      setCookies: 'cookie',
      status: false,
    })
    expect(logonTransform).toHaveBeenCalledWith(responseBody, false)
  })

  it("should set the 'subscribe' flag to 'YES'", async () => {
    await execute({
      payload: {
        ...payloadFromMonty,
        marketingSubscription: true,
      },
      method: 'put',
    })

    expect(utils.getRequests()[0][3].subscribe).toEqual('YES')
  })

  it('should throw an exception on session timeout', () => {
    utils.setWCSResponse({ body: {} })
    const responseBody = { pageTitle: 'LogonForm' }
    utils.setWCSResponse({ body: responseBody }, { n: 1 })

    return execute({ payload: payloadFromMonty })
      .then(() => global.fail('Promise should reject'))
      .catch((error) => {
        expect(error.message).toBe('wcsSessionTimeout')
      })
  })

  it('should return 422 error if there is a `serverErrorMessage` value in the response', async () => {
    utils.setWCSResponse(
      Promise.resolve({ body: { serverErrorMessage: 'ERROR!' } })
    )
    try {
      await execute({
        payload: payloadFromMonty,
        method: 'put',
        query: {},
      })
      global.fail('Promise should reject')
    } catch (e) {
      expect(e.output.payload).toEqual(
        expect.objectContaining({
          statusCode: 422,
          message: 'ERROR!',
        })
      )
    }
  })

  it('should simply throw the body, and not return 422 if there is no serverErrorMessage value in the response', async () => {
    const response = { body: null }
    utils.setWCSResponse(Promise.reject(response))
    try {
      await execute({
        payload: payloadFromMonty,
        method: 'put',
        query: {},
      })
      global.fail('Promise should reject')
    } catch (e) {
      expect(e).toEqual(expect.objectContaining(response))
    }
  })
})
