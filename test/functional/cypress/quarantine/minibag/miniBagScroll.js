// import { setupMocksForInitialRenderOnPdp } from './../../lib/helpers'
// import singleSizeProduct from './../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import ProductDetailPage from './../../page-objects/Pdp.page'
import MiniBag from './../../page-objects/MiniBag.page'
import routes from '../../constants/routes'

const pdp = new ProductDetailPage()
const minibag = new MiniBag()

// PTM-806 ticket opened to investiagte flakey test
describe('Minibag scroll functionality', () => {
  it('Given I am on the pdp page with multiple items in my basket', () => {
    //  const path = setupMocksForInitialRenderOnPdp(singleSizeProduct)
    //  cy.visit(path)
  })

  it('When I add another item to my basket', () => {
    cy.server()
    cy.route(
      'POST',
      routes.shoppingBag.addItem2,
      'fixture:pdp/singleSizeProduct/add_item---threeItemsInMinibag'
    )
    pdp.addToBag()
  })

  it('And the minibag opens', () => {
    pdp.viewBagFromConfirmationModal()
  })

  it('Then I can scroll to the bottom of the minibag', () => {
    minibag.scrollToTheBottomOfMinibag()
  })
})
