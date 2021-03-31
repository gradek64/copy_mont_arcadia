import * as checkout from '../../checkoutActions'

describe('Checkout Actions', () => {
  it('clearCheckoutForms()', () => {
    expect(checkout.clearCheckoutForms()).toEqual({
      type: 'CLEAR_CHECKOUT_FORMS',
    })
  })

  it('toggleExpressDeliveryOptions(bool)', () => {
    expect(checkout.toggleExpressDeliveryOptions(true)).toEqual({
      type: 'TOGGLE_EXPRESS_DELIVERY_OPTIONS_SUMMARY_PAGE',
      bool: true,
    })
  })

  it('setManualAddressMode()', () => {
    expect(checkout.setManualAddressMode()).toEqual({
      type: 'SET_ADDRESS_MODE_TO_MANUAL',
    })
  })

  it('setFindAddressMode(data)', () => {
    expect(checkout.setFindAddressMode()).toEqual({
      type: 'SET_ADDRESS_MODE_TO_FIND',
    })
  })

  it('setStoreUpdating(updating)', () => {
    expect(checkout.setStoreUpdating(true)).toEqual({
      type: 'SET_STORE_UPDATING',
      updating: true,
    })
  })

  it('clearOrderSummaryBasket()', () => {
    expect(checkout.clearOrderSummaryBasket()).toEqual({
      type: 'FETCH_ORDER_SUMMARY_SUCCESS',
      data: {},
      persist: false,
    })
  })

  it('setOrderSummaryField(field, value)', () => {
    expect(checkout.setOrderSummaryField({}, '')).toEqual({
      type: 'SET_ORDER_SUMMARY_FIELD',
      value: '',
      field: {},
    })
  })

  it('setOrderSummaryError(data)', () => {
    expect(checkout.setOrderSummaryError({})).toEqual({
      type: 'SET_ORDER_SUMMARY_ERROR',
      data: {},
    })
  })

  it('setDeliveryAsBillingFlag(val)', () => {
    expect(checkout.setDeliveryAsBillingFlag('')).toEqual({
      type: 'SET_DELIVERY_AS_BILLING_FLAG',
      val: '',
    })
  })

  it('resetAddress()', () => {
    expect(checkout.resetAddress()).toEqual({
      type: 'RESET_SEARCH',
    })
  })

  it('setMonikerAddress(data)', () => {
    expect(checkout.setMonikerAddress({})).toEqual({
      type: 'UPDATE_MONIKER',
      data: {},
    })
  })

  it('setDeliveryStore(store)', () => {
    const store = {
      storeId: 'TS001',
      brandName: 'Topshop',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'postcode',
      },
    }
    expect(checkout.setDeliveryStore(store)).toEqual({
      type: 'SET_DELIVERY_STORE',
      store: {
        deliveryStoreCode: 'TS001',
        storeAddress1: 'line1',
        storeAddress2: 'line2',
        storeCity: 'city',
        storePostcode: 'postcode',
      },
    })
  })

  it('resetStoreDetails()', () => {
    expect(checkout.resetStoreDetails({})).toEqual({
      type: 'RESET_STORE_DETAILS',
    })
  })

  const yourDetailsMock = {
    fields: {
      fieldA: { value: 'valueA' },
    },
  }

  const yourAddressMock = {
    fields: {
      fieldB: { value: 'valueB' },
    },
  }

  const siteOptionsMock = {
    titles: ['Title1', 'Title2'],
  }

  const configMock = {
    brandName: 'BrandName',
    region: 'region',
  }

  const homeDeliveryLocation = {
    deliveryLocationType: 'HOME',
    selected: true,
  }

  const storeDeliveryLocation = {
    deliveryLocationType: 'STORE',
    selected: true,
  }

  describe(checkout.copyDeliveryValuesToBillingForms.name, () => {
    it(
      'copies values from yourDetails form to the billingDetails form' +
        'when home delivery is not selected',
      () => {
        const dispatch = jest.fn()
        const getState = () => {
          return {
            checkout: {
              orderSummary: { deliveryLocations: [storeDeliveryLocation] },
            },
            forms: {
              checkout: { yourDetails: yourDetailsMock },
            },
          }
        }
        checkout.copyDeliveryValuesToBillingForms()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          formName: 'billingDetails',
          initialValues: { fieldA: 'valueA' },
          key: null,
          type: 'RESET_FORM_DIRTY',
        })
      }
    )
    it(
      'copies values from yourDetails and yourAddress forms' +
        'to the billingDetails and billingAddress forms when home delivery is selected',
      () => {
        const dispatch = jest.fn()
        const getState = () => {
          return {
            checkout: {
              orderSummary: { deliveryLocations: [homeDeliveryLocation] },
            },
            forms: {
              checkout: {
                yourDetails: yourDetailsMock,
                yourAddress: yourAddressMock,
              },
            },
          }
        }
        checkout.copyDeliveryValuesToBillingForms()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledTimes(3)
        expect(dispatch).toHaveBeenCalledWith({
          formName: 'billingDetails',
          initialValues: { fieldA: 'valueA' },
          key: null,
          type: 'RESET_FORM_DIRTY',
        })
        expect(dispatch).toHaveBeenCalledWith({
          formName: 'billingAddress',
          initialValues: { fieldB: 'valueB' },
          key: null,
          type: 'RESET_FORM_DIRTY',
        })
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_ADDRESS_MODE_TO_MANUAL',
        })
      }
    )
  })

  describe(checkout.resetBillingForms.name, () => {
    it('reset the billingDetails and billingAddress forms', () => {
      const dispatch = jest.fn()
      const getState = () => {
        return {
          checkout: {
            orderSummary: { shippingCountry: 'GB' },
          },
          siteOptions: siteOptionsMock,
          config: configMock,
        }
      }
      checkout.resetBillingForms()(dispatch, getState)
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({
        formName: 'billingAddress',
        initialValues: {
          address1: null,
          address2: null,
          city: null,
          country: 'GB',
          postcode: null,
          state: null,
        },
        key: null,
        type: 'RESET_FORM',
      })
      expect(dispatch).toHaveBeenCalledWith({
        formName: 'billingDetails',
        initialValues: {
          firstName: null,
          lastName: null,
          telephone: null,
          title: '',
        },
        key: null,
        type: 'RESET_FORM',
      })
    })
  })

  describe(checkout.setDeliveryAsBilling.name, () => {
    it('reset the billingDetails and billingAddress forms', () => {
      const dispatch = jest.fn()
      const getState = () => {
        return {
          forms: { checkout: {} },
          checkout: {
            orderSummary: {
              shippingCountry: 'GB',
              deliveryLocations: [homeDeliveryLocation],
            },
          },
          siteOptions: siteOptionsMock,
          config: configMock,
        }
      }
      checkout.setDeliveryAsBilling(false)(dispatch, getState)
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({
        formName: 'billingAddress',
        initialValues: {
          address1: null,
          address2: null,
          city: null,
          country: 'GB',
          postcode: null,
          state: null,
        },
        key: null,
        type: 'RESET_FORM',
      })
      expect(dispatch).toHaveBeenCalledWith({
        formName: 'billingDetails',
        initialValues: {
          firstName: null,
          lastName: null,
          telephone: null,
          title: '',
        },
        key: null,
        type: 'RESET_FORM',
      })
    })
    it(
      'copies values from yourDetails form to the billingDetails form' +
        'when home delivery is not selected',
      () => {
        const dispatch = jest.fn()
        const getState = () => {
          return {
            checkout: {
              orderSummary: { deliveryLocations: [storeDeliveryLocation] },
            },
            forms: {
              checkout: { yourDetails: yourDetailsMock },
            },
          }
        }
        checkout.copyDeliveryValuesToBillingForms()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          formName: 'billingDetails',
          initialValues: { fieldA: 'valueA' },
          key: null,
          type: 'RESET_FORM_DIRTY',
        })
      }
    )
    it(
      'copies values from yourDetails and yourAddress forms' +
        'to the billingDetails and billingAddress forms when home delivery is selected',
      () => {
        const dispatch = jest.fn()
        const getState = () => {
          return {
            checkout: {
              orderSummary: { deliveryLocations: [homeDeliveryLocation] },
            },
            forms: {
              checkout: {
                yourDetails: yourDetailsMock,
                yourAddress: yourAddressMock,
              },
            },
          }
        }
        checkout.setDeliveryAsBilling(true)(dispatch, getState)
        expect(dispatch).toHaveBeenCalledTimes(3)
        expect(dispatch).toHaveBeenCalledWith({
          formName: 'billingDetails',
          initialValues: { fieldA: 'valueA' },
          key: null,
          type: 'RESET_FORM_DIRTY',
        })
        expect(dispatch).toHaveBeenCalledWith({
          formName: 'billingAddress',
          initialValues: { fieldB: 'valueB' },
          key: null,
          type: 'RESET_FORM_DIRTY',
        })
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_ADDRESS_MODE_TO_MANUAL',
        })
      }
    )
  })

  describe('setDeliveryEditingEnabled', () => {
    const type = 'DELIVERY_AND_PAYMENT_SET_DELIVERY_EDITING_ENABLED'

    it('returns the correct action when passed enabled = true', () => {
      expect(checkout.setDeliveryEditingEnabled(true)).toEqual({
        type,
        enabled: true,
      })
    })

    it('returns the correct action when passed enabled = false', () => {
      expect(checkout.setDeliveryEditingEnabled(false)).toEqual({
        type,
        enabled: false,
      })
    })
  })

  describe(checkout.setSavePaymentDetailsEnabled, () => {
    const type = 'SET_SAVE_PAYMENT_DETAILS_ENABLED'
    describe('returns the correct action when', () => {
      it('enabled = true', () => {
        expect(checkout.setSavePaymentDetailsEnabled(true)).toEqual({
          type,
          enabled: true,
        })
      })
      it('enabled = false', () => {
        expect(checkout.setSavePaymentDetailsEnabled(false)).toEqual({
          type,
          enabled: false,
        })
      })
    })
  })
})
