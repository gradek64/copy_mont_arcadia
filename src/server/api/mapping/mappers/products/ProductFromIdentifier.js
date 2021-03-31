import Boom from 'boom'
import Mapper from '../../Mapper'
import { path } from 'ramda'
import {
  mapNoBundle,
  mapFixedBundle,
  mapFlexibleBundle,
} from '../../transforms/pdp'
import { gatewayWithSchema } from '../../../../handlers/lib/gateway'
import { productByIdSchema } from '../../../../handlers/lib/schema/product'

export default class ProductByIdentifier extends Mapper {
  mapWCSErrorCodes = {
    _ERR_PRODUCT_NOT_PUBLISHED: 404,
  }

  useProductId() {
    if (this.params && this.params.identifier) {
      return this.params.identifier.match(/^\d*$/)
    }
    return true
  }

  usePartNumber() {
    if (this.params && this.params.identifier) {
      return /((^[A-Z]{2}\w*)|(^\d{15}$)|(^BUNDLE_\w*))/.test(
        this.params.identifier
      )
    }
    return false
  }

  mapEndpoint() {
    this.destinationEndpoint =
      this.useProductId() || this.usePartNumber()
        ? '/webapp/wcs/stores/servlet/ProductDisplay'
        : this.params.identifier
    this.timeout = 10000
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    if (this.usePartNumber()) {
      const partNumber = this.params && this.params.identifier
      this.query = {
        langId,
        catalogId,
        storeId,
        partNumber,
      }
    } else if (this.useProductId()) {
      const productId = this.params && this.params.identifier
      this.query = {
        langId,
        catalogId,
        storeId,
        productId,
      }
    }
  }

  mapResponseError(body) {
    if (body.message === 'wcsSessionTimeout') throw body

    throw body.message ? Boom.notFound(body.message) : body
  }

  mapResponseBody(body) {
    const isBundleResponse = path(['isBundle'], body)
    const permanentRedirectUrl = path(['permanentRedirectUrl'], body)

    if (permanentRedirectUrl) {
      return body
    }

    if (isBundleResponse) {
      if (path(['BundleDetails', 'isFlexible'], body)) {
        return mapFlexibleBundle(body)
      }
      return mapFixedBundle(body)
    }

    return mapNoBundle(body)
  }

  execute() {
    return super
      .execute()
      .then((res) =>
        gatewayWithSchema(
          productByIdSchema,
          res,
          this.method,
          this.destinationEndpoint
        )
      )
  }
}

export const productDetailsSpec = {
  summary: 'Get product details',
  parameters: [
    {
      name: 'identifier',
      in: 'path',
      description: 'Product Identifier - the product pathname',
      required: true,
      enum: [
        '/en/tsuk/product/love-gun-t-shirt-by-never-fully-dressed-6954936',
      ],
      type: 'string',
    },
  ],
  responses: {
    200: {
      $ref: '#/definitions/pdpProduct',
    },
  },
}
