import { clone } from 'ramda'
import {
  assembleAddressPayload,
  getAddressDetails,
  getDelivery,
  getDeliveryDetails,
  parseDeliveryDetails,
  splitSelectedDelivery,
  klarnaPaymentsAuthorize,
  klarnaPaymentsLoad,
  klarnaPaymentsInit,
  loadScript,
  KLARNA_SDK_SRC,
  prepareKlarnaPayload,
  isKlarnaFormLoaded,
  hasDeliveryOptionsBeenUpdated,
  hasOrderBeenUpdated,
  removeDiacriticsDeep,
} from '../klarna-utils'
import * as mocks from '../../../../../test/unit/lib/klarna-utils-mocks'
import { authorizeByKlarna } from '../../../actions/common/klarnaActions'

describe('assembleAddressPayload', () => {
  it('correctly combines the results of the getAddressDetails() calls', () => {
    expect(assembleAddressPayload(mocks.props)).toEqual(
      mocks.expectedAddressDetails
    )
  })
})

describe('getAddressDetails', () => {
  const {
    billingDetails,
    billingAddress,
    yourDetails,
    yourAddress,
    user,
    config,
  } = mocks
  it('parses the user delivery details and produces the correct output', () => {
    expect(
      getAddressDetails('shipping', yourDetails, yourAddress, user, config)
    ).toEqual(mocks.expectedDeliveryAddressDetails)
  })

  it('parses the user billing details and produces the correct output', () => {
    expect(
      getAddressDetails('billing', billingDetails, billingAddress, user, config)
    ).toEqual(mocks.expectedBillingAddressDetails)
  })
})

describe('removeDiacriticsDeep', () => {
  const specialCharacters = 'é à è ù â ê î ô û ç ä ë ï ü œ'
  const characters = 'e a e u a e i o u c a e i u oe'

  it('should remove diacritics from an object one level deep', () => {
    const obj = {
      string: specialCharacters,
    }
    const expected = {
      string: characters,
    }

    expect(removeDiacriticsDeep(obj)).toEqual(expected)
  })

  it('should remove diacritics from an object two levels deep', () => {
    const obj = {
      string: {
        string: specialCharacters,
      },
    }
    const expected = {
      string: {
        string: characters,
      },
    }

    expect(removeDiacriticsDeep(obj)).toEqual(expected)
  })

  it('should remove diacritics from an object three levels deep', () => {
    const obj = {
      string: {
        string: {
          string: specialCharacters,
        },
      },
    }
    const expected = {
      string: {
        string: {
          string: characters,
        },
      },
    }

    expect(removeDiacriticsDeep(obj)).toEqual(expected)
  })
})

describe('getDelivery', () => {
  it('parses the delivery options in basket and returns the correct itemised cost of delivery', () => {
    expect(getDelivery(mocks.shoppingBag.bag)).toEqual(
      mocks.expectedDeliveryOptions
    )
  })
})

describe('getDeliveryDetails', () => {
  it('correctly ties splitSelectedDelivery() and parseDeliveryDetails() together and returns parsed, typed result', () => {
    expect(getDeliveryDetails(mocks.getDeliveryDetailsMocks.a.mock)).toEqual(
      mocks.getDeliveryDetailsMocks.a.expected
    )

    expect(getDeliveryDetails(mocks.getDeliveryDetailsMocks.b.mock)).toEqual(
      mocks.getDeliveryDetailsMocks.b.expected
    )
  })
})

describe('parseDeliveryDetails', () => {
  it('will find the correct tokens in the delivery type label (name, price)', () => {
    expect(
      parseDeliveryDetails(mocks.parseDeliveryDetailsMocks.a.mock)
    ).toEqual(mocks.parseDeliveryDetailsMocks.a.expected)

    expect(
      parseDeliveryDetails(mocks.parseDeliveryDetailsMocks.b.mock)
    ).toEqual(mocks.parseDeliveryDetailsMocks.b.expected)
  })
})

describe('splitSelectedDelivery', () => {
  it('finds the selected delivery type and splits it into an array', () => {
    expect(
      splitSelectedDelivery(mocks.shoppingBag.bag.deliveryOptions)
    ).toEqual(mocks.expectedSplitSelectedDelivery)
  })
})

describe('Load Klarna', () => {
  const dispatch = jest.fn()
  const getState = jest.fn()

  const originalDate = Date
  const originalWindow = global.window
  const updateDetails = 'mock updateDetails'
  const mockDate = (date = '2018-01-01T00:00:00') => {
    const constantDate = new Date(date)

    global.Date = () => {
      return constantDate
    }
  }
  const restoreGlobals = () => {
    global.Date = originalDate
    global.window = originalWindow
  }

  global.window.loadScript = jest.fn()

  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    mockDate()

    global.window = { ...originalWindow }

    window.loadScript.mockImplementation(({ onload }) => {
      onload()
      return Promise.resolve()
    })
  })

  afterEach(restoreGlobals)

  describe('loadScript', () => {
    it('should call loadScript', () => {
      return loadScript().then(() => {
        expect(window.loadScript).toHaveBeenCalledTimes(1)
        expect(window.loadScript).toBeCalledWith(
          expect.objectContaining({
            isAsync: true,
            src: `${KLARNA_SDK_SRC}?1514764800000`,
          })
        )
      })
    })
  })

  describe('klarnaPaymentsAuthorize', () => {
    const authorize = jest.fn()
    const result = {
      show_form: 'mock show_form',
      approved: 'mock approved',
    }
    const klarnaPayload = {
      shipping_address: {},
      billing_address: {},
    }

    it('should call window.Klarna.Payments.authorize', async () => {
      authorize.mockImplementation((klarnaConfig, klarnaPayload, callback) => {
        callback(result)
      })

      global.window.Klarna = {
        Payments: {
          authorize,
        },
      }

      await authorizeByKlarna(klarnaPayload)(dispatch, getState)

      expect(authorize).toHaveBeenCalled()
      expect(authorize).toHaveBeenCalledWith(
        {
          instance_id: 'klarna-payments-instance',
        },
        klarnaPayload,
        expect.any(Function)
      )
    })

    it('should call window.Klarna.Payments.authorize and fail', async () => {
      const result = 'wrong result'

      authorize.mockImplementation((updateDetails, callback) => {
        callback(result)
      })

      global.window.Klarna = {
        Payments: {
          authorize,
        },
      }

      return klarnaPaymentsAuthorize(updateDetails).catch(() => {
        expect(authorize).toHaveBeenCalledTimes(1)
        expect(authorize.mock.calls[0][1]).toEqual(updateDetails)
      })
    })

    it('should call loadScript', () => {
      window.Klarna = undefined

      authorize.mockImplementation((updateDetails, callback) => {
        callback(result)
      })
      window.loadScript.mockImplementation(({ onload }) => {
        global.window.Klarna = {
          Payments: {
            authorize,
          },
        }

        onload()
      })

      return klarnaPaymentsAuthorize(updateDetails).catch(() => {
        expect(window.loadScript).toHaveBeenCalledTimes(1)
        expect(authorize).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('klarnaPaymentsInit', () => {
    const client_token = '12345'
    const init = jest.fn()

    it('should call window.Klarna.Payments.init', () => {
      init.mockImplementation()

      global.window.Klarna = {
        Payments: {
          init,
        },
      }

      klarnaPaymentsInit(client_token)
      expect(init).toHaveBeenCalledTimes(1)
    })
  })

  describe('klarnaPaymentsLoad', () => {
    const instance_id = 'klarna-payments-instance'
    const container = 'mock client_token'
    const payment_method_categories = ['pay_later', 'pay_over_time']
    const load = jest.fn()

    it('should call window.Klarna.Payments.load', async () => {
      const result = {
        show_form: true,
      }

      load.mockImplementation((p, updateDetails, callback) => {
        callback(result)
      })

      global.window.Klarna = {
        Payments: {
          load,
        },
      }

      await klarnaPaymentsLoad(
        container,
        updateDetails,
        payment_method_categories
      )

      expect(load).toHaveBeenCalledTimes(1)
      expect(load.mock.calls[0][0]).toEqual({
        container,
        instance_id,
        payment_method_categories,
      })
    })

    it('should call window.Klarna.Payments.load and not display form', async () => {
      const result = {
        show_form: false,
      }

      load.mockImplementation((p, updateDetails, callback) => {
        callback(result)
      })

      global.window.Klarna = {
        Payments: {
          load,
        },
      }

      await expect(
        klarnaPaymentsLoad(container, updateDetails, payment_method_categories)
      ).rejects.toEqual({ show_form: false })
    })

    it('should load the Klarna SDK if window.Klarna does not exist', async () => {
      window.Klarna = undefined
      const result = {
        show_form: true,
      }

      load.mockImplementation((p, updateDetails, callback) => {
        callback(result)
      })

      window.loadScript.mockImplementation(({ onload }) => {
        global.window.Klarna = {
          Payments: {
            load,
          },
        }

        onload()
      })

      expect(global.window.Klarna).toBeUndefined()
      await klarnaPaymentsLoad(container, updateDetails)
      expect(window.loadScript).toHaveBeenCalledTimes(1)
      expect(global.window.Klarna.Payments.load).toHaveBeenCalledTimes(1)
    })
  })
})

describe('prepareKlarnaPayload', () => {
  const MockState = {
    config: mocks.config,
    shoppingBag: mocks.shoppingBag,
    account: {},
    checkout: {
      orderSummary: {
        savedAddresses: [],
      },
    },
    forms: {
      checkout: {
        billingAddress: mocks.billingAddress,
        billingDetails: mocks.billingDetails,
        yourAddress: mocks.yourAddress,
        yourDetails: mocks.yourDetails,
      },
    },
  }

  const expected = {
    billing_address: {
      city: 'billing city',
      country: 'GB',
      email: '',
      family_name: 'billing lastName',
      given_name: 'billing firstName',
      phone: '1235553456',
      postal_code: 'billing postcode',
      region: 'billing county',
      street_address: 'billing address1',
      street_address2: 'billing address2',
      title: 'billing title',
    },
    shipping_address: {
      city: 'delivery city',
      country: 'GB',
      email: '',
      family_name: 'delivery lastName',
      given_name: 'delivery firstName',
      phone: '123-555-3456',
      postal_code: 'delivery postcode',
      region: 'delivery county',
      street_address: 'delivery address1',
      street_address2: 'delivery address2',
      title: 'delivery title',
    },
  }

  it('returns a prepared payload to send to klarna', () => {
    expect(prepareKlarnaPayload(MockState)).toEqual(expected)
  })
})

describe('isKlarnaFormLoaded', () => {
  const KLARNA_FORM_CONTAINER = '.KlarnaForm'
  let originalDocument
  beforeAll(() => {
    originalDocument = global.document
    global.process.browser = true
  })

  afterAll(() => {
    global.document = originalDocument
  })

  it('returns true if klarna form is loaded', () => {
    global.document.body.innerHTML = `<div class="KlarnaForm"><iframe></iframe></div>`
    expect(isKlarnaFormLoaded(KLARNA_FORM_CONTAINER)).toBeTruthy()
  })
  it('returns false if klarna form is not loaded', () => {
    global.document.body.innerHTML = `<div class="KlarnaForm"></div>`
    expect(isKlarnaFormLoaded(KLARNA_FORM_CONTAINER)).toBeFalsy()
  })
})

describe('hasDeliveryOptionsBeenUpdated', () => {
  const prev = {
    deliveryOptions: [
      {
        selected: false,
        deliveryOptionId: 45020,
        deliveryOptionExternalId: 'retail_store_express',
        label: 'Collect From Store Express £3.00',
        enabled: true,
        plainLabel: 'Collect From Store Express',
      },
      {
        selected: true,
        deliveryOptionId: 47524,
        deliveryOptionExternalId: 'retail_store_collection',
        label: 'Collect from ParcelShop £4.00',
        enabled: true,
        plainLabel: 'Collect from ParcelShop',
      },
    ],
  }
  it('returns true if deliveryOptions do not match', () => {
    const order = clone(prev)
    order.deliveryOptions[0].selected = true
    order.deliveryOptions[1].selected = false
    expect(hasDeliveryOptionsBeenUpdated(order, prev)).toBeTruthy()
  })

  it('returns false if deliveryOptions do match', () => {
    const order = clone(prev)
    expect(hasDeliveryOptionsBeenUpdated(order, prev)).toBeFalsy()
  })
})

describe('hasOrderBeenUpdated', () => {
  const prevOrder = {
    total: '100',
    deliveryOptions: [
      {
        selected: false,
        deliveryOptionId: 45020,
        deliveryOptionExternalId: 'retail_store_express',
        label: 'Collect From Store Express £3.00',
        enabled: true,
        plainLabel: 'Collect From Store Express',
      },
      {
        selected: true,
        deliveryOptionId: 47524,
        deliveryOptionExternalId: 'retail_store_collection',
        label: 'Collect from ParcelShop £4.00',
        enabled: true,
        plainLabel: 'Collect from ParcelShop',
      },
    ],
  }

  it('returns false if order has not updated', () => {
    const order = clone(prevOrder)
    expect(hasOrderBeenUpdated(order, prevOrder)).toBeFalsy()
  })

  it('returns true if order total has changed', () => {
    const order = {
      ...prevOrder,
      total: '500',
    }
    expect(hasOrderBeenUpdated(order, prevOrder)).toBeTruthy()
  })

  it('returns true if orderDetails has changed', () => {
    const order = clone(prevOrder)
    order.deliveryOptions[0].selected = true
    order.deliveryOptions[1].selected = false
    expect(hasOrderBeenUpdated(order, prevOrder)).toBeTruthy()
  })
})
