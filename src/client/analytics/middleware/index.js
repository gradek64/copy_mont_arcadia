import userSessionFactory from './user-session'
import productViewFactory from './product-view'
import checkoutStepsFactory from './checkout-steps'
import pageViewFactory from './page-view'
import basketFactory from './basket'
import productImpressionsFactory from './product-impressions'
import wishlistFactory from './wishlist'
import { setupAnalyticsActionListeners } from './analytics-action-listeners'

export default () => {
  userSessionFactory()
  pageViewFactory()
  productViewFactory()
  checkoutStepsFactory()
  basketFactory()
  productImpressionsFactory()
  wishlistFactory()
  setupAnalyticsActionListeners()
}
