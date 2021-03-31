import loginMocks from '../../mock-helpers/loginMockSetup'

const userDetails = {
  email: 'testymctest@arcadiagroup.co.uk',
  password: 'Monty123',
}
const number = Math.random()

const newUser = {
  email: `user-${number}@email.com`,
}

export default class Login extends loginMocks {
  get registerEmailInput() {
    return '.Register .Input-field-email'
  }
  get registerPasswordInput() {
    return '.Register .Input-field-password'
  }
  get registerPasswordConfirmInput() {
    return '.Register .Input-field-passwordConfirm'
  }
  get registerButton() {
    return '.Register-saveChanges'
  }
  get registerRememberMeCheckboxSpan() {
    return '.Register-form .FormComponent-rememberMeRegister .Checkbox-checkboxContainer'
  }
  get registerRememberMeCheckbox() {
    return '#rememberMeRegister-checkbox'
  }
  get loginEmailInput() {
    return '.Login .Input-field-email'
  }
  get loginPasswordInput() {
    return '.Login .Input-field-password'
  }
  get loginButton() {
    return '.Login-submitButton'
  }
  get loginRememberMeCheckbox() {
    return '#rememberMe-checkbox'
  }
  get loginRememberMeCheckboxSpan() {
    return '.Login-form .FormComponent-rememberMe .Checkbox-checkboxContainer'
  }
  get checkoutContainer() {
    return '.CheckoutContainer'
  }
  get resetPasswordButton() {
    return '.ForgetPassword-accordion'
  }
  get resetPasswordInput() {
    return '.ForgetPassword-form .Input-field-email'
  }
  get sendPasswordResetEmail() {
    return '.ForgetPassword-button'
  }
  get resetPasswordMessage() {
    return '.ForgetPassword-form #ForgetPassword-message'
  }

  /**
   * USER ACTIONS *************************************************************
   */
  registerAsNewUser() {
    return cy
      .get(this.registerEmailInput)
      .type(userDetails.email)
      .get(this.registerPasswordInput)
      .type(userDetails.password)
      .get(this.registerButton)
      .click()
  }

  loginAsExistingUser() {
    return cy
      .get(this.loginEmailInput)
      .type(userDetails.email)
      .get(this.loginPasswordInput)
      .type(userDetails.password)
      .get(this.loginButton)
      .click()
  }

  loginAsRememberedUser() {
    return cy
      .get(this.loginPasswordInput)
      .type(userDetails.password)
      .get(this.loginButton)
      .click({ force: true })
  }

  assertLoginFormValues({ email, password = '', rememberMeChecked = false }) {
    cy.get(this.loginEmailInput).should('have.value', email)
    cy.get(this.registerPasswordInput).should('have.value', password)
    cy.get(this.loginRememberMeCheckbox).should(
      rememberMeChecked ? 'be.checked' : 'not.be.checked'
    )
    return this
  }

  resetPasswordExisting() {
    return cy
      .get(this.resetPasswordInput)
      .type(userDetails.email)
      .get(this.sendPasswordResetEmail)
      .click()
  }

  resetPasswordNewUser() {
    return cy
      .get(this.resetPasswordInput)
      .type(newUser.email)
      .get(this.sendPasswordResetEmail)
      .click()
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }
}
