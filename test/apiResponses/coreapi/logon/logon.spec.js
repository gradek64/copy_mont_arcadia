require('@babel/register')

import { addPropsToSchema } from '../utilis'
import {
  newUserMobileAppPayload,
  newUserPayload,
  reauthenticationMobileAppPayload,
} from './logon-data'
import {
  INVALID_ACCOUNT_MSG,
  LOCKED_ACCOUNT_MSG,
  ACCOUNT_WAIT_MSG,
} from '../message-data'
import {
  partialAccountSchema,
  partialCreditCardSchema,
  customerDetailsSchema,
  partialCustomerDetailsSchema,
  nameAndPhoneSchema,
  partialNameAndPhoneSchema,
  addressDetailsSchema,
  partialAddressDetailsSchema,
  creditCardSchema,
} from '../my-account/my-account-schemas'

import {
  loginAsNewUserAndRegisterIfNotExisting,
  logIn,
  logOut,
  createAccount,
} from './../utilis/userAccount'
import { addItemToShoppingBag2 } from '../utilis/shoppingBag'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'

let newAccount

describe('Logon Schema New User Mobile Apps', () => {
  describe('Given I am a registered new user', () => {
    let responseBody
    beforeAll(async () => {
      responseBody = await loginAsNewUserAndRegisterIfNotExisting(
        newUserMobileAppPayload
      )
    }, 60000)

    describe('When I login for the first time with my email, password and appId', () => {
      it('Then I receive a userToken', () => {
        expect(responseBody.userToken).toBeDefined()
        expect(typeof responseBody.userToken).toBe('string')
      })
      it('And I receive a userId', () => {
        expect(responseBody.userId).toBeDefined()
        expect(typeof responseBody.userId).toBe('string')
      })
      it('And the rest of the response matches the logon schema for new users', () => {
        expect(responseBody).toMatchSchema(partialAccountSchema)
      })
    })

    describe('Given that I have logged in before', () => {
      describe('When I login again with my userToken, userId and appId, not providing my email address and password', () => {
        let responseBody
        beforeAll(async () => {
          try {
            responseBody = await loginAsNewUserAndRegisterIfNotExisting(
              reauthenticationMobileAppPayload
            )
          } catch (error) {
            responseBody = error
          }
          // We are currently expecting an error code because WCS doesn't
          // yet include the functionality to reauthenticate
          expect(responseBody.response.body.statusCode).toBe(422)
        }, 60000)
        it('Then I receive back a response matching the usual login success', () => {
          // Use "testNewUserProfileSchema(responseBody)" once response body is
          // defined
          expect(responseBody.exists).not.toBeDefined()
        })

        it('Then there is the same userId returned', () => {
          // Remove "not" once it starts failing: that means WCS feature works
          expect(responseBody.userId).not.toBeDefined()
          expect(typeof responseBody.userId).not.toBe('number')
          expect(responseBody.userId).not.toBe(
            reauthenticationMobileAppPayload.userId
          )
        })
        it('Then there is the same appId returned', () => {
          // Remove "not" once it starts failing: that means WCS feature works
          expect(responseBody.appId).not.toBeDefined()
          expect(typeof responseBody.appId).not.toBe('string')
          expect(responseBody.appId).not.toBe(
            reauthenticationMobileAppPayload.appId
          )
        })
        it('Then there is a userToken returned (which can have changed compared to the one submitted)', () => {
          // Remove "not" once it starts failing: that means WCS feature works
          expect(responseBody.userToken).not.toBeDefined()
          expect(typeof responseBody.userToken).not.toBe('string')
          expect(responseBody.userToken).not.toBe(
            reauthenticationMobileAppPayload.userToken
          )
        })
      })
    })
  })
})

describe('Logon Schema Partial Profile Mobile Apps', () => {
  describe('Given I can login as a returning user with deviceType "apps"', () => {
    let login

    beforeAll(async () => {
      newAccount = await createAccount()
      await logOut()
      try {
        login = await logIn({
          username: newAccount.accountProfile.email,
          password: 'monty1',
          deviceType: 'apps',
        })
      } catch (e) {
        login = e.response.statusCode
      }
    }, 60000)

    it('Then the response matches the regular partial profile response', () => {
      expect(login).toMatchSchema(
        addPropsToSchema(partialAccountSchema, {
          userId: 'stringTypeNumber',
          userToken: 'nullType',
        })
      )
    })

    it('Then the response contains a userToken', () => {
      expect(login.userToken).toBe('null')
    })
  })
})

describe('Logon Schema New User', () => {
  let responseBody
  beforeAll(async () => {
    responseBody = await loginAsNewUserAndRegisterIfNotExisting(newUserPayload)
  }, 60000)

  it('New User Profile Schema', () => {
    expect(responseBody).toMatchSchema(partialAccountSchema)
  })

  it('New User Checkout Profile Credit Card Schema', () => {
    const body = responseBody.creditCard
    expect(body).toMatchSchema(partialCreditCardSchema)
  })

  it('New User Checkout Profile Billing Details Schema', () => {
    const body = responseBody.billingDetails
    expect(body).toMatchSchema(customerDetailsSchema)
  })

  it('New User Checkout Profile Billing Details nameAndPhone Schema', () => {
    const body = responseBody.billingDetails.nameAndPhone
    expect(body).toMatchSchema(partialNameAndPhoneSchema)
  })

  it('New User Checkout Profile Billing Details address Schema', () => {
    const body = responseBody.billingDetails.address
    expect(body).toMatchSchema(partialAddressDetailsSchema)
  })

  it('New User Checkout Profile Delivery Details Schema', () => {
    const body = responseBody.deliveryDetails
    expect(body).toMatchSchema(customerDetailsSchema)
  })

  it('New User Checkout Profile Delivery Details nameAndPhone Schema', () => {
    const body = responseBody.deliveryDetails.nameAndPhone
    expect(body).toMatchSchema(partialNameAndPhoneSchema)
  })

  it('New User Checkout Profile Delivery Details address Schema', () => {
    const body = responseBody.deliveryDetails.address
    expect(body).toMatchSchema(partialAddressDetailsSchema)
  })
})

describe('Logon Schema Full Profile', () => {
  let errorSettingUp
  let products
  let shoppingBag
  let login

  beforeAll(async () => {
    try {
      products = await getProducts()
      newAccount = await createAccount()
      shoppingBag = await addItemToShoppingBag2(
        newAccount.jsessionid,
        products.productsSimpleId
      )
      await payOrder(newAccount.jsessionid, shoppingBag.orderId)
      await logOut()
    } catch (e) {
      errorSettingUp = e
    }
    login = await logIn({
      username: newAccount.accountProfile.email,
      password: 'monty1',
    })
  }, 60000)

  const checkSetUpAndTest = (cb) => () => {
    if (errorSettingUp) {
      throw new Error(
        'Error generating test prerequisites. This is most likely to be an environment issue and is not fault of the test'
      )
    } else {
      cb()
    }
  }

  it(
    'Full Checkout Profile Schema',
    checkSetUpAndTest(() => {
      expect(login).toMatchSchema(
        addPropsToSchema(partialAccountSchema, {
          title: 'stringType',
          firstName: 'stringType',
          lastName: 'stringType',
          hasCardNumberHash: true,
          hasDeliveryDetails: true,
          hasBillingDetails: true,
        })
      )
    })
  )

  it(
    'Full Checkout Profile Credit Card Schema',
    checkSetUpAndTest(() => {
      expect(login.creditCard).toMatchSchema(creditCardSchema)
    })
  )

  it(
    'Full Checkout Profile Billing Details Schema',
    checkSetUpAndTest(() => {
      expect(login.billingDetails).toMatchSchema(customerDetailsSchema)
    })
  )

  it(
    'Full Checkout Profile Billing Details nameAndPhone Schema',
    checkSetUpAndTest(() => {
      expect(login.billingDetails.nameAndPhone).toMatchSchema(
        nameAndPhoneSchema
      )
    })
  )

  it(
    'Full Checkout Profile Billing Details address Schema',
    checkSetUpAndTest(() => {
      expect(login.billingDetails.address).toMatchSchema(addressDetailsSchema)
    })
  )

  it(
    'Full Checkout Profile Delivery Details Schema',
    checkSetUpAndTest(() => {
      expect(login.deliveryDetails).toMatchSchema(customerDetailsSchema)
    })
  )

  it(
    'Full Checkout Profile Delivery Details nameAndPhone Schema',
    checkSetUpAndTest(() => {
      expect(login.deliveryDetails.nameAndPhone).toMatchSchema(
        nameAndPhoneSchema
      )
    })
  )
})

describe('Logon Schema Partial Profile', () => {
  let login

  beforeAll(async () => {
    newAccount = await createAccount()
    await logOut()
    login = await logIn({
      username: newAccount.accountProfile.email,
      password: 'monty1',
    })
  }, 60000)
  it('Partial Checkout Profile Schema', () => {
    expect(login).toMatchSchema(partialAccountSchema)
  })

  it('Partial Checkout Profile Credit Card Schema', () => {
    expect(login.creditCard).toMatchSchema(partialCreditCardSchema)
  })

  it('Partial Checkout Profile Billing Details Schema', () => {
    expect(login.billingDetails).toMatchSchema(partialCustomerDetailsSchema)
  })

  it('Partial Checkout Profile Billing Details nameAndPhone Schema', () => {
    expect(login.billingDetails.nameAndPhone).toMatchSchema(
      partialNameAndPhoneSchema
    )
  })

  it('Partial Checkout Profile Billing Details address Schema', () => {
    expect(login.billingDetails.address).toMatchSchema(
      partialAddressDetailsSchema
    )
  })

  it('Partial Checkout Profile Delivery Details Schema', () => {
    expect(login.deliveryDetails).toMatchSchema(partialCustomerDetailsSchema)
  })

  it('Partial Checkout Profile Delivery Details nameAndPhone Schema', () => {
    expect(login.deliveryDetails.nameAndPhone).toMatchSchema(
      partialNameAndPhoneSchema
    )
  })

  it('Partial Checkout Profile Delivery Details address Schema', () => {
    expect(login.deliveryDetails.address).toMatchSchema(
      partialAddressDetailsSchema
    )
  })
})

describe('Logon Errors', () => {
  let login

  beforeEach(async () => {
    newAccount = await createAccount()
    await logOut()
  }, 60000)

  it(
    'A user cannot logon with invalid email and password',
    async () => {
      try {
        login = await logIn({
          username: 'faillogon@sampleemail.org',
          password: 'monty1',
        })
      } catch (e) {
        login = e.response.body
      }
      expect(login).toMatchSchema(INVALID_ACCOUNT_MSG)
    },
    30000
  )

  it(
    'An existing user cannot logon with invalid password',
    async () => {
      try {
        login = await logIn({
          username: newAccount.accountProfile.email,
          password: 'invalidpassw0rd2',
        })
      } catch (e) {
        login = e.response.body
      }
      expect(login).toMatchSchema(INVALID_ACCOUNT_MSG)
    },
    30000
  )

  it(
    'A user cannot logon with an invalid email',
    async () => {
      try {
        login = await logIn({
          username: 'faillogon@sampleemail.o',
          password: 'monty1',
        })
      } catch (e) {
        login = e.response.body
      }
      expect(login).toMatchSchema(INVALID_ACCOUNT_MSG)
    },
    30000
  )

  it(
    'A user cannot log on to a locked account',
    async () => {
      try {
        login = await logIn({
          username: 'lockedaccount@test.com',
          password: 'monty1',
        })
      } catch (e) {
        login = e.response.body
      }
      expect(login).toMatchSchema(LOCKED_ACCOUNT_MSG)
    },
    30000
  )

  it(
    'A user has to wait 30 seconds after too many failed logon attempts',
    async () => {
      const attemptLogin = async (noOfRetries = 0) => {
        try {
          login = await logIn({
            username: newAccount.accountProfile.email,
            password: 'invalidpassw0rd2',
          })
        } catch (e) {
          login = e.response.body
        }

        if (login.statusCode === 401 && noOfRetries < 10) {
          await attemptLogin(noOfRetries + 1)
        } else if (login.statusCode === 403) {
          expect(login).toMatchSchema(ACCOUNT_WAIT_MSG)
        } else {
          throw new Error(
            `Unexpected response status received: ${
              login.statusCode
            } or noOfRetries (${noOfRetries}) reached`
          )
        }
      }

      await attemptLogin()
    },
    30000
  )

  it(
    'should return a bad request error when an empty payload is sent',
    async () => {
      try {
        login = await logIn({})
      } catch (e) {
        login = e.response.body
      }
      expect(login.statusCode).toBe(400)
      expect(login.message).toBe('Payload is required')
      expect(login.error).toBe('Bad Request')
    },
    30000
  )
})
