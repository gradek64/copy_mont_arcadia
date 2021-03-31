export const espotGroupId = Object.freeze({
  NAVIGATION: 'navigation',
  HOME: 'home',
  MINI_BAG: 'miniBag',
  MINI_BAG_MIDDLE: 'miniBagMiddle',
  PRODUCTS: 'products',
  PRODUCT: 'product',
  THANKYOU: 'thankyou',
  ORDER_SUMMARY: 'orderSummary',
  SHARED: 'shared',
  SEARCH_RESULTS: 'search_results',
  ABANDONMENT_MODAL: 'abandonment_modal',
  MARKETING_SLIDE_UP: 'marketing_slide_up',
})

export default Object.freeze({
  [espotGroupId.NAVIGATION]: {
    siteWideHeader: 'headerEspot',
    // NOTE that some brand require brandHeader and global headers to be swapped
    brandHeader: 'montyHeaderEspot',
    global: 'globalEspot',
  },
  [espotGroupId.HOME]: {
    content: 'homePageEspotContent',
    mainBody: 'homeEspot1',
  },
  [espotGroupId.MINI_BAG]: {
    top: 'shoppingBagTopEspot',
    middle: 'Delivery2HOMEEXPRESS',
    bottom: 'shoppingBagTotalEspot',
  },
  [espotGroupId.PRODUCTS]: {
    productList: 'productList',
  },
  [espotGroupId.PRODUCT]: {
    col1pos1: 'CEProductEspotCol1Pos1',
    col1pos2: 'CEProductEspotCol1Pos2',
    col2pos1: 'CEProductEspotCol2Pos1',
    col2pos2: 'CEProductEspotCol2Pos2',
    col2pos4: 'CEProductEspotCol2Pos4',
    content1: 'CE3ContentEspot1',
    klarna1: 'KlarnaPDPEspot1',
    klarna2: 'KlarnaPDPEspot2',
    bundle1: 'BundleProductEspot1',
  },
  [espotGroupId.THANKYOU]: {
    mainBody1: 'eMarketingEspot1URL',
    mainBody2: 'eMarketingEspot2URL',
    mainBody3: 'eMarketingEspot3URL',
    mainBody4: 'eMarketingEspot7URL',
    sideBar1: 'eMarketingEspot4URL',
    sideBar2: 'eMarketingEspot5URL',
    sideBar3: 'eMarketingEspot6URL',
    CONFIRMATION_DISCOVER_MORE: 'CONFIRMATION_DISCOVER_MORE',
  },
  [espotGroupId.ORDER_SUMMARY]: {
    discountIntro: 'checkoutDiscountIntroEspot',
    toBeDefined: 'toBeDefined',
    ddpRenewalExpiring: 'ddp_renewal_expiring',
    ddpRenewalExpired: 'ddp_renewal_expired',
    ddpTermsAndConditions: 'ddp_terms_and_conditions',
  },
  [espotGroupId.SHARED]: {
    CONTACT_BANNER: 'CONTACT_BANNER',
  },
  [espotGroupId.SEARCH_RESULTS]: {
    NO_SEARCH_RESULT_ESPOT: 'NO_SEARCH_RESULT_ESPOT',
  },
  [espotGroupId.MARKETING_SLIDE_UP]: {
    MARKETING_SLIDE_UP_ESPOT: 'MARKETING_SLIDE_UP_ESPOT',
  },
  [espotGroupId.ABANDONMENT_MODAL]: {
    HOME: 'ABANDONMENT_SIGNUP_MODAL_HOME',
    CATEGORY: 'ABANDONMENT_SIGNUP_MODAL_CATEGORY',
    PDP: 'ABANDONMENT_SIGNUP_MODAL_PDP',
  },
})
