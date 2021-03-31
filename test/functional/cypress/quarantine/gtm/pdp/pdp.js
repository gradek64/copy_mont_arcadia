import '../../../lib/tcombSchemaExtensions'
import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import Navigation from '../../../page-objects/Navigation.page'
import {
  injectPeeriusRecommends,
  injectRecentlyViewed,
  isDesktopLayout,
  eventTypeFilter,
  setFeature,
  isMobileLayout,
} from '../../../lib/helpers'
import * as Schemas from '../../../lib/schemas'
import routes from '../../../constants/routes'
import ProductDetailPage from '../../../page-objects/Pdp.page'
import ProductListingPage from '../../../page-objects/Plp.page'
import StoreLocatorPage from '../../../page-objects/StoreLocator.page'
import multiSizeProduct from '../../../fixtures/pdp/multiSizeProduct/pdpInitialFetch.json'
import recentViewedProd from '../../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import recommendsProd from '../../../fixtures/pdp/peerius/peeriusRecommendsProduct.json'
import peeriusData from '../../../fixtures/pdp/peerius/peeriusRecommends.json'
import recentProds from '../../../fixtures/pdp/recentlyViewed/recentlyViewed.json'
import intialPdp from '../../../fixtures/pdp/preSelectedSize14.json'

const pdpMocks = {
  method: 'GET',
  url:
    '/api/products/en/tsuk/product/clothing-427/orchid-floral-woven-set-7250822',
  response: intialPdp,
}
const pdp = new ProductDetailPage()
const plp = new ProductListingPage()
const navigation = new Navigation()
const strLoc = new StoreLocatorPage()
let path
const timeout = 8000

if (isMobileLayout()) {
  describe('GTM PDP Page Events', () => {
    beforeEach(() => {
      path = pdp.mocksForPdpProduct({
        productByUrl: multiSizeProduct,
      })
      cy.route('GET', routes.storeLocator(), 'fixture:general/storeLocator').as(
        'store-locator'
      )
      injectRecentlyViewed(recentProds)
      cy.visit(path)
    })

    describe('Page load events', () => {
      it('should contain a new "pageView" event', () => {
        getLastGtmEventOfType('pageType').then((event) => {
          expect(event.pageCategory).to.contain('TS:Prod Detail')
          expect(event.pageType).to.equal('TS:Product Display')
        })
      })

      it('should contain a new a new "ecommerce : detail" event', () => {
        getLastGtmEventOfType('ecommerce', 'detail').then((event) => {
          expect(event).to.be.tcombSchema(Schemas.EcommerceDetail)
          expect(event.ecommerce.currencyCode).to.equal('GBP')
          expect(
            event.ecommerce.detail.products[0].sizesAvailable
          ).to.be.tcombSchema(Schemas.StringAvailableSizes)
        })
      })
    })

    describe('Clickevents for find-in-store', () => {
      beforeEach(() => {
        setFeature('FEATURE_FIND_IN_STORE')
      })
      it('should create new clickevents for find in store', () => {
        pdp.findInStore()
        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('findinstore-31600216')
          expect(event.ec).to.equal('pdp')
          expect(event.el).contain(Cypress.config('baseUrl') + path)
        })

        strLoc.sizeSelector('W2428')
        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('productsize-W2428')
          expect(event.ec).to.equal('pdp')
          expect(event.el).contains(Cypress.config('baseUrl') + path)
        })

        strLoc.storeLocatorSearchInPdp('London')
        cy.wait('@store-locator')
        cy.filterGtmEvents({
          filter: (dlItem) => dlItem.ea === 'inStorePostcodeGo',
          timeout,
        }).then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('inStorePostcodeGo')
          expect(event.ec).to.equal('pdp')
          expect(event.el).to.equal('31600216')
        })

        strLoc.expandStoreDetailsFromList(3)
        cy.filterGtmEvents({
          filter: (dlItem) => dlItem.ea === 'inStorePostcodeResult',
          timeout,
        }).then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('inStorePostcodeResult')
          expect(event.ec).to.equal('pdp')
          expect(event.el).to.equal('31600216')
        })
      })
    })

    describe('Clickevent for page image clicks', () => {
      it('should create new event when I scroll the images', () => {
        pdp.clickNextOnImageCarousel()
        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('next')
          expect(event.ec).to.equal('pdp')
          expect(event.el).to.equal('image carousel')
        })
      })

      it('should create new clickevent when I click recently viewed product images', () => {
        pdp.mocksForPdpProduct({
          productByUrl: recentViewedProd,
          productById: recentViewedProd,
        })
        navigation.clickRecentlyViewedImage()
        cy.wait('@product-by-id')
        cy.wait('@product-by-url')

        cy.filterGtmEvents(eventTypeFilter('detail')).then((event) => {
          expect(event.event).to.equal('detail')
          expect(event.ecommerce.detail.actionField.list).to.equal(
            'PDP Recently Viewed'
          )
          expect(event.ecommerce.detail.products[0].category).to.equal('pdp')
        })
        cy.filterGtmEvents(eventTypeFilter('productClick')).then((event) => {
          expect(event.event).to.equal('productClick')
          expect(event.ecommerce.click.actionField.list).to.equal(
            'PDP Recently Viewed'
          )
          expect(event.ecommerce.click.products[0].name).to.equal(
            'Black Bucket Hat'
          )
        })
      })

      it('should create new clickevents when I click recommended product image', () => {
        pdp.mocksForPdpProduct({
          productByUrl: recommendsProd,
          productById: recommendsProd,
        })
        injectPeeriusRecommends(peeriusData)
        navigation.clickPeeriusRecommends()
        cy.wait('@product-by-id')

        cy.filterGtmEvents(eventTypeFilter('detail')).then((event) => {
          expect(event.event).to.equal('detail')
          expect(event.ecommerce.detail.actionField.list).to.equal(
            'PDP Why Not Try'
          )
          expect(event.ecommerce.detail.products[0].category).to.equal('pdp')
        })
        cy.filterGtmEvents(eventTypeFilter('productClick')).then((event) => {
          expect(event.event).to.equal('productClick')
          expect(event.ecommerce.click.actionField.list).to.equal(
            'PDP Recommended Products'
          )
          expect(event.ecommerce.click.products[0].name).to.equal(
            'Sweet Mint Eos Lip Balm'
          )
        })
      })

      it('should create new clickevent when I click recently viewed product images', () => {
        pdp.mocksForPdpProduct({
          productByUrl: recentViewedProd,
          productById: recentViewedProd,
        })
        navigation.clickRecentlyViewedImage()
        cy.wait('@product-by-id')
        cy.wait('@product-by-url')
        cy.filterGtmEvents(eventTypeFilter('productClick')).then((event) => {
          expect(event.event).to.equal('productClick')
          expect(event.ecommerce.click.actionField.list).to.equal(
            'PDP Recently Viewed'
          )
          expect(event.ecommerce.click.products[0].name).to.equal(
            'Black Bucket Hat'
          )
        })
      })

      it('should create impression events for recently viewed products on page', () => {
        cy.filterGtmEvents(eventTypeFilter('impression')).then((event) => {
          expect(event.ecommerce.impressions[0].category).to.equal('pdp')
          expect(event.ecommerce.impressions[0].list).to.equal(
            'PDP Recently Viewed'
          )
        })
      })

      it('should create impression events for recommended products on page', () => {
        injectPeeriusRecommends(peeriusData)
        cy.filterGtmEvents(eventTypeFilter('impression')).then((event) => {
          expect(event.ecommerce.impressions[0].category).to.equal('pdp')
          expect(event.ecommerce.impressions[0].list).to.equal(
            'PDP Why Not Try'
          )
        })
      })

      it('should create new clickevent when I click recommended product image', () => {
        pdp.mocksForPdpProduct({
          productByUrl: recommendsProd,
          productById: recommendsProd,
        })
        injectPeeriusRecommends(peeriusData)
        navigation.clickPeeriusRecommends()
        cy.wait('@product-by-id')
        cy.filterGtmEvents(eventTypeFilter('productClick')).then((event) => {
          expect(event.event).to.equal('productClick')
          expect(event.ecommerce.click.actionField.list).to.equal(
            'PDP Recommended Products'
          )
          expect(event.ecommerce.click.products[0].name).to.equal(
            'Sweet Mint Eos Lip Balm'
          )
        })
      })
    })
    // gtm event needs to be reviewed ADP-3203
    if (isDesktopLayout()) {
      it.skip('should create new clickevent when I click to load product image overlay', () => {
        navigation.clickPDPImage()
        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('image overlay')
          expect(event.ec).to.equal('pdp')
          expect(event.el).to.equal(path)
        })
      })
    }
  })

  describe('PLP to PDP GTM page events', () => {
    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-clothing',
      })
      cy.route(pdpMocks)
      cy.visit('/')
    })
    it('should update datalayer with product infomation', () => {
      plp.selectShoesCatHeader().clickPlpProduct(1)
      cy.filterGtmEvents(eventTypeFilter('detail')).then((event) => {
        const {
          sizesAvailable,
          sizesInStock,
          productId,
          totalSizes,
          category,
        } = event.ecommerce.detail.products[0]
        const { list } = event.ecommerce.detail.actionField

        expect(sizesAvailable).to.equal('100.00')
        expect(sizesInStock).to.equal('4,6,8,10,12,14,16,18')
        expect(productId).to.equal('32036261')
        expect(totalSizes).to.equal('8')
        expect(category).to.equal('Clothing')
        expect(list).to.equal('Clothing')
      })
    })
  })
}
