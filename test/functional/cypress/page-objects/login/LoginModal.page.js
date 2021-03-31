import loginMocks from '../../mock-helpers/loginMockSetup'

export default class LoginModal extends loginMocks {
  get dismissButton() {
    return '.Modal > .Modal-closeIcon > span'
  }

  get getLoginPasswordInput() {
    return '.Modal .Input-field-password'
  }

  get loginEmailInput() {
    return '#Login-email'
  }

  get submitButton() {
    return '.Modal .Login-submitButton'
  }

  get loginRememberMeCheckbox() {
    return '#rememberMe-checkbox'
  }

  get loginModalBody() {
    return '.Modal-children .SignIn'
  }

  /**
   * USER ACTIONS **************************************************************
   */

  clickDismissButton() {
    return cy.get(this.dismissButton).click({ force: true })
  }

  loginWithCredentials(email, password) {
    cy.get(this.loginEmailInput)
      .eq(0)
      .type(email)
      .get(this.getLoginPasswordInput)
      .eq(0)
      .type(password)
      .get(this.submitButton)
      .eq(0)
      .click()

    return this
  }

  assertLoginFormValues({ email, password = '', rememberMeChecked = false }) {
    cy.get(this.loginEmailInput).should('have.value', email)
    cy.get(this.getLoginPasswordInput).should('have.value', password)
    cy.get(this.loginRememberMeCheckbox).should(
      rememberMeChecked ? 'be.checked' : 'not.be.checked'
    )
  }

  assertVisible() {
    cy.get(this.loginModalBody).should('be.visible')
    return this
  }

  /**
   * MOCKS **************************************************************
   */

  setupMocksForAccountAndLogin(selectedEndpoints) {
    this.mocksForAccountAndLogin(selectedEndpoints)
    return this
  }
}
