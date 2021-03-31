import Boom from 'boom'
import Mapper from '../../../Mapper'
import transform from '../../../transforms/orderSummary'
import { isAuthenticated } from '../../../utils/sessionUtils'
import { deliveryMethodsMonty } from '../../../constants/orderSummary'

export default class HomeDeliverySelector extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ProcessDeliveryDetails'
  }

  mapRequestParametersCommon() {
    const { orderId, shippingCountry } = this.payload
    const { siteId, langId, catalogId } = this.storeConfig

    return {
      storeId: siteId,
      langId,
      catalogId,
      deliveryOptionType: 'H',
      errorViewName: 'UserRegistrationForm',
      orderId,
      status: 'P',
      page: 'account',
      outOrderItemName: '',
      shipping_country: shippingCountry,
    }
  }

  mapRequestParametersStandardExpressCommon() {
    const { siteId } = this.storeConfig

    return {
      proceed: 'Y',
      registerType: 'R',
      returnPage: 'ShoppingBag',
      isoCode: '',
      shippingIsoCode: '',
      editRegistration: 'Y',
      editSection: '',
      actionType: 'updateHomeDelivery',
      sourcePage: 'DeliveryPage',
      shipping_errorViewName: 'UserRegistrationForm',
      shipping_nickName: `Default_Shipping_${siteId}`,
      shipping_personTitle: '',
      shipping_firstName: '',
      shipping_lastName: '',
      shipping_phone1: '',
      lookupHouseNumber: '',
      lookupPostcode: '',
      shipping_state_hidden: '',
      shipping_address1: '',
      shipping_address2: '',
      shipping_city: '',
      shipping_state_input: '',
      shipping_state_select_canada: '',
      shipping_state_select: '',
      shipping_zipCode: '',
      preferredLanguage: '',
      preferredCurrency: 's',
    }
  }

  mapRequestParametersHomeDelivery() {
    this.payload = {
      ...this.mapRequestParametersCommon(),
      actionType: 'updateShipping',
      sourcePage: 'OrderSubmitForm',
      deliveryType: 'home',
    }
  }

  mapRequestParamatersHomeStandard() {
    const { shipModeId } = this.payload

    this.payload = {
      ...this.mapRequestParametersCommon(),
      ...this.mapRequestParametersStandardExpressCommon(),
      shipModeId,
    }
  }

  mapRequestParamatersHomeExpress() {
    const { shipModeId } = this.payload
    this.payload = {
      ...this.mapRequestParametersCommon(),
      ...this.mapRequestParametersStandardExpressCommon(),
      shipModeId: undefined, // Cogz said it is needed to be set to undefined
      available_date: shipModeId,
    }
  }

  mapRequestParameters() {
    this.method = 'post'
    const { deliveryType } = this.payload

    if (!this.isHomeDeliverySelection) {
      // The User selected the delivery option "Home Delivery" from a different option
      // (e.g.: Parcelshop -> Home Delivery or Collect From Store -> Home Delivery)
      return this.mapRequestParametersHomeDelivery()
    }

    switch (deliveryType) {
      case deliveryMethodsMonty.homeExpress:
        this.mapRequestParamatersHomeExpress()
        break
      case deliveryMethodsMonty.homeStandard:
        this.mapRequestParamatersHomeStandard()
        break
      default:
        this.mapRequestParamatersHomeStandard()
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

  async execute() {
    this.isHomeDeliverySelection = this.payload.shipModeId

    this.mapEndpoint()
    this.mapRequestParameters()

    try {
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        this.query,
        this.payload,
        this.method,
        this.headers
      )
      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}
