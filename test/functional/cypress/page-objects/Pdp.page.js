import { isMobileLayout } from './../lib/helpers'
import { getRouteFromUrl } from '../../../../src/shared/lib/get-product-route'
import Navigation from './Navigation.page'
import productMocks from '../mock-helpers/productMockSetup'

const navigation = new Navigation()

const userDetailsForOutOfStock = {
  firstName: 'ItemOutOf',
  lastName: 'Stock',
  email: 'itembackinstock@gmail.co.uk',
}

export default class Pdp extends productMocks {
  get addToBagButton() {
    return '.AddToBag .Button'
  }
  get sizeSelectionDropdown() {
    return '.Select-container .Select-select'
  }
  get mobileViewBagButtonOnConfirmationModal() {
    return '.AddToBagConfirm-viewBag'
  }
  get mobileCloseBagConfirmationModal() {
    return 'button.Modal-closeIcon'
  }
  get miniproductErrorMessage() {
    return '.BundlesSizes-error'
  }
  get tileSizes() {
    return '.ProductSizes-list'
  }
  get errorMessage() {
    return '.is-error'
  }
  get productSize() {
    return '.ProductSizes-item'
  }
  get selectedCarouselImage() {
    return '.is-selected .Carousel-image'
  }
  get selectedProductTitle() {
    return '.ProductDetail-title'
  }
  get modalCarousel() {
    return '.Modal-children .Carousel-images'
  }
  get modalNewsletter() {
    return 'div.Modal'
  }
  get findInStoreDisclaimer() {
    return '.FindInStore-disclaimer'
  }
  get selectedModalCarouselImage() {
    return '.Modal-children .is-selected .Carousel-image'
  }
  get carouselNext() {
    return '.Carousel-arrow--right'
  }
  get findStoreButton() {
    return isMobileLayout()
      ? '.FindInStoreButton'
      : '.FindInStoreButton-desktopWrapper'
  }
  get findInStoreModal() {
    return '.FindInStore'
  }

  get storesListSearchResult() {
    return '.FindInStore-storeList > .Store'
  }

  get backInStockModalFirstName() {
    return '.Input-field-firstName'
  }

  get backInStockModalLastName() {
    return '.Input-field-surname'
  }

  get backInStockModalEmail() {
    return '.Modal-children .FormComponent-email .Input-container #email-email'
  }

  get backInStockModalButton() {
    return '.NotifyProduct-submitButton'
  }

  get backInStockModalConfirmationMessage() {
    return '.Modal--roll .Modal-children p'
  }

  get backInStockModalConfirmationButton() {
    return '.Modal-children .Button'
  }

  get breadCrumbs() {
    return '.ProductsBreadCrumbs-item'
  }

  get swatch() {
    return '.Swatch--pdp .Swatch-link'
  }

  get carouselImage() {
    return '.Carousel-image'
  }

  get googleStaticMap() {
    return '.GoogleMap--staticMap > img'
  }

  get googleDynamicMap() {
    return '.GoogleMap-map'
  }

  get logoImage() {
    return 'a.HeaderTopshop-brandLink'
  }

  get wishlistButton() {
    return '.WishlistButton-icon'
  }

  get storeFinderUserInput() {
    return '#UserLocatorInput'
  }

  get storeFinderResults() {
    return '.StoreLocator-resultsContainer'
  }

  get quantitySelector() {
    return '#productQuantity'
  }

  get itemNotAvailableHeader() {
    return '.OutOfStockProductDetail-pageHeading'
  }

  get sizeGuide() {
    return '.SizeGuide-link'
  }

  get productDetailHeader() {
    return '.Accordion-title'
  }

  get productDetail() {
    return '.OOSProductDescription-content'
  }

  get recentlyViewed() {
    return '.RecentlyViewed'
  }

  /**
   * USER ACTIONS **************************************************************
   */
  viewBagFromConfirmationModal() {
    if (isMobileLayout()) {
      cy.get(this.mobileViewBagButtonOnConfirmationModal, {
        timeout: 10000,
      }).should('be.visible')
      cy.get(this.mobileViewBagButtonOnConfirmationModal).click()
    }
    return this
  }

  closeAddConfirmationModal() {
    if (isMobileLayout()) {
      cy.get(this.mobileCloseBagConfirmationModal, { timeout: 10000 }).should(
        'be.visible'
      )
      return cy.get(this.mobileCloseBagConfirmationModal).click()
    }
  }

  selectFirstSizeFromTiles() {
    cy.get(this.productSize)
      .first()
      .click()
    return this
  }

  selectLastSizeFromModalTiles() {
    cy.get(this.productSize)
      .last()
      .click()
    return this
  }

  addToBag({ onlyFirstItem = false } = {}) {
    if (onlyFirstItem) {
      cy.get(this.addToBagButton)
        .eq(0)
        .click()
    } else {
      cy.get(this.addToBagButton).click({ multiple: true })
    }
    return this
  }

  clickOnImageCarousel() {
    return cy.get(this.selectedCarouselImage).click()
  }

  clickNextOnImageCarousel() {
    return cy.get(this.carouselNext).click()
  }

  clickLogoImage() {
    return cy
      .scrollTo('top')
      .get(this.logoImage)
      .click()
  }

  verifySizeOptionsLessThan(number) {
    return cy
      .get(this.tileSizes)
      .children()
      .should('have.length.lessThan', number)
  }

  verifySizeOptionsMoreThan(number) {
    return cy
      .get(this.sizeSelectionDropdown)
      .children()
      .should('have.length.greaterThan', number)
  }

  findInStore() {
    cy.get(this.findStoreButton).click()
    return this
  }

  modalBackInStockUserDetails() {
    cy.get(this.backInStockModalFirstName)
      .type(userDetailsForOutOfStock.firstName)
      .get(this.backInStockModalLastName)
      .type(userDetailsForOutOfStock.lastName)
      .get(this.backInStockModalEmail)
      .type(userDetailsForOutOfStock.email)
    return this
  }

  backInStockButton() {
    cy.get(this.backInStockModalButton).click()
    return this
  }

  clickBackInStockConfirmationButton() {
    return cy.get(this.backInStockModalConfirmationButton).click()
  }

  clickOnBreadCrumb(number) {
    return cy
      .get(this.breadCrumbs)
      .eq(number)
      .click()
  }

  clickOnSwatch(number) {
    return cy
      .get(this.swatch)
      .eq(number)
      .click()
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }

  verifyPreSelecteSize(size) {
    cy.get('.ProductSizes-list>button')
      .find('span.is-active')
      .should('have.text', size)
  }

  clickWishlistButton() {
    return cy.get(this.wishlistButton).click()
  }

  openRecommendedProductQuickViewModal(position) {
    return cy
      .get(
        `:nth-child(${position}) > .Product > .Product-meta > .Product-info > .ProductQuickViewButton`
      )
      .click()
  }

  /**
   * ASSERTIONS **************************************************************
   */
  expectModalCarouselToBeOpen() {
    return cy.get(this.modalCarousel).should('be.visible')
  }

  expectModalCarouselImageToHaveSrc(src) {
    return cy.get(this.selectedModalCarouselImage).then((image) => {
      expect(image.attr('src')).to.equal(src)
    })
  }

  expectSwatchClickToReturnNewData(pdpData, index) {
    return cy.get(this.carouselImage).then((image) => {
      this.clickOnSwatch(index)

      cy.location('pathname').should(
        'eq',
        getRouteFromUrl(pdpData.colourSwatches[index].productUrl)
      )

      cy.get(this.carouselImage).then((nextImage) => {
        expect(image).to.not.equal(nextImage)
      })
    })
  }

  assertNewsletterSignup() {
    cy.get(navigation.miniBagIcon)
      .trigger('mousemove')
      .get(this.modalNewsletter)
      .should('be.visible')
  }

  savePdpImageSrc(history) {
    cy.get(this.selectedProductTitle, { timeout: 10000 })
      .invoke('text')
      .then((value) => {
        history.push(value)
      })
  }

  assertLocationInputValue(value) {
    cy.get(this.storeFinderUserInput).should('have.attr', 'value', value)
    return this
  }

  assertStoreMapVisibility(assert) {
    cy.get(this.storeFinderUserInput).should(assert)
    return this
  }

  assertStoreFinderResultsExist() {
    cy.get(this.storeFinderResults).should('to.exist')
    return this
  }

  expectQuantitySelectorNotBeVisible() {
    cy.get(this.quantitySelector).should('not.be.visible')
    return this
  }

  assertItemNotAvailableHeading() {
    cy.get(this.itemNotAvailableHeader)
      .should('be.visible')
      .should('have.text', 'Item not available')
    return this
  }

  assertItemNotAvailablePage() {
    cy.get(this.productSize).should('not.be.visible')
    cy.get(this.sizeGuide).should('not.be.visible')
    cy.get(this.addToBagButton).should('not.be.visible')
    cy.get(this.findStoreButton).should('not.be.visible')
    return this
  }

  assertOOSProductDetails() {
    cy.get(this.productDetailHeader).should(
      'have.attr',
      'aria-pressed',
      'false'
    )
    cy.get(this.productDetail).should('not.be.visible')
    cy.get(this.productDetailHeader).click()
    cy.get(this.productDetailHeader).should('have.attr', 'aria-pressed', 'true')
    cy.get(this.productDetail).should('be.visible')
  }

  assertRecentlyViewedProduct() {
    cy.get(this.recentlyViewed).should('be.visible')
  }

  assertDressipiRecommendationsCarousel(isDressipi) {
    return isDressipi
      ? cy.get('.Recommendations').should('have.class', 'Dressipi')
      : cy.get('.Recommendations .Dressipi').should('not.be.visible')
  }
}
