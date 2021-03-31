// to do
import {
  createAccountResponse,
  getUserAccountResponse,
  logInResponse,
  logOut,
  changePasswordResponse,
  forgottenPasswordResponse,
  resetPasswordLinkResponse,
  updateAccountShortProfileResponse,
  updateCheckoutDetailsResponse,
  getPreferencesLink,
} from './../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import {
  getJessionIdFromResponse,
  getResponseAndSessionCookies,
} from '../utilis/redis'
import { creditCardSchema } from './my-account-schemas'
import { addItemToShoppingBagResponse } from '../utilis/shoppingBag'
import { payOrder } from '../utilis/payOrder'

describe('It should return the My Account Json Schema', () => {
  let products

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  describe('My Account Full Profile', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccountResponse = await createAccountResponse()
        const jsessionid = await getJessionIdFromResponse(newAccountResponse)
        const shoppingBagResponse = await addItemToShoppingBagResponse(
          jsessionid,
          products.productsSimpleId
        )
        try {
          await payOrder(jsessionid, shoppingBagResponse.body.orderId)
        } catch (e) {
          global.console.log('Error Paying for order', e)
        }
        const userAccountResponse = await getUserAccountResponse(jsessionid)
        const { responseCookies, session } = await getResponseAndSessionCookies(
          userAccountResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  describe('My Account Partial Profile', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccount = await createAccountResponse()
        const { responseCookies, session } = await getResponseAndSessionCookies(
          newAccount
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  describe('My Account Change Password', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccountResponse = await createAccountResponse()
        const jsessionid = await getJessionIdFromResponse(newAccountResponse)
        const updatedPassword = await changePasswordResponse(
          jsessionid,
          newAccountResponse.body.email
        )
        await logOut()
        const userLoginResponse = await logInResponse({
          username: newAccountResponse.body.email,
          password: updatedPassword.newPassword,
        })
        const { responseCookies, session } = await getResponseAndSessionCookies(
          userLoginResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  describe('My Account Forgotten/Reset Password Json Schema', () => {
    let emailAddress

    beforeAll(async () => {
      const newAccount = await createAccountResponse()
      emailAddress = newAccount.body.email
    })

    describe('forgotten password success', () => {
      it(
        'should keep client cookies and redis in sync',
        async () => {
          await logOut()
          const passwordForgotten = await forgottenPasswordResponse(
            emailAddress
          )
          const {
            responseCookies,
            session,
          } = await getResponseAndSessionCookies(passwordForgotten)
          expect(responseCookies).toMatchSession(session)
        },
        60000
      )
    })
    describe('Reset Password link', () => {
      describe('success', () => {
        it(
          'should keep client cookies and redis in sync',
          async () => {
            const passwordReset = await resetPasswordLinkResponse(emailAddress)
            const {
              responseCookies,
              session,
            } = await getResponseAndSessionCookies(passwordReset)
            expect(responseCookies).toMatchSession(session)
          },
          60000
        )
      })
    })
  })
  describe('My Account Short Profile Update Json Schema', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccount = await createAccountResponse()
        const jsessionid = await getJessionIdFromResponse(newAccount)
        const shortProfileResponse = await updateAccountShortProfileResponse(
          jsessionid
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          shortProfileResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  describe('My Account Update My Checkout Details', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccount = await createAccountResponse()
        const jsessionid = await getJessionIdFromResponse(newAccount)
        const shoppingBag = await addItemToShoppingBagResponse(
          jsessionid,
          products.productsSimpleId
        )
        await payOrder(jsessionid, shoppingBag.body.orderId)
        const checkoutProfileResponse = await updateCheckoutDetailsResponse(
          jsessionid,
          'VISA',
          '1111222233334444'
        )
        const updatedAccount = await getUserAccountResponse(jsessionid)
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updatedAccount
        )
        expect(responseCookies).toMatchSession(session)

        // Check visa is credit card
        expect(checkoutProfileResponse.body.creditCard).toMatchSchema(
          creditCardSchema
        )
        expect(
          checkoutProfileResponse.body.creditCard.expiryMonth
        ).toHaveLength(2)
        expect(checkoutProfileResponse.body.creditCard.expiryYear).toHaveLength(
          4
        )
        expect(
          checkoutProfileResponse.body.creditCard.cardNumberStar
        ).toContain('*4444')
      },
      60000
    )
  })
  describe('My Account Partial Profile on Native App', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        let newAccount
        try {
          newAccount = await createAccountResponse({ deviceType: 'apps' })
        } catch (e) {
          newAccount = e.response.statusCode
        }
        const { responseCookies, session } = await getResponseAndSessionCookies(
          newAccount
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  describe('My Preferences - Exponea', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccount = await createAccountResponse()
        const expId = newAccount.body.expId2
        try {
          const exponeaPreferencesLink = await getPreferencesLink(expId)
          const {
            responseCookies,
            session,
          } = await getResponseAndSessionCookies(exponeaPreferencesLink)
          expect(responseCookies).toMatchSession(session)
        } catch (error) {
          // error not used
        }
      },
      60000
    )
  })
})
