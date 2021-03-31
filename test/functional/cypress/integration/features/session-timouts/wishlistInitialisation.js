import {
  isDesktopLayout,
  setFeatureFlag,
  setupSessionTimeout,
} from '../../../lib/helpers'
import Navigation from '../../../page-objects/Navigation.page'
import LoginModal from '../../../page-objects/login/LoginModal.page'
import GeneralUI from '../../../page-objects/GeneralUI.page'

import user from '../../../fixtures/login/timeoutLogonPartialUser.json'
import bag from '../../../fixtures/minibag/getItemsWithProduct.json'

const navigation = new Navigation()
const loginModal = new LoginModal()
const generalUI = new GeneralUI()

if (isDesktopLayout()) {
  // TODO - mobile was switched off until ADP-1181 is resolved
  describe('Initialising wishlist', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_WISHLIST')
      loginModal.setupMocksForAccountAndLogin({
        login: user,
        getAccount: user,
        getItems: bag,
      })
    })

    it('should initialise after login', () => {
      cy.visit('/')

      setupSessionTimeout('GET', '/api/products*')

      navigation.searchFor('shoes')

      cy.wait('@sessionTimeout')

      cy.wait(50)
      loginModal.assertVisible()
      cy.wait('@logout')
      cy.wait(50)
      loginModal.loginWithCredentials('abc@123.com', 'abc123')

      generalUI.assertLoaderIsNotVisible()
    })
  })
}
