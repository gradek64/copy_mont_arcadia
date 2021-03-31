import Boom from 'boom'
import Mapper from '../../Mapper'

export default class ValidateResetPassword extends Mapper {
  mapRequestFormParameters() {
    this.method = 'post'
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.orderId = this.payload.orderId
    this.query = {
      storeId,
      catalogId,
      langId,
      validateLink: true,
      token: this.payload.email,
      hash: decodeURIComponent(this.payload.hash), // From original WCS link
      stop_mobi: 'yes',
      CMPID: this.payload.CMPID,
    }
  }

  mapRequestFormEndpoint() {
    this.requestFormEndpoint = '/webapp/wcs/stores/servlet/ResetPasswordLink'
  }

  mapResponseError(body) {
    const errorMessage =
      body.message ||
      body.errorMessage1 ||
      body.errorMessage2 ||
      body.serverErrorMessage
    throw errorMessage ? Boom.badData(errorMessage) : body
  }

  async execute() {
    this.mapRequestFormEndpoint()
    this.mapRequestFormParameters()

    try {
      this.resetFormResponse = await this.sendRequestToApi(
        this.destinationHostname,
        this.requestFormEndpoint,
        this.query,
        this.payload,
        'get',
        this.headers
      )
      if (
        !this.resetFormResponse.body.isValidEmailLink ||
        this.resetFormResponse.body.success === false
      ) {
        return this.mapResponseError(this.resetFormResponse.body)
      }
      return this.resetFormResponse
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}
