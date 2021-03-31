import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { findAddress, getAddressByMoniker } from '../../../checkoutActions'
import { localise } from '../../../../../lib/localisation'
import { get } from '../../../../../lib/api-service'

// Helper
jest.mock('../../../../../lib/localisation')
jest.mock('../../../../../lib/api-service', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}))

describe('findAddress()', () => {
  const dispatch = jest.fn()
  const getState = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    getState.mockReturnValue({
      config: {
        langHostnames: {
          default: {
            defaultLanguage: 'English',
          },
        },
        brandName: 'topshop',
        language: '',
      },
    })
  })
  const action = findAddress({}, 'yourAddressFormName', 'findAddressFormName')

  it('should increment and then decrement ajax counter on success', () => {
    dispatch.mockImplementation(() => {
      return Promise.resolve({ body: {} })
    })
    return action(dispatch, getState).then(() => {
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: 'AJAXCOUNTER_INCREMENT',
      })
      expect(dispatch.mock.calls[3][0]).toEqual({
        type: 'AJAXCOUNTER_DECREMENT',
      })
    })
  })

  it('should increment and then decrement ajax counter on failure', () => {
    dispatch.mockImplementation(() => {
      return Promise.reject({ response: { body: { message: '' } } })
    })
    return action(dispatch, getState).then(() => {
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: 'AJAXCOUNTER_INCREMENT',
      })
      expect(dispatch.mock.calls[3][0]).toEqual({
        type: 'AJAXCOUNTER_DECREMENT',
      })
    })
  })

  it('should clear form message', () => {
    dispatch.mockImplementation(() => {
      return Promise.resolve({ body: {} })
    })

    localise.mockImplementation(() => {
      return ''
    })

    return action(dispatch, getState).then(() => {
      const setFormMessageThunk = dispatch.mock.calls[1][0]
      dispatch.mockClear()
      setFormMessageThunk(dispatch, getState)

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName: 'findAddressFormName',
        key: null,
        message: {
          message: '',
          type: 'error',
        },
      })
    })
  })

  it('should call setMonikerAddress on success', () => {
    dispatch.mockImplementation(() => {
      return Promise.resolve({ body: {} })
    })
    return action(dispatch, getState).then(() => {
      expect(dispatch.mock.calls[4][0]).toEqual({
        type: 'UPDATE_MONIKER',
        data: {},
      })
    })
  })

  it('should call setMonikerAddress on success', () => {
    dispatch.mockImplementation(() => {
      return Promise.resolve({ body: {} })
    })
    return action(dispatch, getState).then(() => {
      expect(dispatch.mock.calls[4][0]).toEqual({
        type: 'UPDATE_MONIKER',
        data: {},
      })
    })
  })

  it('should call getAddressByMoniker on success if res.body has length', () => {
    dispatch.mockImplementation(() => {
      return Promise.resolve({ body: [{}] })
    })
    return action(dispatch, getState).then(() => {
      expect(dispatch.mock.calls[5][0].name).toBe('getAddressByMonikerThunk')
    })
  })

  it('should set form message to error on success if res.body has no length', () => {
    dispatch.mockImplementation(() => {
      return Promise.resolve({ body: [] })
    })
    localise.mockImplementation(() => {
      return 'We are unable to find your address at the moment. Please enter your address manually.'
    })
    return action(dispatch, getState).then(() => {
      const setFormMessageThunk = dispatch.mock.calls[5][0]
      dispatch.mockClear()
      setFormMessageThunk(dispatch, getState)

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName: 'findAddressFormName',
        key: null,
        message: {
          message:
            'We are unable to find your address at the moment. Please enter your address manually.',
          type: 'error',
        },
      })
    })
  })

  describe('Find Address - failed request', () => {
    let store
    const defaultState = {
      config: {
        langHostnames: {
          default: {
            defaultLanguage: 'English',
          },
        },
        brandName: 'topshop',
        language: 'en-gb',
      },
    }
    const middleWares = [thunk]
    const mockStore = configureStore(middleWares)

    beforeEach(() => {
      store = mockStore(defaultState)
    })

    it('should set form message on failure if statusCode is 422', async () => {
      localise.mockImplementation(
        () =>
          'We are unable to find your address at the moment. Please enter your address manually.'
      )

      get.mockImplementation(() => () => {
        return Promise.reject({
          response: {
            statusCode: 422,
          },
        })
      })

      await store.dispatch(action)

      expect(store.getActions()[1]).toEqual({
        formName: 'findAddressFormName',
        key: null,
        message: {
          message:
            'We are unable to find your address at the moment. Please enter your address manually.',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      })
    })

    it('should set form message on failure if statusCode is 503', async () => {
      localise.mockImplementation(
        () =>
          'We are unable to find your address at the moment. Please enter your address manually.'
      )

      get.mockImplementation(() => () => {
        return Promise.reject({
          response: {
            statusCode: 503,
          },
        })
      })

      await store.dispatch(action)

      expect(store.getActions()[1]).toEqual({
        formName: 'findAddressFormName',
        key: null,
        message: {
          message:
            'We are unable to find your address at the moment. Please enter your address manually.',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      })
    })

    it('should set form message to default error message on failure if statusCode is not 422 and there is no message', async () => {
      localise.mockImplementation(
        () =>
          'We are unable to find your address at the moment. Please enter your address manually.'
      )

      get.mockImplementation(() => () => {
        return Promise.reject({
          response: {
            body: {
              message: '',
            },
            statusCode: 500,
          },
        })
      })

      await store.dispatch(action)

      expect(store.getActions()[1]).toEqual({
        formName: 'findAddressFormName',
        key: null,
        message: {
          message:
            'We are unable to find your address at the moment. Please enter your address manually.',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      })
    })

    it('should set form message on failure if statusCode is not 422 or 503 and there is a message', async () => {
      localise.mockImplementation(() => 'testMessage')

      get.mockImplementation(() => () => {
        return Promise.reject({
          response: {
            body: {
              message: 'testMessage',
            },
            statusCode: 500,
          },
        })
      })

      await store.dispatch(action)

      expect(store.getActions()[1]).toEqual({
        formName: 'findAddressFormName',
        key: null,
        message: {
          message: 'testMessage',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      })
    })
  })
})

describe('getAddressByMoniker', () => {
  const getAddressByMonikerAction = getAddressByMoniker(
    { moniker: 'VVVFGGGHHHT/TFGGDDF4455566', country: 'UK' },
    'formName'
  )

  const dispatch = jest.fn()
  const getState = jest.fn()

  const fakeAddressBody = {
    adress: 'Street',
    postcode: '234556',
    city: 'London',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getState.mockReturnValue({
      config: {
        langHostnames: {
          default: {
            defaultLanguage: 'English',
          },
        },
        brandName: 'topshop',
        language: '',
      },
      checkout: {
        orderSummary: {},
      },
      routing: {
        location: {
          pathname: '/my-account/accountDetails',
        },
      },
    })
  })

  describe('Invoke function from Checkout', () => {
    it('Call GetAddressByMoniker should call setOrderSummary (mean call from Checkout)', () => {
      dispatch.mockImplementation(() => {
        return Promise.resolve({ body: fakeAddressBody })
      })
      getState.mockReturnValue({
        checkout: {
          orderSummary: {},
        },
        routing: {
          location: {
            pathname: '/checkout/accountDetails',
          },
        },
      })
      return getAddressByMonikerAction(dispatch, getState).then(() => {
        expect(dispatch.mock.calls[5][0].name).toBe('setOrderSummaryThunk')
      })
    })

    it('Call GetAddressByMoniker whit no response should call a error', () => {
      dispatch.mockImplementation(() => {
        return Promise.reject({ response: { body: { message: 'no address' } } })
      })

      localise.mockImplementation(() => {
        return 'no address'
      })

      return getAddressByMonikerAction(dispatch, getState).then(() => {
        const setFormMessageThunk = dispatch.mock.calls[3][0]
        dispatch.mockClear()
        setFormMessageThunk(dispatch, getState)

        expect(dispatch.mock.calls[0][0]).toEqual({
          type: 'SET_FORM_MESSAGE',
          formName: 'formName',
          key: null,
          message: {
            message: 'no address',
            type: 'error',
          },
        })
      })
    })

    it('encodes the moniker param', () => {
      return getAddressByMonikerAction(dispatch, getState).then(() => {
        expect(get).toHaveBeenCalledWith(
          '/address/VVVFGGGHHHT%2FTFGGDDF4455566?country=UK'
        )
      })
    })
  })

  describe('Invoke function from MyAccount --> MyCheckoutDetails', () => {
    it('Call GetAddressByMoniker should NOT call setOrderSummary', () => {
      dispatch.mockImplementation(() => {
        return Promise.resolve({ body: fakeAddressBody })
      })
      return getAddressByMonikerAction(dispatch, getState).then(() => {
        expect(dispatch.mock.calls[5]).toBe(undefined)
      })
    })
    it('Call GetAddressByMoniker should call resetForm', () => {
      dispatch.mockImplementation(() => {
        return Promise.resolve({ body: fakeAddressBody })
      })
      return getAddressByMonikerAction(dispatch, getState).then(() => {
        expect(dispatch.mock.calls[3][0]).toEqual({
          type: 'RESET_FORM',
          formName: 'formName',
          initialValues: {
            adress: 'Street',
            postcode: '234556',
            city: 'London',
          },
          key: null,
        })
      })
    })
  })
})
