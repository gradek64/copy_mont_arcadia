import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  createAddress,
  deleteAddress,
  selectAddress,
  showNewAddressForm,
  hideNewAddressForm,
} from '../addressBookActions'
import { resetForm } from '../formActions'
import {
  getOrderSummary,
  updateOrderSummaryWithResponse,
} from '../checkoutActions'

jest.mock('../../../lib/api-service', () => ({
  post: jest.fn(),
  del: jest.fn(),
  put: jest.fn(),
}))

import { post, del, put } from '../../../lib/api-service'

jest.mock('../formActions', () => ({
  resetForm: jest.fn(() => ({
    type: 'RESET_FORM',
  })),
  handleFormResponseErrorMessage: jest.fn(),
}))
jest.mock('../checkoutActions', () => ({
  getOrderSummary: jest.fn(),
  updateOrderSummaryWithResponse: jest.fn(),
}))

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addressBookActions', () => {
  describe('hideNewAddressForm', () => {
    it('should return action to hide address book form', () => {
      const action = {
        type: 'ADDRESS_BOOK_HIDE_NEW_ADDRESS_FORM',
      }
      expect(hideNewAddressForm()).toEqual(action)
    })
  })

  describe('showNewAddressForm', () => {
    const state = {
      account: {
        user: {
          deliveryDetails: {
            address: {
              country: 'United Kingdom',
            },
          },
        },
      },
    }
    const store = mockStore(state)

    it('should dispatch action to reset relevant address forms', () => {
      store.dispatch(showNewAddressForm())
      expect(resetForm).toHaveBeenCalledTimes(4)
      expect(resetForm).toHaveBeenCalledWith('newAddress', {
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        country: 'United Kingdom',
        state: '',
        county: null,
        isManual: false,
      })
      expect(resetForm).toHaveBeenCalledWith('newDetails', {
        title: '',
        firstName: '',
        lastName: '',
        telephone: '',
      })
      expect(resetForm).toHaveBeenCalledWith('newFindAddress', {
        houseNumber: '',
        message: '',
        findAddress: '',
        selectAddress: '',
        postcode: '',
      })
      expect(resetForm).toHaveBeenCalledWith('newDeliverToAddress', {
        deliverToAddress: '',
      })
    })

    it('should dispatch action to show new address form', () => {
      const expectedAction = [
        {
          type: 'ADDRESS_BOOK_SHOW_NEW_ADDRESS_FORM',
        },
      ]
      store.dispatch(showNewAddressForm())
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })
  })

  describe('createAddress', () => {
    const address = {
      address1: '101 Acme Road',
      address2: '',
      city: 'London',
    }
    const dispatchMock = jest.fn(() => Promise.resolve({}))

    beforeEach(() => {
      dispatchMock.mockClear()
    })

    it('should dispatch action to create a delivery address', () => {
      const thunk = createAddress(address)
      thunk(dispatchMock)

      expect(post).toHaveBeenCalledWith(
        '/checkout/order_summary/delivery_address',
        {
          ...address,
          responseType: 'orderSummary',
        }
      )
    })

    it('should dispatch actions to hide address form and get order summary on request success', async () => {
      dispatchMock.mockImplementation((args) => args)
      post.mockReturnValue(
        Promise.resolve({
          body: 'AAAA',
        })
      )
      await createAddress(address)(dispatchMock)
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'ADDRESS_BOOK_HIDE_NEW_ADDRESS_FORM',
      })
      expect(updateOrderSummaryWithResponse).toHaveBeenCalledTimes(1)
      expect(updateOrderSummaryWithResponse).toHaveBeenCalledWith(
        { body: 'AAAA' },
        false,
        false
      )
    })

    it('should not dispatch actions to hide address form or get order summary on request failure', async () => {
      dispatchMock.mockReturnValue(Promise.reject())

      await createAddress(address)(dispatchMock)
      expect(dispatchMock).not.toHaveBeenCalledWith({
        type: 'ADDRESS_BOOK_HIDE_NEW_ADDRESS_FORM',
      })
      expect(getOrderSummary).not.toHaveBeenCalled()
    })
  })

  describe('deleteAddress', () => {
    const dispatchMock = jest.fn(() => Promise.resolve({}))

    it('should make a delete request with address.id', () => {
      const id = 123456

      const thunk = deleteAddress({ id })
      thunk(dispatchMock)

      expect(del).toHaveBeenCalledWith(
        '/checkout/order_summary/delivery_address',
        {
          addressId: id,
        }
      )
    })

    it('should make a delete request with address.addressId', () => {
      const addressId = 123456

      const thunk = deleteAddress({ addressId })
      thunk(dispatchMock)

      expect(del).toHaveBeenCalledWith(
        '/checkout/order_summary/delivery_address',
        {
          addressId,
        }
      )
    })
  })

  describe('selectAddress', () => {
    const addressId = 123456
    const dispatchMock = jest.fn(() => Promise.resolve({}))

    beforeEach(() => {
      dispatchMock.mockClear()
    })

    it('should make a put request to select a delivery address', async () => {
      dispatchMock.mockImplementation((args) => args)
      put.mockReturnValue(
        Promise.resolve({
          body: 'AAAA',
        })
      )

      const thunk = selectAddress({ addressId })
      await thunk(dispatchMock)

      expect(put).toHaveBeenCalledWith(
        '/checkout/order_summary/delivery_address',
        { addressId }
      )
      expect(updateOrderSummaryWithResponse).toHaveBeenCalledTimes(1)
      expect(updateOrderSummaryWithResponse).toHaveBeenCalledWith(
        { body: 'AAAA' },
        false,
        false
      )
    })

    it('should not dispatch action to get order summary on request failure', async () => {
      dispatchMock.mockReturnValue(Promise.reject())
      await selectAddress({ addressId })(dispatchMock)

      expect(getOrderSummary).not.toHaveBeenCalled()
    })
  })
})
