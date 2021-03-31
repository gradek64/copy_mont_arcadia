/*
  Maps (url, method) to specific mapper.
 */

/* Account Mappers */
import Account from './mappers/account/Account'
import ChangePassword from './mappers/account/ChangePassword'
import ResetPassword from './mappers/account/ResetPassword'
import Logon from './mappers/account/Logon'
import Logout from './mappers/account/Logout'
import OrderDetails from './mappers/account/OrderDetails'
import OrderHistory from './mappers/account/OrderHistory'
import Register from './mappers/account/Register'
import ForgotPassword from './mappers/account/ForgotPassword'
import ResetPasswordLink from './mappers/account/ResetPasswordLink'
import ValidateResetPassword from './mappers/account/ValidateResetPassword'
import ReturnDetails from './mappers/account/ReturnDetails'
import ReturnHistory from './mappers/account/ReturnHistory'
import UpdatePaymentDetails from './mappers/account/UpdatePaymentDetails'
import UpdateProfile from './mappers/account/UpdateProfile'

/* Checkout Mappers */
import OrderSummary from './mappers/order/OrderSummary'
import AddGiftCard from './mappers/order/AddGiftCard'
import DeleteGiftCard from './mappers/order/DeleteGiftCard'
import AddDeliveryAddress from './mappers/order/AddDeliveryAddress'
import DeleteDeliveryAddress from './mappers/order/DeleteDeliveryAddress'
import ChooseSavedAddress from './mappers/order/ChooseSavedAddress'
import DeliverySelectorFactory from './mappers/order/DeliverySelectorFactory'
import CreateOrder from './mappers/order/CreateOrder'
import ConfirmOrder from './mappers/order/ConfirmOrder'
import ConfirmPSD2Order from './mappers/order/ConfirmPSD2Order'
import PrePaymentConfig from './mappers/order/PrePaymentConfig'

/* CMS Mappers */
import CMSPageName from './mappers/cms/CMSPageName'
import CMSSeoUrl from './mappers/cms/CMSSeoUrl'

/* Navigation Mappers */
import Navigation from './mappers/navigation/Navigation'
import NavigationDesktop from './mappers/navigation/NavigationDesktop'

/* Order Mappers */
import KlarnaSession from './mappers/order/KlarnaSession'

/* Product Mappers */
import EmailBackInStock from './mappers/products/EmailBackInStock'
import Products from './mappers/products/Products'
import ProductFromIdentifier from './mappers/products/ProductFromIdentifier'
import ForeignProductFromPartNumber from './mappers/products/ForeignProductFromPartNumber'
import ProductsFromSeo from './mappers/products/ProductsFromSeo'
import ProductsFromFilter from './mappers/products/ProductsFromFilter'
import ProductsFromPromo from './mappers/products/ProductsFromPromo'
import GetSeeMore from './mappers/products/GetSeeMore'
import ProductQuickView from './mappers/products/ProductQuickView'
import ProductStock from './mappers/products/ProductStock'

/* Shopping Bag Mappers */
import Basket from './mappers/shopping_bag/Basket'
import AddToBasket from './mappers/shopping_bag/AddToBasket'
import AddToBasketV2 from './mappers/shopping_bag/AddToBasketV2'
import RemoveFromBasket from './mappers/shopping_bag/RemoveFromBasket'
import SizesAndQuantities from './mappers/shopping_bag/SizesAndQuantities'
import AddPromo from './mappers/shopping_bag/AddPromo'
import DeletePromotionCode from './mappers/shopping_bag/DeletePromotionCode'
import UpdateBasketItem from './mappers/shopping_bag/UpdateBasketItem'
import UpdateDeliveryType from './mappers/shopping_bag/UpdateDeliveryType'
import TransferBasket from './mappers/shopping_bag/TransferBasket'
import MiniBag from './mappers/shopping_bag/MiniBag'

/* Saved Basket Mappers */
import SaveFromBasket from './mappers/saved_basket/SaveFromBasket'
import GetSavedBasket from './mappers/saved_basket/GetSavedBasket'
import DeleteSavedItem from './mappers/saved_basket/DeleteSavedItem'
import RestoreSavedBasketItem from './mappers/saved_basket/RestoreSavedBasketItem'
import SaveBasket from './mappers/saved_basket/SaveBasket'
import DeleteSavedBasket from './mappers/saved_basket/DeleteSavedBasket'
import UpdateSavedItem from './mappers/saved_basket/UpdateSavedItem'

/* Wishlist Mappers */
import CreateWishlist from './mappers/wishlist/CreateWishlist'
import AddToWishlist from './mappers/wishlist/AddToWishlist'
import GetWishlist from './mappers/wishlist/GetWishlist'
import GetWishlistItemIds from './mappers/wishlist/GetWishlistItemIds'
import RemoveFromWishlist from './mappers/wishlist/RemoveFromWishlist'
import GetAllWishlists from './mappers/wishlist/GetAllWishlists'
import AddToBasketFromWishlist from './mappers/wishlist/AddToBasketFromWishlist'
import DeleteWishList from './mappers/wishlist/DeleteWishlist'

/* Misc. Mappers */
import NotifyMe from './mappers/NotifyMe'
import SiteOptions from './mappers/SiteOptions'
import Home from './mappers/Home'
import Espots from './mappers/Espots'
import Footer from './mappers/Footer'

import KeepAlive from './mappers/user/KeepAlive'

export default [
  {
    method: 'get',
    re: /^\/api\/keep-alive$/,
    handler: KeepAlive,
  },
  // /account
  {
    re: /^\/api\/account$/,
    method: 'get',
    handler: Account,
  },
  {
    re: /^\/api\/account\/changepassword$/,
    method: 'put',
    handler: ChangePassword,
  },
  {
    re: /^\/api\/account\/login$/,
    method: 'post',
    handler: Logon,
  },
  {
    re: /^\/api\/account\/logout$/,
    method: 'delete',
    handler: Logout,
  },
  {
    re: /^\/api\/account\/order-history$/,
    method: 'get',
    handler: OrderHistory,
  },
  {
    re: /^\/api\/account\/order-history\/\d+$/,
    method: 'get',
    handler: OrderDetails,
  },
  {
    re: /^\/api\/account\/register$/,
    method: 'post',
    handler: Register,
  },
  {
    re: /^\/api\/account\/forgetpassword$/,
    method: 'post',
    handler: ForgotPassword,
  },
  {
    re: /^\/api\/account\/validate_reset_password$/,
    method: 'post',
    handler: ValidateResetPassword,
  },
  {
    re: /^\/api\/account\/reset_password$/,
    method: 'put',
    handler: ResetPassword,
  },
  {
    re: /^\/api\/account\/reset_password_link$/,
    method: 'post',
    handler: ResetPasswordLink,
  },
  {
    re: /^\/api\/account\/return-history$/,
    method: 'get',
    handler: ReturnHistory,
  },
  {
    re: /^\/api\/account\/return-history\/\d+\/\d+$/,
    method: 'get',
    handler: ReturnDetails,
  },
  {
    re: /^\/api\/account\/customerdetails$/,
    method: 'put',
    handler: UpdatePaymentDetails,
  },
  {
    re: /^\/api\/account\/shortdetails$/,
    method: 'put',
    handler: UpdateProfile,
  },

  // /checkout
  {
    re: /^\/api\/checkout\/order_summary$/,
    method: 'put',
    handler: DeliverySelectorFactory,
  },
  {
    re: /^\/api\/checkout\/order_summary(?:\/\d+)?$/,
    method: 'get',
    handler: OrderSummary,
  },
  {
    re: /^\/api\/checkout\/gift-card$/,
    method: 'post',
    handler: AddGiftCard,
  },
  {
    re: /^\/api\/checkout\/gift-card$/,
    method: 'delete',
    handler: DeleteGiftCard,
  },
  {
    re: /^\/api\/checkout\/order_summary\/delivery_address$/,
    method: 'put',
    handler: ChooseSavedAddress,
  },
  {
    re: /^\/api\/checkout\/order_summary\/delivery_address$/,
    method: 'post',
    handler: AddDeliveryAddress,
  },
  {
    re: /^\/api\/checkout\/order_summary\/delivery_address$/,
    method: 'delete',
    handler: DeleteDeliveryAddress,
  },
  {
    re: /^\/api\/order$/,
    method: 'post',
    handler: CreateOrder,
  },
  {
    re: /^\/api\/order$/,
    method: 'put',
    handler: ConfirmOrder,
  },

  // PSD2
  {
    re: /^\/api\/psd2\/order$/,
    method: 'put',
    handler: ConfirmPSD2Order,
  },
  {
    re: /^\/api\/psd2\/pre-payment-config$/,
    method: 'post',
    handler: PrePaymentConfig,
  },

  // /cms
  {
    re: /^\/api\/cms\/seo$/,
    method: 'get',
    handler: CMSSeoUrl,
  },
  {
    re: /^\/api\/cms\/page\/.+$/,
    method: 'get',
    handler: CMSPageName,
  },

  // /navigation
  {
    re: /^\/api\/navigation\/categories$/,
    method: 'get',
    handler: Navigation,
  },
  {
    re: /^\/api\/desktop\/navigation$/,
    method: 'get',
    handler: NavigationDesktop,
  },

  // /order
  {
    re: /^\/api\/klarna-session$/,
    method: 'post',
    handler: KlarnaSession,
  },
  {
    re: /^\/api\/klarna-session$/,
    method: 'put',
    handler: KlarnaSession,
  },

  // /products
  {
    re: /^\/api\/products\/email-back-in-stock$/,
    method: 'post',
    handler: EmailBackInStock,
  },
  {
    re: /^\/api\/products$/,
    method: 'get',
    handler: Products,
  },
  {
    re: /^\/api\/products\/seo$/,
    method: 'get',
    handler: ProductsFromSeo,
  },
  {
    re: /^\/api\/products\/filter$/,
    method: 'get',
    handler: ProductsFromFilter,
  },
  {
    re: /^\/api\/products\/promo$/, //    /api/products/{identifier} => /api/products/123
    method: 'get',
    handler: ProductsFromPromo,
  },
  {
    re: /^\/api\/products\/seemore$/,
    method: 'get',
    handler: GetSeeMore,
  },
  {
    re: /^\/api\/products\/quickview$/,
    method: 'get',
    handler: ProductQuickView,
  },
  {
    re: /^\/api\/products\/stock$/,
    method: 'get',
    handler: ProductStock,
  },
  {
    re: /^\/api\/products\/.+$/, //    /api/products/{identifier} => /api/products/123
    method: 'get',
    handler: ProductFromIdentifier,
  },
  {
    re: /^\/api\/[^/]+\/products\/.+$/,
    method: 'get',
    handler: ForeignProductFromPartNumber,
  },

  // /shopping_bag
  {
    re: /^\/api\/shopping_bag\/get_items$/,
    method: 'get',
    handler: Basket,
  },
  {
    re: /^\/api\/shopping_bag\/add_item$/,
    method: 'post',
    handler: AddToBasket,
  },
  {
    re: /^\/api\/shopping_bag\/add_item2$/,
    method: 'post',
    handler: AddToBasketV2,
  },
  {
    re: /^\/api\/shopping_bag\/delete_item/,
    method: 'delete',
    handler: RemoveFromBasket,
  },
  {
    re: /^\/api\/shopping_bag\/fetch_item_sizes_and_quantities$/,
    method: 'get',
    handler: SizesAndQuantities,
  },
  {
    re: /^\/api\/shopping_bag\/addPromotionCode$/,
    method: 'post',
    handler: AddPromo,
  },
  {
    re: /^\/api\/shopping_bag\/delPromotionCode$/,
    method: 'delete',
    handler: DeletePromotionCode,
  },
  {
    re: /^\/api\/shopping_bag\/update_item$/,
    method: 'put',
    handler: UpdateBasketItem,
  },
  {
    re: /\/api\/shopping_bag\/delivery$/,
    method: 'put',
    handler: UpdateDeliveryType,
  },
  {
    re: /^\/api\/shopping_bag\/transfer$/,
    method: 'post',
    handler: TransferBasket,
  },
  {
    re: /^\/api\/shopping_bag\/mini_bag$/,
    method: 'get',
    handler: MiniBag,
  },

  // /saved_basket
  {
    re: /^\/api\/saved_basket$/, // Save items in the bakset
    method: 'post',
    handler: SaveBasket,
  },
  {
    re: /^\/api\/saved_basket$/,
    method: 'get',
    handler: GetSavedBasket,
  },
  {
    re: /^\/api\/saved_basket$/,
    method: 'delete',
    handler: DeleteSavedBasket,
  },
  {
    re: /^\/api\/saved_basket\/item$/,
    method: 'post',
    handler: SaveFromBasket,
  },
  {
    re: /^\/api\/saved_basket\/item\/restore$/,
    method: 'put',
    handler: RestoreSavedBasketItem,
  },
  {
    re: /^\/api\/saved_basket\/item\/fetch_item_sizes_and_quantities/,
    method: 'get',
    handler: SizesAndQuantities,
  },
  {
    re: /^\/api\/saved_basket\/item\/update_item/,
    method: 'put',
    handler: UpdateSavedItem,
  },
  {
    re: /^\/api\/saved_basket\/item$/,
    method: 'delete',
    handler: DeleteSavedItem,
  },

  // wishlist
  {
    re: /^\/api\/wishlist\/create$/, // Save items not in the basket
    method: 'post',
    handler: CreateWishlist,
  },
  {
    re: /^\/api\/wishlist\/add_item$/,
    method: 'post',
    handler: AddToWishlist,
  },
  {
    re: /^\/api\/wishlist\/item_ids$/, // TODO: rework these paths (e.g. have wishlist/identifier for specific WL)
    method: 'get',
    handler: GetWishlistItemIds,
  },
  {
    re: /^\/api\/wishlist$/, // TODO: rework these paths (e.g. have wishlist/identifier for specific WL)
    method: 'get',
    handler: GetWishlist,
  },
  {
    re: /^\/api\/wishlist\/remove_item$/,
    method: 'delete',
    handler: RemoveFromWishlist,
  },
  {
    re: /^\/api\/wishlists$/, // TODO: rework these paths (e.g. have wishlist/identifier for specific WL)
    method: 'get',
    handler: GetAllWishlists,
  },
  {
    re: /^\/api\/wishlist\/add_to_bag$/,
    method: 'post',
    handler: AddToBasketFromWishlist,
  },
  {
    re: /^\/api\/wishlist\/delete$/,
    method: 'post',
    handler: DeleteWishList,
  },

  // misc
  {
    re: /^\/api\/email-me-in-stock$/,
    method: 'get',
    handler: NotifyMe,
  },
  {
    re: /^\/api\/site-options$/,
    method: 'get',
    handler: SiteOptions,
  },
  {
    re: /^\/api\/home$/,
    method: 'get',
    handler: Home,
  },
  {
    re: /^\/api\/espots$/,
    method: 'get',
    handler: Espots,
  },
  {
    re: /^\/api\/footers$/,
    method: 'get',
    handler: Footer,
  },
]
