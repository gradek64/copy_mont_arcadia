import { getBrandedEnvironmentVariable } from '../../lib/env-utils'

const googleTagManagerOptions = {
  id: 'GTM-WF2JCNR',
  environment: {
    // default gtm is to specify no environment
    default: {},
    // production env variables should be empty
    production: {},
    acc1: {
      preview: 'env-598',
      auth: '4fbqjRE1lQ_UpNWiAkl24A',
      cookiesWin: 'x',
    },
    'GTM-analytics': {
      preview: 'env-703',
      auth: '6LuRMpSxyo-LD7vpU51W0Q',
      cookiesWin: 'x',
    },
  },
}

const googleRecaptchaSiteKey = getBrandedEnvironmentVariable({
  variable: 'GOOGLE_RECAPTCHA_SITEKEY',
  brandName: 'evans',
})

const paypalSDKClientId = getBrandedEnvironmentVariable({
  variable: 'PAYPAL_SDK_CLIENT_ID',
  brandName: 'evans',
})

export default [
  {
    analyticsId: 'arcadiaevansmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiaevansstage',
    prodReportSuiteId: 'arcadiaevansrollup-prod',
    brandName: 'evans',
    brandDisplayName: 'Evans',
    siteId: 12553,
    storeCode: 'evuk',
    brandCode: 'ev',
    region: 'uk',
    brandId: 4,
    name: 'Evans UK',
    lang: 'en',
    locale: 'gb',
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    country: 'United Kingdom',
    defaultLanguage: 'English',
    bazaarVoiceId: '6027-en_gb',
    company_id:
      process.env.EXPONEA_EVANS_TOKEN || '230b4e16-c31f-11e8-b27a-0a580a206209',
    current_url: 'get_consent_url',
    domains: {
      prod: [
        'm.evans.co.uk',
        'evans.co.uk',
        'www.evans.co.uk',
        'www.evans.ltd.uk',
        'evans.ltd.uk',
        'www.evansfashion.com',
        'evansfashion.com',
      ],
      EBT: ['www.evans.co.uk.arcadiagroup.co.uk'],
    },
    mediaHostname: 'media.evans.co.uk',
    staticAmplienceHost: 'static.evans.co.uk',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.evans.co.uk`,
    qubit: {
      smartserveIds: {
        prod: 5675,
        stage: 5699,
      },
    },
    language: 'en-gb',
    googleSiteVerification: 'tamgaKdanfvksPq0OSqMtReqWYo7ywZ5ZaWyya90MWQ',
    googleRecaptchaSiteKey,
    catalogId: '33054',
    langId: '-1',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
    orderReturnUrl:
      process.env.ORDER_RETURN_EVANS_URL ||
      'https://evans.returns.international',
    socialProof: {
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
      bannersCMSPageId: '0000168057',
    },
    brandlockId: '0867f12c',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiaeveumobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiaevansstage',
    prodReportSuiteId: 'arcadiaevansrollup-prod',
    brandName: 'evans',
    brandDisplayName: 'Evans',
    siteId: 13071,
    storeCode: 'eveu',
    brandCode: 'ev',
    region: 'eu',
    brandId: 4,
    name: 'Evans EU',
    lang: 'en',
    locale: 'eu',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'default',
    defaultLanguage: 'English',
    bazaarVoiceId: '6027-en_eu',
    company_id:
      process.env.EXPONEA_EVANS_TOKEN || '230b4e16-c31f-11e8-b27a-0a580a206209',
    current_url: 'get_consent_url',
    domains: {
      prod: [
        'm.euro.evansfashion.com',
        'euro.evansfashion.com',
        'www.euro.evansfashion.com',
      ],
      EBT: ['euro.evansfashion.com.arcadiagroup.co.uk'],
    },
    mediaHostname: 'media.evans.co.uk',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.evansfashion.com`,
    googleRecaptchaSiteKey,
    qubit: {
      smartserveIds: {
        prod: 5677,
        stage: 5701,
      },
    },
    language: 'en-eu',
    googleSiteVerification: 'grKxvOA5GIX2hfgQV3vAeI_1a-kxbIrtVgOLRnITg-U',
    catalogId: '34084',
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
      bannersCMSPageId: '0000168057',
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
    },
    brandlockId: '0867f12c',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiaevmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiaevansstage',
    prodReportSuiteId: 'arcadiaevansrollup-prod',
    brandName: 'evans',
    brandDisplayName: 'Evans',
    brandCode: 'ev',
    country: 'nonEU',
    defaultLanguage: 'English',
    company_id:
      process.env.EXPONEA_EVANS_TOKEN || '230b4e16-c31f-11e8-b27a-0a580a206209',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.evans.co.uk', 'www.evans.co.uk'],
      EBT: ['www.evans.co.uk.arcadiagroup.co.uk'],
    },
    mediaHostname: 'media.evans.co.uk',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
  },
]
