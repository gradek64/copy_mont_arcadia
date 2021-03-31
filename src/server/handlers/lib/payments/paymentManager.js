/*
 * Configure And Validate the paymentMethod Request
 */
import { getConfigByStoreCode } from '../../../config/index'
import { paymentsConfigBySite } from '../../../config/paymentConfig'

/*
 * ADD HERE ONLY THE LOGIC ABOUT AVAILABLE/NOT-AVAILABLE Payment method
 */
export default class PaymentManager {
  constructor({ headers = {}, query = {} }) {
    // Config payments method available only for brand-Area
    const code = headers['brand-code'] || 'tsuk'
    const { brandCode, region } = getConfigByStoreCode(code)
    this.config = { brandCode, region, ...this.sanitizeParams(query) }
  }

  sanitizeParams(query) {
    const { billing, delivery } = query
    return {
      ...query,
      billing: billing || delivery,
    }
  }

  getPaymentsAvailableByBrandAndCountry = () => {
    return paymentsConfigBySite[this.config.brandCode][this.config.region]
  }

  getPaymentAvailableFromAddressDelivery = (payment) => {
    return (
      !this.config.delivery ||
      !payment.deliveryCountry || // if not defined countries we assume is valid everywhere
      !!payment.deliveryCountry.find(
        (country) => country === this.config.delivery
      )
    )
  }

  getPaymentAvailableFromAddressBilling = (payment) => {
    return (
      !this.config.billing ||
      !payment.billingCountry || // if not defined countries we assume is valid everywhere
      !!payment.billingCountry.find(
        (country) => country === this.config.billing
      )
    )
  }
}
