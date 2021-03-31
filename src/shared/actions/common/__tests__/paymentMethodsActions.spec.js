import {
  getPaymentMethods,
  getAllPaymentMethods,
} from '../paymentMethodsActions'

jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
  del: jest.fn(),
}))

import { get } from '../../../lib/api-service'

const getState = jest.fn()
const dispatch = jest.fn()

jest.mock('../../components/LoaderOverlayActions', () => ({
  ajaxCounter: jest.fn(),
}))

import { ajaxCounter } from '../../components/LoaderOverlayActions'

describe('Payment Method Actions', () => {
  describe('getPaymentMethods makes api GET request', () => {
    it('defaults to getting all payment methods if the query string is empty due to undefined params', () => {
      const thunk = getPaymentMethods({})
      thunk(dispatch, getState)
      expect(get).toHaveBeenCalledWith('/payments')
    })

    it('defaults to getting all payment methods if the query string is empty due to empty string params', () => {
      const thunk = getPaymentMethods({ delivery: '', billing: '' })
      thunk(dispatch, getState)
      expect(get).toHaveBeenCalledWith('/payments')
    })

    it('handles passed in delivery, billing and ignores everything else', () => {
      const thunk = getPaymentMethods({
        delivery: 'aaa',
        billing: 'bbb',
        ccc: 1,
        ddd: 'eee',
      })
      thunk(dispatch, getState)
      expect(get).toHaveBeenCalledWith('/payments?delivery=aaa&billing=bbb')
    })

    it('handles passed in just delivery', () => {
      const thunk = getPaymentMethods({ delivery: 'aaa' })
      thunk(dispatch, getState)
      expect(get).toHaveBeenCalledWith('/payments?delivery=aaa')
    })

    it('handles passed in just billing', () => {
      const thunk = getPaymentMethods({ billing: 'aaa' })
      thunk(dispatch, getState)
      expect(get).toHaveBeenCalledWith('/payments?billing=aaa')
    })
    it('Shows and then hides the loader on success', async () => {
      get.mockReturnValueOnce(Promise.resolve())

      const thunk = getPaymentMethods({})
      await thunk(dispatch, getState)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })
    it('Shows and then hides the loader on failure', async () => {
      get.mockReturnValueOnce(Promise.reject())

      const thunk = getPaymentMethods({})
      await thunk(dispatch, getState)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })
  })

  describe('getAllPaymentMethods', () => {
    it('returns a method that calls dispatch with getPaymentMethods', () => {
      const thunk = getAllPaymentMethods()

      thunk(dispatch)

      expect(get).toHaveBeenCalledWith('/payments')
    })
  })
})
