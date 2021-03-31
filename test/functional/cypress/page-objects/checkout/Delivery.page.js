import CheckoutHeader from './Checkout.page'
import { isMobileLayout, isDesktopLayout, ifFeature } from '../../lib/helpers'

const personalDetails = {
  userFirstName: 'I Love',
  userSurname: 'Shopping',
  userPhoneNumber: '0987654321',
  title: 'Dr',
}

const deliveryAddressDetails = {
  ukPostCode: 'W1T 3NL',
  usPostCode: '90210',
  userCity: 'London',
  addressLineOne: 'Sesame Street',
  country: 'United Kingdom',
}

const requiredFields = {
  addressLineOne: '€xord circus',
  addressLineTwo: '€âlrs court',
  userCity: 'L€ndon',
  userFirstName: 'ânt',
  userSurname: '€âvis',
}

export default class Delivery extends CheckoutHeader {
  get storeListFilterOptions() {
    return {
      TOPSHOP_STORES: 'Topshop stores',
      PARCELSHOPS: 'ParcelShops',
      OTHER_STORES: 'Other stores',
    }
  }

  get firstNameInput() {
    return '.Input-field.Input-field-firstName'
  }
  get surnameInput() {
    return '.Input-field.Input-field-lastName'
  }
  get phoneNumberInput() {
    return '.Input-field.Input-field-telephone'
  }
  get enterAddressManually() {
    return '.FindAddressV1-link'
  }
  get addressLineOneInput() {
    return '[name=address1]'
  }
  get addressLineTwoInput() {
    return '[name=address2]'
  }
  get postCodeManualInput() {
    return '.ManualAddress .Input-field.Input-field-postcode'
  }
  get postCodeFindAddressInput() {
    return '.FindAddressV1-form .Input-field.Input-field-postcode '
  }
  get houseNumberFindAddress() {
    return '.FindAddressV1-form .Input-field.Input-field-houseNumber'
  }
  get findAddressButton() {
    return '.FindAddressV1-cta'
  }
  get errorMessageFindAddress() {
    return '.FindAddressV1-form .Message-message'
  }
  get cityManualInput() {
    return '.Input-field[name="city"]'
  }
  get proceedToPaymentButton() {
    if (isMobileLayout()) {
      return '.DeliveryCTAProceed-nextButton'
    }
    return '.DeliveryCTAProceed-nextButton--desktop'
  }

  get deliveryTypesChangeButton() {
    return '.Accordion-statusIndicatorText'
  }

  get countryDropdown() {
    return '.Select-select[name="country"]'
  }
  get selectedCountryOption() {
    return `${this.countryDropdown} option:checked`
  }

  get deliveryInstructionsField() {
    return '#deliveryInstructions-text'
  }

  get smsMobileNumber() {
    return '#smsMobileNumber-tel'
  }

  get proceedButton() {
    return '.DeliveryCTAProceed-nextButtonContainer > .Button'
  }

  get firstNameError() {
    return '#firstName-error'
  }

  get lastNameError() {
    return '#lastName-error'
  }

  get firstAdressError() {
    return '#address1-error'
  }

  get addressTwoError() {
    return '#address2-error'
  }

  get telephoneError() {
    return '#telephone-error'
  }

  get postcodeError() {
    return '#postcode-error'
  }

  get cityError() {
    return '#city-error'
  }

  get collectFromStoreOption() {
    return '.DeliveryOption--store'
  }

  get collectFromParcelShop() {
    return '.DeliveryOption--parcelshop'
  }

  // below my account getters

  get myAccountBillingEnterAddressManuallyClearField() {
    return '.ManualAddress-link--left'
  }

  get myAccountBillingEnterAddress1() {
    return '.ManualAddress .Input-field-address1'
  }

  get myAccountBillingEnterPostcode() {
    return '.ManualAddress .Input-field-postcode'
  }

  get myAccountBillingEnterCity() {
    return '.ManualAddress .Input-field-city'
  }

  // shipping redirect modal getters:

  get shippingRedirectModal() {
    return '.ShippingRedirectModal'
  }

  get languageOptionButtons() {
    return '.ShippingRedirectModal-button'
  }

  get languageOptionSelect() {
    return '.ShippingRedirectModal-languages .Select-select'
  }

  get languageOptionSelectOptions() {
    return '.ShippingRedirectModal-languages .Select-select--option'
  }

  get cancelRedirectButton() {
    return '.ShippingRedirectModal-cancel'
  }

  get continueButtonText() {
    return 'Continue'
  }

  get deliveryLastName() {
    return '.DeliveryDetailsForm input[id="lastName-text"]'
  }

  get deliveryFirstName() {
    return '.DeliveryDetailsForm input[id="firstName-text"]'
  }

  get deliveryDetailForm() {
    return '.DeliveryDetailsForm'
  }

  get deliveryOption() {
    return '.DeliveryOption.DeliveryOption--'
  }

  get goButton() {
    return 'Button.UserLocator-goButton'
  }

  get changeStore() {
    return '.StoreDeliveryV2-changeStoreCTA'
  }

  get collectFromStoreListing() {
    return isMobileLayout()
      ? '.StoreLocator-resultsContainer'
      : '.CollectFromStore-storeList'
  }

  get modalTitle() {
    return '.CollectFromStore-title'
  }

  get googleMaps() {
    return '.GoogleMap--staticMap'
  }

  get storeListFilters() {
    return isMobileLayout()
      ? '.StoreLocator-footerText'
      : '.StoreLocatorFilters'
  }

  get closeButtonForFilterModal() {
    return '.Modal-closeIcon'
  }

  get firstStoreSelectButton() {
    return `${this.collectFromStoreListing}:first-child button.Button`
  }

  get ddpRenewalComponent() {
    return '.DDPRenewal'
  }

  get ddpAddedComponent() {
    return '.DDPAdded'
  }

  get ddpRenewalCTA() {
    return '.DDPRenewal-button'
  }

  get ddpMessages() {
    return '.DDPRenewal-messageContainer'
  }

  getDdpEspot = (identifier) => {
    return `div[data-espot="${identifier}"]`
  }

  get deliveryOptionsAccordion() {
    return '.Accordion.DeliveryOptionsAccordion'
  }

  /**
   *
   * @param {'Topshop stores' | 'ParcelShops' | 'Other stores'} targetCheckbox
   * @returns {string}
   */
  storeListFilterCheckbox(targetCheckbox) {
    return `.Checkbox-checkboxContainer input[name="${targetCheckbox}"]`
  }

  /**
   * USER ACTIONS ************************************************************
   */

  enterDeliveryDetailsManually() {
    cy.get(this.enterAddressManually)
      .click()
      .get(this.firstNameInput)
      .clear()
      .type(personalDetails.userFirstName)
      .get(this.surnameInput)
      .clear()
      .type(personalDetails.userSurname)
      .get(this.phoneNumberInput)
      .clear()
      .type(personalDetails.userPhoneNumber)
      .get(this.addressLineOneInput)
      .clear()
      .type(deliveryAddressDetails.addressLineOne)
      .get(this.postCodeManualInput)
      .clear()
      .type(deliveryAddressDetails.ukPostCode)
      .get(this.cityManualInput)
      .clear()
      .type(deliveryAddressDetails.userCity)
      .get(this.proceedToPaymentButton)
      .click()
    return this
  }

  enterDeliveryDetailsSpecialChar() {
    cy.get(this.enterAddressManually)
      .click()
      .get(this.firstNameInput)
      .clear()
      .type(requiredFields.userFirstName)
      .get(this.surnameInput)
      .clear()
      .type(requiredFields.userSurname)
      .get(this.phoneNumberInput)
      .clear()
      .type(personalDetails.userPhoneNumber)
      .get(this.addressLineOneInput)
      .clear()
      .type(requiredFields.addressLineOne)
      .get(this.addressLineTwoInput)
      .clear()
      .type(requiredFields.addressLineTwo)
      .get(this.postCodeManualInput)
      .clear()
      .type(deliveryAddressDetails.ukPostCode)
      .get(this.cityManualInput)
      .clear()
      .type(requiredFields.userCity)
      .get(this.proceedToPaymentButton)
      .click()
    return this
  }

  enterDeliveryDetailsFindAddress(country) {
    return cy
      .get(this.firstNameInput)
      .type(personalDetails.userFirstName)
      .get(this.surnameInput)
      .type(personalDetails.userSurname)
      .get(this.postCodeFindAddressInput)
      .type(deliveryAddressDetails.ukPostCode)
      .get(this.houseNumberFindAddress)
      .type(deliveryAddressDetails.userCity)
      .get(this.countryDropdown)
      .select(country)
  }

  myAccountEnterBillingDetails() {
    return cy
      .get(this.firstNameInput)
      .first()
      .clear()
      .type(personalDetails.userFirstName)
      .get(this.surnameInput)
      .first()
      .clear()
      .type(personalDetails.userSurname)
      .get(this.phoneNumberInput)
      .first()
      .clear()
      .type(personalDetails.userPhoneNumber)
  }

  myAccountEnterDeliveryDetails() {
    return cy
      .get(this.firstNameInput)
      .last()
      .clear()
      .type(personalDetails.userFirstName)
      .get(this.surnameInput)
      .last()
      .clear()
      .type(personalDetails.userSurname)
      .get(this.phoneNumberInput)
      .last()
      .clear()
      .type(personalDetails.userPhoneNumber)
  }

  myAccountEnterBillingAddressManually() {
    return cy
      .get(this.myAccountBillingEnterAddressManuallyClearField)
      .first()
      .click()
      .get(this.myAccountBillingEnterAddress1)
      .first()
      .type('hello')
      .get(this.myAccountBillingEnterPostcode)
      .first()
      .type('W1G 9XX')
      .get(this.myAccountBillingEnterCity)
      .first()
      .type('London')
  }

  myAccountEnterDeliveryAddressManually() {
    return cy
      .get(this.myAccountBillingEnterAddressManuallyClearField)
      .last()
      .click()
      .get(this.myAccountBillingEnterAddress1)
      .last()
      .type('hello')
      .get(this.myAccountBillingEnterPostcode)
      .last()
      .type('W1G 9XX')
      .get(this.myAccountBillingEnterCity)
      .last()
      .type('London')
  }

  getFindAddressErrorMessage() {
    return cy.get(this.errorMessageFindAddress)
  }

  enterTextIntoFirstnameField(text) {
    cy.get(this.firstNameInput).type(text)
    return this
  }

  clickSurnameField() {
    cy.get(this.surnameInput).click()
    return this
  }

  selectDeliveryCountry(country) {
    cy.get(this.countryDropdown)
      .scrollIntoView()
      .select(country)
    return this
  }

  clickRedirectModalContinueButton() {
    return cy
      .get(this.shippingRedirectModal)
      .contains(this.continueButtonText)
      .click()
  }

  clickRedirectModalFrenchButton() {
    return cy
      .get(this.shippingRedirectModal)
      .contains('French')
      .click()
  }

  clickOutSide() {
    cy.get(this.deliveryDetailForm).click({ force: true })
    return this
  }

  clickRedirectModalCancelButton() {
    cy.get(this.cancelRedirectButton).click()
    return this
  }

  clickDeliveryTypesChange() {
    cy.get(this.deliveryTypesChangeButton).eq(1).click()
    return this
  }

  clickDeliveryMethodsChange() {
    cy.get(this.deliveryTypesChangeButton).eq(0).click()
    return this
  }

  typeDeliveryFirstName(value) {
    cy.get(this.deliveryFirstName)
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

  collectFromStore(storeLocator) {
    cy.get(this.collectFromStoreOption).click()
    storeLocator.assertShareLocationDoesExist()
    return this
  }

  useCollectFromParcelShop() {
    cy.get(this.collectFromParcelShop).click()
    if (isDesktopLayout()) {
      cy.get(this.modalTitle).contains('Where do you want to collect from?')
    }
    return this
  }

  useCurrentLocation(storeLocator) {
    storeLocator.assertLocationIconState('inactive')
    cy.get(storeLocator.shareLocationIcon).click()
    storeLocator.assertLocationIconState('active')
    storeLocator.assertLocationInputValue('Current Location')
    return this
  }

  searchForLocations(storeLocator) {
    cy.get(storeLocator.storeFinderGoButton).click()
    return this
  }

  selectDeliveryOption(option) {
    cy.get(`${this.deliveryOption}${option}`).click()
    return this
  }

  openMobileStoreFilters() {
    cy.get(this.storeListFilters).click()
    return this
  }

  closeMobileStoreFilters() {
    cy.get(this.closeButtonForFilterModal).click()
    return this
  }

  clickdeliveryOptionsAccordion() {
    cy.get(this.deliveryOptionsAccordion).click()
    return this
  }

  /**
   * ASSERTIONS ************************************************************
   */

  assertLanquageOptions(count) {
    cy.get(this.languageOptionButtons).should('have.length', count)
    return this
  }

  assertLanquageSelectOptions(count) {
    cy.get(this.languageOptionSelectOptions).should('have.length', count)
    return this
  }

  assertFirstNameFailedValidation(message = 'This field is required') {
    const el = cy.get(this.firstNameError)
    el.should('be.visible')
    el.contains(message)
    return this
  }

  assertLastNameFailedValidation(message = 'This field is required') {
    const el = cy.get(this.lastNameError)
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
      .get(this.firstAdressError)
      .should(visibility)
      .contains(message)
      .get(this.addressTwoError)
      .should(visibility)
      .contains(message)
      .get(this.cityError)
      .should(visibility)
      .contains(message)
  }

  assertDeliveryOptions(visibility = 'be.visible') {
    cy.get('.DeliveryOptions').should(visibility)
    cy.get('.DeliveryOption.DeliveryOption--home').should(visibility)
    cy.get('.DeliveryOption.DeliveryOption--store').should(visibility)
    ifFeature('FEATURE_PUDO').then((isOn) => {
      if (isOn) {
        cy.get('.DeliveryOption.DeliveryOption--parcelshop').should(visibility)
      }
    })
    return this
  }

  assertYourDetails() {
    cy.get(this.firstNameInput).should('be.visible')
    cy.get(this.surnameInput).should('be.visible')
    cy.get(this.phoneNumberInput).should('be.visible')
    return this
  }

  assertDeliveryAddress() {
    cy.get(this.enterAddressManually).should('be.visible')
    cy.get(this.findAddressButton).should('be.visible')
    cy.get(this.postCodeFindAddressInput).should('be.visible')
    cy.get('#country').contains('United Kingdom')
    return this
  }

  assertDeliveryNotification(visibility = 'be.visible') {
    cy.get(this.deliveryInstructionsField).should(visibility)
    cy.get(this.smsMobileNumber).should(visibility)
    return this
  }

  assertProceedButton() {
    cy.get(this.proceedButton).should('be.visible')
    return this
  }

  assertMandotoryInputs() {
    cy.get(this.enterAddressManually)
      .click()
      .get(this.firstNameInput)
      .clear()
      .get(this.surnameInput)
      .clear()
      .get(this.phoneNumberInput)
      .clear()
      .get(this.addressLineOneInput)
      .clear()
      .get(this.postCodeManualInput)
      .clear()
      .get(this.cityManualInput)
      .clear()
      .get(this.proceedToPaymentButton)
      .click()

    cy.get(this.firstNameError).should('be.visible')
    cy.get(this.lastNameError).should('be.visible')
    cy.get(this.telephoneError).should('be.visible')
    cy.get(this.postcodeError).should('be.visible')
    cy.get(this.cityError).should('be.visible')
    return this
  }

  assertStoreMapVisibility(assert) {
    cy.get(this.googleMaps).should(assert)
    return this
  }

  assertStoreListingExists(assert) {
    cy.get(this.collectFromStoreListing).should(assert)
    return this
  }

  assertStoreListFiltersSelected(selections) {
    cy.get(this.storeListFilters).should('to.exist')

    if (isMobileLayout()) {
      this.openMobileStoreFilters()
    }

    const {
      TOPSHOP_STORES,
      PARCELSHOPS,
      OTHER_STORES,
    } = this.storeListFilterOptions
    const possibleOptions = [TOPSHOP_STORES, PARCELSHOPS, OTHER_STORES]
    possibleOptions.forEach((option) => {
      const target = this.storeListFilterCheckbox(option)
      const isInSelections = selections.includes(option)
      const shouldAssertion = `${isInSelections ? '' : 'not.'}have.attr`
      cy.get(target).should(shouldAssertion, 'checked')
    })

    if (isMobileLayout()) {
      this.closeMobileStoreFilters()
    }

    return this
  }

  assertCanChooseStoreFromList() {
    if (isDesktopLayout()) {
      cy.get(this.collectFromStoreListing)
        .children()
        .then((listing) => {
          return listing[0]
        })
        .as('first-store')

      cy.get('@first-store')
        .click()
        .should('not.have.attr', 'hidden')

      cy.get('@first-store')
        .find('button.Button')
        .trigger('click', { force: true })

      cy.get(this.changeStore).should('be.visible')
    }
  }

  assertNoRenewalComponent() {
    cy.get(this.ddpRenewalComponent).should('not.exist')
  }

  assertactiveRenewalComponent(ddpSaving) {
    const scrollOptions = {
      duration: 1000,
      offset: {
        top: 0,
        left: -20,
      },
    }
    cy.get(this.ddpRenewalComponent).scrollIntoView(scrollOptions)
    cy.get(this.ddpRenewalComponent).should('be.visible')
    const morethan5Savings = ddpSaving
      ? "You've saved up to £8.05 on delivery!"
      : "You've saved up to £6.00 per delivery"

    const continueSaving = 'Expires on the  25 May 2020'
    cy.get(this.ddpMessages)
      .children()
      .then((messages) => {
        const savingsMessageElm = messages[0]
        const activeDDPexpires = messages[1]
        expect(savingsMessageElm).to.have.text(morethan5Savings)
        expect(activeDDPexpires).to.have.text(continueSaving)
      })
  }

  assertDDPRenewalComponent(hasDDPExpired, showDDPSaving) {
    const scrollOptions = {
      duration: 1000,
      offset: {
        top: 0,
        left: -20,
      },
    }
    cy.get(this.ddpRenewalComponent).scrollIntoView(scrollOptions)

    const savingsMessage = showDDPSaving
      ? "You've saved up to £8.05 on delivery!"
      : "You've saved up to £6.00 per delivery"
    const continueSaving = hasDDPExpired
      ? 'Renew and continue saving until 31 March 2021'
      : 'Extend for another year and continue saving until 15 May 2021'
    const espotIdentifier = hasDDPExpired
      ? 'ddp_renewal_expired'
      : 'ddp_renewal_expiring'
    const btnMessage = hasDDPExpired ? 'RENEW FOR £9.95' : 'EXTEND FOR £9.95'

    cy.get(this.ddpMessages)
      .children()
      .then((messages) => {
        const savingsMessageElm = messages[0]
        const continueSavingElm = messages[1]
        expect(savingsMessageElm).to.have.text(savingsMessage)
        expect(continueSavingElm).to.have.text(continueSaving)
      })

    cy.get(this.getDdpEspot(espotIdentifier))

    cy.get(this.ddpRenewalCTA).then((el) => {
      const buttonElm = el[0]
      expect(buttonElm).to.have.text(btnMessage)
    })
  }

  assertDDPAddedComponent() {
    const scrollOptions = {
      duration: 1000,
      offset: {
        top: -200,
        left: -20,
      },
    }
    cy.get(this.ddpAddedComponent).scrollIntoView(scrollOptions)
  }
}
