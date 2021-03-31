import { getBrandedEnvironmentVariable } from '../../lib/env-utils'

const googleTagManagerOptions = {
  id: 'GTM-5Z94JQT',
  environment: {
    // default gtm is to specify no environment
    default: {},
    // production env variables should be empty
    production: {},
    acc1: {
      preview: 'env-549',
      auth: '2raOZgmsdD6eG3qmQrp1Kg',
      cookiesWin: 'x',
    },
    'GTM-analytics': {
      preview: 'env-669',
      auth: 'wGIoCSdfm--lYm1eKxMWAg',
      cookiesWin: 'x',
    },
  },
}

const googleRecaptchaSiteKey = getBrandedEnvironmentVariable({
  variable: 'GOOGLE_RECAPTCHA_SITEKEY',
  brandName: 'missselfridge',
})

const paypalSDKClientId = getBrandedEnvironmentVariable({
  variable: 'PAYPAL_SDK_CLIENT_ID',
  brandName: 'missselfridge',
})

export default [
  {
    analyticsId: 'arcadiamissselfmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiamissselfstage',
    prodReportSuiteId: 'arcadiamsrollup-prod',
    brandName: 'missselfridge',
    brandDisplayName: 'Miss Selfridge',
    siteId: 12554,
    storeCode: 'msuk',
    brandCode: 'ms',
    region: 'uk',
    brandId: 7,
    name: 'Miss Selfridge UK',
    lang: 'en',
    locale: 'gb',
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    country: 'United Kingdom',
    defaultLanguage: 'English',
    bazaarVoiceId: '6029-en_gb',
    company_id:
      process.env.EXPONEA_MISSSELFRIDGE_TOKEN ||
      '31ef63e0-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.missselfridge.com', 'www.missselfridge.com'],
      EBT: ['www.missselfridge.com.arcadiagroup.co.uk'],
    },
    mediaHostname: 'media.missselfridge.com',
    staticAmplienceHost: 'static.missselfridge.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.missselfridge.com`,
    googleRecaptchaSiteKey,
    qubit: {
      smartserveIds: {
        prod: 5678,
        stage: 5702,
      },
    },
    language: 'en-gb',
    googleSiteVerification: 'g73-DJ5JbHZuiex_uaWq4ZLzfudCt7ngwqQMpdedR4U',
    catalogId: '33055',
    langId: '-1',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
    orderReturnUrl:
      process.env.ORDER_RETURN_MISSSELFRIDGE_URL ||
      'https://missselfridge.returns.international',
    socialProof: {
      // You can specify a config for each view: PLP, PDP, minibag & checkout
      // or we will fall back to the default config values
      // Remember to give each config object in here a unique `counter` name
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '100',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      // set to false if you want to show both attributeBanner and socialProofBanner
      // otherwise if you want to show just one banner, specify the banner you want to show as first choice.
      showSingleProductOverlayBannerOnPLP: false,
      bannersCMSPageId: '0000168052',
    },
    brandlockId: '794d5604',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiamseumobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiamissselfstage',
    prodReportSuiteId: 'arcadiamsrollup-prod',
    brandName: 'missselfridge',
    brandDisplayName: 'Miss Selfridge',
    siteId: 13068,
    storeCode: 'mseu',
    brandCode: 'ms',
    region: 'eu',
    brandId: 7,
    name: 'Miss Selfridge EU',
    lang: 'en',
    locale: 'eu',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'default',
    defaultLanguage: 'English',
    bazaarVoiceId: '6029-en_eu',
    company_id:
      process.env.EXPONEA_MISSSELFRIDGE_TOKEN ||
      '31ef63e0-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.euro.missselfridge.com', 'euro.missselfridge.com'],
      EBT: ['euro.missselfridge.com.arcadiagroup.co.uk'],
    },
    mediaHostname: 'media.missselfridge.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.missselfridge.com`,
    googleRecaptchaSiteKey,
    qubit: {
      smartserveIds: {
        prod: 5679,
        stage: 5703,
      },
    },
    language: 'en-eu',
    googleSiteVerification: 'g73-DJ5JbHZuiex_uaWq4ZLzfudCt7ngwqQMpdedR4U',
    catalogId: '34078',
    langId: '-1',
    preferredISOs: [
      'AD',
      'FR',
      'DE',
      'MC',
      'LI',
      'AT',
      'BE',
      'EE',
      'FI',
      'DE',
      'GR',
      'VA',
      'IE',
      'IT',
      'LU',
      'LV',
      'ME',
      'NL',
      'PT',
      'SM',
      'SK',
      'ES',
      'CH',
    ],
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '100',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      showSingleProductOverlayBannerOnPLP: false,
      bannersCMSPageId: '0000168052',
    },
    brandlockId: '794d5604',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiamsusmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiamissselfstage',
    prodReportSuiteId: 'arcadiamsrollup-prod',
    brandName: 'missselfridge',
    brandDisplayName: 'Miss Selfridge',
    siteId: 13069,
    storeCode: 'msus',
    brandCode: 'ms',
    region: 'us',
    brandId: 7,
    name: 'Miss Selfridge US',
    lang: 'en',
    locale: 'us',
    currencyCode: 'USD',
    currencySymbol: '$',
    country: 'United States',
    defaultLanguage: 'English',
    bazaarVoiceId: '6029-en_us',
    company_id:
      process.env.EXPONEA_MISSSELFRIDGE_TOKEN ||
      '31ef63e0-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.us.missselfridge.com', 'us.missselfridge.com'],
      EBT: ['www.us.missselfridge.com.arcadiagroup.co.uk'],
    },
    mediaHostname: 'media.missselfridge.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.missselfridge.com`,
    googleRecaptchaSiteKey,
    qubit: {
      smartserveIds: {
        prod: 5680,
        stage: 5704,
      },
    },
    language: 'en-us',
    googleSiteVerification: 'g73-DJ5JbHZuiex_uaWq4ZLzfudCt7ngwqQMpdedR4U',
    catalogId: '34080',
    langId: '-1',
    preferredISOs: ['US'],
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '100',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      bannersCMSPageId: '0000165680',
      showSingleProductOverlayBannerOnPLP: false,
    },
    brandlockId: '794d5604',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiamsmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiamissselfstage',
    prodReportSuiteId: 'arcadiamsrollup-prod',
    brandName: 'missselfridge',
    brandDisplayName: 'Miss Selfridge',
    brandCode: 'ms',
    country: 'nonEU',
    defaultLanguage: 'English',
    company_id:
      process.env.EXPONEA_MISSSELFRIDGE_TOKEN ||
      '31ef63e0-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.missselfridge.com', 'www.missselfridge.com'],
      EBT: ['www.missselfridge.com.arcadiagroup.co.uk'],
    },
    mediaHostname: 'media.missselfridge.com',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
  },
]
