import { setFeature, isMobileLayout } from '../../../../lib/helpers'
import Login from '../../../../page-objects/login/Login.page'

const login = new Login()

if (isMobileLayout()) {
  describe('Remember Me - register', () => {
    it("Allows a new user to opt in to 'Remember Me'", () => {
      cy.clearCookie('authenticated')
      // The 'Remember Me' checkbox is available in the login page and not ticked
      cy.visit('/login')

      // Enable 'Remember Me'
      setFeature('FEATURE_REMEMBER_ME')

      cy.get(login.registerRememberMeCheckbox)
        .should('be.visible')
        .should('not.be.checked')

      cy.get(login.registerRememberMeCheckboxSpan).click()

      cy.get(login.registerRememberMeCheckbox).should('be.checked')

      login.mocksForAccountAndLogin({
        register: 'fixture:login/newUserCheckoutProfile--emptyBag.json',
      })

      // Login
      login.registerAsNewUser()

      // User is taken to the their account page
      cy.url().should('match', /\/my-account/)
    })
  })
}
