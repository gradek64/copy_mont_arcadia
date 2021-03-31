export default class DomHeader {
  get AlternateLinks() {
    return 'head > link[rel="alternate"]'
  }

  assertNoAltLinks() {
    cy.get(this.AlternateLinks).should('not.exist')
  }

  assertAltLinksHaveRequiredTags() {
    cy.get(this.AlternateLinks).then((linkTags) => {
      ;[...linkTags].forEach((link) => {
        cy.wrap(link).should('have.attr', 'hreflang')
        cy.wrap(link).should('have.attr', 'href')
      })
    })
  }
}
