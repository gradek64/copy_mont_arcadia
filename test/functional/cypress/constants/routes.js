export default {
  account: {
    account: '/api/account',
    customerDetails: 'api/account/customerdetails',
    login: '/api/account/login',
    logout: '/api/account/logout',
    orderHistory: '/api/account/order-history',
    returnHistory: '/api/account/return-history',
    registerNewUser: '/api/account/register',
    resetPasswordLink: '/api/account/reset_password_link',
    resetPassword: '/api/account/reset_password',
    shortDetails: '/api/account/shortdetails',
    validateResetPassword: '/api/account/validate_reset_password',
  },
  address: {
    address: 'api/address?country=GBR&postcode=W1T3NL&address=',
    addressByCountryCode: (countryCode) => `api/address?country=${countryCode}`,
    returnAddressResult: (moniker) => `/api/address/${moniker}`,
  },
  checkout: {
    orderSummary: '/api/checkout/order_summary',
    orderSummaryById: /\/api\/checkout\/order_summary\/([0-9])+/g,
    orderSummaryDeliveryAddress: '/api/checkout/order_summary/delivery_address',
    giftCard: 'api/checkout/gift-card',
  },
  cms: {
    pages: {
      mobileOrderConfirmationEspotPos1:
        '/api/cms/pages/mobileOrderConfirmationESpotPos1',
    },
  },
  emailWhenBackInStock: '/api/email-me-in-stock*',
  klarnaSession: '/api/klarna-session',
  order: '/api/order',
  payments: /\/api\/payments/,
  paymentsDeliveryUkBillingUk:
    '/api/payments?delivery=United Kingdom&billing=United Kingdom',
  products: {
    search: (searchTerm) => `/api/products?q=${searchTerm}`,
    seo: '/api/products/seo?seoUrl=/en/tsuk/category/**',
    filter: (filter) => `/api/products/filter?seoUrl=/en/tsuk/**${filter}`,
  },
  shoppingBag: {
    addItem2: '/api/shopping_bag/add_item2',
    addPromotionCode: '/api/shopping_bag/addPromotionCode',
    bagTransfer: '/api/shopping_bag/transfer',
    deleteItem: '/api/shopping_bag/delete_item*',
    delivery: '/api/shopping_bag/delivery',
    delPromotionCode: '/api/shopping_bag/delPromotionCode',
    getItems: '/api/shopping_bag/get_items',
    fetchItemSizesAndQuantities: /\/api\/shopping_bag\/fetch_item_sizes_and_quantities\?catEntryId=([0-9])+/g,
    updateItem: '/api/shopping_bag/update_item',
  },
  siteOptions: `/api/stores-countries?brandPrimaryEStoreId=**`,
  storeLocator: (query = '*') => `/api/store-locator${query}`,
  thirdParties: {
    qubitTrendingTally: `https://tally-1.qubitproducts.com/tally/topshop-uk/topk/addToBag_monty?k=250`,
  },
  wishlists: '/api/wishlists',
  wishlist: (additionalParams) => `/api/wishlist${additionalParams}`,
  wishlistApi: {
    quickViewProduct: (productId) => `/api/products/${productId}`,
    addItem: '/api/wishlist/add_item',
    removeItem: 'api/wishlist/remove_item',
    addToBag: 'api/wishlist/add_to_bag',
    wishlist: /\/api\/wishlist\/item_ids\?wishlistId=([0-9])+/g,
    wishlistId: `/api/wishlist?wishlistId=*`,
    wishlists: '/api/wishlists',
  },
  dressipi: {
    recommendationsUrl: 'https://dressipi-staging.topshop.com/api/**',
  },
}
