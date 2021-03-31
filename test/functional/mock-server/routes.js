const fixtures = require('./../cypress/fixtures')

const commonRoutes = [
  {
    method: 'GET',
    url: '/api/navigation/categories',
    response: fixtures.general.categories,
  },
  {
    method: 'GET',
    url: '/api/desktop/navigation',
    response: fixtures.general.navigation,
  },
  {
    method: 'GET',
    url: '/api/site-options',
    response: fixtures.general.siteOptions,
  },
  {
    method: 'GET',
    url: '/api/footers',
    response: fixtures.general.footer,
  },
  {
    method: 'GET',
    url: /\/api\/stores-countries/,
    response: fixtures.general.storeCountryLocator,
  },
  {
    method: 'GET',
    url: /\/cmscontent(.*)/,
    response: fixtures.cms.cmscontent,
  },
  {
    method: 'GET',
    url: /\/cms\/pages\/(.*)/,
    response: fixtures.cms.cmscontent,
  },
  {
    method: 'GET',
    url: /\/cms\/pages\/error404/,
    response: fixtures.cms.cmscontent,
    status: 404,
  },
  {
    method: 'GET',
    url: '/api/wishlists',
    response: fixtures.wishlist.wishlists,
  },
  {
    method: 'GET',
    url: '/api/wishlist/item_ids?wishlistId=',
    response: fixtures.wishlist.wishlistNoItem,
  },
  {
    method: 'GET',
    url: '/api/features',
    response: {
      features: {
        '0': 'FEATURE_SWATCHES',
        '1': 'FEATURE_PLP_REDIRECT_IF_ONE_PRODUCT',
        '2': 'FEATURE_PDP_SCROLL_TO_TOP',
        '3': 'FEATURE_PRODUCT_VIDEO',
        '4': 'FEATURE_SHOW_SIZE_GUIDE',
        '5': 'PASSWORD_SHOW_TOGGLE',
        '6': 'FEATURE_CFSI',
        '7': 'FEATURE_PDP_QUANTITY',
        '8': 'FEATURE_PUDO',
        '9': 'FEATURE_HEADER_BIG',
        '10': 'FEATURE_STORE_FINDER_HEADER_WITH_COUNTRY_SELECTOR',
        '11': 'FEATURE_ORDER_HISTORY_MSG',
        '12': 'FEATURE_RESPONSIVE',
        '13': 'FEATURE_NEW_CHECKOUT',
        '14': 'FEATURE_GEOIP',
        '15': 'FEATURE_SHOP_THE_LOOK',
        '16': 'FEATURE_SAVE_PAYMENT_DETAILS',
        '17': 'FEATURE_SHOW_FIT_ATTRIBUTE_LINKS',
        '18': 'FEATURE_TRANSFER_BASKET',
        '19': 'FEATURE_PRODUCT_DESCRIPTION_SEE_MORE',
        '20': 'FEATURE_ADDRESS_BOOK',
        '21': 'FEATURE_MEGA_NAV',
        '22': 'FEATURE_DESKTOP_RESET_PASSWORD',
        '23': 'FEATURE_CVV_HELP',
        '24': 'FEATURE_FULL_MONTY_ESPOTS',
        '25': 'FEATURE_ORDER_RETURNS',
      },
    },
  },
  {
    method: 'POST',
    url: '/api/client-info',
    response: '',
  },
  {
    method: 'POST',
    url: '/api/client-error',
    response: '',
  },
  {
    method: 'POST',
    url: '/api/client-debug',
    response: '',
  },
  {
    method: 'GET',
    url: /\/collector\/(.*)/,
    response: '',
  },
  {
    method: 'POST',
    url: /\/collector\/(.*)/,
    response: '',
  },
  {
    method: 'GET',
    url: /api\/cms\/pages\/(.*)/,
    response: '',
  },
  {
    method: 'GET',
    url: /user\/(.*)/,
    response: '',
  },
  {
    method: 'GET',
    url: '/api/keep-alive',
    response: '',
  },
  {
    method: 'GET',
    url: /\/api\/espots/,
    response: {},
  },
  {
    method: 'POST',
    url: 'api/exponea',
    response: '',
  },
  {
    method: 'POST',
    url: `https://api.mktg.arcadiagroup.co.uk/**`,
    response: {},
  },
  {
    method: 'GET',
    url: '/sockjs-node/**',
    response: {},
  },
]

export const getPDPRoutes = ({ path, response }) => {
  const routes = commonRoutes

  console.log('routes.js getPDPRoutes:path', path, 'response:', response)
  routes.push(
    {
      method: 'GET',
      url: `/api/products/${encodeURIComponent(path)}`,
      response,
    },
    {
      // this one is because cypress decodes urls automatically which results no match...
      method: 'GET',
      url: `/api/products/${path}`,
      response,
    }
  )

  if (response.seeMoreValue && response.seeMoreValue.length) {
    response.seeMoreValue.forEach((smv, i) => {
      routes.push({
        method: 'GET',
        url: `/api/products?endecaSeoValue=${response.seeMoreValue[
          i
        ].seeMoreLink.substr(3)}`,
        response: fixtures.plp.noResults,
      })
    })
  }

  return routes
}

export const concatRoutes = (routes) => commonRoutes.concat(routes)

export const getCommonRoutes = () => commonRoutes.slice()

export const getPlpRoutes = (searchTerm) => {
  const routes = getCommonRoutes()
  const productsToLoadIn = fixtures.plp.initialPageLoad
  routes.push({
    method: 'GET',
    url: `/api/products?q=${encodeURIComponent(searchTerm)}`,
    response: productsToLoadIn,
  })

  return { routes, products: productsToLoadIn.products }
}
