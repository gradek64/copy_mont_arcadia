import PasswordReset from '../../page-objects/PasswordReset.page'
import { isMobileLayout } from '../../lib/helpers'

const passwordReset = new PasswordReset()

if (isMobileLayout()) {
  describe('Password Reset Page Invalid Link', () => {
    it('should render expired reset password link form', () => {
      passwordReset
        .mockForInvalidResetPasswordLink({
          passwordResetLinkInvalidResponse:
            'fixture:my-account/password-reset-link-invalid.json',
        })
        .visit()
      cy.get('h2').should('have.text', 'Reset link expired or not valid')
    })

    it('should allow to request new email if link expired', () => {
      passwordReset
        .mocksForAccountAndLogin({
          resetPassword: 'fixture:resetPassword/existingUserProfile.json',
        })
        .mockForInvalidResetPasswordLink({
          passwordResetLinkInvalidResponse:
            'fixture:my-account/password-reset-link-invalid.json',
        })
        .visit()
        .typeEmailAddress()
        .requestPasswordResetEmail()
        .assertExpiredLinkResentMessageVisible()
      cy.location('pathname').should(
        'eq',
        '/webapp/wcs/stores/servlet/ResetPasswordLink'
      )
    })
  })
}
