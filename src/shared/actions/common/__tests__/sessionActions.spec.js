import React from 'react'
import * as actions from '../sessionActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { logoutRequest } from '../authActions'
import * as modalActions from '../modalActions'
import * as utils from '../../../lib/session-utils'

jest.mock('../../../lib/cookie', () => ({
  parseCookieString: jest.fn((value) => value),
}))

jest.mock('../authActions', () => ({
  logoutRequest: jest.fn(() => ({ type: 'LOGOUT_REQUEST_MOCK' })),
}))

jest.mock('../../../components/containers/SignIn/SignIn', () =>
  jest.fn(() => <div data-jest />)
)
import SignIn from '../../../components/containers/SignIn/SignIn'

const setCookies = jest.fn()
const middlewares = [
  thunk.withExtraArgument({
    setCookies,
  }),
]
const mockStore = configureMockStore(middlewares)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('sessionActions', () => {
  describe('sessionExpired', () => {
    const logoutRequestMock = () => {
      const p = new Promise((res) => res())
      p.type = 'LOGOUT_REQUEST_MOCK'
      return p
    }

    describe('Excluded routes', () => {
      actions.excludedRoutes.forEach((route) => {
        it(`should not run logoutRequest if page is on ${route}`, async () => {
          const store = mockStore({
            routing: {
              location: {
                pathname: route,
              },
            },
          })
          await store.dispatch(actions.sessionExpired())
          const expectedActions = []
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })

    it('dispatches a logoutRequest with redirect to `/login` page', async () => {
      utils.getRedirectUrl = jest.fn().mockReturnValueOnce('/login')
      logoutRequest.mockImplementationOnce(logoutRequestMock)
      const mockedCloseModalAction = { type: 'MOCKED_CLOSE_MODAL' }
      jest
        .spyOn(modalActions, 'closeModal')
        .mockReturnValue(mockedCloseModalAction)

      const store = mockStore({
        routing: {
          location: {
            pathname: '/some-allowed-route',
          },
        },
      })

      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        { type: 'SESSION_EXPIRED' },
        { type: 'SHOW_SESSION_EXPIRED_MESSAGE' },
        { type: 'CLOSE_MINI_BAG' },
        mockedCloseModalAction,
        logoutRequestMock(),
        { type: 'AJAXCOUNTER_DECREMENT' },
        { type: 'RESET_SESSION_EXPIRED' },
      ]

      await store.dispatch(actions.sessionExpired())
      expect(store.getActions()).toEqual(expectedActions)
      expect(logoutRequest).toHaveBeenCalledWith('/login')
    })

    it('should use setCookies in redux context to return logout cookies during SSR', async () => {
      const mockCookies = ['cookie1', 'cookie2']
      const logoutRequestMock = () => {
        const p = new Promise((res) =>
          res({
            headers: {
              'set-cookie': mockCookies,
            },
          })
        )
        p.type = 'LOGOUT_REQUEST_MOCK'
        return p
      }

      logoutRequest.mockImplementationOnce(logoutRequestMock)
      const store = mockStore()
      await store.dispatch(actions.sessionExpired())

      expect(setCookies).toHaveBeenCalledTimes(1)
      expect(setCookies).toHaveBeenCalledWith(mockCookies)
    })
  })

  describe('sessionReset', () => {
    it('should create RESET_SESSION_EXPIRED action', () => {
      const expectedAction = {
        type: 'RESET_SESSION_EXPIRED',
      }

      expect(actions.sessionReset()).toEqual(expectedAction)
    })
  })

  describe('setSessionExpired', () => {
    it('should create SESSION_EXPIRED action', () => {
      const expectedAction = {
        type: 'SESSION_EXPIRED',
      }

      expect(actions.setSessionExpired()).toEqual(expectedAction)
    })
  })

  describe('openSessionTimeoutModal', () => {
    it('should show a modal containing a signin UI', async () => {
      const expectedActions = [
        { type: 'SET_MODAL_MODE', mode: 'sessionTimeout' },
        {
          type: 'SET_MODAL_CHILDREN',
          children: expect.stringContaining('data-jest'),
        },
        { type: 'SET_MODAL_TYPE', modalType: 'dialog' },
      ]

      const store = mockStore()
      await store.dispatch(actions.openSessionTimeoutModal())

      expect(store.getActions()).toMatchObject(
        expect.arrayContaining(expectedActions)
      )
    })

    it('passes the passed success callback into the sign in component', async () => {
      SignIn.mockImplementationOnce(({ successCallback }) => {
        successCallback()
        return null
      })

      const callback = jest.fn()
      const store = mockStore()
      await store.dispatch(actions.openSessionTimeoutModal(callback))

      expect(callback).toHaveBeenCalled()
    })
  })
})
