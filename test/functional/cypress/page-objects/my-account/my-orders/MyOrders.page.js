import MyAccountStart from '../MyAccount.Page'

export default class MyOrders extends MyAccountStart {
  myAccountStart = new MyAccountStart()

  get orderReturnsButton() {
    return '.HistoryDetailsContainer-returns a'
  }
  get orderList() {
    return '.OrderList-list .OrderElement'
  }

  get ordersNotFound() {
    return '.OrderList-notFound'
  }

  get backToMyAccountLink() {
    return '.AccountHeader-back'
  }

  /**
   * ACTIONS  **************************************************************
   */

  clickMyAccount() {
    cy.get(this.backToMyAccountLink).click()
  }
  navigateToOrderList(urls) {
    this.myAccountStart.clickNavigation(urls.myOrders)
    cy.wait('@order-history')
  }

  /**
   * ASSERTIONS  **************************************************************
   */

  assertOrdersNotFound() {
    const orderNotFound = cy.get(this.ordersNotFound)
    orderNotFound.should('be.visible').should('to.exist')
  }

  assertLengthOfOrders(ordersLength) {
    cy.get(this.orderList).should('have.length', ordersLength)
    return this
  }

  // assert that any text is displayed
  assertTextDisplayed(element, text = /^.+$/) {
    cy.get(element).contains(text)
    return this
  }
}
