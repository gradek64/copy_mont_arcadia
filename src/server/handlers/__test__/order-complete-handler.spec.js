import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import orderCompleteHandler, {
  setOrderPayload,
} from '../order-complete-handler'

jest.mock('../server-side-renderer', () => ({
  serverSideRenderer: jest.fn(),
}))

import { serverSideRenderer } from '../server-side-renderer'

describe('setOrderPayload', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  it('should call setOrderPending when an order payload can be extracted from the request', () => {
    const initialState = {}
    const store = mockStore(initialState)
    const orderId = 'testOrderId12345'
    const md = 'testMD'
    const ga = 'testGA'
    const paRes = 'testPaRes'
    const hostname = 'www.example.com'

    const mockReq = {
      query: {
        orderId,
        MD: md,
        ga,
        PaRes: paRes,
      },
      info: {
        hostname,
      },
    }
    setOrderPayload(mockReq, store)
    expect(store.getActions()).toEqual([
      {
        data: {
          authProvider: 'VBV',
          ga,
          hostname,
          md,
          orderId,
          paRes,
        },
        type: 'SET_ORDER_PENDING',
      },
    ])
  })

  it('should call setOrderError when no order payload can be extracted from the request', () => {
    const initialState = {}
    const store = mockStore(initialState)
    const mockReq = {
      query: {},
    }
    setOrderPayload(mockReq, store)
    expect(store.getActions()).toEqual([
      {
        error: 'Unable to complete payment, please retry again later',
        type: 'SET_ORDER_ERROR',
      },
    ])
  })
})

describe('orderCompleteHandler', () => {
  const mockReply = {
    code: jest.fn(),
    redirect: jest.fn(() => ({
      permanent: jest.fn(),
    })),
  }
  const replyMock = jest.fn(() => mockReply)

  it('should call setOrderPayload as part of the server side render', async () => {
    const request = {}

    await orderCompleteHandler(request, replyMock)

    expect(serverSideRenderer).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      {
        postStorePopulation: setOrderPayload,
      }
    )
  })
})
