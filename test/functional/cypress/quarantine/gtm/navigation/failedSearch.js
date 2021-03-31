import ProductListingPage from '../../../page-objects/Plp.page'
import NavigationPage from '../../../page-objects/Navigation.page'
import noResults from '../../../fixtures/plp/no-results.json'

import { setFeature, isDesktopLayout } from '../../../lib/helpers'

const plp = new ProductListingPage()
const navigation = new NavigationPage()

if (isDesktopLayout()) {
  describe('EXP-98 Search invalid items', () => {
    beforeEach(() => {
      plp.mocksForProductList({
        productSearchTerm: 'abcde',
        productSearchResults: noResults,
      })
      cy.visit('/')
      setFeature('FEATURE_ENHANCED_NO_SEARCH_RESULT', true)
      navigation.searchFor('abcde')
    })

    it(' should display failed search page', () => {
      plp.assertFailedSearchPage()
    })
  })
}
