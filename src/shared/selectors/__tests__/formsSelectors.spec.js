
import {
  getForgetPasswordForm,
  getSelectedPaymentType,
  getOrderFormErrorMessage,
  getResetPasswordForm,
  selectCheckoutForms,
  getIsFindAddressVisible,
  selectBillingCardPaymentTypeFromCheckoutForm,
  getBillingAddressForm,
  getBillingDetailsForm,
  isPaymentTypeFieldDirty,
  getFormNames,
  getAddressForm,
  getCountryFor,
  getCountryFromUserProfile,
  getCountryFormField,
  getFormsCheckout,
  getFormsCheckoutBillingCardDetails,
  getBillingCardPaymentType,
  getBillingCardNumber,
  getMCDDeliveryCountry,
  getMCDBillingCountry,
  getDeliveryInstructionsForm,
} from '../formsSelectors'

jest.mock(
  '../../components/containers/CheckoutV2/shared/validationSchemas',
  () => ({
    getCardSchema: jest.fn(),
  })
)

describe('form selectors', () => {
  const populatedState = {
    forms: {
      checkout: {
        billingAddress: {
          fields: {
            address1: {
              value: 'Sesame St',
            },
          },
        },
        billingCardDetails: {
          fields: {
            paymentType: {
              value: 'VISA',
              isDirty: false,
            },
            cardNumber: {
              value: '4444333322221111',
            },
            expiryMonth: {
              value: '06',
            },
            expiryYear: {
              value: '2017',
            },
            cvv: {
              value: '123',
            },
          },
        },
        billingDetails: {
          fields: {
            title: {
              value: 'Mr',
            },
            firstName: {
              value: 'Manuel',
            },
          },
        },
        order: {
          message: {
            message: 'An error occurred...',
          },
        },
      },
      account: {
        myCheckoutDetails: {
          paymentCardDetailsMCD: {
            fields: {
              paymentType: {
                value: 'AMEX',
              },
              cardNumber: {
                value: '343434343434343',
              },
              expiryMonth: {
                value: '06',
              },
              expiryYear: {
                value: '2030',
              },
              cvv: {
                value: '1234',
              },
            },
          },
        },
        order: {
          message: {
            message: 'An error occurred...',
          },
        },
      },
      forgetPassword: {},
      resetPassword: {},
      deliveryInstructions: {},
    },
  }

  describe('getFormsCheckout', () => {
    it('should return forms checkout', () => {
      expect(getFormsCheckout(populatedState)).toEqual(
        populatedState.forms.checkout
      )
    })

    it(`should return an empty object is undefined, null or empty string`, () => {
      expect(getFormsCheckout(undefined)).toEqual({})
      expect(getFormsCheckout(null)).toEqual({})
      expect(getFormsCheckout('')).toEqual({})
    })
  })

  describe('getFormsCheckoutBillingCardDetails', () => {
    it('should return forms billingCardDetails', () => {
      expect(getFormsCheckoutBillingCardDetails(populatedState)).toEqual(
        populatedState.forms.checkout.billingCardDetails
      )
    })

    it(`should return an empty object is undefined, null or empty string`, () => {
      expect(getFormsCheckoutBillingCardDetails(undefined)).toEqual({})
      expect(getFormsCheckoutBillingCardDetails(null)).toEqual({})
      expect(getFormsCheckoutBillingCardDetails('')).toEqual({})
    })
  })

  describe('getBillingCardPaymentType', () => {
    it('should return a payment type', () => {
      expect(getBillingCardPaymentType(populatedState)).toEqual(
        populatedState.forms.checkout.billingCardDetails.fields.paymentType
          .value
      )
    })

    it(`should return an empty string is undefined, null or empty string`, () => {
      expect(getBillingCardPaymentType(undefined)).toEqual('')
      expect(getBillingCardPaymentType(null)).toEqual('')
      expect(getBillingCardPaymentType('')).toEqual('')
    })
  })

  describe('getBillingCardNumber', () => {
    it('should return the cardnumber entered into the checkout form field', () => {
      expect(getBillingCardNumber(populatedState)).toEqual(
        populatedState.forms.checkout.billingCardDetails.fields.cardNumber.value
      )
    })
    it(`should return an empty string is undefined, null or empty string`, () => {
      expect(getBillingCardNumber(undefined)).toEqual('')
      expect(getBillingCardNumber(null)).toEqual('')
      expect(getBillingCardNumber('')).toEqual('')
    })
  })

  describe(getForgetPasswordForm.name, () => {
    it('returns the forgetPassword form state', () => {
      expect(getForgetPasswordForm(populatedState)).toBe(
        populatedState.forms.forgetPassword
      )
    })
  })

  describe(getSelectedPaymentType.name, () => {
    it('should returns card type Visa from form checkout if no formName has been passed', () => {
      expect(getSelectedPaymentType(populatedState)).toBe('VISA')
    })
    it('should returns card type Visa from form checkout if "billingCardDetails" is passed as a formName parameter', () => {
      expect(getSelectedPaymentType(populatedState, 'billingCardDetails')).toBe(
        'VISA'
      )
    })
    it('should returns card type AMEX if "paymentCardDetailsMCD" is pass as formName parameter', () => {
      expect(
        getSelectedPaymentType(populatedState, 'paymentCardDetailsMCD')
      ).toBe('AMEX')
    })
    it('returns null if there is no payment type selected', () => {
      expect(getSelectedPaymentType()).toBe(null)
    })
  })

  describe(getOrderFormErrorMessage.name, () => {
    it('returns the order form error message if it is present', () => {
      expect(getOrderFormErrorMessage(populatedState)).toBe(
        populatedState.forms.checkout.order.message.message
      )
    })

    it('returns undefined if it cant be reached', () => {
      expect(getOrderFormErrorMessage()).toBe(undefined)
    })
  })

  describe(getResetPasswordForm.name, () => {
    it('returns the resetPassword form state', () => {
      expect(getResetPasswordForm(populatedState)).toBe(
        populatedState.forms.resetPassword
      )
    })
  })

  describe(selectCheckoutForms.name, () => {
    it('returns the checkout forms state', () => {
      expect(selectCheckoutForms(populatedState)).toBe(
        populatedState.forms.checkout
      )
    })
  })

  describe(selectBillingCardPaymentTypeFromCheckoutForm.name, () => {
    expect(selectBillingCardPaymentTypeFromCheckoutForm(populatedState)).toBe(
      populatedState.forms.checkout.billingCardDetails.fields.paymentType.value
    )
  })

  describe(getBillingAddressForm.name, () => {
    it('should return billingAddress form', () => {
      expect(getBillingAddressForm(populatedState)).toBe(
        populatedState.forms.checkout.billingAddress
      )
    })
  })

  describe(getDeliveryInstructionsForm.name, () => {
    it('should return deliveryInstructions form', () => {
      expect(getDeliveryInstructionsForm(populatedState)).toBe(
        populatedState.forms.checkout.deliveryInstructionsForm
      )
    })
  })

  describe(getBillingDetailsForm.name, () => {
    it('should return billingDetails form', () => {
      expect(getBillingDetailsForm(populatedState)).toBe(
        populatedState.forms.checkout.billingDetails
      )
    })
  })

  describe(isPaymentTypeFieldDirty.name, () => {
    it('should return billingCardDetails paymentType isDirty field value', () => {
      expect(isPaymentTypeFieldDirty(populatedState)).toBe(false)
    })
  })

  describe(getCountryFromUserProfile.name, () => {
    it('should return empty String when addressType is not defined', () => {
      const addressType = ''
      const state = {}
      const actual = getCountryFromUserProfile(addressType, state)
      expect(actual).toBe('')
    })
    it('should return country from user delivery Details address', () => {
      const addressType = 'deliveryMCD'
      const state = {
        account: {
          user: {
            deliveryDetails: {
              address: {
                country: 'Poland',
              },
            },
          },
        },
      }
      const actual = getCountryFromUserProfile(addressType, state)
      expect(actual).toBe('Poland')
    })
    it('should return country from user billing Details address', () => {
      const addressType = 'billingMCD'
      const state = {
        account: {
          user: {
            billingDetails: {
              address: {
                country: 'Russia',
              },
            },
          },
        },
      }
      const actual = getCountryFromUserProfile(addressType, state)
      expect(actual).toBe('Russia')
    })
    it('should return empty String when state is not defined and `addressType===delivery`', () => {
      const addressType = 'deliveryMCD'
      const state = {}
      const actual = getCountryFromUserProfile(addressType, state)
      expect(actual).toBe('')
    })
    it('should return empty String when state is not defined and `addressType===billing`', () => {
      const addressType = 'billingMCD'
      const state = {}
      const actual = getCountryFromUserProfile(addressType, state)
      expect(actual).toBe('')
    })
  })

  describe(getCountryFormField.name, () => {
    it('should return empty String when addressType or formName is not defined', () => {
      const addressType = ''
      const formName = ''
      const state = {}
      const actual = getCountryFormField(addressType, formName, state)
      expect(actual).toBe('')
    })
    it('should return empty String when addressForm is undefined and `addressType===addressBook`', () => {
      const addressType = 'addressBook'
      const formName = 'newAddress'
      const state = {
        forms: {
          addressBook: {
            unknownForm: {
              fields: {},
            },
          },
        },
      }
      const actual = getCountryFormField(addressType, formName, state)
      expect(actual).toBe('')
    })
    it('should return country from address book when `addressType===addressBook`', () => {
      const addressType = 'addressBook'
      const formName = 'newAddress'
      const state = {
        forms: {
          addressBook: {
            newAddress: {
              fields: {
                country: {
                  value: 'Poland',
                },
              },
            },
          },
        },
      }
      const actual = getCountryFormField(addressType, formName, state)
      expect(actual).toBe('Poland')
    })
    it('should return country from account my Checkout Details when `addressType===delivery`', () => {
      const addressType = 'deliveryMCD'
      const formName = 'deliveryAddressMCD'
      const state = {
        forms: {
          account: {
            myCheckoutDetails: {
              deliveryAddressMCD: {
                fields: {
                  country: {
                    value: 'Holand',
                  },
                },
              },
            },
          },
        },
      }
      const actual = getCountryFormField(addressType, formName, state)
      expect(actual).toBe('Holand')
    })
  })

  describe(getCountryFor.name, () => {
    describe('for returning user', () => {
      describe('addressType or formName is not defined', () => {
        const addressType = 'notValid'
        const formName = 'notValid'
        const state = {
          account: {
            user: {
              deliveryDetails: {
                address: {
                  country: '',
                },
              },
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  country: {
                    value: '',
                  },
                },
              },
            },
          },
          config: {
            country: 'Ireland',
          },
        }
        it('should return to site Default config country', () => {
          const actual = getCountryFor(addressType, formName, state)
          expect(actual).toBe('Ireland')
        })
      })
      describe('when `addressType` === addressBook', () => {
        const addressType = 'addressBook'
        const formNames = getFormNames(addressType)
        it('should return the country from addressBook form when set', () => {
          const state = {
            account: {
              user: {
                deliveryDetails: {
                  address: {
                    country: 'United Kingdom',
                  },
                },
                billingDetails: {
                  addressDetailsId: 1,
                },
              },
            },
            forms: {
              addressBook: {
                newAddress: {
                  fields: {
                    country: {
                      value: 'United States',
                    },
                  },
                },
              },
            },
            config: {
              country: 'Albania',
            },
          }
          const actual = getCountryFor(addressType, formNames.address, state)
          expect(actual).toBe('United States')
        })
        it('should return the country from the brand config when the user deliveryDetails and the the addressBook is not set', () => {
          const state = {
            account: {
              user: {
                deliveryDetails: {
                  address: {
                    country: '',
                  },
                },
                billingDetails: {
                  addressDetailsId: 1,
                },
              },
            },
            forms: {
              addressBook: {
                newAddress: {
                  fields: {
                    country: {
                      value: '',
                    },
                  },
                },
              },
            },
            config: {
              country: 'Poland',
            },
          }
          const actual = getCountryFor(addressType, formNames.address, state)
          expect(actual).toBe('Poland')
        })
        it('should return the country from the brand config when the user deliveryDetails and the the addressBook is not set', () => {
          const state = {
            account: {
              user: {
                deliveryDetails: {
                  address: {
                    country: '',
                  },
                },
                billingDetails: {
                  addressDetailsId: 1,
                },
              },
            },
            forms: {
              addressBook: {
                newAddress: {
                  fields: {
                    country: {
                      value: '',
                    },
                  },
                },
              },
            },
            config: {
              country: 'Poland',
            },
          }
          const actual = getCountryFor(addressType, formNames.address, state)
          expect(actual).toBe('Poland')
        })
      })
      describe('when `addressType` === deliveryMCD', () => {
        const addressType = 'deliveryMCD'
        const formNames = getFormNames(addressType)
        const state = {
          account: {
            user: {
              deliveryDetails: {
                address: {
                  country: 'United Kingdom',
                },
              },
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
          forms: {
            account: {
              myCheckoutDetails: {
                deliveryAddressMCD: {
                  fields: {
                    country: {
                      value: 'United States',
                    },
                  },
                },
              },
            },
          },
          config: {
            country: 'Albania',
          },
        }
        it('get delivery Country from delivery address form', () => {
          const country = getCountryFor(addressType, formNames.address, state)
          expect(country).toEqual('United States')
        })
        it('should not get delivery Country from delivery details form but return site default', () => {
          const updateforms = {
            account: {
              user: {
                deliveryDetails: {
                  address: {
                    country: 'Albania',
                  },
                },
                billingDetails: {
                  addressDetailsId: 1,
                },
              },
            },
            forms: {
              account: {
                myCheckoutDetails: {
                  deliveryDetailsAddressMCD: {
                    fields: {
                      country: {
                        value: '',
                      },
                    },
                  },
                },
              },
            },
          }
          const country = getCountryFor(addressType, formNames.details, {
            ...updateforms,
          })
          expect(country).toEqual('Albania')
        })
        it('should use user delivery details form country when formName is wrong', () => {
          const updateforms = {
            account: {
              user: {
                deliveryDetails: {
                  address: {
                    country: 'Albania',
                  },
                },
                billingDetails: {
                  addressDetailsId: 1,
                },
              },
            },
            forms: {
              account: {
                myCheckoutDetails: {
                  wrongFormName: {
                    fields: {
                      country: {
                        value: 'United States',
                      },
                    },
                  },
                },
              },
            },
          }
          const country = getCountryFor(addressType, formNames.findAddress, {
            ...state,
            ...updateforms,
          })
          expect(country).toEqual('Albania')
        })
      })
      describe('when `addressType` === billingMCD', () => {
        const addressType = 'billingMCD'
        const formNames = getFormNames(addressType)
        const state = {
          account: {
            user: {
              deliveryDetails: {
                address: {
                  country: 'United Kingdom',
                },
              },
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
          forms: {
            account: {
              myCheckoutDetails: {
                billingAddressMCD: {
                  fields: {
                    country: {
                      value: 'South Africa',
                    },
                  },
                },
              },
            },
          },
          config: {
            country: 'Albania',
          },
        }
        it('get billing Country from billing address form', () => {
          const country = getCountryFor(addressType, formNames.address, state)
          expect(country).toEqual('South Africa')
        })
        it('should not get billing Country from billing details form but return site default', () => {
          const updateforms = {
            forms: {
              account: {
                myCheckoutDetails: {
                  billingDetailsAddressMCD: {
                    fields: {
                      country: {
                        value: '',
                      },
                    },
                  },
                },
                billingDetails: {
                  addressDetailsId: 1,
                },
              },
            },
            config: {
              country: 'France',
            },
          }
          const country = getCountryFor(addressType, formNames.details, {
            ...state,
            ...updateforms,
          })
          expect(country).toEqual('France')
        })
      })
    })
    describe('for new user', () => {
      describe('when `addressType` === deliveryCheckout', () => {
        const addressType = 'deliveryCheckout'
        const formNames = getFormNames(addressType)
        const state = {
          account: {
            user: {
              deliveryDetails: {
                address: {
                  country: 'United Kingdom',
                },
              },
              billingDetails: {
                addressDetailsId: false,
              },
            },
          },
          forms: {
            checkout: {
              yourAddress: {
                fields: {
                  country: {
                    value: 'United States',
                  },
                },
              },
            },
          },
          config: {
            country: 'Albania',
          },
        }
        it('get delivery Country from delivery address form', () => {
          const country = getCountryFor(addressType, formNames.address, state)
          expect(country).toEqual('United States')
        })
        it('should not get delivery Country from delivery details form but from checkout orderSummary', () => {
          const updateforms = {
            account: {
              user: {
                deliveryDetails: {
                  address: {
                    country: 'Albania',
                  },
                },
                billingDetails: {
                  addressDetailsId: false,
                },
              },
            },
            forms: {
              account: {
                myCheckoutDetails: {
                  deliveryDetailsAddressMCD: {
                    fields: {
                      country: {
                        value: '',
                      },
                    },
                  },
                },
              },
            },
            checkout: {
              orderSummary: {
                deliveryDetails: {
                  address: {
                    country: 'France',
                  },
                },
              },
            },
          }
          const country = getCountryFor(addressType, formNames.details, {
            ...state,
            ...updateforms,
          })
          expect(country).toEqual('France')
        })
      })
      describe('when `addressType` === billingCheckout', () => {
        const addressType = 'billingCheckout'
        const formNames = getFormNames(addressType)
        const state = {
          account: {
            user: {
              deliveryDetails: {
                address: {
                  country: 'United Kingdom',
                },
              },
              billingDetails: {
                addressDetailsId: false,
              },
            },
          },
          forms: {
            checkout: {
              billingAddress: {
                fields: {
                  country: {
                    value: 'South Africa',
                  },
                },
              },
            },
          },
          config: {
            country: 'Albania',
          },
        }
        it('get billing Country from billing address form', () => {
          const country = getCountryFor(addressType, formNames.address, state)
          expect(country).toEqual('South Africa')
        })
        it('should not get billing Country from billing details form but return default from orderSummary', () => {
          const updateforms = {
            forms: {
              account: {
                myCheckoutDetails: {
                  billingDetailsAddressMCD: {
                    fields: {
                      country: {
                        value: '',
                      },
                    },
                  },
                },
              },
            },
            checkout: {
              orderSummary: {
                billingDetails: {
                  address: {
                    country: 'France',
                  },
                },
              },
            },
            config: {
              country: 'Albania',
            },
          }
          const country = getCountryFor(addressType, formNames.details, {
            ...state,
            ...updateforms,
          })
          expect(country).toEqual('France')
        })
      })
    })
  })

  describe(getMCDDeliveryCountry.name, () => {
    const accountMock = {
      user: {
        deliveryDetails: {
          address: {
            country: 'United Kingdom',
          },
        },
      },
    }

    const formsMock = {
      account: {
        myCheckoutDetails: {
          deliveryAddressMCD: {
            fields: {
              country: {
                value: 'United States',
              },
            },
          },
        },
      },
    }

    const configMock = {
      country: 'Albania',
    }

    it('returns undefined with empty state', () => {
      expect(getMCDDeliveryCountry({})).toBeUndefined()
    })
    it('returns default country if account details or forms are not available', () => {
      const state = {
        config: configMock,
      }
      expect(getMCDDeliveryCountry(state)).toBe('Albania')
    })
    it('returns country from the user profile if MCD form details are not available', () => {
      const state = {
        account: accountMock,
        config: configMock,
      }
      expect(getMCDDeliveryCountry(state)).toBe('United Kingdom')
    })
    it('returns country from the MCD Delivery Address form if available', () => {
      const state = {
        account: accountMock,
        forms: formsMock,
        config: configMock,
      }
      expect(getMCDDeliveryCountry(state)).toBe('United States')
    })
  })

  describe(getMCDBillingCountry.name, () => {
    const accountMock = {
      user: {
        billingDetails: {
          address: {
            country: 'Trinidad & Tobago',
          },
        },
      },
    }

    const formsMock = {
      account: {
        myCheckoutDetails: {
          billingAddressMCD: {
            fields: {
              country: {
                value: 'Iceland',
              },
            },
          },
        },
      },
    }

    const configMock = {
      country: 'Peru',
    }

    it('returns undefined with empty state', () => {
      expect(getMCDBillingCountry({})).toBeUndefined()
    })
    it('returns default country if account details or forms are not available', () => {
      const state = {
        config: configMock,
      }
      expect(getMCDBillingCountry(state)).toBe('Peru')
    })
    it('returns country from the user profile if MCD form details are not available', () => {
      const state = {
        account: accountMock,
        config: configMock,
      }
      expect(getMCDBillingCountry(state)).toBe('Trinidad & Tobago')
    })
    it('returns country from the MCD Delivery Address form if available', () => {
      const state = {
        account: accountMock,
        forms: formsMock,
        config: configMock,
      }
      expect(getMCDBillingCountry(state)).toBe('Iceland')
    })
  })

  describe(getAddressForm.name, () => {
    it('should return empty object when addressType is not defined or not it configuration', () => {
      const state = null
      const addressType = ''
      const formName = ''
      const actual = getAddressForm(addressType, formName, state)
      expect(actual).toEqual({})
    })
    describe('AddressBook form', () => {
      const addressType = 'addressBook'
      const formNames = getFormNames(addressType)
      it('should return addressBook form when state has a valid addressBook object', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  postcode: {
                    value: 'n22 5hy',
                  },
                  country: {
                    value: 'United Kingdom',
                  },
                },
              },
            },
          },
        }
        const actual = getAddressForm(addressType, formNames.address, state)
        expect(actual).toMatchObject({ fields: {} })
      })
    })
    describe('Delivery and billing form in user profile', () => {
      describe('Delivery', () => {
        const addressType = 'deliveryMCD'
        const formNames = getFormNames(addressType)
        it('should return delivery address form when state has a valid delivery Address object', () => {
          const state = {
            forms: {
              account: {
                myCheckoutDetails: {
                  deliveryAddressMCD: {
                    fields: {
                      postcode: {
                        value: 'n22 5hy',
                      },
                      country: {
                        value: 'United Kingdom',
                      },
                    },
                  },
                },
              },
            },
          }
          const actual = getAddressForm(addressType, formNames.address, state)
          expect(actual).toMatchObject({ fields: {} })
        })
      })
      describe('Billing', () => {
        const addressType = 'billingMCD'
        const formNames = getFormNames(addressType)
        it('should return billing address form when state has a valid billing address object', () => {
          const state = {
            forms: {
              account: {
                myCheckoutDetails: {
                  billingAddressMCD: {
                    fields: {
                      postcode: {
                        value: 'n22 5hy',
                      },
                      country: {
                        value: 'United Kingdom',
                      },
                    },
                  },
                },
              },
            },
          }
          const actual = getAddressForm(addressType, formNames.address, state)
          expect(actual).toMatchObject({ fields: {} })
        })
      })
    })
    describe('Delivery and billing form in checkout', () => {
      describe('Delivery', () => {
        const addressType = 'deliveryCheckout'
        const formNames = getFormNames(addressType)
        it('should return delivery address form when state has a valid delivery Address object', () => {
          const state = {
            forms: {
              checkout: {
                yourAddress: {
                  fields: {
                    postcode: {
                      value: 'n22 5hy',
                    },
                    country: {
                      value: 'United Kingdom',
                    },
                  },
                },
              },
            },
          }
          const actual = getAddressForm(addressType, formNames.address, state)
          expect(actual).toMatchObject({ fields: {} })
        })
      })
      describe('Billing', () => {
        const addressType = 'billingCheckout'
        const formNames = getFormNames(addressType)
        it('should return billing address form when state has a valid billing address object', () => {
          const state = {
            forms: {
              checkout: {
                billingAddress: {
                  fields: {
                    postcode: {
                      value: 'n22 5hy',
                    },
                    country: {
                      value: 'United Kingdom',
                    },
                  },
                },
              },
            },
          }
          const actual = getAddressForm(addressType, formNames.address, state)
          expect(actual).toMatchObject({ fields: {} })
        })
      })
    })
  })

  describe(getIsFindAddressVisible.name, () => {
    it('return false when state is empty', () => {
      expect(getIsFindAddressVisible()).toEqual(false)
      expect(getIsFindAddressVisible({})).toEqual(false)
      expect(getIsFindAddressVisible(null)).toEqual(false)
      expect(getIsFindAddressVisible(undefined)).toEqual(false)
    })

    describe('state has combinations of forms and QASCountry config', () => {
      it('should return false when isManual=true and QASCountry code is populated', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  isManual: {
                    value: true,
                  },
                },
              },
            },
          },
          config: {
            qasCountries: {
              'United Kingdom': 'UK',
            },
          },
        }

        const actual = getIsFindAddressVisible(
          'addressBook',
          'newAddress',
          'United Kingdom',
          state
        )
        const expected = false
        expect(actual).toBe(expected)
      })
      it('should return true when  isManual=false and QASCountry code is populated', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  isManual: {
                    value: false,
                  },
                },
              },
            },
          },
          config: {
            qasCountries: {
              'United Kingdom': 'UK',
            },
          },
        }

        const actual = getIsFindAddressVisible(
          'addressBook',
          'newAddress',
          'United Kingdom',
          state
        )
        const expected = true
        expect(actual).toBe(expected)
      })
      it('should return false when isManual=true and QASCountry code returns an empty string', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  isManual: {
                    value: true,
                  },
                },
              },
            },
          },
          config: {
            qasCountries: {},
          },
        }

        const actual = getIsFindAddressVisible(
          'addressBook',
          'newAddress',
          'United Kingdom',
          state
        )
        const expected = false
        expect(actual).toBe(expected)
      })
      it('should return false when isManual=false and QASCountry code returns an empty string', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  isManual: {
                    value: false,
                  },
                },
              },
            },
          },
          config: {
            qasCountries: {},
          },
        }

        const actual = getIsFindAddressVisible(
          'addressBook',
          'newAddress',
          'United Kingdom',
          state
        )
        const expected = false
        expect(actual).toBe(expected)
      })
    })
  })

  describe(getFormNames.name, () => {
    it('gets checkout delivery form names', () => {
      expect(getFormNames('deliveryCheckout')).toEqual({
        address: 'yourAddress',
        details: 'yourDetails',
        findAddress: 'findAddress',
      })
    })
    it('gets checkout billing form names', () => {
      expect(getFormNames('billingCheckout')).toEqual({
        address: 'billingAddress',
        details: 'billingDetails',
        findAddress: 'billingFindAddress',
      })
    })
    it('get MyCheckoutDetails delivery form names', () => {
      expect(getFormNames('deliveryMCD')).toEqual({
        address: 'deliveryAddressMCD',
        details: 'deliveryDetailsAddressMCD',
        findAddress: 'deliveryFindAddressMCD',
      })
    })
    it('get MyCheckoutDetails billing form names', () => {
      expect(getFormNames('billingMCD')).toEqual({
        address: 'billingAddressMCD',
        details: 'billingDetailsAddressMCD',
        findAddress: 'billingFindAddressMCD',
      })
    })
    it('get MyCheckoutDetails payment form names', () => {
      expect(getFormNames('payment')).toEqual({
        paymentCardDetails: 'billingCardDetails',
        paymentCardDetailsMCD: 'paymentCardDetailsMCD',
      })
    })
    it('should return the newAddress form names', () => {
      expect(getFormNames('addressBook')).toEqual({
        address: 'newAddress',
        details: 'newDetails',
        findAddress: 'newFindAddress',
        deliverToAddress: 'newDeliverToAddress',
      })
    })
  })
})
