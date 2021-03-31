import { setFeature, isMobileLayout } from '../../../lib/helpers'
import Login from '../../../page-objects/login/Login.page'
import fullProfileEmptyBag from '../../../fixtures/login/fullCheckoutProfile--emptyBag.json'
import emptyBag from '../../../fixtures/minibag/getItemsEmptyBag.json'
import fullCheckoutProfile from '../../../fixtures/login/fullCheckoutProfile.json'
import * as EventFilters from '../../../lib/filters'
import Checkout from '../../../page-objects/checkout/Checkout.page'

const login = new Login()
const checkout = new Checkout()

if (isMobileLayout()) {
  describe('GA Event checks for DDP user login state', () => {
    beforeEach(() => {
      cy.clearCookie('bagCount')
      checkout.mocksForShoppingBag({
        getItems: emptyBag,
      })
    })
    describe('Non-authenticated non-DDP user', () => {
      beforeEach(() => {
        cy.visit('/')
        setFeature('FEATURE_DDP')
      })

      it('should not contain "isDDPUser" in the "userState" event', () => {
        cy.filterGtmEvents({
          filter: EventFilters.userStatus,
          timeout: 15000,
        }).then((event) => {
          expect(event.event).to.equal('userState')
          expect(JSON.stringify(event.user)).to.not.contain('isDDPUser')
        })
      })
    })

    describe('Authenticated non-DDP user', () => {
      beforeEach(() => {
        login.mocksForAccountAndLogin({
          login: fullProfileEmptyBag,
        })
        cy.visit('/login', { failOnStatusCode: false })
        setFeature('FEATURE_DDP')
      })

      it('should contain "isDDPUser" = False in the "userState" event', () => {
        login.loginAsExistingUser()
        cy.wait('@login').then(() => {
          cy.filterGtmEvents({
            filter: EventFilters.userStatus,
            timeout: 30000,
          }).then((event) => {
            expect(event.event).to.equal('userState')
            expect(event.user.isDDPUser).to.equal('False')
          })
        })
      })
    })

    describe('Authenticated DDP user', () => {
      beforeEach(() => {
        login.mocksForAccountAndLogin({
          login: fullCheckoutProfile,
        })
        cy.visit('/login', { failOnStatusCode: false })
        setFeature('FEATURE_DDP')
      })

      it('should contain "isDDPUser" = True in the "userState" event', () => {
        login.loginAsExistingUser()
        cy.wait('@login').then(() => {
          cy.filterGtmEvents({
            filter: EventFilters.userStatus,
            timeout: 30000,
          }).then((event) => {
            expect(event.event).to.equal('userState')
            expect(event.user.isDDPUser).to.equal('True')
          })
        })
      })
    })
  })
}
