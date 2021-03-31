import PaymentManager from './paymentManager'

/*
 * ADD HERE ONLY THE TYPE OF REQUEST (Ex. list of payments available, 1 payment details ... etc)
 */
export default class PaymentsMethods extends PaymentManager {
  selectRequest = () => {
    return this.getPaymentsAvailableByBrandAndCountry().filter(
      (payment) =>
        this.getPaymentAvailableFromAddressDelivery(payment) &&
        this.getPaymentAvailableFromAddressBilling(payment)
    )
  }
}
