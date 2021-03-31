import Mapper from '../../Mapper'
import { verifyAccountPayloadConstants } from '../../constants/verifyAccount'
import { authenticatedCookies } from './cookies'
import emailServiceStoreMap from '../../../hostsConfig/store_email_service_map.json'

export default class Verify extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/UserIdExists'
  }
  mapRequestParameters() {
    const {
      catalogId,
      langId: preferredLanguage,
      siteId: storeId,
      currencyCode: preferredCurrency,
      storeCode,
    } = this.storeConfig

    const defaultServiceId = emailServiceStoreMap[storeCode || 'tsuk']

    this.payload = {
      ...verifyAccountPayloadConstants,
      catalogId,
      preferredLanguage,
      storeId,
      preferredCurrency,
      checkUserAccountUrl: `UserIdExists?storeId=${storeId}&catalogId=${catalogId}&URL=UserRegistrationAjaxView&ErrorViewName=UserRegistrationAjaxView&action=check`,
      create_logonId: this.query.email,
      default_service_id: defaultServiceId,
    }
    this.query = {}
    this.method = 'post'
  }

  mapResponseBody(body) {
    return {
      exists: !!body.exists,
      email: this.payload.create_logonId,
      version: '1.6',
    }
  }

  mapResponse(res) {
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
      setCookies: authenticatedCookies(),
    }
  }
}
