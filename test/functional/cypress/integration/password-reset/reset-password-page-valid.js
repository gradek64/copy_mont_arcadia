import PasswordReset from '../../page-objects/PasswordReset.page'
import Checkout from '../../page-objects/checkout/Checkout.page'
import { isMobileLayout } from '../../lib/helpers'

const checkout = new Checkout()
const passwordReset = new PasswordReset()

if (isMobileLayout()) {
  describe('Password Reset Page Valid Link', () => {
    it('should render reset password form', () => {
      passwordReset
        .mocksForAccountAndLogin({
          passwordResetLinkValidResponse:
            'fixture:my-account/password-reset-link-valid.json',
        })
        .visit()
      cy.get('.ResetPassword')
    })

    it('should redirect to my-account if no orderId is provided', () => {
      passwordReset
        .mocksForAccountAndLogin({
          resetPassword: 'fixture:resetPassword/existingUserProfile.json',
          passwordResetLinkValidResponse:
            'fixture:my-account/password-reset-link-valid.json',
        })
        .visit()
        .typeNewPassword()
        .saveNewPassword()
      cy.location('pathname').should('eq', '/my-account')
    })

    it('should redirect to checkout if an orderId is provided', () => {
      checkout.mocksForCheckout({
        getOrderSummary: 'fixture:resetPassword/existingUserOrderSummary.json',
        getAccount: 'fixture:resetPassword/existingUserProfile.json',
      })

      passwordReset
        .mocksForAccountAndLogin({
          setAuthStateCookie: 'yes',
          resetPassword: 'fixture:resetPassword/existingUserProfile.json',
          passwordResetLinkValidResponse:
            'fixture:my-account/password-reset-link-valid.json',
        })
        .visit(12345)
        .typeNewPassword()
        .saveNewPassword()
      cy.location('pathname').should('eq', '/checkout/delivery-payment')
    })
  })
}
