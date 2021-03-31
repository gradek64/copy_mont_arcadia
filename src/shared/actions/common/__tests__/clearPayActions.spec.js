import { initialiseClearPay } from '../clearPayActions'
import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import userMock from 'test/mocks/myAccount-response.json'
import * as checkoutSelectors from '../../../selectors/checkoutSelectors'
import * as orderActions from '../orderActions'

jest.spyOn(checkoutSelectors, 'getCheckoutOrderError')
jest.mock('../orderActions', () => ({
  setOrderPending: (payload) => ({
    type: 'SET_ORDER_PENDING_MOCK',
    payload,
  }),
  processOrder: () => ({
    type: 'PROCESS_ORDER_MOCK',
  }),
  completeOrder: jest.fn(({ finalisedOrder, completedOrder }) => ({
    type: 'COMPLETE_ORDER_MOCK',
    finalisedOrder,
    completedOrder,
  })),
}))

describe('initialiseClearPay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const initialState = {
    debug: {
      environment: 'prod',
    },
    account: {
      user: userMock,
    },
    config: {
      language: 'en',
      brandName: 'topshop',
    },
    forms: {
      checkout: {
        billingCardDetails: {
          fields: {
            paymentType: {
              value: 'CLRPY',
            },
          },
        },
      },
      giftCard: {
        fields: {},
      },
    },
    checkout: {
      orderCompleted: 'orderCompleted',
      finalisedOrder: {
        returnUrl:
          'http://www.topshop.com/order-complete?orderId=8359831&paymentMethod=CLRPY',
        orderDeliveryOption: {
          orderId: 'myOrderId',
        },
      },
    },
    siteOptions: {
      billCountries: {},
    },
  }

  const orderResponse = {
    cardBrand: 'CLRPY',
    errorMessage: 'errorMessage',
    expires: 'expires',
    orderId: 'orderId',
    paymentToken: 'paymentToken',
    policyId: 'policyId',
    success: true,
    tranId: 'tranId',
  }

  const mockAfterPayLib = () => {
    window.AfterPay = {
      initialize: jest.fn(),
      open: jest.fn(),
      transfer: jest.fn(),
    }
  }

  beforeEach(() => {
    delete window.AfterPay
    window.loadScript = jest.fn()
    jest.useFakeTimers()
  })

  const expectClearPayScriptToBeInitialised = async ({
    expectedScriptUrl = 'https://portal.clearpay.co.uk/afterpay.js',
    expectedPaymentToken = 'paymentToken',
  } = {}) => {
    // load ClearPay's AfterPay library
    const loadScriptArgs = window.loadScript.mock.calls[0][0]
    expect(loadScriptArgs.src).toBe(expectedScriptUrl)

    mockAfterPayLib()
    loadScriptArgs.onload()
    jest.runAllTimers()

    // check AfterPay called correctly
    expect(window.AfterPay.initialize).toHaveBeenCalledWith({
      countryCode: 'GB',
    })

    expect(window.AfterPay.open).toHaveBeenCalled()
    expect(window.AfterPay.transfer).toHaveBeenCalledWith({
      token: expectedPaymentToken,
    })
  }

  it('loads the correct afterpay script and triggers pop up for dev environment', async () => {
    const store = mockStoreCreator({
      ...initialState,
      debug: {
        environment: 'acc1',
      },
    })

    await store.dispatch(initialiseClearPay(orderResponse))

    await expectClearPayScriptToBeInitialised({
      expectedScriptUrl: 'https://portal.sandbox.clearpay.co.uk/afterpay.js',
    })
  })

  it('loads the correct afterpay script and triggers pop up for prod environment', async () => {
    const store = mockStoreCreator({
      ...initialState,
      debug: {
        environment: 'prod',
      },
    })

    await store.dispatch(initialiseClearPay(orderResponse))

    await expectClearPayScriptToBeInitialised({
      expectedScriptUrl: 'https://portal.clearpay.co.uk/afterpay.js',
    })
  })

  it('does not load the script if it is already loaded', async () => {
    const store = mockStoreCreator(initialState)

    mockAfterPayLib()

    await store.dispatch(initialiseClearPay(orderResponse))

    const loadScript = window.loadScript
    expect(loadScript).toHaveBeenCalledTimes(0)

    expect(window.AfterPay.initialize).toHaveBeenCalledWith({
      countryCode: 'GB',
    })

    expect(window.AfterPay.open).toHaveBeenCalled()
    expect(window.AfterPay.transfer).toHaveBeenCalledWith({
      token: 'paymentToken',
    })
  })

  it('shows an error if AfterPay library is missing', async () => {
    const store = mockStoreCreator(initialState)

    store.dispatch(initialiseClearPay(orderResponse))
    const loadScriptArgs = window.loadScript.mock.calls[0][0]
    loadScriptArgs.onload()
    jest.runAllTimers()

    expect(store.getActions()).toEqual([
      {
        type: 'AJAXCOUNTER_INCREMENT',
      },
      {
        formName: 'order',
        key: null,
        message: {
          message: 'An error has occurred. Please try again',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      },
      {
        type: 'AJAXCOUNTER_DECREMENT',
      },
    ])
  })

  it('shows an error if loadScript library is missing', async () => {
    delete window.loadScript
    const store = mockStoreCreator(initialState)

    store.dispatch(initialiseClearPay(orderResponse))

    expect(store.getActions()).toEqual([
      {
        type: 'AJAXCOUNTER_INCREMENT',
      },
      {
        formName: 'order',
        key: null,
        message: {
          message: 'An error has occurred. Please try again',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      },
      {
        type: 'AJAXCOUNTER_DECREMENT',
      },
    ])
  })

  it('shows an error if the payment token is missing', async () => {
    const store = mockStoreCreator(initialState)

    mockAfterPayLib()

    store.dispatch(
      initialiseClearPay({ ...orderResponse, paymentToken: undefined })
    )

    expect(store.getActions()).toEqual([
      {
        type: 'AJAXCOUNTER_INCREMENT',
      },
      {
        formName: 'order',
        key: null,
        message: {
          message: 'An error has occurred. Please try again',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      },
      {
        type: 'AJAXCOUNTER_DECREMENT',
      },
    ])
    expect(window.AfterPay.initialize).not.toHaveBeenCalled()
    expect(window.AfterPay.open).not.toHaveBeenCalled()
    expect(window.AfterPay.transfer).not.toHaveBeenCalled()
  })

  it('shows an error if event.data.status is CANCELED', async () => {
    const store = mockStoreCreator(initialState)

    await store.dispatch(initialiseClearPay(orderResponse))

    await expectClearPayScriptToBeInitialised()

    window.AfterPay.onComplete({ data: { status: 'CANCELLED' } })

    expect(store.getActions()).toEqual([
      {
        type: 'AJAXCOUNTER_INCREMENT',
      },
      {
        formName: 'order',
        key: null,
        message: {
          message: 'An error has occurred. Please try again',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      },
      {
        type: 'AJAXCOUNTER_DECREMENT',
      },
    ])
  })

  it('shows the WCS error if success is false', async () => {
    const store = mockStoreCreator(initialState)

    await store.dispatch(
      initialiseClearPay({
        ...orderResponse,
        success: false,
        errorMessage: 'Ops something went wrong',
      })
    )

    expect(store.getActions()).toEqual([
      {
        type: 'AJAXCOUNTER_INCREMENT',
      },
      {
        formName: 'order',
        key: null,
        message: {
          message: 'Ops something went wrong',
          type: 'error',
        },
        type: 'SET_FORM_MESSAGE',
      },
      {
        type: 'AJAXCOUNTER_DECREMENT',
      },
    ])
  })

  it('process the order if event.status.success is true', async () => {
    const store = mockStoreCreator(initialState)

    await store.dispatch(initialiseClearPay(orderResponse))

    await expectClearPayScriptToBeInitialised({
      token: orderResponse.paymentToken,
    })

    await window.AfterPay.onComplete({
      data: { status: 'SUCCESS', orderToken: 'orderToken' },
    })

    expect(store.getActions()).toEqual([
      {
        type: 'AJAXCOUNTER_INCREMENT',
      },
      {
        payload: {
          authProvider: 'CLRPY',
          orderId: 'myOrderId',
          policyId: 'policyId',
          token: 'orderToken',
          tran_id: 'tranId',
          userAgent: '',
        },
        type: 'SET_ORDER_PENDING_MOCK',
      },
      {
        type: 'PROCESS_ORDER_MOCK',
      },
      {
        type: 'COMPLETE_ORDER_MOCK',
        completedOrder: 'orderCompleted',
        finalisedOrder: {
          returnUrl:
            'http://www.topshop.com/order-complete?orderId=8359831&paymentMethod=CLRPY',
          orderDeliveryOption: {
            orderId: 'myOrderId',
          },
        },
      },
      {
        type: 'AJAXCOUNTER_DECREMENT',
      },
    ])
  })

  it('should not call completeOrder if an error has occured while processing the order', async () => {
    checkoutSelectors.getCheckoutOrderError = jest.fn(
      () => 'Ops something went wrong with ClearPay'
    )

    const store = mockStoreCreator(initialState)

    await store.dispatch(initialiseClearPay(orderResponse))

    await expectClearPayScriptToBeInitialised({
      token: orderResponse.paymentToken,
    })

    await window.AfterPay.onComplete({
      data: { status: 'SUCCESS', orderToken: 'orderToken' },
    })

    expect(orderActions.completeOrder).not.toHaveBeenCalled()
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: 'AJAXCOUNTER_INCREMENT',
        },
        {
          payload: {
            authProvider: 'CLRPY',
            orderId: 'myOrderId',
            policyId: 'policyId',
            token: 'orderToken',
            tran_id: 'tranId',
            userAgent: '',
          },
          type: 'SET_ORDER_PENDING_MOCK',
        },
        {
          type: 'PROCESS_ORDER_MOCK',
        },
        {
          type: 'AJAXCOUNTER_DECREMENT',
        },
        {
          eventName: 'paymentMethodPurchaseFailure',
          payload: {
            orderId: 'myOrderId',
            selectedPaymentMethod: 'CLRPY',
          },
          type: 'MONTY/ANALYTICS.SEND_PAYMENT_METHOD_PURCHASE_FAILURE_EVENT',
        },
      ])
    )
  })

  it('should wait for the window.AfterPay to be avaiable', async () => {
    // load ClearPay's AfterPay library
    const store = mockStoreCreator(initialState)

    await store.dispatch(initialiseClearPay(orderResponse))

    const loadScriptArgs = window.loadScript.mock.calls[0][0]

    loadScriptArgs.onload()

    jest.advanceTimersByTime(4700)

    mockAfterPayLib()

    jest.advanceTimersByTime(500)

    expect(window.AfterPay.initialize).toHaveBeenCalledWith({
      countryCode: 'GB',
    })

    expect(window.AfterPay.open).toHaveBeenCalled()
    expect(window.AfterPay.transfer).toHaveBeenCalledWith({
      token: 'paymentToken',
    })
  })
})
