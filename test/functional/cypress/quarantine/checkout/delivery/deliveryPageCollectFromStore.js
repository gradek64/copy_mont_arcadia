// helpers
import {
  setFeatureFlag,
  isDesktopLayout,
  isMobileLayout,
} from '../../../lib/helpers'

// Mocked Request Response Data
import checkoutProfileNewUser from '../../../fixtures/checkout/account--newUserEmpty.json'
import orderSummaryNewUser from '../../../fixtures/checkout/testOrderSummary.json'
import storeDeliveryOrderSummary from '../../../fixtures/checkout/order_summary---store-selected-delivery.json'
import updateOrderSummaryNewUser from '../../../fixtures/checkout/order_summary---changeSelectedStore.json'

// Page-objects
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import StoreLocator from '../../../page-objects/StoreLocator.page'

import { getFakeGPSLocation } from '../../../mock-helpers/storeLocatorMockSetup'

const deliveryPage = new DeliveryPage()
const storeLocator = new StoreLocator()

const {
  TOPSHOP_STORES,
  PARCELSHOPS,
  OTHER_STORES,
} = deliveryPage.storeListFilterOptions

const FEATURE = 'FEATURE_STORE_LOCATOR_GPS'
const FEATURE_PUDO = 'FEATURE_PUDO'
const FEATURE_CFS = 'FEATURE_CFS'

if (isMobileLayout()) {
  describe('Collect from store', () => {
    describe('User Share Location', () => {
      beforeEach(() => {
        storeLocator.mocksForStoreLocator('fixture:general/storeLocator')
        deliveryPage.mocksForCheckout({
          setAuthStateCookie: 'yes',
          bagCountCookie: '1',
          putOrderSummary: updateOrderSummaryNewUser,
          getOrderSummary: orderSummaryNewUser,
          getAccount: checkoutProfileNewUser,
        })
        setFeatureFlag(FEATURE_CFS, true)
      })

      describe('Feature user share location not enabled', () => {
        it('Should not display user locator icon', () => {
          setFeatureFlag(FEATURE, false)
          cy.visit('checkout/delivery')
          cy.get(deliveryPage.collectFromStoreOption).click()
          // check locator icon deoesn't exit
          storeLocator.assertShareLocationDoesNotExist()
        })
      })

      describe('Feature User share location enabled', () => {
        beforeEach(() => {
          setFeatureFlag(FEATURE)
          setFeatureFlag(FEATURE_PUDO, true)
          cy.visit(
            'checkout/delivery',
            getFakeGPSLocation({ latitude: 25, longitude: 45 })
          )
        })

        it('Should allow customer to choose store found with get current location', () => {
          deliveryPage
            .collectFromStore(storeLocator)
            .useCurrentLocation(storeLocator)
            .searchForLocations(storeLocator)
            .assertStoreMapVisibility('to.exist')

          cy.wait('@get-stores')
          deliveryPage
            .assertStoreListingExists('to.exist')
            .assertStoreListFiltersSelected([TOPSHOP_STORES, OTHER_STORES])
            .assertCanChooseStoreFromList()
        })

        it('Clear the icon and allow to type post code', () => {
          deliveryPage
            .collectFromStore(storeLocator)
            .useCurrentLocation(storeLocator)
          storeLocator
            .clearLocatorInput()
            .assertLocationInputValue('')
            .assertLocationIconState('inactive')

          const POST_CODE = 'W1T 3NL'
          cy.get(storeLocator.storeFinderUserInput).type(POST_CODE)
          storeLocator.assertLocationInputValue(POST_CODE)
        })

        it('opens modal with parcelshop option with correct filters selected', () => {
          deliveryPage
            .useCollectFromParcelShop()
            .useCurrentLocation(storeLocator)
            .searchForLocations(storeLocator)
            .assertStoreMapVisibility('to.exist')

          cy.wait('@get-stores')

          deliveryPage
            .assertStoreListingExists('to.exist')
            .assertStoreListFiltersSelected([PARCELSHOPS])
        })
      })

      describe('A delivery option has been preselected', () => {
        beforeEach(() => {
          cy.setCookie('WC_pickUpStore', 'TS0014')
          deliveryPage.mocksForCheckout({
            setAuthStateCookie: 'yes',
            getOrderSummary: storeDeliveryOrderSummary,
            getAccount: checkoutProfileNewUser,
          })
          cy.visit('checkout/delivery')
        })

        if (isDesktopLayout()) {
          // Collect From Store
          it('opens displays button to change store and opens modal', () => {
            // click change store
            cy.get(deliveryPage.changeStore).click()
            cy.wait(2000)

            // check modal is present with correct title
            cy.get(deliveryPage.modalTitle).contains(
              'Where do you want to collect from?'
            )
          })
        }
      })

      describe('Permissions Issues', () => {
        it('Should display error permissions', () => {
          setFeatureFlag(FEATURE)
          cy.visit(
            'checkout/delivery',
            getFakeGPSLocation({}, 1) // defaults to rejected
          )
          cy.get(deliveryPage.collectFromStoreOption).click()
          // check locator icon deoesn't exit
          storeLocator.assertShareLocationDoesExist()
          // prompt to allow or disallow
          cy.get(storeLocator.shareLocationIcon).click()

          // check error message is displayed
          storeLocator.assertUserLocationErrorMessage(
            'Please enable location services in your browser settings'
          )
        })
      })
    })
  })
}
