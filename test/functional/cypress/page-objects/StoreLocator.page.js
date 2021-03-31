import { isMobileLayout } from './../lib/helpers'
import storeLocatorMocks from '../mock-helpers/storeLocatorMockSetup'

export default class StoreLocator extends storeLocatorMocks {
  get sizeSelect() {
    return isMobileLayout()
      ? '.FindInStore .ProductSizes-item'
      : '.Select-container .Select-select'
  }

  get storeUserLocatorInput() {
    return '.UserLocatorInput-inputField'
  }

  get storeUserLocatorInputPredictions() {
    return '.UserLocatorInput-predictionsList > :nth-child(1)'
  }

  get storeUserSelectedLocationGoButton() {
    return '.UserLocatorInput-inputContainer > .Button'
  }

  get selectStoreInDelivery() {
    return isMobileLayout()
      ? '.Store-TS0032 > .Accordion > > > > .Store-selectButtonContainer > .Button'
      : '.Store-TS0032 .Store-selectButtonContainer > .Button'
  }

  get storeFinderCountrySelector() {
    return '#StoreFinderCountrySelect'
  }

  get interStoreFinderCountrySelector() {
    return '#InterStoreFinderCountrySelect'
  }

  get findUkStoreLink() {
    return '.IntUserLocator-findText'
  }

  get storeFinderUserInput() {
    return '#UserLocatorInput'
  }

  get storeFinderPredictList() {
    return '.UserLocatorInput-predictionsListItem'
  }

  get storeFinderGoButton() {
    return '.UserLocator-goButton'
  }

  get burgerButton() {
    return '.BurgerButton'
  }

  get topNavListItemLink() {
    return '.ListItemLink'
  }

  get storeFinderResults() {
    return '.StoreLocator .StoreLocator-resultsContainer'
  }
  get storeError() {
    return '.StoreLocator .Store-error'
  }

  get storeOpeningTimes() {
    return '.StoreLocator .Store-success'
  }

  get storeInfo() {
    return '.Store-headerDetails'
  }

  get locationErrorMessage() {
    return '.UserLocator-error'
  }

  get locationLoader() {
    return '.UserLocatorInput-loader'
  }

  get clearUserInput() {
    return '.UserLocatorInput-clearButton'
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }

  get shareLocationIcon() {
    return '.UserLocatorInput-currentLocationButton'
  }

  /**
   * USER ACTIONS **************************************************************
   */

  sizeSelector(size) {
    if (isMobileLayout()) {
      return cy
        .get(this.sizeSelect)
        .eq(0)
        .click()
    }

    return cy
      .get(this.sizeSelect)
      .eq(0)
      .select(size)
  }

  storeLocatorSearchInDelivery(searchTerm) {
    cy.get(this.storeUserLocatorInput).type(searchTerm)
    return this
  }

  selectFirstStoreFromResultsListInDelivery() {
    cy.get(this.storeUserLocatorInputPredictions).click()
    return this
  }

  selectedLocationGoButtonInDelivery() {
    cy.get(this.storeUserSelectedLocationGoButton).click()
    return this
  }

  storeLocatorSearchInPdp(searchTerm) {
    cy.get(this.storeUserLocatorInput).type(searchTerm)
    // Wait introduced as we cannot mock the google predictions API (not XHR)
    // https://github.com/cypress-io/cypress/issues/1296
    cy.wait(3000)
    cy.get(this.storeUserLocatorInputPredictions).click()
    cy.get(this.storeUserSelectedLocationGoButton).click()
    return this
  }

  storeLocatorSlectedStorePdpChangedFocusStore(storeListIndex) {
    cy.get('.FindInStore-storeList > .Store')
      .eq(storeListIndex)
      .click()
    return this
  }

  storeLocatorSelectedStorePdp(searchTerm) {
    cy.get(this.storeUserLocatorInput).type(searchTerm)
    // Wait introduced as we cannot mock the google predictions API (not XHR)
    // https://github.com/cypress-io/cypress/issues/1296
    cy.wait(3000)

    cy.get('.UserLocatorInput-predictionsList')
      .eq(0)
      .click()
      .get('.UserLocator-goButton')
      .click()
      .wait(3000)
    this.storeLocatorSlectedStorePdpChangedFocusStore(0)
    return this
  }

  selectStoreExpressDeliveryType() {
    cy.get(
      ':nth-child(1) > .FormComponent-deliveryMethod > .RadioButton-content'
    ).click()
    return this
  }

  selectCollectFromStoreDeliveryMethod() {
    cy.get('.DeliveryOption--store .RadioButton-content').click()
    return this
  }

  storeLocatorSearchInCheckout(searchTerm) {
    this.selectCollectFromStoreDeliveryMethod()
    this.storeLocatorSearchInDelivery(searchTerm)
    this.selectFirstStoreFromResultsListInDelivery()
    return this
  }

  expandStoreDetailsFromList(index) {
    cy.get('.Store-name')
      .eq(index)
      .click({ force: true })
    return this
  }

  selectStoreButton() {
    cy.get(this.selectStoreInDelivery).click({ force: true })
    return this
  }

  closeStoreProductLocatorModal() {
    cy.get('.Modal > .Modal-closeIcon > span').click()
    return this
  }

  clearLocatorInput() {
    cy.get(this.clearUserInput).click()
    return this
  }

  /**
   * ASSERTIONS **************************************************************
   */

  storeFinderDrpDwnSelect(country) {
    cy.get(this.storeFinderCountrySelector)
      .find(':selected')
      .should('have.text', country)
    return this
  }

  interStoreFinderDrpDwnSelect(country) {
    cy.get(this.interStoreFinderCountrySelector)
      .find(':selected')
      .should('not.have.text', country)
    return this
  }

  assertStoreFinderResultsExist() {
    cy.get(this.storeFinderResults).should('to.exist')
    return this
  }

  assertStoreFinderInputVisibility(assert) {
    cy.get(this.storeFinderUserInput).should(assert)
    return this
  }

  assertStoreMapVisibility(assert) {
    cy.get(this.storeFinderUserInput).should(assert)
    return this
  }

  assertClosingTimeDoesntExist() {
    cy.get(this.storeError).should('not.exist')
    return this
  }

  assertUserLocationErrorMessage(assert) {
    cy.get(this.locationErrorMessage).contains(assert)
    return this
  }

  assertUserLocationLoaderExists() {
    cy.get(this.locationLoader).should('be.visible')
    return this
  }

  assertShareLocationDoesNotExist() {
    cy.get(this.shareLocationIcon).should('not.be.visible')
  }

  assertShareLocationDoesExist() {
    cy.get(this.shareLocationIcon).should('be.visible')
  }

  selectAndAssertDeliverySelection(location, storeTypes) {
    cy.get(this.storeUserLocatorInput)
      .should('be.visible')
      .type(location)
      .get(this.storeUserLocatorInputPredictions)
      .contains(location)
      .click()
      .get(this.storeInfo)
      .should('contain', storeTypes)
    return this
  }

  assertLocationInputValue(value) {
    cy.get(this.storeFinderUserInput).should('have.attr', 'value', value)
    return this
  }

  assertLocationIconState(state) {
    if (state === 'active') {
      cy.get(this.shareLocationIcon).should('have.class', 'is-located')
    } else {
      cy.get(this.shareLocationIcon).should('not.have.class', 'is-located')
    }
    return this
  }
}
