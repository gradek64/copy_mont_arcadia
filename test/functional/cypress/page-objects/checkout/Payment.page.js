import { visaCardPaymentDetails } from '../../constants/paymentDetails'
import CheckoutHeader from './Checkout.page'

export default class Payment extends CheckoutHeader {
  get orderAndPayButton() {
    return 'button.Button.PaymentBtnWithTC-paynow'
  }
  get cvvForSavedCard() {
    return '.Input-field.Input-field-cvv'
  }
  get psd2Modal() {
    return '.ThirdPartyPaymentIFrame'
  }
  get psd2ModalCloseButton() {
    return '.Modal-closeIcon'
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }
  /**
   * USER ACTIONS **************************************************************
   */

  enterCVVNumber() {
    cy.get(this.cvvForSavedCard).type(visaCardPaymentDetails.cvvNumber)
    return this
  }

  clickOrderButton() {
    cy.get(this.orderAndPayButton).click()
    return this
  }
}
