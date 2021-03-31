import {
  stringType,
  stringTypeEmpty,
  stringTypeNumber,
  stringTypePattern,
  objectType,
  booleanType,
  booleanOrNull,
  numberType,
  numberTypePattern,
  arrayType,
  stringTypeCanBeEmpty,
  addPropsToSchema,
  booleanTypeAny,
} from '../utilis'
import {
  createAccountResponse,
  changePassword,
  logIn,
  logOut,
  resetPasswordLink,
  getPreferencesLink,
  getUserAccountResponse,
  logInResponse,
  changePasswordResponse,
  forgottenPasswordResponse,
  resetPasswordResponse,
  updateAccountShortProfileResponse,
  updateCheckoutDetailsResponse,
} from '../utilis/userAccount'
import {
  fullAccountSchema,
  partialAccountSchema,
  creditCardSchema,
  partialCreditCardSchema,
  thirdPartyPaymentSchema,
  customerDetailsSchema,
  partialCustomerDetailsSchema,
  nameAndPhoneSchema,
  partialNameAndPhoneSchema,
  addressDetailsSchema,
  partialAddressDetailsSchema,
  ddpPropertiesSchema,
  ddpRequiredProperties,
} from './my-account-schemas'
import {
  ACCOUNT_LOCKED,
  PASSWORD_RESET_FAILURE,
  PASSWORD_RESET_SUCCESS,
  RESEND_PASSWORD,
} from '../message-data'
import { addItemToShoppingBagResponse } from '../utilis/shoppingBag'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'
import { processClientCookies } from '../utilis/cookies'
import { getResponseAndSessionCookies } from '../utilis/redis'

describe('It should return the My Account Json Schema', () => {
  let products

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  describe('My Account Full Profile', () => {
    let mergeCookies
    let account
    let accountResponse

    beforeAll(async () => {
      ;({ mergeCookies } = processClientCookies())
      const newAccount = await createAccountResponse()
      const newAccountCookies = mergeCookies(newAccount)
      const shoppingBagResponse = await addItemToShoppingBagResponse(
        newAccountCookies,
        products.productsSimpleId
      )
      const shoppingBagCookies = mergeCookies(shoppingBagResponse)
      let paidOrder
      try {
        paidOrder = await payOrder(
          shoppingBagCookies,
          shoppingBagResponse.body.orderId
        )
      } catch (e) {
        global.console.log('Error Paying for order', e)
      }
      const paidOrderCookies = mergeCookies(paidOrder)
      accountResponse = await getUserAccountResponse(paidOrderCookies)
      account = accountResponse.body
    }, 60000)

    it(
      'My Account - User Full Checkout Profile Schema',
      () => {
        expect(account).toMatchSchema(fullAccountSchema)
      },
      30000
    )

    it(
      'My Account - User Full Checkout Profile Credit Card Schema',
      () => {
        expect(account.creditCard).toMatchSchema(creditCardSchema)
      },
      30000
    )

    it(
      'My Account - User Full Checkout Profile Billing Details Schema',
      () => {
        expect(account.billingDetails).toMatchSchema(customerDetailsSchema)
      },
      30000
    )

    it(
      'My Account - User Full Checkout Profile Billing Details nameAndPhone Schema',
      () => {
        expect(account.billingDetails.nameAndPhone).toMatchSchema(
          nameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - User Full Checkout Profile Billing Details address Schema',
      () => {
        expect(account.billingDetails.address).toMatchSchema(
          addressDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - User Full Checkout Profile Delivery Details Schema',
      () => {
        expect(account.deliveryDetails).toMatchSchema(customerDetailsSchema)
      },
      30000
    )

    it(
      'My Account - User Full Checkout Profile Delivery Details nameAndPhone Schema',
      () => {
        expect(account.deliveryDetails.nameAndPhone).toMatchSchema(
          nameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - User Full Checkout Profile Delivery Details address Schema',
      () => {
        expect(account.deliveryDetails.address).toMatchSchema(
          addressDetailsSchema
        )
      },
      30000
    )

    // This will need to be removed once redis is removed
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          accountResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('My Account Partial Profile', () => {
    let newAccountResponse
    let newAccount
    beforeAll(async () => {
      newAccountResponse = await createAccountResponse()
      newAccount = newAccountResponse.body
    }, 30000)

    it.skip(
      'My Account - User Partial Checkout Profile Schema',
      () => {
        expect(newAccount).toMatchSchema(partialAccountSchema)
      },
      30000
    )

    it(
      'My Account - User Partial Checkout Profile Credit Card Schema',
      () => {
        expect(newAccount.creditCard).toMatchSchema(partialCreditCardSchema)
      },
      30000
    )

    it(
      'My Account - User Partial Checkout Profile Billing Details Schema',
      () => {
        expect(newAccount.billingDetails).toMatchSchema(customerDetailsSchema)
      },
      30000
    )

    it(
      'My Account - User Partial Checkout Profile Billing Details nameAndPhone Schema',
      () => {
        expect(newAccount.billingDetails.nameAndPhone).toMatchSchema(
          partialNameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - User Partial Checkout Profile Billing Details address Schema',
      () => {
        expect(newAccount.billingDetails.address).toMatchSchema(
          partialAddressDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - User Partial Checkout Profile Delivery Details Schema',
      () => {
        expect(newAccount.deliveryDetails).toMatchSchema(
          partialCustomerDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - User Partial Checkout Profile Delivery Details nameAndPhone Schema',
      () => {
        expect(newAccount.deliveryDetails.nameAndPhone).toMatchSchema(
          partialNameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - User Partial Checkout Profile Delivery Details address Schema',
      () => {
        expect(newAccount.deliveryDetails.address).toMatchSchema(
          partialAddressDetailsSchema
        )
      },
      30000
    )

    // This will need to be removed once redis is removed
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          newAccountResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('My Account Change Password', () => {
    let userLogin
    let newAccount
    let clientCookies
    let userLoginResponse

    beforeAll(async () => {
      const { mergeCookies } = processClientCookies()
      const newAccountResponse = await createAccountResponse()
      newAccount = newAccountResponse.body
      clientCookies = mergeCookies(newAccountResponse)
      const updatedPasswordResponse = await changePasswordResponse(
        clientCookies,
        newAccount.email
      )
      clientCookies = mergeCookies(updatedPasswordResponse)
      await logOut()
      userLoginResponse = await logInResponse({
        username: newAccount.email,
        password: updatedPasswordResponse.newPassword,
      })
      userLogin = userLoginResponse.body
    }, 30000)

    it(
      'Change Password Json Schema',
      () => {
        expect(userLogin).toMatchSchema(partialAccountSchema)
      },
      30000
    )

    it('Change Password - User Partial Checkout Profile Credit Card Schema', () => {
      expect(userLogin.creditCard).toMatchSchema(partialCreditCardSchema)
    })

    it(
      'Change Password - User Partial Checkout Profile Billing Details Schema',
      () => {
        expect(userLogin.billingDetails).toMatchSchema(customerDetailsSchema)
      },
      30000
    )

    it(
      'Change Password - User Partial Checkout Profile Billing Details nameAndPhone Schema',
      () => {
        expect(userLogin.billingDetails.nameAndPhone).toMatchSchema(
          partialNameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'Change Password - User Partial Checkout Profile Billing Details address Schema',
      () => {
        expect(userLogin.billingDetails.address).toMatchSchema(
          partialAddressDetailsSchema
        )
      },
      30000
    )

    it(
      'Change Password - User Partial Checkout Profile Delivery Details Schema',
      () => {
        expect(userLogin.deliveryDetails).toMatchSchema(customerDetailsSchema)
      },
      30000
    )

    it(
      'Change Password - User Partial Checkout Profile Delivery Details nameAndPhone Schema',
      () => {
        expect(userLogin.deliveryDetails.nameAndPhone).toMatchSchema(
          partialNameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'Change Password - User Partial Checkout Profile Delivery Details address Schema',
      () => {
        expect(userLogin.deliveryDetails.address).toMatchSchema(
          partialAddressDetailsSchema
        )
      },
      30000
    )

    // This will need to be removed once redis is removed
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          userLoginResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('Native Apps - Change Password',() => {
    const updatedPasswordSchema = {
     title: 'Change Password',
     type: 'object',
     required: ['newPassword', 'newPasswordBody'],
     properties: {
       newPassword: stringType,
       newPasswordBody: objectType
       },
   }

    it(
      'should respond with a updatedPasswordSchema',
      async () => {
        const { mergeCookies } = processClientCookies()
        const newAccount = await createAccountResponse()
        const clientCookies = mergeCookies(newAccount)
        let updatedPassword
        try {
          updatedPassword = await changePassword(
            clientCookies,
            newAccount.email,
            'app'
          )
        } catch (e) {
          updatedPassword = e.response.statusCode
        }
        expect(updatedPassword).toMatchSchema(updatedPasswordSchema)
      },
      30000
    )
  })

  describe('My Account Forgotten/Reset Password Json Schema', () => {
    let newAccount
    let passwordForgottenResponse
    let passwordForgotten
    let passwordReset

    beforeAll(async () => {
      const newAccountResponse = await createAccountResponse()
      newAccount = newAccountResponse.body
      await logOut()
      passwordForgottenResponse = await forgottenPasswordResponse(
        newAccount.email
      )
      passwordForgotten = passwordForgottenResponse.body
    }, 30000)

    it(
      'My Account - Forgotten Password => Success',
      () => {
        const forgotPasswordSchema = {
          title: 'Forgot Password',
          type: 'object',
          required: [
            'success',
            'message',
            'originalMessage',
            'additionalData',
            'validationErrors',
            'version',
          ],
          properties: {
            success: booleanType(true),
            message: stringTypePattern(RESEND_PASSWORD),
            originalMessage: stringTypePattern(RESEND_PASSWORD),
            additionalData: arrayType(),
            validationErrors: arrayType(),
            version: stringTypeNumber,
          },
        }
        expect(passwordForgotten).toMatchSchema(forgotPasswordSchema)
      },
      30000
    )

    // This will need to be removed once redis is removed
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          passwordForgottenResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    describe('Reset Password', () => {
      const resetPasswordSchema = {
        title: 'Reset Password Link',
        type: 'object',
        required: ['success', 'errorCode', 'action', 'message'],
        properties: {
          success: booleanType(true),
          errorCode: booleanOrNull,
          action: stringTypePattern('reset'),
          message: PASSWORD_RESET_SUCCESS,
        },
      }

      it(
        'My Account - Reset password Link => Success',
        async () => {
          passwordReset = await resetPasswordLink(newAccount.email)
          expect(passwordReset).toMatchSchema(resetPasswordSchema)
        },
        30000
      )

      it('My Account - Reset password link => Account does not exist', async () => {
        try {
          passwordReset = await resetPasswordLink(
            'faillogonqqqq@sampleemail.org'
          )
        } catch (e) {
          passwordReset = e.response.body
        }
        expect(passwordReset).toMatchSchema(resetPasswordSchema)
      })

      it('My Account - Reset password Link => Account locked', async () => {
        try {
          passwordReset = await resetPasswordLink('lockedaccount@test.com')
        } catch (e) {
          passwordReset = e.response.body
        }
        expect(passwordReset).toMatchSchema(ACCOUNT_LOCKED)
      })
    })
  })

  describe('My Account Reset Password', () => {
    it(
      'My Account - Reset password => Failure: link is not valid',
      async () => {
        const { mergeCookies } = processClientCookies()
        const newAccountResponse = await createAccountResponse()
        let clientCookies = mergeCookies(newAccountResponse)
        const { logOutBody } = await logOut()
        clientCookies = mergeCookies(logOutBody)
        let updatedPassword
        try {
          updatedPassword = await resetPasswordResponse(
            newAccountResponse.body.email,
            clientCookies
          )
        } catch (e) {
          updatedPassword = e.response.body
        }
        expect(updatedPassword).toMatchSchema(PASSWORD_RESET_FAILURE)
      },
      30000
    )
  })

  describe('My Account Short Profile Update Json Schema', () => {
    let shortProfileResponse
    let shortProfile
    let userLogin
    beforeAll(async () => {
      const { mergeCookies } = processClientCookies()
      const newAccountResponse = await createAccountResponse()
      const clientCookies = mergeCookies(newAccountResponse)
      shortProfileResponse = await updateAccountShortProfileResponse(
        clientCookies
      )
      shortProfile = shortProfileResponse.body
    }, 30000)

    it(
      'Account Short Profile Update',
      () => {
        const registerAccountSchema = {
          title: 'Account Short Profile Update Schema',
          type: 'object',
          required: [
            'exists',
            'email',
            'title',
            'firstName',
            'lastName',
            'userTrackingId',
            'subscriptionId',
            'basketItemCount',
            'creditCard',
            'deliveryDetails',
            'billingDetails',
            'version',
            'expId1',
            'expId2',
            'userId',
            'userToken',
            'success',
            ...ddpRequiredProperties,
          ],
          properties: {
            exists: booleanType(true),
            email: stringTypePattern(shortProfile.email),
            title: stringTypePattern(shortProfile.title),
            firstName: stringTypePattern(shortProfile.firstName),
            lastName: stringTypePattern(shortProfile.lastName),
            userTrackingId: numberType,
            subscriptionId: stringTypeEmpty,
            basketItemCount: numberTypePattern(0),
            creditCard: objectType,
            deliveryDetails: objectType,
            billingDetails: objectType,
            version: stringTypeNumber,
            expId1: stringType,
            expId2: stringType,
            userId: stringTypeCanBeEmpty,
            userToken: stringTypeCanBeEmpty,
            success: booleanTypeAny,
            ...ddpPropertiesSchema,
          },
        }
        expect(shortProfile).toMatchSchema(registerAccountSchema)
      },
      30000
    )

    it(
      'Should logon with the new user email',
      async () => {
        userLogin = await logIn({
          username: shortProfile.email,
          password: 'monty1',
        })
        const partialAccountSchema = {
          title: 'My Account - User Partial Profile Schema',
          type: 'object',
          required: [
            'exists',
            'email',
            'title',
            'firstName',
            'lastName',
            'userTrackingId',
            'subscriptionId',
            'basketItemCount',
            'creditCard',
            'deliveryDetails',
            'billingDetails',
            'version',
            'hasCardNumberHash',
            'hasPayPal',
            'hasDeliveryDetails',
            'hasBillingDetails',
            'expId1',
            'expId2',
            'success',
            'userId',
            'userToken',
            ...ddpRequiredProperties,
          ],
          properties: {
            exists: booleanType(true),
            email: stringTypePattern(shortProfile.email),
            title: stringTypePattern(shortProfile.title),
            firstName: stringTypePattern(shortProfile.firstName),
            lastName: stringTypePattern(shortProfile.lastName),
            userTrackingId: numberType,
            subscriptionId: stringTypeEmpty,
            basketItemCount: numberType,
            creditCard: objectType,
            deliveryDetails: objectType,
            billingDetails: objectType,
            version: stringTypeNumber,
            hasCardNumberHash: booleanType(false),
            hasPayPal: booleanType(false),
            hasDeliveryDetails: booleanType(false),
            hasBillingDetails: booleanType(false),
            expId1: stringType,
            expId2: stringType,
            success: booleanTypeAny,
            userId: stringTypeCanBeEmpty,
            userToken: stringTypeCanBeEmpty,
            ...ddpPropertiesSchema,
          },
        }
        expect(userLogin).toMatchSchema(partialAccountSchema)
      },
      30000
    )

    // This will need to be removed once redis is removed
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          shortProfileResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('My Account Update My Checkout Details', () => {
    let accountResponse
    let account
    let shoppingBag
    let checkoutProfileResponse
    let checkoutProfile
    let newAccount
    let mergeCookies
    let clientCookies
    beforeAll(async () => {
      ;({ mergeCookies } = processClientCookies())
      const newAccountResponse = await createAccountResponse()
      newAccount = newAccountResponse.body
      clientCookies = mergeCookies(newAccountResponse)
      const shoppingBagResponse = await addItemToShoppingBagResponse(
        clientCookies,
        products.productsSimpleId
      )
      shoppingBag = shoppingBagResponse.body
      clientCookies = mergeCookies(shoppingBagResponse)
      await payOrder(clientCookies, shoppingBag.orderId)
      checkoutProfileResponse = await updateCheckoutDetailsResponse(
        clientCookies,
        'VISA',
        '1111222233334444'
      )
      checkoutProfile = checkoutProfileResponse.body
      clientCookies = mergeCookies(checkoutProfileResponse)
      accountResponse = await getUserAccountResponse(clientCookies)
      account = accountResponse.body
    }, 90000)

    it(
      'My Account - Update Full Checkout Profile Schema',
      () => {
        expect(checkoutProfile).toMatchSchema(fullAccountSchema)
        expect(checkoutProfile.email).toEqual(newAccount.email)
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Billing Details Schema',
      () => {
        expect(checkoutProfile.billingDetails).toMatchSchema(
          customerDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Billing Details nameAndPhone Schema',
      () => {
        expect(checkoutProfile.billingDetails.nameAndPhone).toMatchSchema(
          nameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Billing Details address Schema',
      () => {
        expect(checkoutProfile.billingDetails.address).toMatchSchema(
          addressDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Delivery Details Schema',
      () => {
        expect(checkoutProfile.deliveryDetails).toMatchSchema(
          customerDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Delivery Details nameAndPhone Schema',
      () => {
        expect(checkoutProfile.deliveryDetails.nameAndPhone).toMatchSchema(
          nameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Delivery Details address Schema',
      () => {
        expect(checkoutProfile.deliveryDetails.address).toMatchSchema(
          addressDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema VISA',
      () => {
        expect(checkoutProfile.creditCard).toMatchSchema(creditCardSchema)
        expect(checkoutProfile.creditCard.expiryMonth).toHaveLength(2)
        expect(checkoutProfile.creditCard.expiryYear).toHaveLength(4)
        expect(checkoutProfile.creditCard.cardNumberStar).toContain('*4444')
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema MASTERCARD',
      async () => {
        const { body: checkoutProfile } = await updateCheckoutDetailsResponse(
          clientCookies,
          'MCARD',
          '5500000000000004'
        )
        expect(checkoutProfile.creditCard).toMatchSchema(creditCardSchema)
        expect(checkoutProfile.creditCard.expiryMonth).toHaveLength(2)
        expect(checkoutProfile.creditCard.expiryYear).toHaveLength(4)
        expect(checkoutProfile.creditCard.cardNumberStar).toContain('*0004')
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema AMERICAN EXPRESS',
      async () => {
        const { body: checkoutProfile } = await updateCheckoutDetailsResponse(
          clientCookies,
          'AMEX',
          '340000000000009'
        )
        expect(checkoutProfile.creditCard).toMatchSchema(creditCardSchema)
        expect(checkoutProfile.creditCard.expiryMonth).toHaveLength(2)
        expect(checkoutProfile.creditCard.expiryYear).toHaveLength(4)
        expect(checkoutProfile.creditCard.cardNumberStar).toContain('*0009')
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema MAESTRO',
      async () => {
        const { body: checkoutProfile } = await updateCheckoutDetailsResponse(
          clientCookies,
          'SWTCH',
          '6759649826438453'
        )
        expect(checkoutProfile.creditCard).toMatchSchema(creditCardSchema)
        expect(checkoutProfile.creditCard.expiryMonth).toHaveLength(2)
        expect(checkoutProfile.creditCard.expiryYear).toHaveLength(4)
        expect(checkoutProfile.creditCard.cardNumberStar).toContain('*8453')
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema ACCOUNT NUMBER',
      async () => {
        const { body: checkoutProfile } = await updateCheckoutDetailsResponse(
          clientCookies,
          'ACCNT',
          '6000082000000005'
        )
        expect(checkoutProfile.creditCard).toMatchSchema(creditCardSchema)
        expect(checkoutProfile.creditCard.expiryMonth).toHaveLength(2)
        expect(checkoutProfile.creditCard.expiryYear).toHaveLength(4)
        expect(checkoutProfile.creditCard.cardNumberStar).toContain('*0005')
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema PAYPAL',
      async () => {
        const cardType = 'PYPAL'
        const { body: checkoutProfile } = await updateCheckoutDetailsResponse(
          clientCookies,
          cardType,
          '0'
        )
        expect(checkoutProfile.creditCard).toMatchSchema(
          thirdPartyPaymentSchema(cardType)
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema MASTERPASS',
      async () => {
        const cardType = 'MPASS'
        const { body: checkoutProfile } = await updateCheckoutDetailsResponse(
          clientCookies,
          cardType,
          '0'
        )
        expect(checkoutProfile.creditCard).toMatchSchema(
          thirdPartyPaymentSchema(cardType)
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Credit Card Schema KLARNA',
      async () => {
        const cardType = 'KLRNA'
        const { body: checkoutProfile } = await updateCheckoutDetailsResponse(
          clientCookies,
          cardType,
          '0'
        )
        expect(checkoutProfile.creditCard).toMatchSchema(
          thirdPartyPaymentSchema(cardType)
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Check GET Account Schema',
      async () => {
        expect(account).toMatchSchema(fullAccountSchema)
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Check GET Account Billing Details Schema',
      () => {
        expect(account.billingDetails).toMatchSchema(customerDetailsSchema)
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Check GET Account Billing Details nameAndPhone Schema',
      () => {
        expect(account.billingDetails.nameAndPhone).toMatchSchema(
          nameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Check GET Account Billing Details address Schema',
      () => {
        expect(account.billingDetails.address).toMatchSchema(
          addressDetailsSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Check GET Account Delivery Details Schema',
      () => {
        expect(account.deliveryDetails).toMatchSchema(customerDetailsSchema)
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Check GET Account Delivery Details nameAndPhone Schema',
      () => {
        expect(account.deliveryDetails.nameAndPhone).toMatchSchema(
          nameAndPhoneSchema
        )
      },
      30000
    )

    it(
      'My Account - Update Full Checkout Profile Check GET Account Delivery Details address Schema',
      () => {
        expect(account.deliveryDetails.address).toMatchSchema(
          addressDetailsSchema
        )
      },
      30000
    )

    // This will need to be removed once redis is removed
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          accountResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('My Account Partial Profile on Native App', () => {
    let newAccount
    beforeAll(async () => {
      try {
        const newAccountResponse = await createAccountResponse({
          deviceType: 'apps',
        })
        ;({ body: newAccount } = newAccountResponse)
      } catch (e) {
        newAccount = e.response.statusCode
      }
    }, 30000)

    it(
      'My Account - User Partial Profile Schema Native App',
      async () => {
        expect(newAccount).toMatchSchema(
          addPropsToSchema(partialAccountSchema, {
            userId: 'stringTypeNumber',
            userToken: 'nullType',
          })
        )
      },
      30000
    )
  })

  describe('My Preferences - Exponea', () => {
    let newAccount
    let expId
    let exponeaPreferencesLink

    beforeAll(async () => {
      ;({ body: newAccount } = await createAccountResponse())
      expId = newAccount.expId2
    }, 60000)

    it('should return the Exponea Preferences Link', async () => {
      try {
        exponeaPreferencesLink = await getPreferencesLink(expId)
        const exponeaLinkSchemaSuccessfulResponse = {
          title: 'Exponea Preferences Link Successful Response Json Schema',
          type: 'object',
          required: ['link'],
          properties: {
            link: stringType,
          },
        }
        expect(exponeaPreferencesLink.body).toMatchSchema(
          exponeaLinkSchemaSuccessfulResponse
        )
      } catch (error) {
        const exponeaLinkSchemaUnsuccessfulResponse = {
          title: 'Exponea Preferences Link Unsuccessful Response Json Schema',
          type: 'object',
          required: ['statusCode', 'error', 'message'],
          properties: {
            statusCode: numberTypePattern(422),
            error: stringTypePattern('Unprocessable Entity'),
            message: stringTypePattern('EXPONEA LINK NOT AVAILABLE'),
          },
        }
        expect(error.response.body).toMatchSchema(
          exponeaLinkSchemaUnsuccessfulResponse
        )
      }
    })
  })
})
