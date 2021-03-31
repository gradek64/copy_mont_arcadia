import Boom from 'boom'
import Mapper from '../../../Mapper'
import transform from '../../../transforms/orderSummary'
import { isAuthenticated } from '../../../utils/sessionUtils'

export default class StoreDeliverySelector extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ProcessStoreDetails'
  }

  mapCommonRequestParameters() {
    const {
      orderId,
      shippingCountry,
      storeAddress1,
      storeAddress2,
      storeCity,
      storePostcode,
      deliveryStoreCode,
    } = this.payload
    const { siteId, langId, catalogId } = this.storeConfig

    return {
      langId,
      storeId: siteId,
      catalogId,
      orderId,
      shipping_country: shippingCountry,
      sourcePage: 'OrderSubmitForm',
      page: 'account',
      actionType: 'updateStoreDelivery',
      field1: deliveryStoreCode,
      deliveryType: 'store',
      deliveryOptionType: 'S',
      errorViewName: 'UserRegistrationForm',
      shipping_errorViewName: 'UserRegistrationForm',
      shipping_nickName: `Default_Store_${siteId}`,
      shipping_address1: storeAddress1,
      shipping_address2: storeAddress2,
      shipping_city: storeCity,
      shipping_state_input: storeCity,
      shipping_zipCode: storePostcode,
    }
  }

  mapWCSErrorCodes = {
    _ERR_DELIVERY_STORE_INVALID: 409,
    _ERR_DELIVERY_STORE_ADDRESS_INVALID: 409,
    _ERR_DELIVERY_STORE_ADDRESS_INACTIVE: 409,
  }

  mapResponseError(body) {
    if (body.isBoom) {
      throw body
    }

    throw body.orderSummary && body.orderSummary.errorMessage
      ? Boom.badData(body.orderSummary.errorMessage)
      : body
  }

  mapResponseBody(body) {
    const isGuest = !isAuthenticated(this.headers.cookie)
    // In cases where store delivery option is not available for a product, the orderSummary object will have success: false
    if (!body.orderSummary || body.orderSummary.success === false)
      return this.mapResponseError(body)
    return transform(
      body.orderSummary,
      isGuest,
      this.storeConfig.currencySymbol
    )
  }

  async execute() {
    this.mapEndpoint()
    // This cookie interferes with the WCS response setting the delivery store
    this.cookieCapture.removeCookieByName('WC_pickUpStore')
    const { shipModeId } = this.payload

    const payload = this.mapCommonRequestParameters()

    if (shipModeId) {
      payload.shipModeId = shipModeId
    }

    try {
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        {},
        payload,
        'post',
        this.headers
      )

      this.mapErrorCode(res)

      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}
