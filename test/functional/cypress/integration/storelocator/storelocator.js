import { setFeatureFlag, isMobileLayout } from '../../lib/helpers'
import StoreFinder from '../../page-objects/StoreLocator.page'
import { getFakeGPSLocation } from '../../mock-helpers/storeLocatorMockSetup'
import DomHeader from '../../page-objects/DomHeader.page.part'

const FEATURE_GPS = 'FEATURE_STORE_LOCATOR_GPS'
const FEATURE_YEXT = 'FEATURE_YEXT'

const storeFinder = new StoreFinder()
const domHeader = new DomHeader()
const {
  burgerButton,
  topNavListItemLink,
  storeFinderUserInput,
  storeFinderPredictList,
  storeFinderGoButton,
  storeFinderResults,
  storeFinderCountrySelector,
  storeOpeningTimes,
  interStoreFinderCountrySelector,
  findUkStoreLink,
} = storeFinder

if (isMobileLayout()) {
  describe('Store Locator', () => {
    beforeEach(() => {
      setFeatureFlag(FEATURE_YEXT, false)
      storeFinder.mocksForStoreLocator('fixture:general/storeLocator')
    })

    describe('User is on homepage and uses the store finder in the top nav', () => {
      it('goes to next page and passes the long location string as a query', () => {
        setFeatureFlag(FEATURE_YEXT, true)
        storeFinder.mocksForStoreLocator('fixture:general/storeLocator')
        cy.visit('/')
        cy.get(burgerButton).click()
        cy.get(topNavListItemLink)
          .first()
          .click()
        cy.get(storeFinderUserInput).type('W1T3NL')
        cy.get(storeFinderPredictList)
          .should('be.visible')
          .first()
          .click()
        cy.location().should((loc) => {
          const check = 'London'
          expect(loc.search).to.include(check)
        })
      })
    })

    describe('Visit store locator ', () => {
      beforeEach(() => {
        cy.visit('/store-locator')
      })

      it('should not display alternate links in dom head when not on homepage', () => {
        domHeader.assertNoAltLinks()
      })

      it('Allows a user to search for UK stores', () => {
        cy.get(storeFinderCountrySelector)
          .select('United Kingdom')
          .then(() => {
            storeFinder.storeFinderDrpDwnSelect('United Kingdom')
          })
        cy.get(storeFinderUserInput).type('NW1 5QD')
        cy.get(storeFinderPredictList)
          .first()
          .click()
        cy.get(storeFinderGoButton).click({ force: true })
        storeFinder
          .assertStoreMapVisibility('to.exist')
          .wait('@get-stores')
          .assertStoreFinderResultsExist()
      })
      it('Allows a user to find non uk stores', () => {
        storeFinder.mocksForStoreLocator(
          'fixture:general/storeLocator--russia',
          '?country=Russia*'
        )
        cy.get(storeFinderCountrySelector)
          .select('Russia')
          .wait('@get-stores')
          .then(() => {
            storeFinder
              .assertStoreFinderInputVisibility('not.be.visible')
              .assertStoreMapVisibility('not.be.visible')
              .assertStoreFinderResultsExist()
          })
      })
      it('When selecting a different country it should display store opening times ', () => {
        storeFinder.mocksForStoreLocator(
          'fixture:general/storeLocator--netherlands',
          '?country=Netherlands*'
        )
        cy.get(storeFinderCountrySelector)
          .select('Netherlands')
          .wait('@get-stores')
          .then(() => {
            storeFinder.assertStoreFinderResultsExist()
            cy.get(storeOpeningTimes).should('to.exist')
          })
      })
      it('Hides the `UK postcode input` when searching for a non uk country', () => {
        cy.get(storeFinderCountrySelector)
          .select('Netherlands')
          .wait('@get-stores')
        storeFinder
          .assertStoreFinderResultsExist()
          .assertStoreMapVisibility('not.be.visible')
      })
      it('Does not show `Closed Today` copy for any non-uk Search that does not contain opening time data', () => {
        storeFinder.mocksForStoreLocator(
          'fixture:general/storeLocator--russia',
          '?country=Russia*'
        )
        cy.get(storeFinderCountrySelector)
          .select('Russia')
          .wait('@get-stores')
        storeFinder
          .assertStoreFinderResultsExist()
          .assertClosingTimeDoesntExist()
      })
      it('Resets the store locator back to initial `state` when going from non uk country search to uk country search', () => {
        storeFinder
          .storeFinderDrpDwnSelect('United Kingdom')
          .assertStoreMapVisibility('to.exist')
        cy.get(storeFinderGoButton).should('to.exist')
        cy.get(storeFinderResults).should('not.exist')
      })
    })

    describe('Feature User Current Location not enabled', () => {
      it('Should not display Icon in input field if Geo location if feature is enabled', () => {
        setFeatureFlag(FEATURE_GPS, false)
        cy.visit('/store-locator')
        cy.get(storeFinder.shareLocationIcon).should('not.be.visible')
      })
    })

    describe('International Store Locator', () => {
      beforeEach(() => {
        setFeatureFlag(FEATURE_YEXT, true)
        storeFinder.mocksForStoreLocator('fixture:general/storeLocator')
        cy.visit('/store-locator')
      })

      it('Should not display United Kingdom in country select list', () => {
        storeFinder.interStoreFinderDrpDwnSelect('United Kingdom')
      })

      it('Allows a user to search for non UK stores', () => {
        storeFinder.interStoreFinderDrpDwnSelect('United Kingdom')
        cy.get(interStoreFinderCountrySelector)
          .select('Russia')
          .wait('@get-stores')
          .then(() => {
            storeFinder
              .assertStoreFinderInputVisibility('not.be.visible')
              .assertStoreMapVisibility('not.be.visible')
              .assertStoreFinderResultsExist()
          })
      })

      it('Allows a user to search for UK stores by forwarding to Yext', () => {
        let url = ''

        cy.get(findUkStoreLink).then((res) => {
          url = res[0].hostname
        })

        cy.get(findUkStoreLink)
          .first()
          .click()

        cy.location().should((loc) => {
          expect(loc.origin).to.include(url)
        })
      })
    })

    describe('User Share Geo Location is enabled', () => {
      beforeEach(() => {
        setFeatureFlag(FEATURE_YEXT, false)
        setFeatureFlag(FEATURE_GPS)
      })

      describe('Feature Current Location enabled', () => {
        describe('Should display error message if user has not allowed share location', () => {
          it(`renders expected error message: 'Please enable location services in your browser settings', for error response: 1`, () => {
            cy.visit(
              'store-locator',
              getFakeGPSLocation({}, 1) // defaults to rejected
            )
            // prompt to allow or disallow
            cy.get(storeFinder.shareLocationIcon).click()

            // check error message is displayed
            storeFinder.assertUserLocationErrorMessage(
              'Please enable location services in your browser settings'
            )
          })

          it(`renders expected error message: 'As you are currently offline your location can’t be determined', for error response: 2`, () => {
            cy.visit(
              'store-locator',
              getFakeGPSLocation({}, 2) // defaults to rejected
            )
            // prompt to allow or disallow
            cy.get(storeFinder.shareLocationIcon).click()

            // check error message is displayed
            storeFinder.assertUserLocationErrorMessage(
              'As you are currently offline your location can’t be determined'
            )
          })

          it(`renders expected error message: 'Geolocation timed out', for error response: 3`, () => {
            cy.visit(
              'store-locator',
              getFakeGPSLocation({}, 3) // defaults to rejected
            )

            // prompt to allow or disallow
            cy.get(storeFinder.shareLocationIcon).click()

            // check error message is displayed
            storeFinder.assertUserLocationErrorMessage('Geolocation timed out')
          })

          it(`renders expected error message: 'An unknown error occurred', for unexpected error response`, () => {
            cy.visit(
              'store-locator',
              getFakeGPSLocation({}, 4) // defaults to rejected
            )

            // prompt to allow or disallow
            cy.get(storeFinder.shareLocationIcon).click()

            // check error message is displayed
            storeFinder.assertUserLocationErrorMessage(
              'An unknown error occurred'
            )
          })
        })

        describe('User allows share location', () => {
          beforeEach(() => {
            cy.visit(
              'store-locator',
              getFakeGPSLocation({ latitude: 25, longitude: 45 }) // defaults to rejected
            )
          })

          it('Location icon should become active and "Current Location" displayed when clicked', () => {
            storeFinder.assertLocationIconState('inactive')

            cy.get(storeFinder.shareLocationIcon).click()
            storeFinder
              .assertLocationIconState('active')
              .assertLocationInputValue('Current Location')
          })

          it('Should display stores once allow browser to share location ', () => {
            cy.get(storeFinder.shareLocationIcon).click()
            // press go and view stores
            cy.get(storeFinder.storeFinderGoButton).click()
            // check stores and map is subsequently listed
            storeFinder
              .assertStoreMapVisibility('to.exist')
              .wait('@get-stores')
              .assertStoreFinderResultsExist()
          })

          it('Once shared location, pressing clear button should remove current location and allow input', () => {
            cy.get(storeFinder.shareLocationIcon).click()

            // Press x and start typing
            cy.get(storeFinder.clearUserInput).click()
            storeFinder
              .assertLocationIconState('inactive')
              .assertLocationInputValue('')

            cy.get(storeFinder.storeFinderUserInput).type('W1T 3NL')
            storeFinder.assertLocationInputValue('W1T 3NL')
          })
        })
      })
    })
  })
}
