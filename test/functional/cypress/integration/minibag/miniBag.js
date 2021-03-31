import {
  setFeature,
  isDesktopLayout,
  isMobileLayout,
} from './../../lib/helpers'
import singleSizeProduct from './../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import ProductDetailPage from './../../page-objects/Pdp.page'
import MiniBag from './../../page-objects/MiniBag.page'
import Navigation from './../../page-objects/Navigation.page'

const pdp = new ProductDetailPage()
const minibag = new MiniBag()
const navigation = new Navigation()

describe('Mini-Bag Assertions', () => {
  if (isMobileLayout()) {
    beforeEach(() => {
      const path = pdp.mocksForPdpProduct({
        productByUrl: singleSizeProduct,
      })
      cy.visit(path)
      setFeature('FEATURE_DDP')
      minibag.mocksForShoppingBag({
        addToBag: 'fixture:pdp/ddpProduct/ddpProductAddToBag',
      })
    })

    describe('DDP Product in basket', () => {
      it(' should not display "edit" and "size" in mini-bag', () => {
        pdp
          .addToBag()
          .wait('@add-to-bag')
          .viewBagFromConfirmationModal()
        minibag.assertDDPinBag()
      })
    })

    describe('EXP-162 Checkout button', () => {
      it(' should display lock image if feature flag is turned on', () => {
        setFeature('FEATURE_CHECKOUT_BUTTON_LOCK')
        pdp
          .addToBag()
          .wait('@add-to-bag')
          .viewBagFromConfirmationModal()
        minibag.assertLockInCheckout(true)
      })

      it(' should not display lock image if feature flag is turned off', () => {
        setFeature('FEATURE_CHECKOUT_BUTTON_LOCK', false)
        pdp
          .addToBag()
          .wait('@add-to-bag')
          .viewBagFromConfirmationModal()
        minibag.assertLockInCheckout(false)
      })
    })
  }

  if (isDesktopLayout()) {
    describe('opens and closses Mini bag', () => {
      beforeEach(() => {
        const path = pdp.mocksForPdpProduct({
          productByUrl: singleSizeProduct,
        })
        cy.visit(path)
        setFeature('FEATURE_DDP')
        minibag.mocksForShoppingBag({
          addToBag: 'fixture:pdp/ddpProduct/ddpProductAddToBag',
        })
        pdp.addToBag().wait('@add-to-bag')
      })
      describe('Mini bag auto close', () => {
        it('should auto close mini-bag after 3 seconds', () => {
          pdp.viewBagFromConfirmationModal().wait(3000)
          minibag.minibagDrawer.should('not.be.visible')
        })

        it('should not auto close minibag if I click to open it', () => {
          navigation.openMiniBag().wait(3000)
          minibag.minibagDrawer.should('be.visible')
        })
      })

      describe('body tag should have class `not-scrollable`', () => {
        it('when drawer is open', () => {
          navigation.openMiniBag().wait(3000)
          cy.get('body').should('have.class', 'not-scrollable')
        })
      })

      describe('body tag should not have class `not-scrollable`', () => {
        it('after clicking clossing button', () => {
          minibag.miniBagClose()
          cy.get('body').should('not.have.class', 'not-scrollable')
        })

        it('after clicking on ContentOverlay', () => {
          minibag.clickOnOverlay()
          cy.get('body').should('not.have.class', 'not-scrollable')
        })
      })
    })
  }
})
