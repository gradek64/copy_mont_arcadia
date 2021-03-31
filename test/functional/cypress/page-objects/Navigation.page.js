import { isMobileLayout, checkExistenceOfClass } from './../lib/helpers'
import MiniBag from './MiniBag.page'

const minibag = new MiniBag()

export default class Navigation {
  get searchIcon() {
    return isMobileLayout() ? '.Header-searchButton' : '.SearchBar-icon'
  }

  get searchTermInput() {
    return '.SearchBar-queryInput'
  }

  get performSearchButton() {
    return '.SearchBar-icon'
  }

  get noResultsSearchButton() {
    return '.NoSearchResults > .Button'
  }

  get pdpImage() {
    return '.Carousel-image'
  }

  get contentOverlay() {
    return '.ContentOverlay'
  }

  get recentlyViewed() {
    return '.RecentlyViewed .ProductImages'
  }

  get peeriusRecommends() {
    return '.Recommendations .ProductCarousel-container > :nth-child(2) .Product-link  '
  }

  get miniBagIcon() {
    return isMobileLayout()
      ? '.Header-shoppingCartIconbutton'
      : '.ShoppingCart-icon'
  }

  get myAccountIcon() {
    return isMobileLayout()
      ? '.TopNavMenu-userDetails .Categories-listItem:nth-child(2)'
      : '.AccountIcon-loggedInContainer'
  }

  get myViewProfile() {
    return '.AccountIcon-popover .AccountIcon-popoverButtonMyAccount'
  }

  get mobileBurgerMenu() {
    return '.Header .BurgerButton'
  }

  get mobileBurgerMenuStoreFinderArrow() {
    return '.TopSectionItemLayout-arrow'
  }

  get mobileBurgerMenuStoreFinderPlaceholder() {
    return '#UserLocatorInput[placeholder="Enter town/postcode"]'
  }

  get countrySelector() {
    return '#country'
  }

  get languageSelector() {
    return '#language'
  }

  get mobileShippingCountryAndLanguageText() {
    return '.TopSectionItemLayout-textWrapper div:first'
  }

  get mobileShippingDestinationMenu() {
    return '.ShippingDestinationMobile > .TopSectionItemLayout'
  }

  get desktopShippingDestinationClass() {
    return 'button.ShippingDestination span:nth-child(2)'
  }

  get shippingSelectorButton() {
    return '.ShippingPreferencesSelector-submitButton'
  }

  get flagClass() {
    return `FlagIcons--`
  }

  get shippingDestnationClassMobile() {
    return '.ShippingDestinationMobile span:nth-child(1)'
  }

  get wishlistButton() {
    return '.WishlistHeaderLink-icon'
  }

  get mobileViewBagButtonOnConfirmationModal() {
    return '.AddToBagConfirm-viewBag'
  }

  get navCategory() {
    return '.MegaNav-category'
  }

  get navCategoryLink() {
    return '.MegaNav-categoryLink'
  }

  get navCategoryLinkFirst() {
    return '.MegaNav-category:first .MegaNav-categoryLink'
  }

  get subNav() {
    return '.MegaNav-subNav'
  }

  get cartItemsCount() {
    if (isMobileLayout()) {
      return '.Header-shoppingCartBadgeIcon'
    }

    return '.ShoppingCart-itemsCount'
  }
  /**
   * USER ACTIONS **************************************************************
   */

  click(element) {
    cy.get(element).click()
  }

  clickSearchIcon() {
    cy.get(this.searchIcon).click()
    return this
  }

  typeTermIntoSearchInput(term) {
    cy.get(this.searchTermInput).type(term)
    return this
  }

  clickPerformSearch() {
    cy.get(this.performSearchButton).click()
    return this
  }

  clickNoResultsSearchButton() {
    cy.get(this.noResultsSearchButton).click()
    return this
  }

  clickPDPImage() {
    return cy.get(this.pdpImage).click()
  }

  clickRecentlyViewedImage() {
    return cy.get(this.recentlyViewed).click()
  }

  clickPeeriusRecommends() {
    return cy.get(this.peeriusRecommends).click()
  }

  openMiniBag() {
    cy.get(this.miniBagIcon).click()
    return this
  }

  clickMyAccountIcon() {
    return cy.get(this.myAccountIcon).click()
  }

  clickMyProfile() {
    return cy.get(this.myViewProfile).click({ force: true })
  }

  clickMobileBurgerMenu() {
    return cy.get(this.mobileBurgerMenu).click()
  }

  closeNavigationMenu() {
    return cy.get(this.contentOverlay).click()
  }

  clickStoreFinderArrow() {
    return cy.get(this.mobileBurgerMenuStoreFinderArrow).click()
  }

  checkStoreFinderPlaceholder() {
    if (isMobileLayout()) {
      this.clickMobileBurgerMenu()
      this.clickStoreFinderArrow()
      cy.get(this.mobileBurgerMenuStoreFinderPlaceholder).should('be.visible')
    }
  }

  changeShippingDestination(country, language) {
    if (isMobileLayout()) {
      this.clickMobileBurgerMenu()
      cy.get(this.mobileShippingDestinationMenu).click()
      cy.get(this.countrySelector).select(country)
      if (language) {
        cy.get(this.languageSelector).select(language)
      }
    } else {
      cy.get(this.desktopShippingDestinationClass).click()
      cy.get(this.countrySelector).select(country)
      if (language) {
        cy.get(this.languageSelector).select(language)
      }
    }
    cy.get(this.shippingSelectorButton).click()
  }

  countryFlag(country) {
    return this.flagClass + country
  }

  checkForShippingDestnationFlag(country) {
    if (isMobileLayout()) {
      this.clickMobileBurgerMenu()
      checkExistenceOfClass(
        this.shippingDestnationClassMobile,
        this.countryFlag(country)
      )
    } else {
      checkExistenceOfClass(
        this.desktopShippingDestinationClass,
        this.countryFlag(country)
      )
    }
  }

  hasNumberOfItems(number) {
    cy.contains(this.cartItemsCount, number)
  }

  mouseOver(element, index) {
    cy.get(element)
      .eq(index)
      .trigger('mouseover')
  }

  searchFor(string) {
    this.clickSearchIcon()
    cy.get('#searchTermInput')
      .focus()
      .type(string)
      .type('{enter}')
    return this
  }

  selectWishlistIcon() {
    cy.get(this.wishlistButton)
      .first()
      .click({ force: true })
    return this
  }

  selectMobileViewBag() {
    return cy.get(this.mobileViewBagButtonOnConfirmationModal).click()
  }

  wait(alias) {
    cy.wait(alias)
    return this
  }

  completeThreeClicks() {
    this.clickSearchIcon()
    this.openMiniBag()
    minibag.miniBagClose()
  }
}
