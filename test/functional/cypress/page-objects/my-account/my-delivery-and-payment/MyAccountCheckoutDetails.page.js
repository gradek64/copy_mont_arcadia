import DeliveryPage from '../../checkout/Delivery.page'
import MyAccountStart from '../MyAccount.Page'

const delivery = new DeliveryPage()

const requiredFields = {
  addressLineOne: '€xord circus',
  addressLineTwo: '€âlrs court',
  userCity: 'L€ndon',
  userFirstName: 'ânt',
  userSurname: '€âvis',
}

export default class MyAccountCheckoutDetails extends MyAccountStart {
  get ddpSubscriptionContainer() {
    return '.DDPSubscription'
  }

  get ddpSubscriptionMessage() {
    return '.DDPSubscription-message'
  }

  get ddpSubscriptionCancel() {
    return 'a.DDPSubscription-cancel'
  }

  get ddpIcon() {
    return '.DDPSubscription-icon'
  }

  get ddpRenewLink() {
    return '.DDPSubscription-renewButton'
  }

  get changePaymentMethodLink() {
    return '.PaymentMethodPreviewV1-button'
  }

  selectPaymentMethodLink(index) {
    return `.PaymentOption:nth-child(${index})`
  }

  get savePaymentChangesLink() {
    return 'button.PaymentContainer-paynow'
  }

  get visaPaymentField() {
    return '.CardPaymentMethod .Input-field-cardNumber'
  }

  get saveDetailsBtn() {
    return '.MyCheckoutDetails > .Button'
  }

  get changeBillingDetailsBtn() {
    return '.AddressPreview .AddressPreview-button'
  }

  get myAccountCheckoutMessage() {
    return '.MyCheckoutDetails-message .Message-message'
  }

  get clearAddress() {
    return '.ManualAddress-link'
  }

  get postcodeInput() {
    return '.Input-field-postcode'
  }

  get findAddressBtn() {
    return '.ButtonContainer > .Button'
  }

  get billingPreviewAddressLine1() {
    return '.AddressPreview-detailsDescription'
  }

  get deliveryPreviewAddressLine1() {
    return '.AddressPreview-details > :nth-child(2) > .AddressPreview-detailsDescription'
  }
  get allInputsAddressBilling() {
    return '.MyCheckoutDetails-address .Input-container > input'
  }

  get enterAddressManually() {
    return '.FindAddressV1-link'
  }

  get billingFirstName() {
    return '.AddressFormDetails--billingMCD input[id="firstName-text"]'
  }

  get billingLastName() {
    return '.AddressFormDetails--billingMCD input[id="lastName-text"]'
  }

  get addressLineInput() {
    return '.MyCheckoutDetails-addressItem .FormComponent-address1 #address1-text'
  }

  get addressLineTwoInput() {
    return '.MyCheckoutDetails-addressItem .FormComponent-address2 #address2-text'
  }

  get cityInput() {
    return '#city-text'
  }

  get deliveryFirstName() {
    return '.AddressFormDetails--deliveryMCD input[id="firstName-text"]'
  }
  get deliveryPhone() {
    return '.AddressFormDetails--deliveryMCD .Input-field-telephone'
  }

  get deliveryLastName() {
    return '.AddressFormDetails--deliveryMCD input[id="lastName-text"]'
  }

  get cityDeliveryInput() {
    return '.MyCheckoutDetails-addressItem  .Input-field[name="city"]'
  }

  get clearBillingForm() {
    return '.MyCheckoutDetails-addressItem .ManualAddress-link'
  }

  get firstNameBillingError() {
    return '.AddressFormDetails--billingMCD #firstName-error'
  }

  get firstNameDeliveryError() {
    return '.AddressFormDetails--deliveryMCD #firstName-error'
  }

  get addressLineInputError() {
    return '.MyCheckoutDetails-addressItem .FormComponent-address1 #address1-error'
  }

  get addressLineTwoInputError() {
    return '.MyCheckoutDetails-addressItem .FormComponent-address2 #address2-error'
  }

  get cityDeliveryInputError() {
    return '.MyCheckoutDetails-addressItem  #city-error'
  }

  /**
   * USER ACTIONS **************************************************************
   */

  clearSpecialChars() {
    cy.get(this.clearBillingForm)
      .eq(0)
      .click()
      .get(this.clearBillingForm)
      .eq(1)
      .click()
      .get(this.billingFirstName)
      .clear()
      .get(this.billingLastName)
      .clear()
      .get(this.deliveryFirstName)
      .clear()
      .get(this.deliveryLastName)
      .clear()
    return this
  }

  enterDetailsSpecialChar() {
    cy.get(this.billingFirstName)
      .type(requiredFields.userFirstName)
      .get(this.billingLastName)
      .type(requiredFields.userSurname)
      .get(this.addressLineInput)
      .eq(0)
      .type(requiredFields.addressLineOne)
      .get(this.addressLineTwoInput)
      .eq(0)
      .type(requiredFields.addressLineTwo)
      .get(this.cityInput)
      .eq(0)
      .type(requiredFields.userCity)
      .get(this.deliveryFirstName)
      .type(requiredFields.userFirstName)
      .get(this.deliveryLastName)
      .type(requiredFields.userSurname)
      .get(this.addressLineInput)
      .eq(1)
      .type(requiredFields.addressLineOne)
      .get(this.addressLineTwoInput)
      .eq(1)
      .type(requiredFields.addressLineTwo)
      .get(this.cityDeliveryInput)
      .eq(1)
      .type(requiredFields.userCity)
      .get(this.deliveryPhone)
      .click()
    return this
  }

  clickDdpRenewalLink() {
    cy.get(this.ddpRenewLink)
      .invoke('removeAttr', 'target')
      .click({ timeout: 10000 })
    return this
  }

  clickChangePaymentMethod() {
    cy.get(this.changePaymentMethodLink).click()
    return this
  }

  selectPaymentMethod(index) {
    cy.get(this.selectPaymentMethodLink(index)).click()
    return this
  }

  clickSavePaymentChanges() {
    cy.get(this.savePaymentChangesLink).click()
    return this
  }

  addCardNumber() {
    cy.get(this.visaPaymentField).type('4444333322221111')
    return this
  }

  saveDetails() {
    cy.get(this.saveDetailsBtn).click()
    return this
  }

  changeBillingDetails() {
    return cy
      .get(this.changeBillingDetailsBtn)
      .first()
      .click()
  }

  typeBillingFirstName(value) {
    cy.get(this.billingFirstName)
      .clear()
      .type(value)
    return this
  }

  typeBillingLastName(value) {
    cy.get(this.billingLastName)
      .clear()
      .type(value)
    return this
  }

  typeDeliveryLastName(value) {
    cy.get(this.deliveryLastName)
      .clear()
      .type(value)
    return this
  }

  clickBillingFirstName() {
    cy.get(this.billingFirstName).click()
    return this
  }

  clickBillingLastName() {
    cy.get(this.billingLastName).click()
    return this
  }

  clickDeliveryFirstName() {
    cy.get(this.deliveryFirstName).click()
    return this
  }

  changeDeliveryDetails() {
    cy.get(this.changeBillingDetailsBtn)
      .last()
      .click()
    return this
  }

  findAddress() {
    cy.get(this.clearAddress)
      .last()
      .click()
      .get(this.postcodeInput)
      .last()
      .type('W1T3NL')
      .get(this.findAddressBtn)
      .last()
      .click()

    return this
  }

  changeAddressDetails(condition) {
    switch (condition) {
      case 'billing':
        this.changeBillingDetails()
        delivery.myAccountEnterBillingDetails()
        delivery.myAccountEnterBillingAddressManually()
        this.addCardNumber()
        break

      default:
      case 'delivery':
        this.changeDeliveryDetails()
        delivery.myAccountEnterDeliveryDetails()
        delivery.myAccountEnterDeliveryAddressManually()
        this.addCardNumber()
        break
    }
    return this.saveDetails()
  }

  /**
   * ASSERTIONS  **************************************************************
   */

  assertBillingPreviewAddressLine1(line1) {
    cy.get(this.billingPreviewAddressLine1).contains(line1)
    return this
  }

  assertDeliveryPreviewAddressLine1(line1) {
    cy.get(this.deliveryPreviewAddressLine1).contains(line1)
    return this
  }

  assertSavedChangesMessage() {
    cy.get(this.myAccountCheckoutMessage)
      .should('be.visible')
      .and('have.text', 'Your changes have been saved')
  }

  assertUrlIsOnPage(url, condition = 'include') {
    cy.url().should(condition, url)
    return this
  }

  assertBillingAddressFormValuesGreaterThan(length) {
    cy.get(this.allInputsAddressBilling).each((input) => {
      expect(input.val().length).greaterThan(length)
    })
    return this
  }

  assertFirstNameFailedValidation(form, message = 'This field is required') {
    const el = cy.get(`.AddressFormDetails--${form} #firstName-error`)
    el.should('be.visible')
    el.contains(message)
    return this
  }

  assertLastNameFailedValidation(form, message = 'This field is required') {
    const el = cy.get(`.AddressFormDetails--${form} #lastName-error`)
    el.should('be.visible')
    el.contains(message)
    return this
  }

  assertDdpSubscriptionElementsVisible(message) {
    cy.get(this.ddpSubscriptionContainer)
      .should('be.visible')
      .get(this.ddpSubscriptionMessage)
      .should('be.visible')
      .should('contain', message)
      .get(this.ddpIcon)
      .should('be.visible')
      .get(this.ddpRenewLink)
      .should('be.visible')
    return this
  }
  assertDdpSubscriptionCancel(visibility = 'be.visible') {
    cy.get(this.ddpSubscriptionCancel).should(visibility)
    return this
  }

  assertDdpRenewalLink() {
    cy.get(this.ddpRenewLink).should('be.visible')
    return this
  }

  assertSpecialCharacterValidation(visibility, message) {
    cy.get(this.firstNameBillingError)
      .should(visibility)
      .contains(message)
      .get(this.firstNameDeliveryError)
      .should(visibility)
      .contains(message)
      .get(this.addressLineInputError)
      .eq(0)
      .should(visibility)
      .contains(message)
      .get(this.addressLineTwoInputError)
      .eq(0)
      .should(visibility)
      .contains(message)
      .get(this.addressLineInputError)
      .eq(1)
      .should(visibility)
      .contains(message)
      .get(this.addressLineTwoInputError)
      .eq(1)
      .should(visibility)
      .contains(message)
      .get(this.cityDeliveryInputError)
      .eq(0)
      .should(visibility)
      .contains(message)
      .get(this.cityDeliveryInputError)
      .eq(1)
      .should(visibility)
      .contains(message)
  }
}
