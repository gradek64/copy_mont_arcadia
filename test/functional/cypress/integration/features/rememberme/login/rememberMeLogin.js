import { setFeature, isMobileLayout } from '../../../../lib/helpers'
import Login from '../../../../page-objects/login/Login.page'

const login = new Login()

if (isMobileLayout()) {
  describe('Remember Me - Login', () => {
    it("Allows a returning user to opt in to 'Remember Me'", () => {
      // The 'Remember Me' checkbox is available in the login page and not ticked
      cy.visit('/login')

      // Enable 'Remember Me'
      setFeature('FEATURE_REMEMBER_ME')

      cy.get(login.loginRememberMeCheckbox)
        .should('be.visible')
        .should('not.be.checked')

      cy.get(login.loginRememberMeCheckboxSpan).click()

      cy.get(login.loginRememberMeCheckbox).should('be.checked')

      login.mocksForAccountAndLogin({
        login: 'fixture:login/newUserCheckoutProfile--emptyBag.json',
        getItems: '{}',
      })

      // Login
      login.loginAsExistingUser()

      // User is taken to the their account page
      cy.url().should('match', /\/my-account$/)
    })
  })
}
