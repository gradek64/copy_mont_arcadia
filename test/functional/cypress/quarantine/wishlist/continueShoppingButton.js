import {
  setFeatureFlag,
  isDesktopLayout,
  setUpMocksForRouteList,
} from '../../lib/helpers'

import Navigation from '../../page-objects/Navigation.page'
import WishList from '../../page-objects/Wishlist.page'
import Plp from '../../page-objects/Plp.page'
import MyAccount from '../../page-objects/my-account/MyAccount.Page'
import plpRoutes from '../../../mock-server/routes/plp/filters'
import accountProfile from './../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'

const navigation = new Navigation()
const wishlist = new WishList()
const plp = new Plp()
const myAccount = new MyAccount()
const homePageUrl = `${Cypress.config().baseUrl}/`

if (isDesktopLayout()) {
  describe('WishList - Continue shopping button', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_WISHLIST')
    })
    describe('Wishlist to PLP and back navigation', () => {
      beforeEach(() => {
        cy.clearCookie('authenticated')
        setUpMocksForRouteList(plpRoutes)
        cy.visit('/')
        navigation.searchFor('shirts')
        cy.wait('@search-shirts')
      })
      it('Should return to plp page when "continue shopping" is selected', () => {
        navigation.selectWishlistIcon()
        wishlist.selectContinueShoppingButton()
        cy.location('href').should('contain', 'search/?q=shirts')
      })

      it('Should return to scrolled plp position when "continue shopping" is selected', () => {
        cy.get(plp.productList9thProduct)
          .scrollIntoView({ duration: 3000 })
          .end()

        navigation.selectWishlistIcon()
        wishlist.selectContinueShoppingButton()
        cy.get(plp.productList9thProduct).should('be.visible')
      })
    })
    describe('Login > Wishlist > Homepage navigation', () => {
      it('Should take back to homepage when your previous visited route is /Login', () => {
        cy.visit('/login')
        navigation.selectWishlistIcon()
        wishlist.selectContinueShoppingButton()
        cy.location('href').should('contain', '/')
      })
    })
    describe('My-account > Wishlist > Homepage navigation', () => {
      beforeEach(() => {
        myAccount.mocksForAccountAndLogin({ getAccount: accountProfile })
        cy.visit('/my-account')
      })
      it('Should take back to homepage when your previous visited route is /My-account', () => {
        navigation.selectWishlistIcon()
        wishlist.selectContinueShoppingButton()
        cy.location().should((loc) => {
          expect(loc.href).to.eq(homePageUrl)
        })
      })
    })
  })
}
