import * as utils from '../../../__test__/utils'
import ChangePassword from '../ChangePassword'

jest.mock('../../../transforms/logon')
import logonTransform from '../../../transforms/logon'

const jsessionid = '123'

const payloadToWCS = {
  storeId: 12556,
  catalogId: '33057',
  langId: '-1',
  logonId: '12556monty@desktop.com',
  logonPassword: 'test123456',
  logonPasswordVerify: 'test123456',
  URL: 'LogonForm?page=account',
  reLogonURL: 'ChangePassword',
  login: 'Change Password',
  'login.x': '63', // hardcoded in scrAPI
  'login.y': '9', // hardcoded in scrAPI
  logonPasswordOld: 'test123',
  nextPage: 'MyAccount',
  pageFrom: '',
  Relogon: 'Update',
}

describe('ChangePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  const defaults = {
    headers: {
      cookie: 'jsessionid=123; ',
      'BRAND-CODE': 'tsuk',
    },
    method: 'post',
    payload: {
      emailAddress: 'monty@desktop.com',
      oldPassword: 'test123',
      newPassword: 'test123456',
      newPasswordConfirm: 'test123456',
    },
    query: {},
  }

  const execute = utils.buildExecutor(ChangePassword, defaults)

  it('called with the correct payload', async () => {
    utils.setWCSResponse({
      body: 'WCS response body',
      jsessionid,
    })
    await execute()
    utils.expectRequestMadeWith({
      hostname: false,
      endpoint: `/webapp/wcs/stores/servlet/ResetPassword`,
      query: {},
      payload: payloadToWCS,
      method: 'post',
      headers: {
        'BRAND-CODE': 'tsuk',
        cookie: 'jsessionid=123; ',
      },
    })
  })

  it('Call the login endpoint on a successful password change', async () => {
    utils.setWCSResponse({
      body: 'WCS response body',
      jsessionid,
    })
    utils.setWCSResponse(
      {
        body: 'WCS login data',
        jsessionid,
      },
      { n: 1 }
    )
    await execute()
    utils.expectRequestMadeWith(
      {
        hostname: false,
        endpoint: `/webapp/wcs/stores/servlet/LogonForm`,
        query: {
          catalogId: '33057',
          langId: '-1',
          storeId: 12556,
        },
        payload: {},
        method: 'get',
        headers: {
          'BRAND-CODE': 'tsuk',
          cookie: 'jsessionid=123; ',
        },
        sessionKey: jsessionid,
        timeout: 0,
      },
      1
    )
    expect(logonTransform).toHaveBeenCalledWith('WCS login data', false)
    expect(logonTransform).toHaveBeenCalledTimes(1)
  })

  it('throws an error, if a wcs error occurred', async () => {
    utils.setWCSResponse({
      body: {
        serverErrorMessage: 'Boom!',
      },
      jsessionid,
    })

    await utils.expectFailedWith(execute(), {
      statusCode: 422,
      message: 'Boom!',
    })
  })

  it('errors if appId is of an incorrect type', async () => {
    expect(() =>
      execute({
        payload: {
          ...defaults.payload,
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
          userId: undefined,
          userToken: 'userToken',
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
          userId: '12345',
          userToken: [],
        },
      })
    ).toThrow()
  })
})
