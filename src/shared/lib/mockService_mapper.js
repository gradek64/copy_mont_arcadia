// mock services
import * as desktopNavigationMock from './mockApiService'
import * as checkoutMock from './mockCheckoutService'

export const mapMockResponse = (path, method) => {
  switch (method) {
    case 'GET':
      if (path === '/payments') {
        return Promise.resolve({
          body: checkoutMock.getPayments,
        })
      }
      if (path === '/desktop/navigation') {
        return Promise.resolve({
          body: desktopNavigationMock.desktopNavigation,
        })
      }
      if (/products\/.*view-all-clothing/.test(path)) {
        return Promise.resolve({
          body: desktopNavigationMock.singleProductResponse,
        })
      }
      if (/products\/seo\?seoUrl=/.test(path)) {
        return Promise.resolve({
          body: desktopNavigationMock.anyProductsResponse,
        })
      }

      if (path === '/payments') {
        return Promise.resolve({
          body: checkoutMock.getPayments,
        })
      }

      if (/products\/seo\?seoUrl=/.test(path)) {
        return Promise.resolve({
          body: desktopNavigationMock.anyProductsResponse,
        })
      }

      if (/address\?country.*/.test(path)) {
        return Promise.resolve({
          body: desktopNavigationMock.getAddressResponse,
        })
      }

      if (path === '/shopping_bag/get_items') {
        return Promise.resolve({
          body: checkoutMock.getItems,
        })
      }

      if (/checkout\/order_summary\/\d*\?guestUser=true/.test(path)) {
        return Promise.resolve({
          body: checkoutMock.getOrderSummary,
        })
      }

      // find address
      if (/address*?/.test(path)) {
        return Promise.resolve({
          body: [{}],
        })
      }

      return Promise.resolve({
        body: {},
      })
    case 'POST':
      if (path === '/shopping_bag/add_item2') {
        return Promise.resolve({
          body: checkoutMock.postAddItemResponse,
        })
      }
      break
    case 'DELETE':
      if (/shopping_bag\/delete_item/.test(path)) {
        return Promise.resolve({
          body: checkoutMock.deleteItemResponse,
        })
      }
      break
    default:
      return Promise.resolve({
        body: {},
      })
  }
}
