import MyAccountStart from '../MyAccount.Page'

export default class MyDetails extends MyAccountStart {
  get allInputFields() {
    return '.MyAccount-form input'
  }

  get allSelectFields() {
    return '.MyAccount-form select'
  }

  get firstName() {
    return '.MyAccount-form input[id="firstName-text"]'
  }

  get lastName() {
    return '.MyAccount-form input[id="lastName-text"]'
  }

  get emailAddress() {
    return '.MyAccount-form input[id="email-email"]'
  }

  get saveChanges() {
    return 'button[class="Button CustomerShortProfile-saveChanges"]'
  }

  get firstNameError() {
    return '#firstName-error'
  }

  get lastNameError() {
    return '#lastName-error'
  }

  /**
   * ACTIONS  **************************************************************
   */

  clearFirstName() {
    cy.get(this.firstName)
      .clear()
      .focus()
    return this
  }

  typeFirstName(value) {
    cy.get(this.firstName)
      .clear()
      .type(value)
    return this
  }

  clearLastName() {
    cy.get(this.lastName).clear()
    return this
  }

  typeLastName(value) {
    cy.get(this.lastName)
      .clear()
      .type(value)
    return this
  }

  typeEmailAddress(value) {
    cy.get(this.emailAddress)
      .clear()
      .type(value)
    return this
  }

  clickSaveChanges() {
    cy.get(this.saveChanges).click()
    return this
  }

  clickOutSide() {
    cy.get('.AccountHeader-title').click()
    return this
  }

  /**
   * ASSERTS  **************************************************************
   */

  assertAllInputHasValuesGreaterThan(value = 1) {
    cy.get(this.allInputFields).each((input) => {
      expect(input.val().length).to.be.greaterThan(value)
    })
    return this
  }

  assertMessageIsSuccessful() {
    cy.get('.Message-message').contains(
      'Your profile details have been successfully updated.'
    )
    return this
  }

  assertFirstNameFailedRequiredValidation(message = 'This field is required') {
    cy.get(this.firstNameError)
      .should('be.visible')
      .contains(message)
    return this
  }

  assertLastNameFailedValidation(message = 'This field is required') {
    cy.get(this.lastNameError)
      .should('be.visible')
      .contains(message)
    return this
  }

  assertEmailNameFailedValidation(
    message = 'Please enter a valid email address.'
  ) {
    const el = cy.get('#email-error')
    el.should('be.visible')
    el.contains(message)
    return this
  }

  assertSpecialCharacterValidation(visibility, message) {
    cy.get(this.firstNameError)
      .should(visibility)
      .contains(message)
      .get(this.lastNameError)
      .should(visibility)
      .contains(message)
  }
}
