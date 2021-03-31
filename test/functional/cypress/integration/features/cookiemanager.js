import { setFeatureFlag, isMobileLayout } from '../../lib/helpers'

if (isMobileLayout()) {
  describe('Cookie banner display', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_COOKIE_MANAGER', true)
    })
    describe('When the feature flag is enabled', () => {
      it('should display third party cookie banner', () => {
        cy.visit('/')
        cy.get('#consent_blackbar').should('to.exist')
        cy.get('.CookieMessage').should('not.be.visible')
      })
    })
    describe('When the feature flag is disabled', () => {
      it('should display custom cookie banner', () => {
        setFeatureFlag('FEATURE_COOKIE_MANAGER', false)
        cy.clearCookie('topshop-cookie-message')
        cy.visit('/')
        cy.get('.CookieMessage').should('be.visible')
        cy.get('#consent_blackbar').should('not.to.exist')
      })
    })
  })
}
