import {
  getBrandedEnvironmentVariable,
  getBrandedEnvironmentVariableByRegion,
} from '../../lib/env-utils'

const googleTagManagerOptions = {
  id: 'GTM-W3T7B3Z',
  environment: {
    // default gtm is to specify no environment
    default: {},
    // production env variables should be empty
    production: {},
    acc1: {
      preview: 'env-911',
      auth: 'qKRLSepIqL7WyKsvngLI7g',
      cookiesWin: 'x',
    },
    'GTM-analytics': {
      preview: 'env-1076',
      auth: 'qDyk6-9dwHGcsWL8qXJYlQ',
      cookiesWin: 'x',
    },
  },
}

const googleRecaptchaSiteKey = getBrandedEnvironmentVariable({
  variable: 'GOOGLE_RECAPTCHA_SITEKEY',
  brandName: 'topshop',
})

const paypalSDKClientId = getBrandedEnvironmentVariable({
  variable: 'PAYPAL_SDK_CLIENT_ID',
  brandName: 'topshop',
})

export const thirdPartySiteConfigs = [
  {
    name: 'Topshop SG',
    siteId: 13079,
    brandName: 'topshop',
    brandCode: 'ts',
    country: 'Singapore',
    url: 'sg.topshop.com',
    siteDeliveryISOs: [],
  },
  {
    name: 'Topshop MY',
    siteId: 13088,
    brandName: 'topshop',
    brandCode: 'ts',
    country: 'Malaysia',
    url: 'my.topshop.com',
    siteDeliveryISOs: [],
  },
]

export default [
  {
    analyticsId: 'arcadiatsmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatsstage',
    prodReportSuiteId: 'arcadiatsrollup-prod',
    brandName: 'topshop',
    brandDisplayName: 'Topshop',
    siteId: 12556,
    storeCode: 'tsuk',
    brandCode: 'ts',
    region: 'uk',
    brandId: 1,
    name: 'Topshop UK',
    lang: 'en',
    locale: 'gb',
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    country: 'United Kingdom',
    defaultLanguage: 'English',
    bazaarVoiceId: '6025-en_gb',
    company_id:
      process.env.EXPONEA_TOPSHOP_TOKEN ||
      '47e0be88-c234-11e8-9d3f-0a580a204314',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.topshop.com', 'www.topshop.com'],
    },
    mediaHostname: 'media.topshop.com',
    staticAmplienceHost: 'static.topshop.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`,
    qubit: {
      smartserveIds: {
        prod: 5686,
        stage: 5710,
      },
    },
    language: 'en-gb',
    googleSiteVerification: 'zQ2HIlAlAghVTHgdRcdJNUd4gDlQUNMekCVJpvi65iU',
    googleRecaptchaSiteKey,
    catalogId: '33057',
    langId: '-1',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
    orderReturnUrl:
      process.env.ORDER_RETURN_TOPSHOP_URL ||
      'https://topshop.returns.international',
    socialProof: {
      // You can specify a config for each view: PLP, PDP, minibag & checkout
      // or we will fall back to the default config values
      // Remember to give each config object in here a unique `counter` name
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      // set to false if you want to show both attributeBanner and socialProofBanner
      // otherwise if you want to show just one banner, specify the banner you want to show as first choice.
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
    },
    brandlockId: '61e35e03',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatsusmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatsstage',
    prodReportSuiteId: 'arcadiatsrollup-prod',
    brandName: 'topshop',
    brandDisplayName: 'Topshop',
    siteId: 13052,
    storeCode: 'tsus',
    brandCode: 'ts',
    region: 'us',
    brandId: 1,
    name: 'Topshop US',
    lang: 'en',
    locale: 'us',
    currencyCode: 'USD',
    currencySymbol: '$',
    country: 'United States',
    defaultLanguage: 'English',
    bazaarVoiceId: '6025-en_us',
    company_id:
      process.env.EXPONEA_TOPSHOP_TOKEN ||
      '47e0be88-c234-11e8-9d3f-0a580a204314',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.us.topshop.com', 'us.topshop.com'],
    },
    mediaHostname: 'media.topshop.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}-us.topshop.com`,
    qubit: {
      smartserveIds: {
        prod: 5687,
        stage: 5711,
      },
    },
    language: 'en-us',
    googleSiteVerification: 'zQ2HIlAlAghVTHgdRcdJNUd4gDlQUNMekCVJpvi65iU',
    googleRecaptchaSiteKey,
    catalogId: '33060',
    langId: '-1',
    preferredISOs: ['US'],
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
    },
    brandlockId: '61e35e03',
    paypalSDKClientId: getBrandedEnvironmentVariableByRegion({
      variable: 'PAYPAL_SDK_CLIENT_ID',
      brandName: 'topshop',
      region: 'us',
    }),
  },
  {
    analyticsId: 'arcadiatsdemobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatsstage',
    prodReportSuiteId: 'arcadiatsrollup-prod',
    brandName: 'topshop',
    brandDisplayName: 'Topshop',
    siteId: 13056,
    storeCode: 'tsde',
    brandCode: 'ts',
    region: 'de',
    brandId: 1,
    name: 'Topshop DE',
    lang: 'de',
    locale: 'de',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'Germany',
    defaultLanguage: 'German',
    bazaarVoiceId: '6025-de_de',
    company_id:
      process.env.EXPONEA_TOPSHOP_TOKEN ||
      '47e0be88-c234-11e8-9d3f-0a580a204314',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.de.topshop.com', 'de.topshop.com'],
    },
    mediaHostname: 'media.topshop.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`,
    qubit: {
      smartserveIds: {
        prod: 5688,
        stage: 5712,
      },
    },
    language: 'de-DE',
    googleSiteVerification: 'zQ2HIlAlAghVTHgdRcdJNUd4gDlQUNMekCVJpvi65iU',
    googleRecaptchaSiteKey,
    catalogId: '34054',
    langId: '-3',
    preferredISOs: ['DE', 'LI', 'AT'],
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
    },
    brandlockId: '61e35e03',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatsfrmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatsstage',
    prodReportSuiteId: 'arcadiatsrollup-prod',
    brandName: 'topshop',
    brandDisplayName: 'Topshop',
    siteId: 13057,
    storeCode: 'tsfr',
    brandCode: 'ts',
    region: 'fr',
    brandId: 1,
    name: 'Topshop FR',
    lang: 'fr',
    locale: 'fr',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'France',
    defaultLanguage: 'French',
    bazaarVoiceId: '6025-fr_fr',
    company_id:
      process.env.EXPONEA_TOPSHOP_TOKEN ||
      '47e0be88-c234-11e8-9d3f-0a580a204314',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.fr.topshop.com', 'fr.topshop.com'],
    },
    mediaHostname: 'media.topshop.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`,
    qubit: {
      smartserveIds: {
        prod: 5689,
        stage: 5713,
      },
    },
    language: 'fr-fr',
    googleSiteVerification: 'zQ2HIlAlAghVTHgdRcdJNUd4gDlQUNMekCVJpvi65iU',
    googleRecaptchaSiteKey,
    catalogId: '34056',
    langId: '-2',
    preferredISOs: ['FR', 'MC'],
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
    },
    brandlockId: '61e35e03',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatseumobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatsstage',
    prodReportSuiteId: 'arcadiatsrollup-prod',
    brandName: 'topshop',
    brandDisplayName: 'Topshop',
    siteId: 13058,
    storeCode: 'tseu',
    brandCode: 'ts',
    region: 'eu',
    brandId: 1,
    name: 'Topshop EU',
    lang: 'en',
    locale: 'eu',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'default',
    defaultLanguage: 'English',
    bazaarVoiceId: '6025-en_eu',
    company_id:
      process.env.EXPONEA_TOPSHOP_TOKEN ||
      '47e0be88-c234-11e8-9d3f-0a580a204314',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.eu.topshop.com', 'eu.topshop.com'],
    },
    mediaHostname: 'media.topshop.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`,
    qubit: {
      smartserveIds: {
        prod: 5690,
        stage: 5714,
      },
    },
    language: 'en-eu',
    googleSiteVerification: 'zQ2HIlAlAghVTHgdRcdJNUd4gDlQUNMekCVJpvi65iU',
    googleRecaptchaSiteKey,
    catalogId: '34058',
    langId: '-1',
    preferredISOs: [
      'AD',
      'BE',
      'EE',
      'FI',
      'IE',
      'GR',
      'VA',
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
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60 * 24,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
    },
    brandlockId: '61e35e03',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatsmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatsstage',
    prodReportSuiteId: 'arcadiatsrollup-prod',
    brandName: 'topshop',
    brandDisplayName: 'Topshop',
    brandCode: 'ts',
    country: 'nonEU',
    defaultLanguage: 'English',
    company_id:
      process.env.EXPONEA_TOPSHOP_TOKEN ||
      '47e0be88-c234-11e8-9d3f-0a580a204314',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.topshop.com', 'www.topshop.com'],
    },
    mediaHostname: 'media.topshop.com',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
  },
]
