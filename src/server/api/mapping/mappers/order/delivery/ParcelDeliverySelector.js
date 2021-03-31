import Boom from 'boom'
import Mapper from '../../../Mapper'
import transform from '../../../transforms/orderSummary'
import { isAuthenticated } from '../../../utils/sessionUtils'

/**
 * This class's aim is to make the necessary requests to WCS in order to select a Parcelshop Store as delivery.
 * The necessary requests to WCS are 2:
 *    1. request to select Parcelshop as delivery location
 *    2. request to select a specific Parcelshop store as delivery destination
 */
export default class ParcelDeliverySelector extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ProcessStoreDetails'
  }

  mapCommonRequestParameters() {
    const { orderId, shippingCountry } = this.payload
    const { siteId, langId, catalogId } = this.storeConfig

    return {
      catalogId,
      storeId: siteId,
      langId,
      orderId,
      errorViewName: 'UserRegistrationForm',
      sourcePage: 'OrderSubmitForm',
      page: 'account',
      shipping_country: shippingCountry,
    }
  }

  mapSelectParcelRequestParameters() {
    return {
      ...this.mapCommonRequestParameters(),
      actionType: 'updateShipping',
      deliveryType: 'parcel_collection',
    }
  }

  mapSelectParceshopStoreRequestParameters() {
    const {
      storeAddress1,
      storeAddress2,
      storeCity,
      storePostcode,
      deliveryStoreCode,
    } = this.payload
    const { siteId } = this.storeConfig

    return {
      ...this.mapCommonRequestParameters(),
      actionType: 'updateCountryAndOrderItems',
      field1: deliveryStoreCode,
      deliveryOptionType: 'S',
      URL: 'ProcessDeliveryDetails',
      preventAddressOverride: 'Y',
      shipping_errorViewName: 'UserRegistrationForm',
      shipping_nickName: `Default_Store_${siteId}`,
      shipping_address1: storeAddress1,
      shipping_address2: storeAddress2,
      shipping_city: storeCity,
      shipping_state_input: storeCity,
      shipping_zipCode: storePostcode,
    }
  }

  mapResponseError(body) {
    if (body.isBoom) {
      throw body
    }

    throw body.message ? Boom.badData(body.message) : body
  }

  mapResponseBody(body) {
    const isGuest = !isAuthenticated(this.headers.cookie)

    if (!body.orderSummary) return this.mapResponseError(body)

    return transform(
      body.orderSummary,
      isGuest,
      this.storeConfig.currencySymbol
    )
  }

  async executeSelection(payload, mapResponse) {
    try {
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        {},
        payload,
        'post',
        this.headers
      )

      if (mapResponse) return this.mapResponse(res)

      return res && res.body && res.body.orderSummary
    } catch (err) {
      return this.mapResponseError(err)
    }
  }

  async executeParcelshopSelection() {
    const payload = this.mapSelectParcelRequestParameters()

    return this.executeSelection(payload)
  }

  async executeParcelshopStoreSelection() {
    const payload = this.mapSelectParceshopStoreRequestParameters()

    return this.executeSelection(payload, true)
  }

  async execute() {
    this.mapEndpoint()

    const parcelshopSelected = await this.executeParcelshopSelection()

    if (!parcelshopSelected)
      return this.mapResponseError({
        message: 'Error while trying to select Parcelshop Delivery',
      })

    return this.executeParcelshopStoreSelection()
  }
}
