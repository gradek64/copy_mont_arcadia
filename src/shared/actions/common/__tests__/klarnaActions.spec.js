import { renderToStaticMarkup } from 'react-dom/server'
import { createOrder } from '../orderActions'
import {
  createKlarnaSession,
  setKlarnaClientToken,
  setKlarnaPaymentMethodCategories,
  loadKlarnaForm,
  blockKlarnaUpdate,
  blockKlarnaPayment,
  resetKlarna,
  handleDisapproval,
  authorizeByKlarna,
  displayKlarnaWarning,
  updateKlarnaSession,
} from '../klarnaActions'

import {
  isKlarnaFormLoaded,
  klarnaPaymentsAuthorize,
  klarnaPaymentsInit,
  klarnaPaymentsLoad,
  removeDiacriticsDeep,
} from '../../../lib/checkout-utilities/klarna-utils'

import { showModal } from '../../common/modalActions'
import { nrBrowserLogError } from '../../../../client/lib/logger'

jest.mock('../orderActions', () => ({
  createOrder: jest.fn(),
}))

jest.mock('../../common/modalActions', () => ({
  showModal: jest.fn(),
}))

jest.mock('../../../lib/checkout-utilities/klarna-utils', () => ({
  authorizeRequest: jest.fn(),
  assembleSessionPayload: jest.fn(),
  reAuthorizeRequest: jest.fn(),
  klarnaPaymentsLoad: jest.fn(),
  klarnaPaymentsAuthorize: jest.fn(),
  prepareKlarnaPayload: jest.fn(),
  isKlarnaFormLoaded: jest.fn(),
  klarnaPaymentsInit: jest.fn(),
  removeDiacriticsDeep: jest.fn(),
}))

jest.mock('../../../lib/localisation', () => ({
  localise: jest.fn(),
}))

jest.mock('../../../lib/api-service', () => ({
  post: jest.fn(),
  put: jest.fn(),
}))

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

jest.mock('../../../../client/lib/logger', () => ({
  nrBrowserLogError: jest.fn(),
}))

describe('Klarna Actions', () => {
  const dispatch = jest.fn()
  const getState = jest.fn()
  const { post, put } = require('../../../lib/api-service')

  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    getState.mockReturnValue({
      klarna: {},
      config: {},
      checkout: {
        selectedPaymentMethod: 'KLRNA',
      },
    })
  })

  describe('actionCreators', () => {
    const param = 'mock-param'
    const actionCreators = [
      [
        setKlarnaClientToken,
        {
          type: 'SET_KLARNA_CLIENT_TOKEN',
          clientToken: param,
        },
      ],
      [
        setKlarnaPaymentMethodCategories,
        {
          type: 'SET_KLARNA_PAYMENT_METHOD_CATEGORIES',
          paymentMethodCategories: param,
        },
      ],
      [
        blockKlarnaUpdate,
        {
          type: 'BLOCK_KLARNA_UPDATE',
          isKlarnaUpdateBlocked: param,
        },
      ],
      [
        blockKlarnaPayment,
        {
          type: 'BLOCK_KLARNA_PAYMENT',
          isKlarnaPaymentBlocked: param,
        },
      ],
      [
        resetKlarna,
        {
          type: 'RESET_KLARNA',
        },
      ],
    ]

    actionCreators.forEach(([actionCreator, action]) => {
      it(`should create ${action.type}`, () => {
        expect(actionCreator(param)).toEqual(action)
      })
    })
  })

  describe('createSession', () => {
    const orderId = 123456
    const clientToken = 'mock clientToken'
    const sessionId = 'mock sessionId'
    const paymentMethodCategories = 'payment1,payment2'
    const state = {
      klarna: {},
      config: { clientToken },
    }
    const promiseReturnedByDispatchOnPost = Promise.resolve({
      body: {
        sessionId,
        clientToken,
        paymentMethodCategories,
      },
    })

    it('should create a new session with klarna and return sessionId, clientToken and paymentMethodCategories', async () => {
      getState.mockReturnValue(state)
      dispatch.mockReturnValueOnce()
      dispatch.mockReturnValueOnce(promiseReturnedByDispatchOnPost)

      await createKlarnaSession({ orderId })(dispatch, getState)

      expect(post).toBeCalledWith('/klarna-session', { orderId })
      expect(dispatch).toBeCalledWith({ type: 'AJAXCOUNTER_INCREMENT' })
      expect(dispatch).toBeCalledWith({ type: 'AJAXCOUNTER_DECREMENT' })
      expect(dispatch).toBeCalledWith({
        type: 'SET_KLARNA_PAYMENT_METHOD_CATEGORIES',
        paymentMethodCategories: ['payment1', 'payment2'],
      })
      expect(klarnaPaymentsInit).toHaveBeenCalled()
      expect(klarnaPaymentsInit).toHaveBeenCalledWith(clientToken)
    })

    it('should display an error if creating a session fails', async () => {
      getState.mockReturnValue(state)
      dispatch.mockReturnValueOnce()
      dispatch.mockReturnValueOnce(Promise.reject(''))
      await createKlarnaSession({ orderId })(dispatch, getState)

      expect(post).toBeCalledWith('/klarna-session', { orderId })
      expect(dispatch).toBeCalledWith({ type: 'AJAXCOUNTER_INCREMENT' })
      expect(dispatch).toBeCalledWith({ type: 'AJAXCOUNTER_DECREMENT' })
      expect(dispatch.mock.calls[3][0].name).toEqual(
        'displayKlarnaWarningThunk'
      )
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions.js -> createSession',
        ''
      )
    })
  })

  describe('loadKlarnaForm', () => {
    const container = 'mock container'

    it('should load the klarna form if klarnaPaymentsLoad has resolved', async () => {
      klarnaPaymentsLoad.mockImplementation(() => Promise.resolve({}))
      await loadKlarnaForm(container)(dispatch, () => ({
        klarna: { isKlarnaUpdateBlocked: true, isKlarnaPaymentBlocked: true },
      }))
      expect(dispatch.mock.calls).toHaveLength(2)
      expect(dispatch).toBeCalledWith({
        type: 'BLOCK_KLARNA_UPDATE',
        isKlarnaUpdateBlocked: false,
      })
      expect(dispatch).toBeCalledWith({
        type: 'BLOCK_KLARNA_PAYMENT',
        isKlarnaPaymentBlocked: false,
      })
      expect(nrBrowserLogError).toHaveBeenCalledTimes(0)
    })

    it('should log an error if response provides an error', async () => {
      klarnaPaymentsLoad.mockImplementation(() =>
        Promise.resolve({ error: 'this is an error' })
      )
      await loadKlarnaForm(container)(dispatch, () => ({}))
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions.js -> loadKlarnaForm -> show-form: true -> solvable errors.',
        'this is an error'
      )
    })

    it('should not load klarna form if klarnaPaymentsLoad has failed', async () => {
      klarnaPaymentsLoad.mockImplementation(() => {
        return Promise.reject({ show_form: false })
      })
      await loadKlarnaForm(container)(dispatch, getState)
      expect(klarnaPaymentsLoad()).rejects.toEqual({ show_form: false })
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions.js -> loadKlarnaForm -> show-form: false',
        { show_form: false }
      )
      expect(dispatch).toBeCalledWith({
        type: 'BLOCK_KLARNA_PAYMENT',
        isKlarnaPaymentBlocked: true,
      })
    })
  })

  describe('handleDisapproval', () => {
    const {
      browserHistory: { push },
    } = require('react-router')
    const { localise } = require('../../../lib/localisation')
    const translation = 'mock translation'
    const handleDisapprovalThunk = handleDisapproval()

    localise.mockReturnValue(translation)

    it('should dispatch showModal', () => {
      const state = {
        config: {},
        routing: {
          location: {
            pathname: 'checkout/payment',
            search: 'mock search',
          },
        },
      }

      getState.mockReturnValue(state)
      showModal.mockReturnValue('mock modal')

      handleDisapprovalThunk(dispatch, () => state)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(showModal).toHaveBeenCalledTimes(1)
      expect(renderToStaticMarkup(showModal.mock.calls[0][0])).toBe(
        '<div><p></p><button class="Button notranslate" type="button" role="button"></button></div>'
      )
      expect(dispatch.mock.calls[0][0]).toBe('mock modal')
      expect(dispatch.mock.calls[0][1]).toEqual({ type: 'alertdialog' })
    })

    it('should call browserHistory.push', () => {
      const search = 'mock search'
      const state = {
        config: {},
        routing: {
          location: {
            pathname: 'mock pathname',
            search,
          },
        },
      }

      getState.mockReturnValue(state)
      showModal.mockReturnValue('mock modal')

      handleDisapprovalThunk(dispatch, () => state)

      expect(push).toHaveBeenCalledTimes(1)
      expect(push.mock.calls[0][0]).toEqual(
        `/checkout/payment${search}#CardDetails`
      )
    })
  })

  describe('authorizeByKlarna', () => {
    const klarnaPayload = {}
    const order = {
      orderDeliveryOption: {
        deliveryType: '',
      },
    }
    const authorization_token = '036dddd8-a6c4-55cb-960d-27628da53401'

    it('should return an klarna authorized token and pass it to the create order action', async () => {
      const expectedMockArgs = {
        authToken: authorization_token,
        deliveryNameAndPhone: {
          firstName: 'John',
          lastName: 'Smith',
          title: 'Mr',
        },
      }
      removeDiacriticsDeep.mockReturnValueOnce(expectedMockArgs)
      klarnaPaymentsAuthorize.mockImplementation(() => {
        return Promise.resolve({ authorization_token, approved: true })
      })
      await authorizeByKlarna(klarnaPayload, order)(dispatch, getState)
      expect(klarnaPaymentsAuthorize).toHaveBeenCalledTimes(1)
      expect(klarnaPaymentsAuthorize).toHaveBeenCalledWith(klarnaPayload)
      expect(klarnaPaymentsAuthorize()).resolves.toEqual({
        authorization_token,
        approved: true,
      })

      expect(createOrder).toHaveBeenCalled()
      expect(createOrder).toHaveBeenCalledWith(expectedMockArgs)
    })

    it('should log an error if not approved and no authorization token', async () => {
      klarnaPaymentsAuthorize.mockImplementation(() => {
        return Promise.resolve({ approved: false })
      })
      await authorizeByKlarna(klarnaPayload, order)(dispatch, getState)
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions -> authorize -> No authorization token',
        'Klarna approval failed'
      )
    })

    it('should log an error if not approved and finalization is required', async () => {
      klarnaPaymentsAuthorize.mockImplementation(() => {
        return Promise.resolve({
          approved: false,
          finalize_required: true,
          authorization_token,
        })
      })
      await authorizeByKlarna(klarnaPayload, order)(dispatch, getState)
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions -> authorize -> An authorization that requires finalization',
        'Klarna approval failed'
      )
    })

    it('should display a disapproval message if klarna.authorize has failed', async () => {
      klarnaPaymentsAuthorize.mockImplementation(() => {
        return Promise.reject({ show_form: false })
      })

      await authorizeByKlarna(klarnaPayload, order)(dispatch, getState)
      expect(createOrder).not.toHaveBeenCalled()
      expect(klarnaPaymentsAuthorize()).rejects.toEqual({ show_form: false })
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions -> authorize -> A rejected authorization (non-resolvable)',
        { show_form: false }
      )
    })

    it('should display a klarna warning message if klarna.authorize has failed', async () => {
      klarnaPaymentsAuthorize.mockImplementation(() => {
        return Promise.reject({ show_form: true })
      })

      await authorizeByKlarna(klarnaPayload, order)(dispatch, getState)
      expect(createOrder).not.toHaveBeenCalled()
      expect(klarnaPaymentsAuthorize()).rejects.toEqual({ show_form: true })
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions -> authorize -> A rejected authorization with solvable errors',
        { show_form: true }
      )
    })
  })

  describe('displayKlarnaWarning', () => {
    it('should display a modal with a warning message', async () => {
      await displayKlarnaWarning()(dispatch, getState)
      expect(showModal).toHaveBeenCalled()
    })
  })

  describe('updateKlarnaSession', () => {
    const clientToken = 'mock clientToken'
    const state = {
      klarna: {
        isKlarnaUpdateBlocked: false,
      },
      config: { clientToken },
      shoppingBag: {
        bag: {
          orderId: '0000001',
        },
      },
    }

    it('should update the Klarna form if "isKlarnaUpdateBlocked" is true', async () => {
      // A returning customer can modified an order outside of checkout
      // and when the customer returns to checkout the order is not in-sync with
      // Klarna. An update is required.

      isKlarnaFormLoaded.mockReturnValueOnce(false)
      getState.mockReturnValue({
        ...state,
      })
      dispatch.mockReturnValueOnce(Promise.resolve())
      const forceUpdate = true
      await updateKlarnaSession(forceUpdate)(dispatch, getState)
      expect(put).toBeCalledWith('/klarna-session', { orderId: '0000001' })
      expect(dispatch.mock.calls[1][0].name).toEqual('loadKlarnaFormThunk')
    })

    it('should update the Klarna form if the klarna iframe is rendered', async () => {
      isKlarnaFormLoaded.mockReturnValueOnce(true)
      getState.mockReturnValue(state)
      dispatch.mockReturnValueOnce(Promise.resolve())

      await updateKlarnaSession()(dispatch, getState)
      expect(put).toBeCalledWith('/klarna-session', { orderId: '0000001' })
      expect(dispatch.mock.calls[1][0].name).toEqual('loadKlarnaFormThunk')
    })

    it('should display an error if the update is rejected', async () => {
      isKlarnaFormLoaded.mockReturnValueOnce(true)
      getState.mockReturnValue(state)
      dispatch.mockReturnValueOnce(Promise.reject(''))
      await updateKlarnaSession()(dispatch, getState)
      expect(put).toBeCalledWith('/klarna-session', { orderId: '0000001' })
      expect(dispatch.mock.calls[1][0].name).toEqual(
        'displayKlarnaWarningThunk'
      )
      expect(dispatch).toBeCalledWith({
        type: 'BLOCK_KLARNA_PAYMENT',
        isKlarnaPaymentBlocked: true,
      })
      expect(dispatch).toBeCalledWith({
        type: 'BLOCK_KLARNA_UPDATE',
        isKlarnaUpdateBlocked: false,
      })

      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'error: klarnaActions.js -> updateSession',
        ''
      )
    })

    it('should do nothing if the klarna iframe is not rendered', async () => {
      isKlarnaFormLoaded.mockReturnValueOnce(false)
      getState.mockReturnValue(state)
      await updateKlarnaSession()(dispatch, getState)
      expect(put).not.toHaveBeenCalled()
    })
  })
})
