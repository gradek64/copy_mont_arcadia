import qs from 'qs'
import loginMockHelpers from '../mock-helpers/loginMockSetup'

export default class PasswordReset extends loginMockHelpers {
  get passwordField() {
    return '#password-password'
  }

  get passwordConfirmField() {
    return '#passwordConfirm-password'
  }

  get savePasswordButton() {
    return '.ResetPassword-saveChanges'
  }

  get emailField() {
    return '#email-email'
  }

  get sendPasswordResetEmailButton() {
    return '.ForgetPassword-button'
  }

  visit(orderId, token = 'test@email.com') {
    const basePath = '/webapp/wcs/stores/servlet/ResetPasswordLink'
    let params = {
      storeId: 12345,
      token,
      hash: 'andjsbdfhjdfdsbhfjdsbfjkdhfjf',
    }

    if (orderId) {
      params = {
        ...params,
        orderId,
      }
    }

    const paramsString = qs.stringify(params)

    cy.visit(`${basePath}?${paramsString}`)

    return this
  }

  typeNewPassword() {
    cy.get(this.passwordField).type('Abcde123')

    return this
  }

  typeConfirmNewPassword() {
    cy.get(this.passwordConfirmField).type('abc123')

    return this
  }

  saveNewPassword() {
    cy.get(this.savePasswordButton).click()

    return this
  }

  typeEmailAddress() {
    cy.get(this.emailField).type('foo@bar.com')

    return this
  }

  requestPasswordResetEmail() {
    cy.get(this.sendPasswordResetEmailButton).click()

    return this
  }

  resendResetLink() {
    cy.get('.Accordion-title')
      .click()
      .get('.ForgetPassword-form #email-email')
      .click()
      .type('foo@bar.com')
      .get('.ForgetPassword-form > .Button')
      .click()
    return this
  }

  assertResentMessageVisible() {
    cy.get('.ForgetPassword-form > .Message > .Message-message').should(
      'be.visible'
    )
    return this
  }

  assertExpiredLinkResentMessageVisible() {
    cy.get('#ForgetPassword-message').should('be.visible')
    return this
  }
}
