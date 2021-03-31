import { isMobileLayout } from '../../lib/helpers'
import checkoutMocks from '../../mock-helpers/checkoutMockSetup'

export default class CheckoutHeader extends checkoutMocks {
  get continueShoppingButton() {
    return isMobileLayout()
      ? '.Header button[title=Home]'
      : '.Header-continueShopping'
  }

  get removeDeliveryAdressLink() {
    return '.AddressBookList-itemAction'
  }

  get addressBookItem() {
    return '.AddressBookList-item'
  }

  clickContinueShopping() {
    cy.get(this.continueShoppingButton).click()
    return this
  }
}
