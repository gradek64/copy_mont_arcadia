import {
  isDesktopLayout,
  setFeatureFlag,
  isMobileLayout,
} from './../../lib/helpers'
import PDP from './../../page-objects/Pdp.page'
import StoreLocator from './../../page-objects/StoreLocator.page'
import pdpInitialFetch from './../../fixtures/pdp/multiSizeProduct/pdpInitialFetch.json'
import pdpInitialFetchSingle from './../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import { getFakeGPSLocation } from '../../mock-helpers/storeLocatorMockSetup'

const pdp = new PDP()
const storeLocator = new StoreLocator()

const singleProduct = {
  ...pdpInitialFetchSingle,
  items: [
    {
      quantity: 1,
    },
  ],
}
if (isMobileLayout()) {
  describe('PDP find in store - FEATURE_STORE_LOCATOR_GPS is enabled', () => {
    let path

    beforeEach(() => {
      setFeatureFlag('FEATURE_STORE_LOCATOR_GPS', true)
      storeLocator.mocksForStoreLocator('fixture:general/storeLocator')
      path = pdp.mocksForPdpProduct({
        productByUrl: pdpInitialFetch,
      })
      setFeatureFlag('FEATURE_FIND_IN_STORE', true)
    })

    describe('User denies `share location`', () => {
      it('renders expected error message: `Permission denied`', () => {
        cy.visit(path, getFakeGPSLocation({}, 1))
        pdp.selectFirstSizeFromTiles().findInStore()
        cy.get(storeLocator.shareLocationIcon).click()
        storeLocator.assertUserLocationErrorMessage(
          'Please enable location services in your browser settings'
        )
      })
    })

    describe('User allows `share location`', () => {
      describe('Should display the error message if the geocoder API returns one', () => {
        it('renders expected error message: `Position unavailable` for error response: 2', () => {
          cy.visit(path, getFakeGPSLocation({}, 2))
          pdp.selectFirstSizeFromTiles().findInStore()
          cy.get(storeLocator.shareLocationIcon).click()
          storeLocator.assertUserLocationErrorMessage(
            'As you are currently offline your location can’t be determined'
          )
        })
        it('renders expected error message: `Timeout` for error response: 3', () => {
          cy.visit(path, getFakeGPSLocation({}, 3))
          pdp.selectFirstSizeFromTiles().findInStore()
          cy.get(storeLocator.shareLocationIcon).click()
          storeLocator.assertUserLocationErrorMessage('Geolocation timed out')
        })
      })
      it('should fill the search input with `Current Location`', () => {
        cy.visit(path, getFakeGPSLocation({ latitude: 25, longitude: 45 }))
        storeLocator.assertLocationIconState('inactive')
        pdp.selectFirstSizeFromTiles().findInStore()
        cy.get(storeLocator.shareLocationIcon).click()
        storeLocator.assertLocationIconState('active')
        pdp.assertLocationInputValue('Current Location')
      })
      it('should display stores once the user has used geolocation and presses `go` button', () => {
        cy.visit(path, getFakeGPSLocation({ latitude: 25, longitude: 45 }))
        pdp.selectFirstSizeFromTiles().findInStore()
        cy.get(storeLocator.shareLocationIcon).click()
        cy.get(storeLocator.storeFinderGoButton).click()
        cy.get(pdp.storesListSearchResult).should('be.visible')
      })
      it('should allow the user to clear their current location and manually input a search', () => {
        cy.visit(path, getFakeGPSLocation({ latitude: 25, longitude: 45 }))
        pdp.selectFirstSizeFromTiles().findInStore()
        cy.get(storeLocator.shareLocationIcon).click()
        storeLocator.assertLocationIconState('active')
        cy.get(storeLocator.clearUserInput).click()
        storeLocator.assertLocationIconState('inactive')
        pdp.assertLocationInputValue('')
        cy.get(pdp.storeFinderUserInput).type('W1T 3NL')
        pdp.assertLocationInputValue('W1T 3NL')
      })
    })
  })
  describe('PDP find in store button: PDP with all sizes available allows to find in store', () => {
    beforeEach(() => {
      storeLocator.mocksForStoreLocator('fixture:general/storeLocator')
      const path = pdp.mocksForPdpProduct({
        productByUrl: pdpInitialFetch,
      })
      setFeatureFlag('FEATURE_FIND_IN_STORE', true)
      cy.visit(path)
    })

    it('should load find in store modal when selected', () => {
      pdp.selectFirstSizeFromTiles().findInStore()
      cy.get(pdp.findInStoreModal)
        .should('be.visible')
        .get(storeLocator.sizeSelect)
        .should('be.visible')
    })

    it('should render a disclaimer message ', () => {
      pdp.selectFirstSizeFromTiles().findInStore()
      cy.get(pdp.findInStoreModal)
        .should('be.visible')
        .get(pdp.findInStoreDisclaimer)
        .should('be.visible')
    })

    it('should see a list of stores  when searching location ', () => {
      pdp.selectFirstSizeFromTiles().findInStore()
      storeLocator.storeLocatorSearchInPdp('London')
      cy.wait('@get-stores').then(() => {
        cy.get(pdp.storesListSearchResult).should('be.visible')
      })
    })
  })

  describe('PDP find in store button: PDP single product scenario', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_FIND_IN_STORE', true)
    })
    it('should render a disclaimer message', () => {
      storeLocator.mocksForStoreLocator('fixture:general/storeLocator')
      const path = pdp.mocksForPdpProduct({ productByUrl: singleProduct })
      cy.visit(path)
      pdp.findInStore()
      cy.get(pdp.findInStoreModal)
        .should('be.visible')
        .get(pdp.findInStoreDisclaimer)
        .should('be.visible')
    })
  })
}

if (isDesktopLayout()) {
  describe('static map in find in store', () => {
    beforeEach(() => {
      storeLocator.mocksForStoreLocator('fixture:general/storeLocator')
      const path = pdp.mocksForPdpProduct({
        productByUrl: pdpInitialFetch,
      })
      setFeatureFlag('FEATURE_FIND_IN_STORE', true)
      cy.visit(path)
    })

    it('static vs dynamic map behaviour', () => {
      pdp.selectFirstSizeFromTiles().findInStore()

      cy.log('should display a google static map')
      cy.get(pdp.googleStaticMap).should('be.visible')

      cy.log('should get a google dynamic map if a user click on a static map')
      cy.get(pdp.googleStaticMap)
        .click()
        .get(pdp.googleDynamicMap)
        .should('be.visible')

      cy.log(
        'should see a list of stores when searching location and get a google static map'
      )
      storeLocator.storeLocatorSearchInPdp('London')
      cy.wait('@get-stores').then(() => {
        cy.get(pdp.googleStaticMap).should('be.visible')
        cy.get(pdp.storesListSearchResult).should('be.visible')
      })

      cy.log('should still be a static google map when a user select a store')
      storeLocator.storeLocatorSelectedStorePdp('London')
      cy.wait('@get-stores').then(() => {
        cy.get(pdp.googleStaticMap).should('be.visible')
      })

      cy.log(
        'should keep a dynamic map once a user have triggered it and navigate between selected store'
      )
      storeLocator.storeLocatorSelectedStorePdp('London')
      cy.wait('@get-stores').then(() => {
        cy.get(pdp.googleStaticMap)
          .click()
          .get(pdp.googleDynamicMap)
          .should('be.visible')
        storeLocator.storeLocatorSlectedStorePdpChangedFocusStore(2)
        cy.get(pdp.googleDynamicMap).should('be.visible')
        storeLocator.storeLocatorSlectedStorePdpChangedFocusStore(3)
        cy.get(pdp.googleDynamicMap).should('be.visible')
      })
    })
  })
}
