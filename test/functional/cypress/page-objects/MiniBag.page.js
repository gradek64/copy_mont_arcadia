import { isMobileLayout } from './../lib/helpers'
import CheckoutMocks from '../mock-helpers/checkoutMockSetup'

export default class MiniBag extends CheckoutMocks {
  get checkoutButton() {
    return '.MiniBag-continueButton'
  }
  get miniBagCloseButton() {
    return '.MiniBag-closeButton'
  }
  get editProductSizeDropdown() {
    return '.OrderProducts-sizes > .Select-select[aria-activedescendant]'
  }

  get editProductQuantityDropdown() {
    return '.OrderProducts-quantities > .Select-select[aria-activedescendant]'
  }

  get editProductButton() {
    return '.OrderProducts-editText'
  }
  get productContainer() {
    return '.OrderProducts-product'
  }
  get productImage() {
    return 'a > .OrderProducts-productImage'
  }
  get productSize() {
    return '.OrderProducts-product .OrderProducts-productSize'
  }
  get productTitle() {
    return 'a > .OrderProducts-productName'
  }
  get productWasPrice() {
    return '.HistoricalPrice-old .Price'
  }
  get productNowPrice() {
    return '.HistoricalPrice-promotion .Price'
  }
  get quantitySelectionDropdown() {
    return '.FormComponent-bagItemQuantity .Select-container .Select-select'
  }
  get saveChangesButton() {
    return '.OrderProducts-saveButton'
  }
  get sizeSelectionDropdown() {
    return '.FormComponent-bagItemSize .Select-container .Select-select'
  }
  get removeItemButton() {
    return 'button.OrderProducts-deleteText'
  }
  get removeItemModalSubmitButton() {
    return '.OrderProducts-modal > .Button'
  }
  get closeBagConfirmationModal() {
    return isMobileLayout() ? '.MiniBag-emptyBag > .Button' : '.ContentOverlay'
  }
  get checkoutButtonLock() {
    return '.MiniBag-lock'
  }
  get minibagDrawer() {
    return cy.get('.is-open .MiniBag')
  }
  get minibagContainer() {
    return cy.get('.MiniBag-content')
  }

  get promoCodeExpanderHeader() {
    return '.MiniBag-content .PromotionCode-headerContainer'
  }

  get deliveryOptionsSelector() {
    return '#miniBagDeliveryType'
  }

  get emptyBagLabel() {
    return '.MiniBag-emptyLabel'
  }

  get miniBagIcon() {
    return isMobileLayout()
      ? '.Header-shoppingCartIconbutton'
      : '.ShoppingCart-icon'
  }

  get minibagTotalPrice() {
    return '.Price.OrderProducts-price'
  }

  get addToWishList() {
    return '.OrderProducts-addToWishlistLabel'
  }

  get firstItemInMinibag() {
    return '.OrderProducts-wrapper > :nth-child(1)'
  }

  get eligibleFreeDeliveryThresholdMessage() {
    return '.FreeShippingMessage > .FreeShippingMessage-success'
  }

  get eligibleFreeDeliveryThresholdMessageOnQuickView() {
    return '.FreeShippingMessage > .FreeShippingMessage-success'
  }

  get achiveFreeDeliverThresholdMessage() {
    return '.FreeShippingMessage-info'
  }
  /**
   * USER ACTIONS **************************************************************
   */

  invokeCurrentProductSizeOfProductAs(number, variableToStore) {
    cy.get(this.productSize)
      .eq(number - 1)
      .invoke('text')
      .as(variableToStore)
  }

  editAndChangeSizeForProductNumberTo(number, size) {
    cy.get(this.editProductButton)
      .eq(number - 1)
      .click()
      .get(this.sizeSelectionDropdown)
      .eq(number - 1)
      .select(size)
    return this
  }

  editAndChangeQuantityForProductNumberTo(number, quantity) {
    cy.get(this.editProductButton)
      .eq(number - 1)
      .click()
      .get(this.quantitySelectionDropdown)
      .eq(number - 1)
      .select(quantity)
    return this
  }

  removeProductFromBasketWithIndex(index) {
    return cy
      .get(this.removeItemButton)
      .eq(index)
      .click({ force: true })
      .get(this.removeItemModalSubmitButton)
      .click({ force: true })
  }

  saveChanges() {
    cy.get(this.saveChangesButton).click()
    return this
  }

  moveToCheckout() {
    cy.get(this.checkoutButton)
      .eq(0)
      .click()
    return this
  }

  continueShopping() {
    return cy.get(this.closeBagConfirmationModal).click()
  }

  clickOnOverlay() {
    return cy.get(this.closeBagConfirmationModal).click()
  }

  miniBagClose() {
    return cy.get(this.miniBagCloseButton).click()
  }

  scrollToTheBottomOfMinibag() {
    return this.minibagContainer.scrollTo('bottom')
  }

  clickProductTitleInMiniBag() {
    return cy.get(this.productTitle).click()
  }

  clickProductImageInMiniBag() {
    return cy.get(this.productImage).click()
  }

  expandPromoCode() {
    return cy.get(this.promoCodeExpanderHeader).click()
  }

  selectDeliveryOptionAtIndex(index) {
    cy.get(this.deliveryOptionsSelector)
      .get('option')
      .eq(index)
      .then((option) => {
        return cy.get(this.deliveryOptionsSelector).select(option.val())
      })
    return this
  }

  getProductTitleInMiniBag() {
    return cy.get(this.productTitle)
  }

  open() {
    cy.get(this.miniBagIcon).click()
    return this
  }

  selectMoveToWishList() {
    cy.get(this.addToWishList).click({
      force: true,
    })
  }

  wait(alias) {
    cy.wait(alias)
    return this
  }

  /**
   * ASSERTIONS ******************************************************
   */

  assertItemWasNowPrices(item, was, now) {
    cy.contains(this.productContainer, item)
      .find(this.productWasPrice)
      .should('contain', was)
    cy.contains(this.productContainer, item)
      .find(this.productNowPrice)
      .should('contain', now)
    return this
  }

  isEmpty() {
    return cy.get(this.emptyBagLabel).contains('Your shopping bag is empty.')
  }

  expectDeliveryOptionToBeSelected(index) {
    return cy
      .get(this.deliveryOptionsSelector)
      .get('option')
      .eq(index)
      .then((option) => {
        return cy
          .get(this.deliveryOptionsSelector)
          .should('have.value', option.val())
      })
  }

  expectSizeOfProductNumberToNotEqual(number, previousValue) {
    cy.get(this.productSize)
      .eq(number)
      .invoke('text')
      .should('not.be.undefined')
      .and('not.equal', previousValue)
    return this
  }

  expectProductAToHaveDifferentSizeThanProductB(prodA, prodB) {
    cy.get(this.productSize)
      .eq(prodA - 1)
      .invoke('text')
      .as('prodAsize')
    cy.get(this.productSize)
      .eq(prodB - 1)
      .invoke('text')
      .should('not.be.undefined')
      .and('not.equal', this.prodAsize)
    return this
  }

  expectProductToHaveSize(size) {
    cy.get(this.editProductSizeDropdown).should('be', size)
    return this
  }

  expectProductToHaveQuantity(quantity) {
    cy.get(this.editProductQuantityDropdown).should('be', quantity)
    return this
  }

  expectToBeOpen() {
    this.minibagDrawer.should('be.visible')
    return this
  }

  expectNumberOfProductsToBe(number) {
    cy.get(this.productContainer).should('have.length', number)
    return this
  }

  assertDDPinBag() {
    cy.get(this.editProductButton).should('not.be.visible')
    cy.get(this.productSize).should('not.be.visible')
    return this
  }

  assertLockInCheckout(visiblity) {
    return visiblity
      ? cy.get(this.checkoutButtonLock).should('be.visible')
      : cy.get(this.checkoutButtonLock).should('not.be.visible')
  }

  verifyDeliveryThresholdMessage(pageIs) {
    cy.get(this.minibagTotalPrice)
      .invoke('text')
      .then((minibasketTotal) => {
        const splitMiniBasketAmount = minibasketTotal.split('£')
        const miniBasketAmount = parseInt(splitMiniBasketAmount[1], 10)
        cy.log(minibasketTotal)
        if (miniBasketAmount < 50) {
          cy.get(this.eligibleFreeDeliveryThresholdMessage).should(
            'not.be.visible'
          )
        } else if (miniBasketAmount >= 50) {
          if (pageIs === 'quickView') {
            cy.get(this.eligibleFreeDeliveryThresholdMessageOnQuickView).should(
              'be.visible'
            )
            cy.get(this.eligibleFreeDeliveryThresholdMessageOnQuickView)
              .invoke('text')
              .then((thresholdMessage) => {
                expect(thresholdMessage).to.contain(
                  'Your bag qualifies for free shipping'
                )
              })
          } else {
            cy.get(this.eligibleFreeDeliveryThresholdMessage).should(
              'be.visible'
            )
            cy.get(this.eligibleFreeDeliveryThresholdMessage)
              .invoke('text')
              .then((thresholdMessage) => {
                expect(thresholdMessage).to.contain(
                  'Your bag qualifies for free shipping'
                )
              })
          }
        }
      })
  }
}
