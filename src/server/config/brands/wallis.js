import { getBrandedEnvironmentVariable } from '../../lib/env-utils'

const googleTagManagerOptions = {
  id: 'GTM-NMDV2PG',
  environment: {
    // default gtm is to specify no environment
    default: {},
    // production env variables should be empty
    production: {},
    acc1: {
      preview: 'env-504',
      auth: 'zHkJ2WBz491YVfmMDY23Rw',
      cookiesWin: 'x',
    },
    'GTM-analytics': {
      preview: 'env-608',
      auth: 'mjnwlOP4EMyjqS0wR0_kIw',
      cookiesWin: 'x',
    },
  },
}

const googleRecaptchaSiteKey = getBrandedEnvironmentVariable({
  variable: 'GOOGLE_RECAPTCHA_SITEKEY',
  brandName: 'wallis',
})

const paypalSDKClientId = getBrandedEnvironmentVariable({
  variable: 'PAYPAL_SDK_CLIENT_ID',
  brandName: 'wallis',
})

export default [
  {
    analyticsId: 'arcadiawlmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiawallisstage',
    prodReportSuiteId: 'arcadiawlrollup-prod',
    brandName: 'wallis',
    brandDisplayName: 'Wallis',
    siteId: 12557,
    storeCode: 'wluk',
    brandCode: 'wl',
    region: 'uk',
    brandId: 5,
    name: 'Wallis UK',
    lang: 'en',
    locale: 'gb',
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    country: 'United Kingdom',
    defaultLanguage: 'English',
    bazaarVoiceId: '6030-en_gb',
    company_id:
      process.env.EXPONEA_WALLIS_TOKEN ||
      '2bd19820-c31f-11e8-9a18-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.wallis.co.uk', 'www.wallis.co.uk'],
    },
    mediaHostname: 'media.wallis.co.uk',
    staticAmplienceHost: 'static.wallis.co.uk',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.wallis.co.uk`,
    qubit: {
      smartserveIds: {
        prod: 5691,
        stage: 5715,
      },
    },
    language: 'en-gb',
    googleSiteVerification: 'tamgaKdanfvksPq0OSqMtReqWYo7ywZ5ZaWyya90MWQ',
    googleRecaptchaSiteKey,
    catalogId: '33058',
    langId: '-1',
    preferredISOs: ['GB'],
    sizeTileMaximumDesktop: 7,
    siteDeliveryISOs: [],
    orderReturnUrl:
      process.env.ORDER_RETURN_WALLIS_URL ||
      'https://wallis.returns.international',
    socialProof: {
      // You can specify a config for each view: PLP, PDP, minibag & checkout
      // or we will fall back to the default config values
      // Remember to give each config object in here a unique `counter` name
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60,
        },
      },
      // set to false if you want to show both attributeBanner and socialProofBanner
      // otherwise if you want to show just one banner, specify the banner you want to show as first choice.
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
      bannersCMSPageId: '0000168054',
    },
    brandlockId: 'ec95e5ff',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiawleumobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiawallisstage',
    prodReportSuiteId: 'arcadiawlrollup-prod',
    brandName: 'wallis',
    brandDisplayName: 'Wallis',
    siteId: 13075,
    storeCode: 'wleu',
    brandCode: 'wl',
    region: 'eu',
    brandId: 5,
    name: 'Wallis EU',
    lang: 'en',
    locale: 'eu',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'default',
    defaultLanguage: 'English',
    bazaarVoiceId: '6030-en_eu',
    company_id:
      process.env.EXPONEA_WALLIS_TOKEN ||
      '2bd19820-c31f-11e8-9a18-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: [
        'm.euro.wallisfashion.com',
        'euro.wallisfashion.com',
        'www.wallisfashion.com',
      ],
    },
    mediaHostname: 'media.wallis.co.uk',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.wallisfashion.com`,
    qubit: {
      smartserveIds: {
        prod: 5692,
        stage: 5716,
      },
    },
    language: 'en-eu',
    googleSiteVerification: 'g1ZbuwnSWE9PXS_vF-9-SL_aAEs2dc39rXWD2Tt9oKc',
    googleRecaptchaSiteKey,
    catalogId: '34092',
    langId: '-1',
    preferredISOs: [
      'AD',
      'AT',
      'BE',
      'EE',
      'FI',
      'DE',
      'FR',
      'GR',
      'VA',
      'IE',
      'IT',
      'LI',
      'LU',
      'LV',
      'MC',
      'ME',
      'NL',
      'PT',
      'SM',
      'SK',
      'ES',
      'CH',
    ],
    sizeTileMaximumDesktop: 7,
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
      bannersCMSPageId: '0000165900',
    },
    brandlockId: 'ec95e5ff',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiawlmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiawallisstage',
    prodReportSuiteId: 'arcadiawlrollup-prod',
    brandName: 'wallis',
    brandDisplayName: 'Wallis',
    brandCode: 'wl',
    country: 'nonEU',
    defaultLanguage: 'English',
    company_id:
      process.env.EXPONEA_WALLIS_TOKEN ||
      '2bd19820-c31f-11e8-9a18-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.wallis.co.uk', 'www.wallis.co.uk'],
    },
    mediaHostname: 'media.wallis.co.uk',
    preferredISOs: ['GB'],
    sizeTileMaximumDesktop: 7,
    siteDeliveryISOs: [],
  },
]
