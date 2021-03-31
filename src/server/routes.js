import path, { resolve } from 'path'

import { getSiteConfig } from './config'
import { getDestinationHostFromStoreCode } from './api/utils'
import * as specs from './api/specs'
import { validateQuery } from './lib/middleware'
import { getStaticAssets } from './lib/get-static-assets'
import { getEtagMethod } from '../shared/lib/cacheable-urls'

// Handlers
import routeHandler from './api/handler'
import { serverSideRenderer } from './handlers/server-side-renderer'
import { assetHandler } from './handlers/asset-handler'
import { paymentMethodsHandler } from './handlers/payment-methods-handler'
import {
  getStoresHandler,
  getCountriesHandler,
} from './handlers/store-locator-handler'
import * as address from './handlers/address'
import {
  getCmsFormHandler,
  cmsFormSubmitHandler,
  montyCmsFormSubmitHandler,
} from './handlers/cms-handler'
import { processReport } from './handlers/client-report-handler'
import featuresHandler, {
  consumerFeatureHandler,
  consumerFeatureHandlerSpec,
} from './handlers/features-handler'
import { getHealthCheckHandler } from './handlers/healthcheck'
import { getPlatformHealthCheckHandler } from './handlers/platform-healthcheck'
import {
  mrCmsContentHandler,
  mrCmsAssetsHandler,
} from './handlers/mr-cms-handler'
import forceTimeout from './handlers/force-timeout'
import forceRememberMeTimeout from './handlers/force-remember-me-timeout'
import geoIPPixelHandler from './handlers/geo-ip-pixel'
import exponeaHandler from './handlers/exponea-handler'
import orderCompleteHandler from './handlers/order-complete-handler'
import psd2OrderPunchoutHandler from './handlers/psd2-order-punchout-handler'
import googleMapsHandler, {
  googleMapsHandlerSpec,
} from './handlers/google-maps-handler'
import {
  catalogLegacyRedirectHandler,
  homeLegacyRedirectHandler,
} from './handlers/legacy-redirect-handler'
import applepayValidationHandler from './handlers/applepay-validation-handler'
import applepaySessionHandler from './handlers/applepay-session-handler'

const auth = process.env.BASIC_AUTH_ENABLED === 'true' ? 'simple' : false

const isAssetRequest = (param) => {
  return typeof param === 'string' && !param.includes('/')
}

const getBrandName = (hostname) => {
  return getSiteConfig(hostname).brandName
}

const getAssetPath = (assets, brandName, fileName) => {
  const brandAssets = assets[brandName]
  if (brandAssets && brandAssets.files.includes(fileName)) {
    return resolve(brandAssets.path, brandAssets.subFolder, fileName)
  }
}

export default [
  {
    method: 'GET',
    path: '/api/keep-alive',
    handler: routeHandler,
  },
  {
    devOnly: true,
    method: 'GET',
    path: '/api-docs/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '../../swagger-ui'),
      },
    },
  },
  {
    method: 'GET',
    path: '/api/force-timeout',
    devOnly: true,
    handler: forceTimeout,
    meta: {
      excludeFromDocs: true,
    },
  },
  {
    method: 'GET',
    path: '/api/force-remember-me-timeout',
    devOnly: true,
    handler: forceRememberMeTimeout,
    meta: {
      excludeFromDocs: true,
    },
  },
  {
    method: 'POST',
    path: '/api/products/email-back-in-stock',
    handler: routeHandler,
    meta: {
      swagger: specs.emailMeInStockSpec,
    },
  },
  {
    // This is desktop specific (no scrAPI handler available)
    method: 'GET',
    path: '/api/desktop/navigation',
    handler: routeHandler,
  },
  {
    method: 'POST',
    path: '/api/static-map',
    handler: googleMapsHandler,
    meta: {
      swagger: googleMapsHandlerSpec,
    },
  },
  {
    method: 'GET',
    path: '/cmscontent/{pathName*}',
    handler: mrCmsContentHandler,
  },
  {
    method: 'GET',
    path: '/cmscontent',
    handler: mrCmsContentHandler,
  },
  {
    method: 'GET',
    path: '/assets/content',
    handler: mrCmsAssetsHandler,
  },
  {
    method: 'GET',
    path: '/assets/{pathName*}',
    handler: assetHandler,
  },
  {
    method: 'GET',
    path: '/api/{targetCountry}/products/{partNumber}',
    handler: routeHandler,
    meta: {
      swagger: specs.foreignProductFromPartNumberSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/products/{identifier}',
    handler: routeHandler,
    meta: {
      swagger: specs.productDetailsSpec,
    },
  },
  {
    method: 'GET',
    path: '/health',
    handler: getHealthCheckHandler,
  },
  {
    method: 'GET',
    path: '/platform-health',
    handler: getPlatformHealthCheckHandler,
  },
  {
    method: 'GET',
    path: '/api/products',
    handler: routeHandler,
    meta: {
      swagger: specs.getProductsSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/products/seo',
    handler: routeHandler,
    meta: {
      swagger: specs.productsFromSeoSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/products/filter',
    handler: routeHandler,
    meta: {
      swagger: specs.getProductsFromFilterSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/products/promo',
    handler: routeHandler,
    meta: {
      swagger: specs.productsFromPromoSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/products/seemore',
    handler: routeHandler,
    meta: {
      swagger: specs.getSeeMoreSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/products/quickview',
    handler: routeHandler,
    meta: {
      swagger: specs.productQuickViewSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/products/stock',
    handler: routeHandler,
    meta: {
      swagger: specs.productStockSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/account',
    handler: routeHandler,
    meta: {
      swagger: specs.accountSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/account/register',
    handler: routeHandler,
    meta: {
      swagger: specs.registerSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/account/login',
    handler: routeHandler,
    meta: {
      swagger: specs.logonSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/account/logout',
    handler: routeHandler,
    meta: {
      swagger: specs.logoutSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/account/changepassword',
    handler: routeHandler,
    meta: {
      swagger: specs.changePasswordSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/account/forgetpassword',
    handler: routeHandler,
    meta: {
      swagger: specs.forgotPasswordSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/account/reset_password',
    handler: routeHandler,
    meta: {
      swagger: specs.resetPasswordSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/account/validate_reset_password',
    handler: routeHandler,
  },
  {
    method: 'POST',
    path: '/api/account/reset_password_link',
    handler: routeHandler,
    meta: {
      swagger: specs.resetPasswordLinkSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/account/customerdetails',
    handler: routeHandler,
    meta: {
      swagger: specs.updatePaymentDetailsSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/account/shortdetails',
    handler: routeHandler,
    meta: {
      swagger: specs.updateProfileSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/account/order-history',
    handler: routeHandler,
    meta: {
      swagger: specs.orderHistorySpec,
    },
  },
  {
    method: 'GET',
    path: '/api/account/order-history/{orderId}',
    handler: routeHandler,
    meta: {
      swagger: specs.orderDetailsSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/account/return-history',
    handler: routeHandler,
    meta: {
      swagger: specs.returnHistorySpec,
    },
  },
  {
    method: 'GET',
    path: '/api/account/return-history/{orderId}/{rmaId}',
    handler: routeHandler,
    meta: {
      swagger: specs.returnDetailsSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/navigation/categories',
    handler: routeHandler,
    meta: {
      swagger: specs.navigationSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/shopping_bag/add_item',
    handler: routeHandler,
    meta: {
      swagger: specs.addToBasketSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/shopping_bag/add_item2',
    handler: routeHandler,
    meta: {
      swagger: specs.addToBasketV2Spec,
    },
  },
  {
    method: 'GET',
    path: '/api/shopping_bag/get_items',
    handler: routeHandler,
    meta: {
      swagger: specs.getBasketSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/shopping_bag/delete_item',
    handler: routeHandler,
    meta: {
      swagger: specs.removeFromBasketSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/shopping_bag/transfer',
    handler: routeHandler,
    meta: {
      swagger: specs.transferBasketSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/shopping_bag/addPromotionCode',
    handler: routeHandler,
    meta: {
      swagger: specs.addPromoSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/shopping_bag/delPromotionCode',
    handler: routeHandler,
    meta: {
      swagger: specs.deletePromoSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/shopping_bag/update_item',
    handler: routeHandler,
    meta: {
      swagger: specs.updateItemSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/shopping_bag/delivery',
    handler: routeHandler,
    meta: {
      swagger: specs.updateDeliveryTypeSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/shopping_bag/fetch_item_sizes_and_quantities',
    handler: routeHandler,
    meta: {
      swagger: specs.sizesAndQuantitiesSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/shopping_bag/mini_bag',
    handler: routeHandler,
    meta: {
      swagger: specs.miniBagSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/site-options',
    handler: routeHandler,
    meta: {
      swagger: specs.siteOptionsSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/home',
    handler: routeHandler,
    meta: {
      swagger: specs.homeSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/payments',
    handler: paymentMethodsHandler,
    meta: {
      swagger: specs.getPaymentMethodsSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/order',
    config: {
      validate: {},
    },
    handler: routeHandler,
    meta: {
      swagger: specs.createOrderSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/order',
    handler: routeHandler,
    meta: {
      swagger: specs.confirmOrderSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/psd2/order',
    handler: routeHandler,
    meta: {
      swagger: specs.confirmPSD2OrderSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/psd2/pre-payment-config',
    handler: routeHandler,
    meta: {
      swagger: specs.prePaymentConfigSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/checkout/order_summary/{orderId?}',
    handler: routeHandler,
    meta: {
      swagger: specs.orderSummarySpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/checkout/order_summary',
    handler: routeHandler,
    meta: {
      swagger: specs.deliverySelectorSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/checkout/order_summary/delivery_address',
    handler: routeHandler,
    meta: {
      swagger: specs.addDeliveryAddressSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/checkout/order_summary/delivery_address',
    handler: routeHandler,
    meta: {
      swagger: specs.chooseSavedAddressSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/checkout/gift-card',
    handler: routeHandler,
    meta: {
      swagger: specs.addGiftCardSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/checkout/gift-card',
    handler: routeHandler,
    meta: {
      swagger: specs.deleteGiftCardSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/checkout/order_summary/delivery_address',
    handler: routeHandler,
    meta: {
      swagger: specs.deleteDeliveryAddressSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/checkout/applepay_session',
    handler: applepaySessionHandler,
  },
  {
    method: 'GET',
    path: '/api/store-locator',
    handler: getStoresHandler,
  },
  {
    method: 'GET',
    path: '/api/stores-countries',
    handler: getCountriesHandler,
  },
  {
    method: 'GET',
    path: '/api/email-me-in-stock',
    handler: routeHandler,
    meta: {
      swagger: specs.notifyMeSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/address',
    config: { timeout: { server: 2000 } },
    handler: address.list,
  },
  {
    method: 'GET',
    path: '/api/address/{moniker}',
    config: { timeout: { server: 2000 } },
    handler: address.getByMoniker,
  },
  {
    method: 'GET',
    path: '/api/cms/seo',
    handler: routeHandler,
    meta: {
      swagger: specs.cmsSeoUrlSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/cms/page/{pageName}',
    handler: routeHandler,
    meta: {
      swagger: specs.cmsPageNameSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/cms/forms/{formName}',
    handler: getCmsFormHandler,
  },
  {
    method: 'POST',
    path: '/api/montycms/form/submit',
    handler: montyCmsFormSubmitHandler,
  },
  {
    method: 'POST',
    path: '/api/cms/form/submit',
    handler: cmsFormSubmitHandler,
  },
  {
    method: 'POST',
    path: '/api/client-{ltype}',
    handler: processReport,
  },
  {
    method: 'GET',
    path: '/api/features/{consumer}',
    handler: consumerFeatureHandler,
    meta: {
      swagger: consumerFeatureHandlerSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/features',
    handler: featuresHandler,
  },
  {
    method: 'POST',
    path: '/api/klarna-session',
    handler: routeHandler,
    meta: {
      swagger: specs.klarnaSessionSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/klarna-session',
    handler: routeHandler,
    meta: {
      swagger: specs.klarnaSessionSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/saved_basket',
    handler: routeHandler,
    meta: {
      swagger: specs.saveBasketSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/saved_basket',
    handler: routeHandler,
    meta: {
      swagger: specs.getSavedBasketSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/saved_basket/item',
    handler: routeHandler,
    meta: {
      swagger: specs.saveFromBasketSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/saved_basket/item/restore',
    handler: routeHandler,
    meta: {
      swagger: specs.restoreSavedBasketItemSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/saved_basket/item/fetch_item_sizes_and_quantities',
    handler: routeHandler,
    meta: {
      swagger: specs.sizesAndQuantitiesSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/saved_basket/item',
    handler: routeHandler,
    meta: {
      swagger: specs.deleteSavedItemSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/saved_basket',
    handler: routeHandler,
    meta: {
      swagger: specs.deleteSavedBasketSpec,
    },
  },
  {
    method: 'PUT',
    path: '/api/saved_basket/item/update_item',
    handler: routeHandler,
    meta: {
      swagger: specs.updateSavedItemSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/wishlist/create',
    handler: routeHandler,
    meta: {
      swagger: specs.createWishlistSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/wishlist/add_item',
    handler: routeHandler,
    meta: {
      swagger: specs.addToWishlistSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/wishlist/item_ids',
    handler: routeHandler,
    meta: {
      swagger: specs.getWishlistItemIdsSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/wishlist',
    handler: routeHandler,
    meta: {
      swagger: specs.getWishlistSpec,
    },
  },
  {
    method: 'DELETE',
    path: '/api/wishlist/remove_item',
    handler: routeHandler,
    meta: {
      swagger: specs.removeFromWishlistSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/wishlists',
    handler: routeHandler,
    meta: {
      swagger: specs.getAllWishlistsSpec,
    },
  },
  {
    method: 'POST',
    path: '/api/wishlist/add_to_bag',
    handler: routeHandler,
    meta: {
      swagger: specs.addToBasketFromWishlistSpec,
    },
  },
  {
    method: 'GET',
    path: '/robots.txt',
    handler: (req, reply) =>
      reply
        .file(path.join(__dirname, '../../public/robots.txt'))
        .type('text/plain'),
  },
  {
    method: 'GET',
    path: '/api/espots',
    handler: routeHandler,
    meta: {
      swagger: specs.espotsSpec,
    },
  },
  {
    method: 'GET',
    path: '/api/footers',
    handler: routeHandler,
  },
  {
    method: 'GET',
    path: '/api/geo-ip-pixel/{ISO}',
    handler: geoIPPixelHandler,
    meta: {
      excludeFromDocs: true,
    },
  },
  {
    method: 'GET',
    path: '/.well-known/apple-developer-merchantid-domain-association.txt',
    handler: applepayValidationHandler,
  },
  {
    method: 'GET',
    path: '/wcsstore/{param*}',
    handler: (req, reply) => {
      /**
       * The MCR content renders relative images e.g. src="/wcsstore/..." which sends a here.
       * These images live on a certain WCS environment.
       *
       * The WCS_ENVIRONMENT environment variable is used to configure CoreAPI
       * to point to a certain WCS environment e.g. tst1, acc1 etc.
       * The MR_CMS_* environment variables tell the hapi server to point to a
       * certain MCR env (previously called Monty CMS, previously previously called Mr CMS).
       *
       * MCR will be pointing to a WCS environment but not necessarily the same as CoreAPI.
       * Therefore the content may be being served from 1 WCS instance and the catalog
       * being served from another.
       *
       * So we use the MR_CMS_URL env var to work out which WCS env we need to get the images from.
       * This is why we map MCR environments to the WCS environments they point to.
       *
       * We only do this locally while pointing to tst1 as there are Akamai rules
       * that do roughly the same.
       *
       * All of this can be removed when MCR uses Amplience as these will be hosted on
       * the Amplience URLS e.g. images.topshop.com/...
       */
      if (process.env.WCS_ENVIRONMENT !== 'tst1')
        return reply('Invalid WCS URL').code(400)

      const config = getSiteConfig(req.info.hostname)
      const mapCMSEnvToWCSDomain = {
        'cms-integration': getDestinationHostFromStoreCode(
          'prd1stage',
          config.storeCode
        ),
        'cms-showcase': getDestinationHostFromStoreCode(
          'prd1stage',
          config.storeCode
        ),
        cms: getDestinationHostFromStoreCode('prd1live', config.storeCode),
      }
      const cmsEnv = process.env.MR_CMS_URL.split('.')[0]
      const wcsDomain = mapCMSEnvToWCSDomain[cmsEnv]

      reply()
        .redirect(`${wcsDomain}${req.url.pathname}`)
        .permanent()
    },
  },

  //
  // 3rd Party Payment Verification.
  //
  // Worldpay, Paypal, etc return to the platform on a GET or a POST
  // for a server side render.
  //
  // Reloading the page will invoke a server side render on the GET.
  //
  {
    method: 'GET',
    path: '/order-complete',
    config: { auth, validate: { query: validateQuery } },
    handler: orderCompleteHandler,
    meta: {
      swagger: specs.confirmOrderSpec,
    },
  },
  {
    method: 'POST',
    path: '/order-complete',
    config: { auth, validate: { query: validateQuery } },
    handler: orderCompleteHandler,
    meta: {
      swagger: specs.confirmOrderSpec,
    },
  },

  //
  // Exponea route for managing marketing email preferences per customer.
  //
  {
    method: 'POST',
    path: '/api/exponea',
    handler: exponeaHandler,
  },

  //
  // PSD2 - EU Payment Services Directive 2 compliance
  //

  // This is the return point from a third party payment e.g. 3D Secure.
  //
  // The page this serves into the iframe containing the third party UI will redirect
  // the iframe's parent to the next Monty state (/psd2-order-confirm), thereby
  // bursting out of the iframe.
  //
  // This avoids the redirection remaining in the iframe which would nest Monty within Monty.
  {
    method: 'POST',
    path: '/psd2-order-punchout',
    handler: psd2OrderPunchoutHandler,
  },

  // ADP-3343 - Legacy app redirects
  // Calls to this endpoint should redirect the user to the
  // homepage with a 301 status code.
  {
    method: 'GET',
    path: '/webapp/wcs/stores/servlet/TopCategoriesDisplay',
    handler: homeLegacyRedirectHandler,
  },

  // ADP-3343 - Continued
  // Calls to:
  // - '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd',
  // should redirect to the provided category which is retrieved from wcs.
  {
    method: 'GET',
    path: '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd',
    handler: catalogLegacyRedirectHandler,
  },

  //
  // This is the catch-all route for GET requests.
  //
  // NB: Please keep this at the end of the list of route definitions.
  //
  // As a catch-all it makes more sense at the end, even if Hapi uses a set of
  // path matching specificity rules in practice instead of the ordering of
  // route definitions in the array.
  //
  // Hapi docs on path matching and specificity rules:
  //   https://hapijs.com/api/13.5.0#path-matching-order
  //
  {
    method: 'GET',
    path: '/{param*}',
    config: {
      auth,
      handler: function appRouteHandler(req, reply) {
        const {
          info: { hostname },
          params: { param },
        } = req

        if (isAssetRequest(param)) {
          const brandName = getBrandName(hostname)
          const assetPath = getAssetPath(this.staticAssets, brandName, param)

          // force a Monty style 404 page if no file with name `param` exists
          if (assetPath) {
            return reply.file(assetPath, {
              etagMethod: getEtagMethod('hapi', `/${param}`),
            })
          }
        }

        return serverSideRenderer(req, reply)
      },
      bind: { staticAssets: getStaticAssets() },
      validate: { query: validateQuery },
    },
  },
]
