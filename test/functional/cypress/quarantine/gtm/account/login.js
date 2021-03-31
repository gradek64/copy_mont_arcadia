import Login from '../../../page-objects/login/Login.page'
import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import fullCheckoutProfile from '../../../fixtures/login/fullCheckoutProfile.json'
import registrationResponse from '../../../fixtures/login/newRegistration.json'
import invalidLogin from '../../../fixtures/login/invalidLogon.json'
import invalidRegistration from '../../../fixtures/login/invalidRegistration.json'
import * as EventFilters from '../../../lib/filters'
import { isMobileLayout } from '../../../lib/helpers'

const login = new Login()

if (isMobileLayout()) {
  describe('GA events for login page actions', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('should contain a "TS:Register/Logon" pageViewEvent', () => {
      cy.filterGtmEvents({
        filter: EventFilters.pageViewEvent,
        timeout: 15000,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Register/Logon')
        expect(event.pageType).to.equal('TS:Register/Logon')
      })
    })

    describe('GA events for login success event', () => {
      beforeEach(() => {
        login.mocksForAccountAndLogin({
          login: fullCheckoutProfile,
        })

        login.loginAsExistingUser().wait('@login')
      })

      it('should create a new "clickevent", login as a returning user', () => {
        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('submit')
          expect(event.ec).to.equal('signIn')
          expect(event.el).to.equal('sign-in-button')
        })
      })

      it('should create a new "userState" event, login as a returning user', () => {
        getLastGtmEventOfType('event', 'userState').then((event) => {
          expect(event.user.loggedIn).to.equal('True')
          expect(event.user.isDDPUser).to.equal('True')
        })
      })
    })

    describe('GA events for registration success', () => {
      beforeEach(() => {
        login.mocksForAccountAndLogin({
          register: registrationResponse,
        })

        login.registerAsNewUser().wait('@register')
      })

      it('should create a new "clickevent", register as new user', () => {
        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('submit')
          expect(event.ec).to.equal('register')
          expect(event.el).to.equal('register-in-button')
        })
      })

      it('should have a new "userState" event, register as new user', () => {
        getLastGtmEventOfType('event', 'userState').then((event) => {
          expect(event.user.loggedIn).to.equal('True')
          expect(event.user.isDDPUser).to.equal('False')
        })
      })
    })
  })

  describe('GA events for registration failure', () => {
    beforeEach(() => {
      login.mocksForAccountAndLogin({
        register422: invalidRegistration,
      })
      cy.visit('/login')
      login.registerAsNewUser().wait('@register-422')
    })

    it('should create new "errorMessage" event, registration failure', () => {
      getLastGtmEventOfType('event', 'errorMessage').then((event) => {
        expect(event.event).to.equal('errorMessage')
        expect(event.errorMessage).to.equal('User registration failed')
      })
    })

    it('should generate new "userState" event registration failure', () => {
      getLastGtmEventOfType('event', 'userState').then((event) => {
        expect(event.user.loggedIn).to.equal('False')
      })
    })
  })

  describe('GA events for login failure', () => {
    beforeEach(() => {
      login.mocksForAccountAndLogin({
        login422: invalidLogin,
      })
      cy.visit('/login')
      login.loginAsExistingUser().wait('@login-422')
    })

    it('should create new "errorMessage" event, login failure', () => {
      getLastGtmEventOfType('event', 'errorMessage').then((event) => {
        expect(event.event).to.equal('errorMessage')
        expect(event.errorMessage).to.equal('User login failed')
      })
    })

    it('should create new "userState" event, login failure', () => {
      getLastGtmEventOfType('event', 'userState').then((event) => {
        expect(event.user.loggedIn).to.equal('False')
      })
    })
  })
}
