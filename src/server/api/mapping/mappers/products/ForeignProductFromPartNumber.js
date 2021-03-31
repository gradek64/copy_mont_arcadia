import { path } from 'ramda'
import Mapper from '../../Mapper'
import {
  getSiteConfigByPreferredISO,
  getWCSDomainFromConfig,
} from '../../../../config'
import { isWCSProduction } from '../../../../lib/env-utils'
import {
  mapNoBundle,
  mapFixedBundle,
  mapFlexibleBundle,
} from '../../transforms/pdp'
import Boom from 'boom'
import { gatewayWithSchema } from '../../../../handlers/lib/gateway'
import { productByIdSchema } from '../../../../handlers/lib/schema/product'

/**
 * Given a product's partNumber, finds that product in another country's catalog
 */
export default class ForeignProductFromPartNumber extends Mapper {
  constructor(...args) {
    super(...args)

    this.storeConfig = getSiteConfigByPreferredISO(
      this.params.targetCountry,
      this.storeConfig.brandCode
    )
  }

  mapEndpoint() {
    if (isWCSProduction()) {
      this.destinationHostname = getWCSDomainFromConfig(this.storeConfig)
    }
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ProductDisplay'
  }

  mapRequestParameters() {
    this.query = {
      storeId: this.storeConfig.siteId,
      langId: this.storeConfig.langId,
      catalogId: this.storeConfig.catalogId,
      partNumber: this.params.partNumber,
    }

    this.headers['brand-code'] = this.storeConfig.storeCode
  }

  mapResponse(response) {
    if (
      response &&
      typeof response === 'object' &&
      response.body &&
      typeof response.body === 'object' &&
      response.body.success === false
    ) {
      throw new Error(response.body.errorMessage)
    }

    return super.mapResponse(response)
  }

  execute() {
    return super
      .execute()
      .then((res) =>
        gatewayWithSchema(
          productByIdSchema,
          res,
          this.method,
          `${this.destinationHostname}${this.destinationEndpoint}`
        )
      )
  }

  mapResponseBody(body) {
    const isBundleResponse = path(['isBundle'], body)

    if (isBundleResponse) {
      if (path(['BundleDetails', 'isFlexible'], body)) {
        return mapFlexibleBundle(body)
      }
      return mapFixedBundle(body)
    }
    return mapNoBundle(body)
  }

  mapResponseError(error) {
    throw Boom.notFound(error && error.message)
  }
}

export const foreignProductFromPartNumberSpec = {
  summary:
    "Given a product's partNumber, finds that product in another country's catalog",
  parameters: [
    {
      name: 'targetCountry',
      in: 'path',
      description: 'ISO 2 country code of the catalog you want to query',
      required: true,
      type: 'string',
    },
    {
      name: 'partNumber',
      in: 'path',
      required: true,
      description:
        'The product\'s partNumber, also sometimes called grouping e.g. "TS26K31NGRY"',
      type: 'string',
    },
  ],
  responses: {
    200: {
      $ref: '#/definitions/pdpProduct',
    },
  },
}
