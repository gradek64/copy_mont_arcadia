import { isMobileLayout } from '../../lib/helpers'

if (isMobileLayout()) {
  describe('/ui - style guide', () => {
    it('should do something', () => {
      cy.visit('/ui')

      cy.get('h1').should('be.visible')
      cy.get('.UI .Button').should('be.visible')
    })
  })
}
