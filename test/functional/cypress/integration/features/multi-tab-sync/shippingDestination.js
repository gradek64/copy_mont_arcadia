import {
  isDesktopLayout,
  checkLocalStorage,
  setInLocalStorage,
  checkExistenceOfClass,
  forceSync,
} from '../../../lib/helpers'
import { homepageUrlWithCurrentCountry } from '../../../constants/urls'
import Navigation from '../../../page-objects/Navigation.page'

const navigation = new Navigation()
const stateKey = 'shippingDestination'

if (isDesktopLayout()) {
  describe('Multi Tab Sync - Shipping Destination', () => {
    it('Should set destination and persist to local storage', () => {
      cy.visit(homepageUrlWithCurrentCountry('PL')).should(() => {
        checkLocalStorage('shippingDestination', 'destination', 'Poland')
        checkLocalStorage('shippingDestination', 'language', 'English')
        checkExistenceOfClass(
          navigation.desktopShippingDestinationClass,
          navigation.countryFlag('poland')
        )
      })
    })

    it('Should set destination and language when a country with a supported language is selected', () => {
      cy.visit(homepageUrlWithCurrentCountry('DE')).should(() => {
        checkLocalStorage('shippingDestination', 'destination', 'Germany')
        checkLocalStorage('shippingDestination', 'language', 'German')
        checkExistenceOfClass(
          navigation.desktopShippingDestinationClass,
          navigation.countryFlag('germany')
        )
      })
    })

    it('Should update shipping destination when local storage changes', () => {
      cy.visit('/').should(() => {
        checkExistenceOfClass(
          navigation.desktopShippingDestinationClass,
          navigation.countryFlag('unitedKingdom')
        )

        setInLocalStorage(stateKey, {
          destination: 'France',
          language: 'French',
        })
        forceSync(stateKey)

        checkExistenceOfClass(
          navigation.desktopShippingDestinationClass,
          navigation.countryFlag('france')
        )
      })
    })
  })
}
