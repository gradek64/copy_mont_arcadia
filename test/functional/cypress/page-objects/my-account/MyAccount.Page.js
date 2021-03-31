import loginMockHelpers from '../../mock-helpers/loginMockSetup'

export default class MyAccountStart extends loginMockHelpers {
  get accountPageTitle() {
    return '.AccountHeader-title'
  }

  /**
   * ACTIONS  **************************************************************
   */

  clickNavigation(url) {
    cy.get(`a[href="${url}"]`).click()
    return this
  }

  /**
   * MOCKS  **************************************************************
   */

  setupMocksForAccountAndLogin(selectedEndpoints) {
    this.mocksForAccountAndLogin(selectedEndpoints)
    return this
  }
}
