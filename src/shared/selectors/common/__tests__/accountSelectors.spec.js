import {
  getUser,
  getUserDetails,
  getUserAddress,
  getUserCountry,
  getUserEmail,
  getHashedUserEmail,
  selectStoredPaymentDetails,
  getMyCheckoutDetailsEditingEnabled,
  getMyCheckoutDetailForm,
  getMCDPaymentMethodForm,
  isSaveMyCheckoutDetailsDisabled,
  selectDeliveryCountry,
  selectBillingCountry,
  getPaymentCardDetailsMCD,
  getDeliveryDetails,
  getOrderDetailsDeliveryPostCode,
  getValidUKOrdersCountries,
  getValidOrderStatusReturn,
  isResetPasswordLinkValid,
  getCreditCardType,
  isKlarnaDefaultPaymentType,
  getUserTrackingId,
  isLoggedIn,
  getExponeaMemberId,
} from '../accountSelectors'
import myAccountMock from '../../../../../test/mocks/myAccount-response.json'
import { paymentMethodsList } from '../../../../../test/mocks/paymentMethodsMocks'
import myCheckoutDetailsMocks, {
  myCheckoutDetailsErrors,
  myCheckoutDetailsNoErrors,
  myCheckoutDetailsCVVError,
} from '../../../../../test/mocks/forms/myCheckoutDetailsFormsMocks'
import configMock from '../../../../../test/mocks/config'
import deepFreeze from 'deep-freeze'

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('@Account Selectors', () => {
  const state = {
    config: configMock,
    account: {
      user: myAccountMock,
      myCheckoutDetails: {
        editingEnabled: false,
      },
      resetPasswordLinkIsValid: false,
    },
    paymentMethods: paymentMethodsList,
    forms: {
      account: {
        myCheckoutDetails: myCheckoutDetailsMocks,
      },
      // @todo: move that behind forms.acount.myCheckoutDetails
      checkout: {
        billingCardDetails: {
          fields: {
            paymentType: {
              value: 'VISA',
              isDirty: false,
              isTouched: false,
              isFocused: false,
            },
          },
        },
      },
    },
    findAddress: {
      isManual: false,
    },
  }

  describe('[getUser selector]', () => {
    it('return empty when state is empty', () => {
      expect(getUser({})).toEqual({})
    })
    it('return user from account', () => {
      expect(getUser(state)).toEqual(myAccountMock)
    })
  })

  describe(getUserEmail, () => {
    it('returns the users email address if available', () => {
      const state = {
        account: {
          user: {
            email: 'aamir.ahmad@arcadiagroup.co.uk',
          },
        },
      }
      expect(getUserEmail(state)).toEqual('aamir.ahmad@arcadiagroup.co.uk')
    })
    it('returns null if there is no user email address', () => {
      const state = {}
      expect(getUserEmail(state)).toEqual(null)
    })
  })

  describe(getHashedUserEmail, () => {
    it('returns the users hashed email address if available', () => {
      const state = {
        account: {
          user: {
            email: 'aamir.ahmad@arcadiagroup.co.uk',
          },
        },
      }
      expect(getHashedUserEmail(state)).toEqual(
        '0904c4fabd5ce6902f0484bf47801851814336a7f6a6f691857919554b80ecf2'
      )
    })
    it('returns null if there is no user email address', () => {
      const state = {}
      expect(getHashedUserEmail(state)).toEqual(null)
    })
  })

  describe('getUserTrackingId selector', () => {
    it('should return undefined if no user defined', () => {
      expect(getUserTrackingId({})).toBeUndefined()
    })
    it('should return userTrackingId if available on user', () => {
      expect(
        getUserTrackingId({
          account: {
            user: {
              userTrackingId: 123456,
            },
          },
        })
      ).toBe(123456)
    })
  })

  describe('[isResetPasswordLinkValid selector', () => {
    it('return isResetPasswordLinkValid value', () => {
      expect(isResetPasswordLinkValid(state)).toMatchSnapshot()
    })
    it('returns isResetPasswordLinkValid value as false by default', () => {
      expect(isResetPasswordLinkValid(state)).toEqual(false)
    })
    it('returns isResetPasswordLinkValid value as true if set as true', () => {
      const state = {
        account: {
          resetPasswordLinkIsValid: true,
        },
      }
      expect(isResetPasswordLinkValid(state)).toEqual(true)
    })
  })

  describe('getDeliveryDetails', () => {
    it('returns an empty object by default', () => {
      expect(getDeliveryDetails({})).toEqual({})
    })

    it('returns the delivery details', () => {
      expect(getDeliveryDetails(state)).toMatchSnapshot()
    })
  })

  describe('[getUserDetails selector]', () => {
    it('return empty when state is empty', () => {
      expect(getUserDetails({}, 'deliveryDetails')).toEqual({})
    })

    it('return empty when type is empty', () => {
      expect(getUserDetails({}, '')).toEqual({})
      expect(getUserDetails({}, undefined)).toEqual({})
      expect(getUserDetails({}, null)).toEqual({})
      expect(getUserDetails(state, '')).toEqual({})
      expect(getUserDetails(state, undefined)).toEqual({})
      expect(getUserDetails(state, null)).toEqual({})
    })

    it('extract userDetails from user deliveryDetails', () => {
      snapshot(getUserDetails(state, 'deliveryDetails'))
    })

    it('extract userDetails from user billingDetails', () => {
      snapshot(getUserDetails(state, 'billingDetails'))
    })
  })

  it('[getUserAddress selector] return empty when state is empty', () => {
    expect(getUserAddress({}, 'deliveryDetails')).toEqual({})
  })

  it('[getUserAddress selector] return empty when type is empty', () => {
    expect(getUserAddress({}, '')).toEqual({})
    expect(getUserAddress({}, undefined)).toEqual({})
    expect(getUserAddress({}, null)).toEqual({})
    expect(getUserAddress(state, '')).toEqual({})
    expect(getUserAddress(state, undefined)).toEqual({})
    expect(getUserAddress(state, null)).toEqual({})
  })

  it('[getUserAddress selector] extract user Address from deliveryDetails', () => {
    snapshot(getUserAddress(state, 'deliveryDetails'))
  })

  it('[getUserAddress selector] extract user Address from billingDetails', () => {
    snapshot(getUserAddress(state, 'billingDetails'))
  })

  it('[get User Countries], extract delivery country', () => {
    snapshot(getUserCountry(state, 'deliveryDetails'))
  })

  it('[get User Countries], extract billing country', () => {
    snapshot(getUserCountry(state, 'billingDetails'))
  })

  it('[get User Countries selector] return empty when state is empty', () => {
    expect(getUserCountry({}, 'deliveryDetails')).toEqual('United Kingdom')
  })

  it('[get User Countries], return empty when type is empty', () => {
    expect(getUserCountry({}, '')).toEqual('United Kingdom')
    expect(getUserCountry({}, undefined)).toEqual('United Kingdom')
    expect(getUserCountry({}, null)).toEqual('United Kingdom')
    expect(getUserCountry(state, '')).toEqual('United Kingdom')
    expect(getUserCountry(state, undefined)).toEqual('United Kingdom')
    expect(getUserCountry(state, null)).toEqual('United Kingdom')
  })

  describe('[selectStoredPaymentDetails selector]', () => {
    it('should extract creditCard from user', () => {
      snapshot(selectStoredPaymentDetails(state))
    })

    it('should return empty when state is empty', () => {
      expect(selectStoredPaymentDetails({})).toEqual({})
      expect(selectStoredPaymentDetails(null)).toEqual({})
      expect(selectStoredPaymentDetails(undefined)).toEqual({})
    })
  })

  describe('[getMyCheckoutDetailsEditingEnabled selector]', () => {
    it('false by default', () => {
      expect(getMyCheckoutDetailsEditingEnabled(state)).toBe(false)
    })
    it('true when changed', () => {
      const state = {
        account: {
          myCheckoutDetails: {
            editingEnabled: true,
          },
        },
      }
      expect(getMyCheckoutDetailsEditingEnabled(state)).toBe(true)
    })
    it('return false when state is empty', () => {
      expect(getMyCheckoutDetailsEditingEnabled({})).toEqual(false)
      expect(getMyCheckoutDetailsEditingEnabled(null)).toEqual(false)
      expect(getMyCheckoutDetailsEditingEnabled(undefined)).toEqual(false)
    })
  })

  describe('[getMyCheckoutDetailForm selector]', () => {
    const form = getMyCheckoutDetailForm(state)
    it('emtpy by default', () => {
      expect(form.fields.isDeliveryAndBillingAddressEqual).toEqual({
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      })
    })
    it('return null when state is empty', () => {
      expect(getMyCheckoutDetailForm({})).toEqual(null)
      expect(getMyCheckoutDetailForm(null)).toEqual(null)
      expect(getMyCheckoutDetailForm(undefined)).toEqual(null)
    })
  })

  describe('[getMCDPaymentMethodForm selector]', () => {
    it('get Card Details form', () => {
      const form = getMCDPaymentMethodForm(state)
      expect(form.fields).toBeDefined()
      expect(form.fields).toEqual(
        expect.objectContaining({
          paymentType: {
            value: 'VISA',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        })
      )
    })
  })

  describe(isSaveMyCheckoutDetailsDisabled.name, () => {
    it('return false when there are validation errors', () => {
      expect(isSaveMyCheckoutDetailsDisabled(myCheckoutDetailsErrors)).toEqual(
        false
      )
    })
    it('return false when there are no validation errors', () => {
      expect(
        isSaveMyCheckoutDetailsDisabled(myCheckoutDetailsNoErrors)
      ).toEqual(false)
    })
    it('return false when the only validation error is the CVV field', () => {
      expect(
        isSaveMyCheckoutDetailsDisabled(myCheckoutDetailsCVVError)
      ).toEqual(false)
    })
  })
  describe('selectDeliveryCountry selector', () => {
    it('should select the delivery country from checkout if present', () => {
      const state = {
        checkout: {
          orderSummary: {
            deliveryDetails: {
              address: {
                country: 'United Kingdom',
              },
            },
          },
        },
      }

      expect(selectDeliveryCountry(state)).toEqual('United Kingdom')
    })

    it('should select the delivery country from the checkout form if present', () => {
      const state = {
        forms: {
          checkout: {
            yourAddress: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
          },
        },
      }

      expect(selectDeliveryCountry(state)).toEqual('United Kingdom')
    })

    it('should select the delivery country from the user account if present and a checkout form is missing', () => {
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

      expect(selectDeliveryCountry(state)).toEqual('United Kingdom')
    })

    it('should select the delivery country from the config if all else fails', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
      }

      expect(selectDeliveryCountry(state)).toEqual('United Kingdom')
    })
  })

  describe('selectBillingCountry selector', () => {
    it('should select the billing country from the checkout form if present', () => {
      const state = {
        forms: {
          checkout: {
            billingAddress: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
          },
        },
      }

      expect(selectBillingCountry(state)).toEqual('United Kingdom')
    })

    it('should select the billing country from the user account if present and a checkout form is missing', () => {
      const state = {
        account: {
          user: {
            billingDetails: {
              address: {
                country: 'United Kingdom',
              },
            },
          },
        },
      }

      expect(selectBillingCountry(state)).toEqual('United Kingdom')
    })

    it('should select the billing country from the config if all else fails', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
      }

      expect(selectBillingCountry(state)).toEqual('United Kingdom')
    })
  })

  describe('getPaymentCardDetailsMCD', () => {
    it('should return payment card details for my checkout detail', () => {
      const paymentCardDetailsMCD = 'paymentCardDetailsMCD'
      const state = {
        forms: {
          account: {
            myCheckoutDetails: {
              paymentCardDetailsMCD,
            },
          },
        },
      }
      expect(getPaymentCardDetailsMCD(state)).toBe(paymentCardDetailsMCD)
    })

    it('should safely return undefined if state does not have forms', () => {
      expect(getPaymentCardDetailsMCD({})).toBeUndefined()
    })
  })

  describe('getOrderDetailsDeliveryPostCode', () => {
    it('Should return post code when passed state', () => {
      const state = {
        address4: 'SE7 R8E',
      }
      expect(getOrderDetailsDeliveryPostCode(state)).toEqual(state.address4)
    })
    it('Should safely return "" if state does not have address4', () => {
      expect(getOrderDetailsDeliveryPostCode({})).toEqual('')
    })
  })

  describe('getValidUKOrdersCountries', () => {
    it('Should return true if Country is United Kingdom, Jersey, Guernsey', () => {
      expect(getValidUKOrdersCountries({ country: 'United Kingdom' })).toBe(
        true
      )
      expect(getValidUKOrdersCountries({ country: 'Jersey' })).toBe(true)
      expect(getValidUKOrdersCountries({ country: 'Guernsey' })).toBe(true)
    })
    it('Should return false if Country is not United Kingdom, Jersey, Guernsey', () => {
      expect(getValidUKOrdersCountries({ country: 'India' })).toBe(false)
    })
  })

  describe('getValidOrderStatusReturn', () => {
    /**
     * M - order placed
     * C - order placed
     * W - order on hold
     * G - order shipment delayed
     * N - order payment pending approval
     * FLD - order payment failed
     * s - order partially shipped
     * L - order - low stock
     * r - item returned
     * i - parcel ready for collection
     */
    const orderStatusNotAllowed = [
      'M',
      'C',
      'W',
      'G',
      'N',
      'FLD',
      's',
      'L',
      'r',
      'i',
    ]

    /**
     * S - Order shipped
     * D - Order payment settled
     * c - Parcel collected by customer
     * */
    const orderStatusAllowed = ['S', 'D', 'c']

    it('Should return false if orderStatus does not comply ', () => {
      orderStatusNotAllowed.forEach((status) => {
        return expect(getValidOrderStatusReturn(status)).toBeFalsy()
      })
    })

    it('Should return true if orderStatus matches', () => {
      orderStatusAllowed.forEach((status) => {
        return expect(getValidOrderStatusReturn(status)).toBeTruthy()
      })
    })
  })

  describe('getCreditCardType', () => {
    it('Should return a credit card type', () => {
      expect(getCreditCardType(state)).toEqual('PYPAL')
    })

    it('Should return an empty string if state not available', () => {
      expect(getCreditCardType()).toEqual('')
    })
  })

  describe('isKlarnaDefaultPaymentType', () => {
    it('returns true if the default payment type is Klarna', () => {
      const state = {
        account: {
          user: {
            creditCard: {
              type: 'KLRNA',
            },
          },
        },
      }
      expect(isKlarnaDefaultPaymentType(state)).toEqual(true)
    })
    it('returns true if the default payment type is Klarna', () => {
      const state = {}
      expect(isKlarnaDefaultPaymentType(state)).toEqual(false)
    })
  })

  describe('isLoggedIn', () => {
    const stateNotLogged = {
      account: {
        user: {},
      },
    }
    it('return false if user not logged in', () => {
      expect(isLoggedIn(stateNotLogged)).toEqual(false)
    })
    it('return true if user logged in (exist: true)', () => {
      expect(isLoggedIn(state)).toEqual(true)
    })
  })

  describe(getExponeaMemberId.name, () => {
    const expId2 =
      '8ba233e437d8f896098ed097a0e2dc079c6908693cdec27af2b493865c0c9c76'

    const state = deepFreeze({
      account: {
        user: {
          expId2,
        },
      },
    })

    it('should return the ExponeaMemberId', () => {
      expect(getExponeaMemberId(state)).toBe(expId2)
    })

    it('should return an empty string if the ExponeaMemberId is not returned', () => {
      const newState = deepFreeze({
        ...state,
        account: {
          ...state.account,
          user: {},
        },
      })
      expect(getExponeaMemberId(newState)).toBe('')
    })
  })
})
