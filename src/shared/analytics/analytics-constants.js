import namespacedKeyMirror from '../lib/namespaced-key-mirror'

export const ANALYTICS_PLATFORM_ID = 'monty'

export const ANALYTICS_ERROR = {
  REGISTRATION_FAILED: 'User registration failed',
  LOGIN_FAILED: 'User login failed',
  SHOPPING_BAG_PROMO_CODE: 'Error applying promo code in shopping bag.',
  PROCEED_TO_PAYMENT: 'Error proceeding to payment',
  CONFIRM_AND_PAY: 'Error paying order',
  GIFT_CARD_ERROR: 'Error applying gift card in checkout',
}

export const ANALYTICS_FORM_ID = {
  REGISTER: 'register',
  LOGIN: 'login',
}

export const ANALYTICS_ACTION = namespacedKeyMirror('ANALYTICS', {
  SEND_API_RESPONSE_EVENT: null,
  SEND_CLICK_EVENT: null,
  SEND_ERROR_MESSAGE: null,
  SEND_PRODUCT_CLICK_EVENT: null,
  SEND_DISPLAY_EVENT: null,
  SEND_DELIVERY_OPTION_CHANGE_EVENT: null,
  SEND_INPUT_VALIDATION_STATUS: null,
  SEND_PAYMENT_METHOD_SELECTION_EVENT: null,
  SEND_PAYMENT_METHOD_INTENTION_EVENT: null,
  SEND_PAYMENT_METHOD_PURCHASE_SUCCESS_EVENT: null,
  SEND_PAYMENT_METHOD_PURCHASE_FAILURE_EVENT: null,
  SEND_DELIVERY_METHOD_CHANGE_EVENT: null,
  SEND_FILTER_USED_EVENT: null,
  SEND_ORDER_COMPLETE_EVENT: null,
  SEND_PURCHASE_EVENT: null,
  SEND_PURCHASE_ERROR_EVENT: null,
})

export const GTM_EVENT = {
  BAG_DRAWER_DISPLAYED: 'bagDrawerDisplayed',
  GEO_IP_MODAL_DISPLAYED: 'geoIpModal',
  CHECKOUT_SHIPPING_REDIRECT_MODAL_DISPLAYED: 'checkoutShippingRedirectModal',
}

export const GTM_TRIGGER = {
  PRODUCT_ADDED_TO_BAG: 'add to bag',
  PRODUCT_VIEW_BAG: 'view bag',
  BAG_ICON_CLICKED: 'bag icon',
  LOGIN: 'login',
}

export const GTM_CATEGORY = {
  SHOPPING_BAG: 'shoppingBag',
  CHECKOUT: 'checkout',
  SIGN_IN: 'signIn',
  REGISTER: 'register',
  HOME: 'home',
  PLP: 'plp',
  PDP: 'pdp',
  SEARCH_SELECTED: 'searchSelected',
  BUNDLE: 'bundle',
  STORE_LOCATOR: 'store-locator',
  FIND_IN_STORE: 'find-in-store',
  MR_CMS: 'mrCms-pages',
  PRODUCT_QUICK_VIEW: 'product-quick-view',
  DELIVERY_PAYMENT: 'delivery-payment',
  DELIVERY_DETAILS: 'delivery-details',
  COLLECT_FROM_STORE: 'collect-from-store',
  WRITE_REVIEW: 'write-a-review',
  REGISTER_LOGIN: 'register-login',
  BAG_DRAWER: 'bagDrawer',
  NOT_FOUND: 'not-found',
}

export const GTM_ACTION = {
  PROMO_CODE_APPLIED: 'promoCodeApplied',
  CLICKED: 'clicked',
  SUBMIT: 'submit',
  IMAGE_OVERLAY: 'image overlay',
  GIFT_CARD: 'giftCardApplied',
  CONTINUE_SHOPPING: 'continue shopping',
  SEARCH_BAR: 'searchbar',
  SIZE_SELECTED: 'selected size',
  BAG_DRAW_EDIT: 'bagDrawEdit',
  IN_STORE_POSTCODE_GO: 'inStorePostcodeGo',
  IN_STORE_POSTCODE_RESULT: 'inStorePostcodeResult',
  PAYMENT_METHOD_SELECTION: 'paymentMethodSelection',
  PAYMENT_METHOD_INTENTION: 'paymentMethodIntention',
  PAYMENT_METHOD_PURCHASE_SUCCESS: 'paymentMethodPurchaseSuccess',
  PAYMENT_METHOD_PURCHASE_FAILURE: 'paymentMethodPurchaseFailure',
}

export const GTM_PAGE_TYPES = {
  PDP_PAGE_TYPE: 'pdp',
  PLP_PAGE_TYPE: 'plp',
  PDP_BUNDLE_PAGE_TYPE: 'bundle',
  HOMEPAGE_PAGE_TYPE: 'homepage',
}

export const GTM_LIST_TYPES = {
  PDP_RECENTLY_VIEWED: 'PDP Recently Viewed',
  PLP_RECENTLY_VIEWED: 'PLP Recently Viewed',
  PDP_RECOMMENDED_PRODUCTS: 'PDP Recommended Products',
  // This variable is the same as PDP_RECOMMENDED_PRODUCTS, but it was decided to make it more specific in case we'll have another carousel of products on PDP page
  // PDP_RECOMMENDED_PRODUCTS variable could later be either deleted or renamed
  PDP_WHY_NOT_TRY: 'PDP Why Not Try',
}

export const GTM_VALIDATION_STATES = {
  SUCCESS: 'success',
  FAILURE: 'failure',
}

export const GTM_LABEL = {
  CLOSE_BUTTON: 'close-button',
  PRODUCT_DETAILS: 'product details',
}
