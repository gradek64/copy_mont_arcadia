export default class PromoCode {
  get promoCodeInput() {
    return '#promotionCode-text'
  }
  get promoCodeApplyButton() {
    return '.PromotionCode-form > .Button'
  }
  get promoCodeHeader() {
    return '.PromotionCode-header'
  }
  get promoCodeTitle() {
    return '.PromotionCode-codeTitle'
  }
  get promoCodeErrorMessage() {
    return '.Message.is-shown.is-error.PromotionCode-message'
  }
  get promoCodeConfirmation() {
    return '.PromotionCode-codeConfirmation'
  }
  get promoCodeAddAnother() {
    return '.PromotionCode-addText'
  }
  get promoCodeRemoveButton() {
    return '.PromotionCode-removeText'
  }
  get promoList() {
    return '.PromotionCode-list'
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }
  /**
   * USER ACTIONS **************************************************************
   */

  typePromoCodeAndApply(code) {
    cy.get(this.promoCodeInput)
      .type(code)
      .get(this.promoCodeApplyButton)
      .click()
    return this
  }

  enterPromoCodeAndApply(code) {
    cy.get(this.promoCodeHeader)
      .click()
      .get(this.promoCodeInput)
      .type(code)
      .get(this.promoCodeApplyButton)
      .click()
    return this
  }

  enterAnotherPromoCodeAndApply(code) {
    cy.get(this.promoCodeAddAnother)
      .click()
      .get(this.promoCodeInput)
      .type(code)
      .get(this.promoCodeApplyButton)
      .click()
    return this
  }

  verifyPromoCodeApplied(code) {
    return cy.get(this.promoCodeTitle).should('contain', code)
  }

  verifyNoPromoCodes() {
    return cy
      .get(this.promoList)
      .find('.PromotionCode-code')
      .should('have.length', 0)
  }

  verifyPromoCodeErrorDisplayed() {
    return cy
      .get(this.promoCodeErrorMessage)
      .should('contain', 'The code you have entered has not been recognised.')
  }

  removePromoCodeAtIndex(index) {
    cy.get(this.promoCodeRemoveButton)
      .eq(index)
      .click()
    return this
  }
}
