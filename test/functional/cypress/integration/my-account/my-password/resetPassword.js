import Login from '../../../page-objects/login/Login.page'
import passwordSuccess from '../../../fixtures/login/resetPassword--success.json'
import passwordFailure from '../../../fixtures/login/resetPassword--failure.json'
import { isMobileLayout } from '../../../lib/helpers'

const login = new Login()

if (isMobileLayout()) {
  describe('Password reset messaging', () => {
    it('should display correct message for valid reset password', () => {
      login.mocksForAccountAndLogin({
        resetPasswordLink: passwordSuccess,
      })

      cy.visit('/login')
        .get(login.resetPasswordButton)
        .should('be.visible')
        .get(login.resetPasswordButton)
        .click()

      login.resetPasswordExisting()

      cy.wait('@reset-password-link')
        .get(login.resetPasswordMessage)
        .should('be.visible')
        .should(
          'have.text',
          "Thanks! We've sent you an email. It should arrive in a couple of minutes - be sure to check your junk folder just in case. "
        )
    })

    it('should display correct message for invalid reset password attempt', () => {
      login.mocksForAccountAndLogin({
        resetPasswordLink: passwordFailure,
      })

      cy.visit('/login')
        .get(login.resetPasswordButton)
        .should('be.visible')
        .get(login.resetPasswordButton)
        .click()

      login.resetPasswordNewUser()

      cy.wait('@reset-password-link')
        .get(login.resetPasswordMessage)
        .should('be.visible')
        .should(
          'have.text',
          'If you have entered an email address that we recognise, you should receive a password reset email shortly. Any problems getting your email? Contact Us'
        )
    })
  })
}
