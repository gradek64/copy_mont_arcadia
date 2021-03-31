import testReducer from '../myCheckoutDetailsFormReducer'
import { getMockStoreWithInitialReduxState } from '../../../../../../../test/unit/helpers/get-redux-mock-store'
import { UPDATE_LOCATION } from 'react-router-redux'

describe('My Checkout Details Form Reducer', () => {
  it('Default values', () => {
    const state = getMockStoreWithInitialReduxState().getState()
    const formAddress = {
      fields: {
        address1: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        address2: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        postcode: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        city: { value: '', isDirty: false, isTouched: false, isFocused: false },
        country: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        county: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        state: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        isManual: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
      },
      isLoading: false,
      errors: {},
      message: {},
    }
    const formFindAddress = {
      fields: {
        houseNumber: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        message: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        findAddress: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        selectAddress: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        postcode: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
      },
      isLoading: false,
      errors: {},
      message: {},
    }
    const formDetails = {
      fields: {
        title: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        firstName: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        lastName: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        telephone: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
      },
      isLoading: false,
      errors: {},
      message: {},
    }
    expect(state.forms.account.myCheckoutDetails.billingAddressMCD).toEqual(
      formAddress
    )
    expect(state.forms.account.myCheckoutDetails.billingFindAddressMCD).toEqual(
      formFindAddress
    )
    expect(
      state.forms.account.myCheckoutDetails.billingDetailsAddressMCD
    ).toEqual(formDetails)
    expect(state.forms.account.myCheckoutDetails.deliveryAddressMCD).toEqual(
      formAddress
    )
    expect(
      state.forms.account.myCheckoutDetails.deliveryFindAddressMCD
    ).toEqual(formFindAddress)
    expect(
      state.forms.account.myCheckoutDetails.deliveryDetailsAddressMCD
    ).toEqual(formDetails)
    expect(state.forms.account.myCheckoutDetails.paymentCardDetailsMCD).toEqual(
      {
        fields: {
          paymentType: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          cardNumber: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          expiryDate: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          expiryMonth: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          expiryYear: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          startMonth: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          startYear: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        },
        isLoading: false,
        errors: {},
        message: {},
      }
    )
    expect(state.forms.account.myCheckoutDetails.myCheckoutDetailsForm).toEqual(
      {
        fields: {
          isDeliveryAndBillingAddressEqual: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        },
        isLoading: false,
        errors: {},
        message: {},
      }
    )
  })

  describe('`UPDATE_LOCATION`', () => {
    it('should remove error messages when pathname is not equals to `/my-account/details`', () => {
      expect(
        testReducer(
          {
            myCheckoutDetailsForm: {
              fields: {
                isDeliveryAndBillingAddressEqual: {
                  value: '',
                  isDirty: false,
                  isTouched: false,
                  isFocused: false,
                },
              },
              isLoading: false,
              errors: {},
              message: 'this is an error',
            },
          },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: '',
            },
          }
        )
      ).toEqual(
        expect.objectContaining({
          myCheckoutDetailsForm: {
            fields: {
              isDeliveryAndBillingAddressEqual: {
                value: '',
                isDirty: false,
                isTouched: false,
                isFocused: false,
              },
            },
            isLoading: false,
            errors: {},
            message: '',
          },
        })
      )
    })
    it('should leave error messages when pathname is equals to `/my-account/details`', () => {
      expect(
        testReducer(
          {
            myCheckoutDetailsForm: {
              fields: {
                isDeliveryAndBillingAddressEqual: {
                  value: '',
                  isDirty: false,
                  isTouched: false,
                  isFocused: false,
                },
              },
              isLoading: false,
              errors: {},
              message: 'this is an error',
            },
          },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: '/my-account/details',
            },
          }
        )
      ).toEqual(
        expect.objectContaining({
          myCheckoutDetailsForm: {
            fields: {
              isDeliveryAndBillingAddressEqual: {
                value: '',
                isDirty: false,
                isTouched: false,
                isFocused: false,
              },
            },
            isLoading: false,
            errors: {},
            message: 'this is an error',
          },
        })
      )
    })
  })
})
