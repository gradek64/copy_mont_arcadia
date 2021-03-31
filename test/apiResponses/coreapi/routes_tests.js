const baseUrl = `http://local.m.topshop.com:3000/api`

export default {
  navigation: {
    mobile: {
      method: 'get',
      path: `${baseUrl}/navigation/categories`,
      status: 'done',
    },
    desktop: {
      method: 'get',
      path: `${baseUrl}/desktop/navigation`,
      status: 'done',
    },
    home: {
      method: 'get',
      path: `${baseUrl}/home`,
      status: 'not-used',
    },
  },
  myAccount: {
    account: {
      method: 'get',
      path: `${baseUrl}/account`,
      status: 'done',
    },
    register: {
      method: 'post',
      path: `${baseUrl}/account/register`,
      status: 'done',
    },
    login: {
      method: 'post',
      path: `${baseUrl}/account/login`,
      status: 'done',
    },
    logout: {
      method: 'delete',
      path: `${baseUrl}/account/logout`,
      status: 'done',
    },
    changePassword: {
      method: 'put',
      path: `${baseUrl}/account/changepassword`,
      status: 'done',
    },
    forgotPassword: {
      method: 'post',
      path: `${baseUrl}/account/forgetpassword`,
      status: 'done',
    },
    resetPassword: {
      method: 'put',
      path: `${baseUrl}/account/reset_password`,
      status: 'done',
    },
    resetPasswordLink: {
      method: 'post',
      path: `${baseUrl}/account/reset_password_link`,
      status: 'done',
    },
    customerDetails: {
      method: 'get',
      path: `${baseUrl}/account/customerdetails`,
      status: 'not-used',
    },
    changeCustomerDetails: {
      method: 'put',
      path: `${baseUrl}/account/customerdetails`,
      status: 'done',
    },
    accountShortProfile: {
      method: 'put',
      path: `${baseUrl}/account/shortdetails`,
      status: 'done',
    },
    orderHistory: {
      method: 'get',
      path: `${baseUrl}/account/order-history`,
      status: 'done',
    },
    orderHistoryDetails: {
      method: 'get',
      path: (orderId) => `${baseUrl}/account/order-history/${orderId}`,
      status: 'done',
    },
    returnHistory: {
      method: 'get',
      path: `${baseUrl}/account/return-history`,
      status: 'done',
    },
    returnHistoryDetails: {
      method: 'get',
      path: (orderId, rmaId) =>
        `${baseUrl}/account/return-history/${orderId}/${rmaId}`,
      status: 'done',
    },
    exponea: {
      method: 'post',
      path: `${baseUrl}/exponea`,
      status: 'done',
    },
  },
  shoppingBag: {
    addItem: {
      method: 'post',
      path: `${baseUrl}/shopping_bag/add_item`,
      status: 'done',
    },
    addItem2: {
      method: 'post',
      path: `${baseUrl}/shopping_bag/add_item2`,
      status: 'done',
    },
    items: {
      method: 'get',
      path: `${baseUrl}/shopping_bag/get_items`,
      status: 'done',
    },
    deleteItem: {
      method: 'delete',
      path: `${baseUrl}/shopping_bag/delete_item`,
      status: 'done',
    },
    deleteAllItems: {
      method: 'delete',
      path: `${baseUrl}/shopping_bag/empty_bag`,
      status: 'not-used',
    },
    transferShoppingBag: {
      method: 'post',
      path: `${baseUrl}/shopping_bag/transfer`,
      status: 'done',
    },
    addPromotionCode: {
      method: 'post',
      path: `${baseUrl}/shopping_bag/addPromotionCode`,
      status: 'done',
    },
    deletePromotionCode: {
      method: 'delete',
      path: `${baseUrl}/shopping_bag/delPromotionCode`,
      status: 'done',
    },
    updateItem: {
      method: 'put',
      path: `${baseUrl}/shopping_bag/update_item`,
      status: 'done',
    },
    updateDelivery: {
      method: 'put',
      path: `${baseUrl}/shopping_bag/delivery`,
      status: 'done',
    },
    fetchSizeQty: {
      method: 'get',
      path: `${baseUrl}/shopping_bag/fetch_item_sizes_and_quantities`,
      status: 'done',
    },
    getMiniBag: {
      method: 'get',
      path: `${baseUrl}/shopping_bag/mini_bag`,
      status: 'not-used',
    },
  },
  products: {
    emailBackInStock: {
      method: 'post',
      path: `${baseUrl}/products/email-back-in-stock`,
      status: 'TODO',
    },
    productDetailsPage: {
      method: 'get',
      path: (productId) => `${baseUrl}/products/${productId}`,
      status: 'done',
    },
    productsListingPage: {
      method: 'get',
      path: `${baseUrl}/products`,
      status: 'done',
    },
    productsFilter: {
      method: 'get',
      path: `${baseUrl}/products/filter`,
      status: 'done',
    },
    productsListingSEO: {
      method: 'get',
      path: `${baseUrl}/products/seo`,
      status: 'done',
    },
    productsPromo: {
      method: 'get',
      path: `${baseUrl}/products/promo`,
      status: 'not-used',
    },
    productsSeeMore: {
      method: 'get',
      path: `${baseUrl}/products/seemore`,
      status: 'not-used',
    },
    productsQuickView: {
      method: 'get',
      path: `${baseUrl}/products/quickview`,
      status: 'done',
    },
    productsStock: {
      method: 'get',
      path: (productId) => `${baseUrl}/products/stock?productId=${productId}`,
      status: 'done',
    },
  },
  assets: {
    assetsContent: {
      method: 'get',
      path: `${baseUrl}/assets/content`,
      status: 'not-used',
    },
    assetsPath: {
      method: 'get',
      path: (pathName) => `${baseUrl}/assets/${pathName}`,
      status: 'not-used',
    },
  },
  orders: {
    payOrder: {
      method: 'post',
      path: `${baseUrl}/order`,
      status: 'done',
    },
    updateOrder: {
      method: 'put',
      path: `${baseUrl}/order`,
      status: 'TODO',
    },
    orderComplete: {
      method: 'post',
      path: `${baseUrl}/order-complete`,
      status: 'not-used',
    },
    orderCompleteReturnUrl: {
      path: (payMethod) =>
        `${baseUrl}/order-complete?paymentMethod=${payMethod}`,
      status: 'done',
    },
    prePaymentConfig: {
      method: 'post',
      path: `${baseUrl}/psd2/pre-payment-config`,
      status: 'done',
    },
  },
  checkout: {
    orderSummary: {
      method: 'get',
      path: `${baseUrl}/checkout/order_summary`,
      status: 'done',
    },
    updateOrderSummary: {
      method: 'put',
      path: `${baseUrl}/checkout/order_summary`,
      status: 'done',
    },
    updateOrderSummaryBillingAddress: {
      method: 'put',
      path: `${baseUrl}/checkout/order_summary/billing_address`,
      status: 'not-used',
    },
    addOrderSummaryDeliveryAddress: {
      method: 'post',
      path: `${baseUrl}/checkout/order_summary/delivery_address`,
      status: 'done',
    },
    amendOrderSummaryDeliveryAddress: {
      method: 'put',
      path: `${baseUrl}/checkout/order_summary/delivery_address`,
      status: 'done',
    },
    orderSummaryDeleteDeliveryAddress: {
      method: 'delete',
      path: `${baseUrl}/checkout/order_summary/delivery_address`,
      status: 'done',
    },
    addGiftCard: {
      method: 'post',
      path: `${baseUrl}/checkout/gift-card`,
      status: 'done',
    },
    deleteGiftCard: {
      method: 'delete',
      path: `${baseUrl}/checkout/gift-card`,
      status: 'done',
    },
  },
  payments: {
    payment: {
      method: 'get',
      path: `${baseUrl}/payments`,
      status: 'done',
    },
    klarna: {
      create: {
        method: 'post',
        path: `${baseUrl}/klarna-session`,
        status: 'done',
      },
      update: {
        method: 'put',
        path: `${baseUrl}/klarna-session`,
        status: 'done',
      },
    },
  },
  storeLocator: {
    store: {
      method: 'get',
      path: `${baseUrl}/store-locator`,
      status: 'not-used',
    },
    storeCountries: {
      method: 'get',
      path: `${baseUrl}/stores-countries`,
      status: 'done',
    },
  },
  emailMeInStock: {
    method: 'get',
    path: `${baseUrl}/email-me-in-stock`,
    status: 'done',
  },
  emailMeInStockApp: {
    method: 'get',
    path: `${baseUrl}/products/email-back-in-stock`,
    status: 'done',
  },
  address: {
    method: 'get',
    path: `${baseUrl}/address`,
    status: 'done',
  },
  addressMoniker: {
    method: 'get',
    path: (moniker) => `${baseUrl}/address/${moniker}`,
    status: 'done',
  },
  consumerFeatures: {
    method: 'get',
    path: (consumer) => `${baseUrl}/features/${consumer}`,
    status: 'done',
  },
  basket: {
    saveBasket: {
      method: 'post',
      path: `${baseUrl}/saved_basket`,
      status: 'not-used',
    },
    savedBasket: {
      method: 'get',
      path: `${baseUrl}/saved_basket`,
      status: 'not-used',
    },
    saveItemToSavedBasket: {
      method: 'post',
      path: `${baseUrl}/saved_basket/item`,
      status: 'not-used',
    },
    restoreSavedBasket: {
      method: 'put',
      path: `${baseUrl}/saved_basket/item/restore`,
      status: 'not-used',
    },
    fetchSizeQtySavedBasket: {
      method: 'get',
      path: `${baseUrl}/saved_basket/item/fetch_item_sizes_and_quantities`,
      status: 'not-used',
    },
    deleteItemFromSavedBasket: {
      method: 'delete',
      path: `${baseUrl}/saved_basket/item`,
      status: 'not-used',
    },
    deleteSavedBasket: {
      method: 'delete',
      path: `${baseUrl}/saved_basket`,
      status: 'not-used',
    },
    updatedItemInSavedBasket: {
      method: 'put',
      path: `${baseUrl}/saved_basket/item/update_item`,
      status: 'not-used',
    },
  },
  siteOptions: {
    method: 'get',
    path: `${baseUrl}/site-options`,
    status: 'done',
  },
  // Wishlist tests have been written but are currently
  // excluded from the run via jest.gonfig.js
  wishlist: {
    createWishlist: {
      method: 'post',
      path: `${baseUrl}/wishlist/create`,
      status: 'done',
    },
    addItemWishlist: {
      method: 'post',
      path: `${baseUrl}/wishlist/add_item`,
      status: 'done',
    },
    getWishlist: {
      method: 'get',
      path: (giftListId) =>
        `${baseUrl}/wishlist/item_ids?wishlistId=${giftListId}`,
      status: 'done',
    },
    deleteItemWishlist: {
      method: 'delete',
      path: `${baseUrl}/wishlist/remove_item`,
      status: 'done',
    },
    getAllWishlists: {
      method: 'get',
      path: `${baseUrl}/wishlists`,
      status: 'done',
    },
    addToBagWishlist: {
      method: 'post',
      path: `${baseUrl}/wishlist/add_to_bag`,
      status: 'done',
    },
  },
  cms: {
    cmsPageName: {
      method: 'get',
      path: (pageName) => `${baseUrl}/cms/page/${pageName}`,
      status: 'done',
    },
    cmsSeo: {
      method: 'get',
      path: (seoUrl) => `${baseUrl}/cms/seo?pathname=${seoUrl}`,
      status: 'done',
    },
    cmsContent: {
      method: 'get',
      path: `${baseUrl}/cmscontent`,
      status: 'done',
    },
    getCmsForms: {
      method: 'get',
      path: (formName) => `${baseUrl}/cms/forms/${formName}`,
      status: 'not-used',
    },
    montyCmsFormHandler: {
      method: 'post',
      path: `${baseUrl}/montycms/form/submit`,
      status: 'done',
    },
    cmsFormHandler: {
      method: 'post',
      path: `${baseUrl}/cms/form/submit`,
      status: 'done',
    },
  },
  health: {
    method: 'get',
    path: `${baseUrl}/health`,
    status: 'not-used',
  },
  platformHealth: {
    method: 'get',
    path: `${baseUrl.replace('/api', '')}/platform-health`,
    status: 'done',
  },
  espots: {
    method: 'get',
    path: `${baseUrl}/espots`,
    status: 'done',
  },
  session: {
    keepAlive: {
      method: 'get',
      path: `${baseUrl}/keep-alive`,
      status: 'done',
    },
    invalidateSessionKey: {
      method: 'get',
      path: `${baseUrl}/invalidate-session-key`,
      status: 'not-used',
    },
    forceTimeout: {
      method: 'get',
      path: `${baseUrl}/force-timeout`,
      status: 'not-used',
    },
    forceRememberMeTimeout: {
      method: 'get',
      path: `${baseUrl}/force-remember-me-timeout`,
      status: 'not-used',
    },
  },
  clientReport: {
    method: 'post',
    path: (ltype) => `${baseUrl}/client-${ltype}`,
    status: 'not-used',
  },
  robotsTxt: {
    method: 'get',
    path: `${baseUrl}/robots.txt`,
    status: 'not-used',
  },
  footers: {
    method: 'get',
    path: `${baseUrl}/footers`,
    status: 'done',
  },
  geoIpPixel: {
    method: 'get',
    path: (ISO) => `${baseUrl}/geo-ip-pixel/${ISO}`,
    status: 'done',
  },
}
