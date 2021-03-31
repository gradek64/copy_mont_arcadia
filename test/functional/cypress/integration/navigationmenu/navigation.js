import { visitPageWithGeoLocation, isMobileLayout } from '../../lib/helpers'
import { homepageUrlWithCurrentCountry } from '../../constants/urls'

import Navigation from '../../page-objects/Navigation.page'
import GeoIPModal from '../../page-objects/GeoIpModal.page'

const navigation = new Navigation()
const geoIPModal = new GeoIPModal()

describe('Shipping destination behaviours', () => {
  it('Should default to the currentCountry query param if it exists', () => {
    visitPageWithGeoLocation('JP', homepageUrlWithCurrentCountry('AU'))
    navigation.checkForShippingDestnationFlag('australia')
  })

  it("Should default to the user's geo location if the current site delivers there", () => {
    visitPageWithGeoLocation('JP')
    navigation.checkForShippingDestnationFlag('japan')
  })

  it("Should default to the site default country if the current site does not deliver to the user's location", () => {
    visitPageWithGeoLocation('FR')
    geoIPModal.clickDismissButton()
    navigation.checkForShippingDestnationFlag('unitedKingdom')
  })

  it('Should display language code and country name for country with multiple languages option', () => {
    cy.visit('/')
    navigation.changeShippingDestination('France', 'French')
    cy.location('href').should('contain', 'm.fr.topshop.com')
    navigation.checkForShippingDestnationFlag('france')
    if (isMobileLayout()) {
      cy.get(navigation.mobileShippingCountryAndLanguageText).should(
        'have.text',
        '(FR) France'
      )
    }
  })

  it('Should display country name and no language code for country with one language option and country ISO code in URL', () => {
    cy.visit('/')
    navigation.changeShippingDestination('Canada')
    cy.location('href').should('contain', 'currentCountry=CA')
    navigation.checkForShippingDestnationFlag('canada')
    if (isMobileLayout()) {
      cy.get(navigation.mobileShippingCountryAndLanguageText).should(
        'have.text',
        'Canada'
      )
    }
  })

  it('Should display "Enter town/postcode" placeholder in store finder input field inside burger menu mobile view', () => {
    cy.visit('/')
    navigation.checkStoreFinderPlaceholder()
  })

  it('Should display "unitedKingdom" flag when I land on the UK site', () => {
    cy.visit('/')
    navigation.checkForShippingDestnationFlag('unitedKingdom')
  })

  it('Should display "United Kingdom" as the selected option when landing on "change-your-shipping-destination"', () => {
    cy.visit('/change-your-shipping-destination')
    cy.get(navigation.countrySelector).should('have.value', 'United Kingdom')
  })
})

describe('opens and closes mobile TopNavigationMenu menu', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('body tag should have class `not-scrollable when TopNavigationmMenu is open', () => {
    if (isMobileLayout()) {
      navigation.clickMobileBurgerMenu()
      cy.get('body').should('have.class', 'not-scrollable')
    }
  })
  it('body tag should not have class `not-scrollable` when TopNavigationmMenu is closed', () => {
    if (isMobileLayout()) {
      navigation.clickMobileBurgerMenu()
      navigation.closeNavigationMenu()
      cy.get('body').should('not.have.class', 'not-scrollable')
    }
  })
})
