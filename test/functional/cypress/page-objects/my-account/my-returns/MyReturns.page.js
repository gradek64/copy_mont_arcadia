import MyAccountStart from '../MyAccount.Page'

export default class MyReturns extends MyAccountStart {
  get viewOrdersStartReturn() {
    return '.AccountHeader-action .Button'
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }

  /**
   * USER ACTIONS **************************************************************
   */

  clickViewOrdersStartReturn() {
    cy.get(this.viewOrdersStartReturn).click()
    return this
  }
}
