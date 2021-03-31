import '../../../lib/tcombSchemaExtensions'
import * as Schemas from '../../../lib/schemas'
import ProductDetailPage from '../../../page-objects/Pdp.page'
import MiniBag from '../../../page-objects/MiniBag.page'
import PromoCodePage from '../../../page-objects/PromoCode.page'
import Navigation from '../../../page-objects/Navigation.page'
import //  setupMocksForInitialRenderOnPdp,
// setupMocksForCheckout,
//  setupClientMockProductInMinibag,
'../../../lib/helpers'
import singleSizeProduct from '../../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import * as EventFilters from '../../../lib/filters'
import routes from '../../../constants/routes'
import singleSizeProductAddToBag from '../../../fixtures/pdp/singleSizeProduct/addToBag.json'
import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import { promoCode } from '../../../constants/promoCode'
// import multiSizeProduct from '../../../fixtures/pdp/multiSizeProduct/pdpInitialFetch.json'
import multiSizeProductAddToBag from '../../../fixtures/pdp/multiSizeProduct/multiSizeAddToBag.json'
// import orderSummary from '../../../fixtures/checkout/order_summary---newUserSingleSizeProd.json'
// import customerAccount from '../../../fixtures/checkout/account--newUser.json'

const pdp = new ProductDetailPage()
const miniBag = new MiniBag()
const navigation = new Navigation()
const promo = new PromoCodePage()

describe('GTM analytics for minibag interactions', () => {
  let path

  describe('Product click events', () => {
    beforeEach(() => {
      cy.clearCookie('authenticated')
      //   setupClientMockProductInMinibag()
      //  path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
      cy.visit(path)
      pdp.addToBag()
      pdp.viewBagFromConfirmationModal()
    })

    it('Clicking product link creates new "productid" event', () => {
      miniBag.clickProductTitleInMiniBag()
      getLastGtmEventOfType('ea').then((event) => {
        const productTitleClicked = event
        expect(productTitleClicked.event).to.equal('clickevent')
        expect(productTitleClicked.ec).to.equal('shoppingBag')
        expect(productTitleClicked.el).to.equal('product details')
        expect(productTitleClicked.ea).to.equal('clicked')
      })
    })

    it('Clicking product image creates new "productid" event', () => {
      miniBag.clickProductImageInMiniBag()
      getLastGtmEventOfType('ea').then((event) => {
        const productImageClicked = event
        expect(productImageClicked.event).to.equal('clickevent')
        expect(productImageClicked.ec).to.equal('shoppingBag')
        expect(productImageClicked.el).to.equal('product details')
        expect(productImageClicked.ea).to.equal('clicked')
      })
    })
  })

  describe('Events for add-to-bag', () => {
    before(() => {
      //   path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
      cy.visit(path)
      cy.server()
      cy.route('POST', routes.shoppingBag.addItem2, singleSizeProductAddToBag)
      pdp.addToBag()
    })

    it('Should create click event for add-to-bag from PDP', () => {
      getLastGtmEventOfType('ea').then((event) => {
        expect(event.ea).to.equal('addtobag')
        expect(event.ec).to.equal('pdp')
        expect(event.el).to.equal(Cypress.config('baseUrl') + path)
      })
    })

    it('Should create a new ecommerce event for "addToBasket"', () => {
      cy.filterGtmEvents({
        filter: EventFilters.addToBasketEvent,
        timeout: 8000,
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.AddToBasket)
        expect(event.ecommerce.add.products[0].quantity).to.equal('1')
        expect(event.fullBasket.productList[0].quantity).to.equal('1') // DES-5299
      })
    })

    it('Should create a new "bagDrawerDisplayed" event when minibag opens', () => {
      pdp.viewBagFromConfirmationModal()
      cy.filterGtmEvents({
        filter: (dlItem) => dlItem.bagDrawerTrigger,
        timeout: 2000,
      }).then((event) => {
        expect(event.event).to.equal('bagDrawerDisplayed')
        expect(event.bagDrawerTrigger).to.equal('add to bag')
      })
    })
  })

  describe('Basket edits', () => {
    describe('Events for product quantity edits', () => {
      before(() => {
        //     path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
        cy.visit(path)
        cy.server()
        cy.route('POST', routes.shoppingBag.addItem2, singleSizeProductAddToBag)
        pdp.addToBag()
        pdp.viewBagFromConfirmationModal()
      })

      it('Should create "bagDrawEdit" event when bag qty increased', () => {
        cy.server()
        cy.route(
          'GET',
          `${routes.shoppingBag.fetchItemSizesAndQuantities}?catEntryId=${
            singleSizeProductAddToBag.products[0].catEntryId
          }`,
          'fixture:pdp/singleSizeProduct/fetchSizesAndQuantities'
        ).as('fetchBag')
        cy.route(
          'PUT',
          routes.shoppingBag.updateItem,
          'fixture:pdp/singleSizeProduct/updateQuantityTo3'
        )

        miniBag.editAndChangeQuantityForProductNumberTo(1, '3')
        cy.wait('@fetchBag', { timeout: 30000 }).then(() => {
          miniBag.saveChanges()
        })

        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('bagDrawEdit')
          expect(event.ec).to.equal('bagDrawer')
          expect(event.el).to.equal(singleSizeProduct.productId)
        })
      })

      it('Should create a new "ecommerce" event with value "addToBasket"', () => {
        getLastGtmEventOfType('ecommerce').then((event) => {
          expect(event.event).to.equal('addToBasket')
          expect(event.ecommerce.add.products[0].quantity).to.equal('2')
          expect(event.fullBasket.productList[0].quantity).to.equal('3') // DES-5299
        })
      })

      it('Should create a new ecommerce event with value "removeFromBasket" when qty decreased', () => {
        cy.server()
        cy.route(
          'GET',
          `${routes.shoppingBag.fetchItemSizesAndQuantities}?catEntryId=${
            singleSizeProductAddToBag.products[0].catEntryId
          }`,
          'fixture:pdp/singleSizeProduct/fetchSizesAndQuantities'
        ).as('fetchBag')
        cy.route(
          'PUT',
          routes.shoppingBag.updateItem,
          'fixture:pdp/singleSizeProduct/updateQuantityTo1'
        )

        miniBag.editAndChangeQuantityForProductNumberTo(1, '1')
        cy.wait('@fetchBag', { timeout: 30000 }).then(() => {
          miniBag.saveChanges()
        })
        cy.get(miniBag.minibagTotalPrice).should('be.visible')
        getLastGtmEventOfType('ecommerce').then((event) => {
          expect(event.event).to.equal('removeFromBasket')
          expect(event.ecommerce.remove.products[0].quantity).to.equal('2')
          expect(event.fullBasket.productList[0].quantity).to.equal('1') // DES-5299
        })
      })
    })

    describe('Events for product size edits', () => {
      before(() => {
        //     const path = setupMocksForInitialRenderOnPdp(multiSizeProduct)
        cy.visit(path)
        pdp.selectFirstSizeFromTiles()
        cy.server()
        cy.route(
          'POST',
          routes.shoppingBag.addItem2,
          'fixture:pdp/multiSizeProduct/multiSizeAddToBag'
        )
        pdp.addToBag()
        pdp.viewBagFromConfirmationModal()
        cy.server()
        cy.route(
          'GET',
          `${routes.shoppingBag.fetchItemSizesAndQuantities}?catEntryId=${
            multiSizeProductAddToBag.products[0].catEntryId
          }`,
          'fixture:pdp/multiSizeProduct/multiSizeFetchItemAndSizes'
        ).as('fetchBag')
      })
      it('Should create a new "sizeUpdate" clickevent when size is changed', () => {
        miniBag.editAndChangeSizeForProductNumberTo(1, 'W2528')
        cy.wait('@fetchBag', { timeout: 30000 }).then(() => {
          getLastGtmEventOfType('ea').then((event) => {
            expect(event.event).to.equal('clickevent')
            expect(event.ea).to.equal('sizeUpdate')
            expect(event.ec).to.equal('shoppingBag')
          })
        })
      })
    })

    describe('Events for empty basket', () => {
      // DES-5299
      before(() => {
        //      path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
        cy.visit(path)
        cy.server()
        cy.route('POST', routes.shoppingBag.addItem2, singleSizeProductAddToBag)
        pdp.addToBag()
        pdp.viewBagFromConfirmationModal()
      })

      it('Should create a new "ecommerce" object for empty bag when last item removed', () => {
        cy.route(
          'DELETE',
          '/api/shopping_bag/delete_item*',
          'fixture:minibag/shopping_bag----emptyBag'
        )
        miniBag.removeProductFromBasketWithIndex(0)
        miniBag.isEmpty()
        getLastGtmEventOfType('ecommerce').then((event) => {
          expect(event.event).to.equal('removeFromBasket')
          expect(event.fullBasket.totalQuantity).to.equal(0) // DES-5299
          expect(event.fullBasket.totalPrice).to.equal(0) // DES-5299
        })
      })
    })
  })

  describe('Events for promo code apply', () => {
    before(() => {
      //    path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
      cy.visit(path)
      cy.server()
      cy.route('POST', routes.shoppingBag.addItem2, singleSizeProductAddToBag)
      pdp.addToBag()
      pdp.viewBagFromConfirmationModal()
    })

    it('Should create a new a "promoCodeApplied" clickevent', () => {
      // commonMocks()
      cy.server()
      cy.route(
        'POST',
        routes.shoppingBag.addPromotionCode,
        'fixture:minibag/addPromoCodeOnMinibag'
      ).as('addingPromoCode')
      promo.enterPromoCodeAndApply(promoCode.tsPromo)
      cy.wait('@addingPromoCode').then(() => {
        cy.get(promo.promoCodeConfirmation).then(() => {
          getLastGtmEventOfType('ec').then((event) => {
            expect(event.event).to.equal('clickevent')
            expect(event.ea).to.equal('promoCodeApplied')
            expect(event.ec).to.equal('shoppingBag')
            expect(event.el).to.equal(promoCode.tsPromo)
          })
        })
      })
    })

    it('Should create a new "errorMessage" event when invalid applied', () => {
      //  setupMocksForInitialRenderOnPdp(singleSizeProduct)
      cy.server()
      cy.route({
        method: 'POST',
        url: routes.shoppingBag.addPromotionCode,
        response: 'fixture:payment/failedPromoCodeOnPaymentsPage',
        status: 422,
      }).as('addingPromoCode')
      promo.enterAnotherPromoCodeAndApply('XXXXXXXX')
      cy.wait('@addingPromoCode').then(() => {
        cy.get(promo.promoCodeConfirmation).then(() => {
          getLastGtmEventOfType('event', 'errorMessage').then((event) => {
            expect(event.event).to.equal('errorMessage')
            expect(event.errorMessage).to.equal(
              'Error applying promo code in shopping bag.'
            )
          })
        })
      })
    })
  })

  describe('Events for minibag icon click', () => {
    before(() => {
      //     path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
      cy.visit(path)
    })

    it('Should create a new "bagDrawerDisplayed" event on minibag open', () => {
      navigation.openMiniBag()
      getLastGtmEventOfType('bagDrawerTrigger').then((event) => {
        expect(event.event).to.equal('bagDrawerDisplayed')
        expect(event.bagDrawerTrigger).to.equal('bag icon')
      })
    })

    it('Should create a new "close-button" event on minibag close', () => {
      miniBag.miniBagClose()
      getLastGtmEventOfType('event', 'clickevent').then((event) => {
        expect(event.el).to.equal('close-button')
        expect(event.ea).to.equal('clicked')
      })
    })
  })

  describe('Event for proceed to checkout', () => {
    before(() => {
      //     path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
      cy.visit(path)
      cy.server()
      cy.route('POST', routes.shoppingBag.addItem2, singleSizeProductAddToBag)
      pdp.addToBag()
      pdp.closeAddConfirmationModal()
      //     setupMocksForCheckout(orderSummary, customerAccount)
      navigation.openMiniBag()
      miniBag.moveToCheckout()
    })

    it('Should create a new ecommerce event for "CheckoutStep1" on continue to checkout', () => {
      cy.filterGtmEvents({
        filter: EventFilters.ecommerceCheckoutStep(1),
        timeout: 15000,
        name: 'CheckoutStep1',
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.CheckoutStep1)
      })
    })
  })
})
