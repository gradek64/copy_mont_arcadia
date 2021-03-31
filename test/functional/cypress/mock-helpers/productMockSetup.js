const fixtures = require('../../cypress/fixtures')

import {
  setUpMocksForRouteList,
  removeDomainFromFullLink,
} from '../lib/helpers'
import routes from '../constants/routes'

export default class productMocks {
  // PLP
  mocksForProductList = (selectedEndpoints = {}) => {
    const {
      productSearchTerm,
      productSearchResults,
      productNavigation,
      productFilter,
      filter,
    } = selectedEndpoints

    let filterFormatted
    if (filter !== undefined) {
      filterFormatted = `**${filter}**`
    } else {
      filterFormatted = '**'
    }
    const path = `/search/?q=${encodeURIComponent(productSearchTerm)}`
    const productRoutes = [
      productSearchTerm && {
        method: 'GET',
        url: `/api/products?q=${encodeURIComponent(productSearchTerm)}`,
        response: productSearchResults,
        alias: 'prod-search-results',
      },
      productNavigation && {
        method: 'GET',
        url: routes.products.seo,
        response: productNavigation,
        alias: 'prod-nav-results',
      },
      productFilter && {
        method: 'GET',
        url: `/api/products/filter?seoUrl=/${filterFormatted}`,
        response: productFilter,
        alias: 'prod-filtered',
      },
    ]
    setUpMocksForRouteList(productRoutes)
    return path
  }

  // PDP
  pdpRoutes = (selectedEndpoints = {}) => {
    const { path, productByUrl, productById } = selectedEndpoints

    const routes = [
      productByUrl && {
        method: 'GET',
        url: `/api/products/${encodeURIComponent(path)}`,
        response: productByUrl,
        alias: 'product-by-url',
      },
      productByUrl && {
        // this one is because cypress decodes urls automatically which results no match...
        method: 'GET',
        url: `/api/products/${path}`,
        response: productByUrl,
        alias: 'product-by-url',
      },
      productById && {
        method: 'GET',
        url: /\/api\/products\/([0-9])+/g,
        response: productById,
        alias: 'product-by-id',
      },
    ]

    if (
      productById &&
      productById.seeMoreValue &&
      productById.seeMoreValue.length
    ) {
      productById.seeMoreValue.forEach((smv, i) => {
        routes.push({
          method: 'GET',
          url: `/api/products?endecaSeoValue=${productById.seeMoreValue[
            i
          ].seeMoreLink.substr(3)}`,
          response: fixtures.plp.noResults,
          alias: 'no-results-products',
        })
      })
    }
    return routes
  }

  mocksForPdpProduct = (selectedEndPoints = {}) => {
    const { productByUrl, productById } = selectedEndPoints
    const path =
      productByUrl && removeDomainFromFullLink(productByUrl.sourceUrl)
    const routes = this.pdpRoutes({
      path,
      productByUrl,
      productById,
    })
    setUpMocksForRouteList(routes)
    return path
  }

  mocksForTrending = (response) => {
    cy.server()
    cy.route({
      method: 'GET',
      url: routes.thirdParties.qubitTrendingTally,
      response,
    }).as('plp-trending')
  }

  mocksForDressipiRecommendations = () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: routes.dressipi.recommendationsUrl,
      response: 'fixture:pdp/dressipi/dressipiRelatedRecommendations.json',
    }).as('dressipi-recommendtations-request')
  }
}
