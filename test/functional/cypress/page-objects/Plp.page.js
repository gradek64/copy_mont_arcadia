import ProductDetailPage from './Pdp.page'
import { changeToNumber } from '../lib/utils'
import { isMobileLayout } from '../lib/helpers'
import productMocks from '../mock-helpers/productMockSetup'

const Pdp = new ProductDetailPage()

export default class Plp extends productMocks {
  get refinementValueOption() {
    return isMobileLayout()
      ? '.Refinements .ValueOption-link'
      : '.ValueOption-label'
  }

  get filtersResults() {
    return '.Filters .Filters-totalResults'
  }

  get clearAllFilters() {
    return isMobileLayout()
      ? '.Refinements-clearButton'
      : '.RefinementSummary-clearRefinementsButton'
  }

  get refinementSummaryValue() {
    return '.RefinementSummary-value'
  }

  get refinementSummaryValueInner() {
    return '.RefinementSummary-valueInner'
  }

  get refinementSummaryTitle() {
    return '.RefinementSummary-item > .RefinementSummary-itemTitle'
  }

  get refinementSummaryMinPrice() {
    return '.RefinementSummary-valueInner > div > :nth-child(1)'
  }

  get refinementSummaryMaxPrice() {
    return '.RefinementSummary-valueInner > div > :nth-child(2)'
  }

  get refinementSummaryRemoveFilterButton() {
    return '.RefinementSummary-removeTextValue'
  }

  get priceSliderLabel() {
    return '.Slider > span.Slider-label'
  }

  get productCarouselItem() {
    return '.ProductCarouselItem img'
  }

  get categoryShoesLink() {
    return isMobileLayout()
      ? '.Categories-listItem208492 > .ListItemLink'
      : '.category_208492 > .MegaNav-categoryLink'
  }

  get categoryClothesLink() {
    return isMobileLayout()
      ? '.Categories-listItem203984 > .ListItemLink'
      : '.category_203984 > .MegaNav-categoryLink'
  }

  get categoryClothesLinkMobile() {
    return '.Categories-listItem203984 > .ListItemLink'
  }

  get categoryBrandsLink() {
    return '.category_2244743 > .MegaNav-categoryLink'
  }

  get subCategoryDressesLinkMobile() {
    return '.Categories-listItem208523 > .ListItemLink'
  }

  get subCategoryCalvinKleinLink() {
    return '.category_3291029 > a'
  }

  get subCategoryShopAllShoesLink() {
    return '.Categories-listItem331499 > .ListItemLink'
  }

  get categoryBrandLink() {
    return '.MegaNav-category category_2244743 MegaNav-category--isNotTouch'
  }

  get accordionGroup() {
    return isMobileLayout()
      ? '.Refinements-content .Accordion.Accordion-groupMember'
      : '.Accordion.Accordion-groupMember'
  }

  get accordionHeader() {
    return '.Accordion-header'
  }

  get productList() {
    return '.ProductList-products'
  }

  get productImage() {
    return '.ProductImages'
  }

  get historicalPrice() {
    return '.ProductList-products .HistoricalPrice > span'
  }

  get quickViewButton() {
    return '.ProductQuickViewButton'
  }

  get productList9thProduct() {
    return `.ProductList-products > :nth-child(${9})`
  }

  get productListFirstProduct() {
    return '.ProductList-products > :nth-child(plpProdNum)'
  }

  get productListAllProducts() {
    return '.ProductList-products > .Product'
  }

  get firstImageAttribute() {
    return 'div.ProductImages:nth-child(1) picture > img'
  }

  get notFound() {
    return '.NotFound'
  }

  get noSearchResults() {
    return '.NoSearchResults-message'
  }

  get failedSearch() {
    return '.NoSearchResults'
  }

  get failedSearchInput() {
    return '.SearchInput-search'
  }

  get addToWishlistButton() {
    return '.WishlistButton--plp'
  }

  get firstProductWishlistButton() {
    return ':nth-child(1) > :nth-child(1) > .Product-link > .Product-images > .ProductImages > .WishlistButton > div > .WishlistButton-icon'
  }

  get trendingProductMessage() {
    return '.SocialProofCarouselOverlay-container'
  }

  get mobileCookiesButton() {
    return '.CookieMessage-button'
  }

  get recentlyViewedWidget() {
    return '.RecentlyViewedTab-toggleButton'
  }

  get socialProofProductOverlay() {
    return '.SocialProofProductOverlay--badgeText'
  }

  get productAttributeBanner() {
    return '.ProductAttributeBanner'
  }

  get productLinks() {
    return '.Product-link'
  }

  get noSearchResultsMesssage() {
    return isMobileLayout()
      ? '.NoSearchResults-message'
      : '.NoSearchResults--isFiltered'
  }

  get noSearchResultsMesssageFilterSection() {
    return '.EnhancedMessage-message'
  }

  get markettingSlider() {
    return 'div.MarketingSlideUp-content'
  }

  /**
   * USER ACTIONS **************************************************************
   */

  clickClearAll() {
    cy.get(this.clearAllFilters).click()
    return this
  }

  selectQuickViewForItem(num) {
    cy.get(this.quickViewButton)
      .eq(num)
      .click()
      .wait(2000)
      .get(Pdp.addToBagButton)
  }

  verifyTrendingProductOnQuickView(visiblity) {
    return visiblity
      ? cy
          .get(this.trendingProductMessage)
          .invoke('text')
          .should(
            'contain',
            'Trending ProductThis style is selling fast!Shop it before'
          )
      : cy.get('this.trendingProductMessage').should('not.be.visible')
  }

  verifyTrendingProductOnPLP(num, visiblity) {
    return visiblity
      ? cy
          .get('.Product-meta')
          .eq(num)
          .invoke('text')
          .should('contain', 'Trending Product')
      : cy.get('.SocialProofProductMetaLabel').should('not.be.visible')
  }

  verifyTrendingProductOnPDP() {
    const trendingMessagePDP = isMobileLayout()
      ? 'Trending ProductShop it before'
      : 'Trending ProductThis style is selling fast!Shop it before'
    cy.get(this.trendingProductMessage)
      .invoke('text')
      .should('contain', trendingMessagePDP)
  }

  clickOnTrendingProduct(num) {
    cy.get('.Product-images')
      .eq(num)
      .click()
  }

  verifyProductAttributeBanner(num, visiblity) {
    cy.get(this.productLinks)
      .eq(num)
      .within(() => {
        return visiblity
          ? cy.get(this.productAttributeBanner).should('be.visible')
          : cy.get(this.productAttributeBanner).should('not.be.visible')
      })
  }

  verifySocialProofOverlayOnPLP(num, visiblity) {
    return visiblity
      ? cy
          .get(this.productLinks)
          .eq(num)
          .find(this.socialProofProductOverlay)
          .invoke('text')
          .should((text) => {
            expect(text).equal('HURRY, SELLING FAST!')
          })
      : cy.get(this.socialProofProductOverlay).should('not.be.visible')
  }

  hoverOnFirstProduct() {
    cy.get(this.productImage)
      .first()
      .trigger('mouseover')
  }

  clickPlpProduct(prodNum) {
    const elmString = this.productListFirstProduct.replace(
      'plpProdNum',
      prodNum
    )
    cy.get(elmString).click()
    return this
  }

  clickOnFilterGroup(type) {
    cy.contains(this.accordionGroup, type)
      .within(($ele) => {
        const notExpanded = !$ele.hasClass('is-expanded')
        if (notExpanded) {
          cy.get(this.accordionHeader).click()
        }
      })
      .end()
    return this
  }

  clickOnFilter(filterValue) {
    cy.contains(this.refinementValueOption, filterValue).click()
    return this
  }

  clickOnCategoryLink(category) {
    let catLink = ''
    switch (category) {
      case 'Shoes':
        catLink = this.categoryShoesLink
        break

      case 'Clothing':
        catLink = this.categoryClothesLink
        break

      case 'Dresses':
        catLink = this.categoryDresses
        break

      case 'Brands':
        catLink = this.categoryBrandLink
        break

      default:
        catLink = ''
        break
    }

    cy.get(catLink)
      .trigger('mouseover')
      .click()
    return this
  }

  clickOnSubCategoryLink(subCategory) {
    let catLink = ''
    let subCatLink = ''
    switch (subCategory) {
      case 'Calvin Klein':
        catLink = this.categoryBrandsLink
        subCatLink = this.subCategoryCalvinKleinLink
        break

      case 'Shop All Shoes':
        subCatLink = this.subCategoryShopAllShoesLink
        break

      default:
        catLink = ''
        subCatLink = ''
        break
    }

    if (catLink) {
      cy.get(catLink)
        .trigger('mouseover')
        .get(subCatLink)
        .trigger('mouseover')
    }

    cy.get(subCatLink).click()

    return this
  }

  scrollToPage(page) {
    const productsPerPage = 24
    const childIndex = (page - 1) * productsPerPage - 1
    cy.get(`.ProductList-products > :nth-child(${childIndex})`)
      .scrollIntoView({ duration: 3000 })
      .end()
    return this
  }

  getPriceSlider(type) {
    return isMobileLayout()
      ? cy.get(
          `.is-expanded > .Accordion-wrapper > .Accordion-content > .RefinementOptions > .RangeOption > .Slider > .Slider-handle--${type}Handle > .Slider-icon`
        )
      : cy.get(`.Slider-handle--${type}Handle > .Slider-icon`)
  }

  slideToPrice(type, distance) {
    this.getPriceSlider(type)
      .trigger('mousedown', { which: 1, pageX: 0, pageY: 0 })
      .trigger('mousemove', { which: 1, pageX: distance, pageY: 0 })
      .trigger('mouseup')
    return this
  }

  clickToRemoveFilterFromSummary(value) {
    if (value === 'Price') {
      cy.contains(this.refinementSummaryTitle, value)
        .next()
        .find(this.refinementSummaryRemoveFilterButton)
        .click()
    } else {
      cy.contains(this.refinementSummaryValueInner, value)
        .next()
        .click()
    }
    return this
  }

  sortBy(option) {
    cy.get('#sortSelector').select(option)
    return this
  }

  clickOnFilterButton() {
    if (isMobileLayout()) {
      cy.get('.Filters-refineButtonContainer > .Button', {
        timeout: 10000,
      }).should('be.visible')
      cy.get('.Filters-refineButtonContainer > .Button').click()
    }
    return this
  }

  refinementsScrollTo(position) {
    cy.get('.Refinements .RefinementList').scrollTo(position, {
      easing: 'linear',
    })
    return this
  }

  clickOnMenuButtonMobile() {
    cy.get('.Header-burgerButtonContainer').click()
    return this
  }

  clickOnCategoryLinkMobile(category) {
    let catLink = ''
    switch (category) {
      case 'Clothing':
        catLink = this.categoryClothesLinkMobile
        break

      default:
        catLink = 'Dresses'
        break
    }

    cy.get(catLink).click()
    return this
  }

  clickOnSubCategoryLinkMobile(subCategory) {
    let subCatLink = ''
    switch (subCategory) {
      case 'Dresses':
        subCatLink = this.subCategoryDressesLinkMobile
        break

      default:
        subCatLink = ''
        break
    }

    cy.get(subCatLink).click()
    return this
  }

  clickOnApplyFiltersButton() {
    cy.get('.Refinements-applyButton').click()
    return this
  }

  addItemToWishlist(index) {
    cy.get(this.addToWishlistButton)
      .eq(index)
      .click()
    return this
  }

  clickFirstProduct() {
    cy.get(this.productImage)
      .first()
      .click()
    return this
  }

  mobileAcceptAndCLoseCookies() {
    cy.get(this.mobileCookiesButton, { timeout: 10000 }).should('be.visible')
    cy.get(this.mobileCookiesButton).click()
  }

  addToWishlistFirstProduct() {
    cy.get(this.firstProductWishlistButton).click()
    return this
  }

  selectShoesCatHeader() {
    if (isMobileLayout()) {
      this.clickOnMenuButtonMobile()
      cy.get(this.categoryShoesLink).click()
      cy.get(this.subCategoryShopAllShoesLink).click()
    } else {
      this.clickOnCategoryLink('Shoes')
    }
    return this
  }

  selectProducts(noOfProducts, history) {
    for (let product = 0; product < noOfProducts; product++) {
      cy.get(this.productListAllProducts)
        .eq(product)
        .click()
      Pdp.savePdpImageSrc(history)
      cy.go('back')

      if (product === 9) {
        this.assertRecentlyViewedWidget(true)
        this.verifyProductsInWidget(history)
      }
    }
    return this
  }

  closeMarkettingSlider() {
    cy.get('button.MarketingSlideUp-closeButton').click()
  }

  /**
   * ASSERTIONS **************************************************************
   */

  expectWishlistButtonToBeFilled(index) {
    cy.get(this.addToWishlistButton)
      .eq(index)
      .within(() => {
        cy.get('i').should('have.class', 'is-selected')
      })

    return this
  }

  expectProductListLinkItemTextToBe(item, text, contain = 'contain') {
    cy.get(
      `.ProductList-products:nth-child(${item}) .Product-meta .Product-name a.Product-nameLink`
    ).should(contain, text)
    return this
  }

  expectCategoryTitleToBe(text) {
    cy.get('.PlpHeader-title').should('contain', text)
    return this
  }

  expectResultsToBe(num) {
    cy.get(this.filtersResults, { timeout: 10000 }).should(
      'have.text',
      `${num} results`
    )
    return this
  }

  expectFilterSummaryValueToBe(text) {
    cy.get(this.refinementSummaryValue).should('have.text', text)
    return this
  }

  wait(alias) {
    cy.wait(alias)
    return this
  }

  expectResults() {
    cy.get(this.notFound)
      .should('not.be.visible')
      .get(this.noSearchResults)
      .should('not.be.visible')
      .get(this.productList)
      .should('be.visible')

    return this
  }

  expectPdpReloadAndReturnSuccess() {
    cy.reload()
      .wait(500) // for some reason this stops Cypress
      // picking up 'removeChild' error
      .go('back')
      .get(this.notFound)
      .should('not.be.visible') // 404
      .get(this.noSearchResults)
      .should('not.be.visible')
      .get(this.productList)
      .should('be.visible')
  }

  expectFilterGroupNotToExist(filterType) {
    cy.get(this.accordionGroup)
      .contains(filterType)
      .should('not.contain', filterType)
    return this
  }

  expectFilterGroupToBeExpanded(type) {
    cy.contains(this.accordionGroup, type).should('have.class', 'is-expanded')
    return this
  }

  expectFilterGroupNotToBeExpanded(type) {
    cy.contains(this.accordionGroup, type).should(
      'not.have.class',
      'is-expanded'
    )
    return this
  }

  expectSummaryTitleToExist(filterType) {
    cy.get(this.refinementSummaryValueInner).should('contain', filterType)
    return this
  }

  expectSummaryTitleNotToExist(filterType) {
    cy.get(this.refinementSummaryValueInner).should('not.contain', filterType)
    return this
  }

  expectSummaryFilterGroupToExist(filterType) {
    cy.get('.RefinementSummary-itemTitle')
      .contains(filterType)
      .should('contain', filterType)
    return this
  }

  expectClearAllToBeDisabled() {
    cy.get(this.clearAllFilters).should('to.have.attr', 'disabled')
    return this
  }

  expectClearAllToBeEnabled() {
    cy.get(this.clearAllFilters).should('not.to.have.attr', 'disabled')
    return this
  }

  expectSummaryFilterGroupNotToExist(filterType) {
    cy.get('.RefinementSummary-itemTitle')
      .contains(filterType)
      .should('not.contain', filterType)
    return this
  }

  expectProductListLengthToBe(index) {
    cy.get(this.productList)
      .children()
      .should('have.length', index)
    return this
  }

  expectFilterNotToBeChecked(filterType, filterValue) {
    cy.contains(this.accordionHeader, filterType)
      .next()
      .find(`[name=${filterType.toLowerCase()}-${filterValue.toLowerCase()}]`)
      .should('not.to.be.checked')
    return this
  }

  expectFilterPriceToMatchSummaryPrice() {
    cy.get(this.priceSliderLabel).then((ele) => {
      const minPrice = ele[0].innerText
      const maxPrice = ele[1].innerText

      cy.contains(this.refinementSummaryTitle, 'Price')
        .next()
        .get(this.refinementSummaryMinPrice)
        .should('have.text', minPrice)

      cy.contains(this.refinementSummaryTitle, 'Price')
        .next()
        .get(this.refinementSummaryMaxPrice)
        .should('have.text', maxPrice)
    })
    return this
  }

  expectFilterMenuVisible() {
    cy.get('.Refinements').should('have.class', 'is-shown')
    return this
  }

  expectAccordionHeaderToContain(value) {
    cy.get('.RefinementList-selection.is-value').should('contain', value)
  }

  expectAccordionHeaderNotToContain(value) {
    cy.get('.RefinementList-selection.is-value').should('not.contain', value)
  }

  expectProductListToBeOrderedBy(option) {
    cy.get(this.historicalPrice)
      .not('.HistoricalPrice-was')
      .not('.HistoricalPrice-label')
      .then(($ele) => {
        switch (option) {
          case 'Price - High To Low': {
            let cache = changeToNumber($ele[0].innerText)
            // eslint-disable-next-line
            for (const ele of $ele) {
              const price = changeToNumber(ele.innerText)
              expect(price).to.be.at.most(cache)
              if (cache >= price) cache = price
            }
            break
          }

          case 'Price - Low To High': {
            let cache = changeToNumber($ele[0].innerText)
            // eslint-disable-next-line
            for (const ele of $ele) {
              const price = changeToNumber(ele.innerText)
              expect(price).to.be.at.least(cache)
              if (cache <= price) cache = price
            }
            break
          }

          default:
            break
        }
      })
  }

  expectTrendingLogoOnPLP() {
    cy.get('.ProductList-products >div')
      .find('.Product-meta')
      .should(($div) => {
        const text = $div.first().text()
        cy.get(this.quickViewButton)
          .eq(1)
          .click()
        expect(text).to.contain('Trending Product')
      })
  }

  assertFailedSearchPage() {
    cy.get(this.failedSearch, { timeout: 10000 }).should('be.visible')
  }

  assertRecentlyViewedWidget(visiblity) {
    return visiblity
      ? cy.get(this.recentlyViewedWidget).click()
      : cy.get(this.recentlyViewedWidget).should('not.be.visible')
  }

  verifyProductsInWidget(productsHistory) {
    cy.get(productsHistory)
      .its('length')
      .then((productLength) => {
        if (productLength > 10) {
          cy.get(this.productCarouselItem).should('have.length', 10)
          cy.get(this.productCarouselItem)
            .eq(9)
            .then((image) => {
              cy.get(image).should('not.have.attr', 'title', productsHistory[0])
            })
        } else {
          for (let i = 0; i < productLength; i++) {
            cy.get(this.productCarouselItem)
              .eq(i)
              .then((image) => {
                cy.get(image).should(
                  'have.attr',
                  'title',
                  productsHistory[productLength - i - 1]
                )
              })
          }
        }
      })
  }

  viewProductFromWidget() {
    cy.get(this.productCarouselItem)
      .eq(0)
      .click({ force: true })
    cy.get(Pdp.addToBagButton).should('be.visible')
    cy.get('.Modal > .Modal-closeIcon > span').click()
    this.assertRecentlyViewedWidget(true)
    cy.get(this.productCarouselItem)
      .eq(0)
      .should('not.be.visible')
    this.closeRecentlyViewedWidget()
  }

  closeRecentlyViewedWidget() {
    cy.get('.RecentlyViewedTab-closeButton').click()
    this.assertRecentlyViewedWidget(false)
  }

  expectNoResultsMessageToBeDisplayed() {
    cy.get(this.noSearchResultsMesssage).should('be.visible')
  }

  expectNoResultsMessageMobileFilterToBeDisplayed() {
    cy.get(this.noSearchResultsMesssageFilterSection).should('be.visible')
  }

  assertMarkettingSlider(visible) {
    return visible
      ? cy.get(this.markettingSlider).should('be.visible')
      : cy.get(this.markettingSlider).should('not.not.exist')
  }

  expectQuantitySelectorNotBeVisible() {
    return cy.get(this.quickViewQuantitySelector).should('not.be.visible')
  }
}
