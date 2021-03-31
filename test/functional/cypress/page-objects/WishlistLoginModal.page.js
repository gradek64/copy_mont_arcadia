import loginMocks from '../mock-helpers/loginMockSetup'

export default class WishlistLoginModal extends loginMocks {
  get modal() {
    return '.Modal-children .WishlistLoginModal'
  }

  assertIsVisible(isVisible) {
    const assertion = isVisible ? 'be.visible' : 'not.be.visible'
    cy.get(this.modal).should(assertion)

    return this
  }
}
