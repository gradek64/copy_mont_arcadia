import CheckoutHeader from './Checkout.page'
import { isMobileLayout, setFutureExpiryYear } from '../../lib/helpers'
import { visaCardPaymentDetails } from '../../constants/paymentDetails'

export default class DeliveryPayment extends CheckoutHeader {
  get cvvInput() {
    return 'input[name="cvv"]'
  }
  get expiryMonth() {
    return '#expiryMonth.Select-select'
  }
  get expiryYear() {
    return '#expiryYear'
  }
  get orderAndPayButton() {
    return 'button.Button.PaymentBtnWithTC-paynow'
  }
  get paymentErrorMessage() {
    return '.Message.is-shown.is-error .Message-message'
  }

  get expiryCardErrorMessage() {
    return '.PaymentDetails-previewCardError'
  }

  get inputValidationMessage() {
    return '.Input-validationMessage'
  }

  get cardsInputField() {
    return '#cardNumber-tel'
  }

  get continueShoppingButton() {
    return isMobileLayout()
      ? '.Header button[title=Home]'
      : '.Header-continueShopping'
  }

  get addNewAddress() {
    return '.AddressBook-addNewBtn'
  }

  get changeCardDetails() {
    return '.PaymentMethodPreview-button'
  }

  get changePaymentMethodBtn() {
    return '.PaymentMethodPreview-col > .Button'
  }
  get promoExpander() {
    return '.CheckoutContentContainer-content .PromotionCode-headerContainer'
  }
  get deliveryMethod() {
    return '.DeliveryMethods .DeliveryMethod'
  }

  get mobileOrderSummaryButton() {
    return '.QuickViewOrderSummary-button'
  }

  get accountcardPaymentOption() {
    return 'input[value="ACCNT"]'
  }

  get paypalPaymentOption() {
    return '.PaymentDetails > :nth-child(5)'
  }

  get KlarnaPaymentOption() {
    return '.PaymentDetails > :nth-child(7)'
  }

  get KlarnaPaymentOptionNewUser() {
    return '.PaymentDetails > :nth-child(6)'
  }

  get klarnaForm() {
    return '#klarna-klarna-payments-instance-main'
  }

  get deliveryOptions() {
    return '.DeliveryOptions .DeliveryOption'
  }

  get promotionCodes() {
    return '.PromotionCode > .Accordion-header'
  }

  get giftCards() {
    return '.GiftCards-accordion > .Accordion-header'
  }

  get giftCardsNumberInput() {
    return '#giftCardNumber-text.Input-field-giftCardNumber'
  }

  get paymentDetails() {
    return '.PaymentDetails'
  }

  get firstNameErrorMessage() {
    return '.Input-field-firstName > .Input-head > span'
  }

  clickAddNewAddress() {
    cy.get(this.addNewAddress).click()
    return this
  }

  get addressBookItemList() {
    return '.AddressBookList-itemDetails'
  }
  /**
   * USER ACTIONS ************************************************************
   */

  clickContinueShopping() {
    cy.get(this.continueShoppingButton).click()
    return this
  }
  clickChangeCardDetails() {
    cy.get(this.changeCardDetails).click()
    return this
  }

  payAsReturningUser() {
    cy.get(this.cvvInput)
      .type(visaCardPaymentDetails.cvvNumber)
      .get(this.orderAndPayButton)
      .click()
    return this
  }

  payWithCard(cardDetails) {
    return cy
      .get(this.cardsInputField)
      .type(cardDetails.cardNumber)
      .get(this.expiryMonth)
      .select(cardDetails.expiryMonth)
      .get(this.expiryYear)
      .select(setFutureExpiryYear())
      .get(this.cvvInput)
      .type(cardDetails.cvvNumber)
      .click()
      .get(this.orderAndPayButton)
      .click()
  }

  validateFirstFormField() {
    return cy
      .get(this.inputValidationMessage)
      .first()
      .should('have.text', 'This field is required')
  }

  payWithVisa() {
    return cy
      .get(this.cardsInputField)
      .type(visaCardPaymentDetails.cardNumber)
      .get(this.cvvInput)
      .type(visaCardPaymentDetails.cvvNumber)
      .get(this.termsAndConditionsCheckboxSpan)
      .click()
      .get(this.orderAndPayButton)
      .click()
  }

  payWithPaypal() {
    return cy
      .get(this.paypalPaymentOption)
      .click()
      .get(this.orderAndPayButton)
      .click()
  }

  payWithKlarna() {
    return cy.get(this.KlarnaPaymentOption).click()
  }
  payWithKlarnaNewUser() {
    return cy.get(this.KlarnaPaymentOptionNewUser).click()
  }

  changePaymentMethodFromKlarna() {
    cy.get('.PaymentDetails > :nth-child(2)').click()
  }

  pay() {
    return cy.get(this.orderAndPayButton).click()
  }

  selectAccountcardPaymentOption() {
    return cy.get(this.accountcardPaymentOption).click({ force: true })
  }

  changePaymentMethod() {
    return cy.get(this.changePaymentMethodBtn).click()
  }

  expandPromoCode() {
    return cy.get(this.promoExpander).click()
  }

  selectDeliveryMethodAtIndex(index) {
    return cy
      .get(this.deliveryMethod)
      .eq(index)
      .click()
  }

  clickMobileOrderSummaryButton() {
    if (isMobileLayout()) {
      cy.get(this.mobileOrderSummaryButton).click()
    }
    return this
  }

  wait(alias) {
    cy.wait(alias)
    return this
  }

  removeDeliveryAddress() {
    cy.get(this.removeDeliveryAdressLink).click()
    return this
  }

  /**
   * ASSERTIONS ************************************************************
   */

  assertDeliveryMethodSelectedIndex(index) {
    cy.get(this.deliveryOptions).should('be.visible')
    cy.get(this.deliveryMethod)
      .eq(index)
      .find('input')
      .should('be.checked')
    return this
  }

  assertDeliveryDetails(delAddress) {
    cy.get(this.addressBookItem)
      .should('be.visible')
      .eq(0)
      .find('input')
      .should('be.checked')
    cy.get(this.addressBookItemList).should('contain', delAddress)
    return this
  }

  assertTenderTypes() {
    cy.get(this.promotionCodes).should('be.visible')
    cy.get(this.giftCards).should('be.visible')
    cy.get(this.paymentDetails).should('be.visible')
    cy.get(this.orderAndPayButton).should('be.visible')
    return this
  }

  assertDeliveryAddressRemoved() {
    cy.get(this.removeDeliveryAdressLink).should('not.exist')
    cy.get(this.addressBookItem).should('have.length', 1)
    return this
  }

  assertPaymentErrorMessage() {
    cy.get(this.paymentErrorMessage)
      .should('be.visible')
      .should(
        'have.text',
        'Your payment cannot be accepted at this time. Please try again later.'
      )
    return this
  }

  assertExpiryCardErrorMessage() {
    cy.get(this.expiryCardErrorMessage)
      .should('be.visible')
      .should(
        'have.text',
        'Card expired. Try a different card or payment method.'
      )
    return this
  }

  assertCVVField() {
    cy.get(this.cvvInput).should('not.exist')
    return this
  }

  assertOrderAndPayButton(state) {
    const predicate = state === 'disabled' ? 'to.have.attr' : 'not.have.attr'

    cy.get(this.orderAndPayButton).should(predicate, 'disabled')
    return this
  }

  assertEmptyExpiryMonthAndYear() {
    cy.get(this.expiryMonth).should('have.value', null)
    cy.get(this.expiryYear).should('have.value', null)
    return this
  }

  checkInputValidationMessage(index, message) {
    cy.get(this.inputValidationMessage)
      .eq(index)
      .should('have.text', message)
    return this
  }
}
