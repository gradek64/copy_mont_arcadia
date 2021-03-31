import emailWhenBackInStock from '../../fixtures/pdp/emailWhenBackInStock.json'
import routes from '../../constants/routes'
import PDP from '../../page-objects/Pdp.page'

const pdp = new PDP()

describe.skip('Email me when back in stock items', () => {
  it("Should show 'Email me when back in stock' when out of stock", () => {
    const path = pdp.mocksForPdpProduct({
      productByUrl: emailWhenBackInStock,
    })
    cy.visit(path)

    cy.server()
    cy.route(
      'GET',
      routes.emailWhenBackInStock,
      'fixture:pdp/emailWhenBackInStockModal.json'
    ).as('emailWhenBackInStock')

    pdp
      .selectFirstSizeFromTiles()
      .selectLastSizeFromModalTiles()
      .modalBackInStockUserDetails()
      .backInStockButton()

    cy.wait('@emailWhenBackInStock').then(() => {
      cy.get(pdp.backInStockModalConfirmationMessage)
        .should('be.visible')
        .should(
          'have.text',
          'Your request has been received, and you will receive an email when the item is in stock.'
        )
    })
    pdp.clickBackInStockConfirmationButton()
  })
})
