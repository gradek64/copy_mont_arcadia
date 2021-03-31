import config, {
  triggered,
  cacheActionListener,
  userSessionStateListener,
} from '../user-session'
import { getItem } from '../../../../client/lib/cookie/utils'

jest.mock('../../storeObserver', () => ({
  addStateListeners: jest.fn(),
}))

jest.mock('../analytics-middleware', () => ({
  addPostDispatchListeners: jest.fn(),
}))

jest.mock('../../../../shared/analytics/dataLayer', () => ({
  push: jest.fn(),
}))

jest.mock('../../../../client/lib/cookie/utils', () => ({
  getItem: jest.fn(),
}))

describe('userSession analytics', () => {
  let dataLayerMock

  beforeEach(() => {
    jest.clearAllMocks()
    getItem.mockImplementation(() => 'none')
    triggered.cacheListener = false
    dataLayerMock = require('../../../../shared/analytics/dataLayer')
  })

  const loggedOutState = {
    account: {
      user: {},
    },
  }

  const loggedInState = ({ authentication = 'full' } = {}) => ({
    auth: {
      authentication,
    },
    account: {
      user: {
        exists: true,
        userTrackingId: 123,
        email: 'test@testing.com',
      },
    },
  })

  const loggedInDdpUserState = {
    account: {
      user: {
        exists: true,
        userTrackingId: 123,
        isDDPUser: true,
        wasDDPUser: false,
        isDDPRenewable: true,
        ddpStartDate: '1 May 2019',
        ddpEndDate: '1 May 2020',
        ddpCurrentOrderCount: 3,
        ddpPreviousOrderCount: 0,
        email: 'test@testing.com',
      },
    },
  }

  describe('userSessionStateListener() triggering behaves as expected', () => {
    describe('cacheActionListener()', () => {
      it('triggers update to dataLayer', () => {
        expect(triggered.cacheListener).toBe(false)

        cacheActionListener(null, {
          getState: () => loggedOutState,
        })

        expect(triggered.cacheListener).toBe(true)

        expect(dataLayerMock.push).toHaveBeenCalledTimes(1)
        const actualDataLayerPushArgs = dataLayerMock.push.mock.calls[0]
        expect(actualDataLayerPushArgs).toEqual([
          {
            user: {
              dualRun: 'none',
              loggedIn: 'False',
              id: undefined,
              isDDPUser: undefined,
              authState: 'guest',
            },
          },
          'userSessionSchema',
          'userState',
        ])
      })
      it('triggers update to dataLayer for user in Monty AB Test', () => {
        getItem.mockImplementation(() => 'monty')

        expect(triggered.cacheListener).toBe(false)

        cacheActionListener(null, {
          getState: () => loggedOutState,
        })

        expect(triggered.cacheListener).toBe(true)

        expect(dataLayerMock.push).toHaveBeenCalledTimes(1)
        const actualDataLayerPushArgs = dataLayerMock.push.mock.calls[0]
        expect(actualDataLayerPushArgs).toEqual([
          {
            user: {
              dualRun: 'monty',
              loggedIn: 'False',
              id: undefined,
              authState: 'guest',
            },
          },
          'userSessionSchema',
          'userState',
        ])
      })
    })

    describe('userSessionStateListener()', () => {
      it('triggers userStateChange event if logged out and then logged in', () => {
        triggered.cacheListener = true

        userSessionStateListener(loggedOutState, loggedInState())

        expect(dataLayerMock.push).toHaveBeenCalledTimes(1)
        const actualDataLayerPushArgs = dataLayerMock.push.mock.calls[0]
        expect(actualDataLayerPushArgs).toEqual([
          {
            user: {
              dualRun: 'none',
              loggedIn: 'True',
              id: '123',
              hashedEmailAddress:
                '587d4c12fef06af41f2fdfa19a3e68443bf8a7923b47cb75022481f8d77552ad',
              authState: 'full',
              isDDPUser: 'False',
              wasDDPUser: 'False',
              isDDPRenewable: 'False',
              ddpStartDate: undefined,
              ddpEndDate: undefined,
              ddpCurrentOrderCount: undefined,
              ddpPreviousOrderCount: undefined,
            },
          },
          'userSessionSchema',
          'userState',
        ])
      })

      it('triggers userStateChange event if logged out and then logged in as isDDPUser', () => {
        triggered.cacheListener = true

        userSessionStateListener(loggedOutState, loggedInDdpUserState)

        expect(dataLayerMock.push).toHaveBeenCalledTimes(1)
        const actualDataLayerPushArgs = dataLayerMock.push.mock.calls[0]
        expect(actualDataLayerPushArgs).toEqual([
          {
            user: {
              dualRun: 'none',
              loggedIn: 'True',
              id: '123',
              hashedEmailAddress:
                '587d4c12fef06af41f2fdfa19a3e68443bf8a7923b47cb75022481f8d77552ad',
              isDDPUser: 'True',
              wasDDPUser: 'False',
              isDDPRenewable: 'True',
              ddpStartDate: '1 May 2019',
              ddpEndDate: '1 May 2020',
              ddpCurrentOrderCount: 3,
              ddpPreviousOrderCount: 0,
              authState: 'guest',
            },
          },
          'userSessionSchema',
          'userState',
        ])
      })

      it('triggers userStateChange event if logged in and then logged out', () => {
        triggered.cacheListener = true

        userSessionStateListener(loggedInState(), loggedOutState)

        expect(dataLayerMock.push).toHaveBeenCalledTimes(1)
        const actualDataLayerPushArgs = dataLayerMock.push.mock.calls[0]
        expect(actualDataLayerPushArgs).toEqual([
          {
            user: {
              dualRun: 'none',
              loggedIn: 'False',
              id: undefined,
              isDDPUser: undefined,
              authState: 'guest',
            },
          },
          'userSessionSchema',
          'userState',
        ])
      })

      it('triggers userStateChange event if logged in as isDDPUser and then logged out', () => {
        triggered.cacheListener = true

        userSessionStateListener(loggedInDdpUserState, loggedOutState)

        expect(dataLayerMock.push).toHaveBeenCalledTimes(1)
        const actualDataLayerPushArgs = dataLayerMock.push.mock.calls[0]
        expect(actualDataLayerPushArgs).toEqual([
          {
            user: {
              dualRun: 'none',
              loggedIn: 'False',
              id: undefined,
              isDDPUser: undefined,
              wasDDPUser: undefined,
              isDDPRenewable: undefined,
              ddpStartDate: undefined,
              ddpEndDate: undefined,
              ddpCurrentOrderCount: undefined,
              ddpPreviousOrderCount: undefined,
              authState: 'guest',
            },
          },
          'userSessionSchema',
          'userState',
        ])
      })

      it('does not push any event if user remains loggedOut', () => {
        userSessionStateListener(loggedOutState, loggedOutState)

        expect(dataLayerMock.push).toHaveBeenCalledTimes(0)
      })

      it('configures listeners correctly', () => {
        config()
        const addStateListeners = require('../../storeObserver')
          .addStateListeners
        expect(addStateListeners).toHaveBeenCalledWith(userSessionStateListener)

        const addPostDispatchListeners = require('../analytics-middleware')
          .addPostDispatchListeners
        expect(addPostDispatchListeners).toHaveBeenCalledWith(
          'PAGE_LOADED',
          cacheActionListener
        )
      })

      it('sets authState parameter to "full" if user is fully authenticated', () => {
        triggered.cacheListener = true
        userSessionStateListener(loggedOutState, loggedInState())
        expect(dataLayerMock.push.mock.calls[0][0].user).toEqual(
          expect.objectContaining({
            authState: 'full',
          })
        )
      })

      it('sets authState parameter to "partial" if user is partially authenticated', () => {
        triggered.cacheListener = true
        userSessionStateListener(
          loggedOutState,
          loggedInState({ authentication: 'partial' })
        )

        expect(dataLayerMock.push.mock.calls[0][0].user).toEqual(
          expect.objectContaining({
            authState: 'partial',
          })
        )
      })

      it('sets authState parameter to "guest" if user is not authenticated', () => {
        triggered.cacheListener = true
        userSessionStateListener(
          loggedInState({ authentication: 'partial' }),
          loggedOutState
        )

        expect(dataLayerMock.push.mock.calls[0][0].user).toEqual(
          expect.objectContaining({
            authState: 'guest',
          })
        )
      })
    })
  })
})
