import wishlistMocks from '../mock-helpers/wishListMockSetup'

export default class WishList extends wishlistMocks {
  get continueShoppingButton() {
    return '.EmptyWishlist > .Button'
  }

  get allWishlistItems() {
    return `.WishlistItem`
  }

  get alertModalText() {
    return '.OrderProducts-modal > p'
  }

  get alertModalOKButton() {
    return '.OrderProducts-modal > .Button'
  }

  get firstWishListItemTitle() {
    return '.WishlistItem-titleText'
  }

  get quickViewButton() {
    return '.ProductQuickViewButton'
  }

  get firstWishListItemSizeSelector() {
    return ':nth-child(1) > .WishlistItem-form > .FormComponent-Size > .Select-container [id="Size selection"]'
  }

  get firstWishListItemAddToBagButton() {
    return ':nth-child(1) > .WishlistItem-form > .Button'
  }

  get firstWishlistItem() {
    return ':nth-child(1) > .WishlistItem-form > .FormComponent-Size > .Select-container'
  }

  get firstWishlistItemRemoveButton() {
    return '.WishlistItem-remove'
  }

  get wishlistCount() {
    return '.WishlistPageContainer-itemCount'
  }

  get wishListItemSizeSelectorSelected() {
    return '.WishlistItem-select.is-selected'
  }

  /**
   * USER ACTIONS ************************************************************
   */

  clickQuickViewModal() {
    return cy.get(this.quickViewButton).click()
  }

  selectContinueShoppingButton() {
    cy.get(this.continueShoppingButton).click()
  }

  selectOKModalButton() {
    cy.get(this.alertModalOKButton)
      .contains('Ok')
      .click({ force: true })
  }

  removeFirstWishlistItem() {
    cy.get(this.firstWishlistItemRemoveButton).click()
  }
}
