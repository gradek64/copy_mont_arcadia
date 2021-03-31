import {
  getBrandedEnvironmentVariable,
  getBrandedEnvironmentVariableByRegion,
} from '../../lib/env-utils'

const googleTagManagerOptions = {
  id: 'GTM-NHVC8SB',
  environment: {
    // default gtm is to specify no environment
    default: {},
    // production env variables should be empty
    production: {},
    acc1: {
      preview: 'env-646',
      auth: 'T_TpLY-CjlBTqbLyPEtkrw',
      cookiesWin: 'x',
    },
    'GTM-analytics': {
      preview: 'env-765',
      auth: 'fzCmzNT__cwkCT6crUbeKw',
      cookiesWin: 'x',
    },
  },
}

const googleRecaptchaSiteKey = getBrandedEnvironmentVariable({
  variable: 'GOOGLE_RECAPTCHA_SITEKEY',
  brandName: 'topman',
})

const paypalSDKClientId = getBrandedEnvironmentVariable({
  variable: 'PAYPAL_SDK_CLIENT_ID',
  brandName: 'topman',
})

export default [
  {
    analyticsId: 'arcadiatmmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatmstage',
    prodReportSuiteId: 'arcadiatmrollup-prod',
    brandName: 'topman',
    brandDisplayName: 'Topman',
    siteId: 12555,
    storeCode: 'tmuk',
    brandCode: 'tm',
    region: 'uk',
    brandId: 2,
    name: 'Topman UK',
    lang: 'en',
    locale: 'gb',
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    country: 'United Kingdom',
    defaultLanguage: 'English',
    bazaarVoiceId: '6024-en_gb',
    company_id:
      process.env.EXPONEA_TOPMAN_TOKEN ||
      '37fb597e-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.topman.com', 'www.topman.com'],
    },
    mediaHostname: 'media.topman.com',
    staticAmplienceHost: 'static.topman.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topman.com`,
    qubit: {
      smartserveIds: {
        prod: 5681,
        stage: 5705,
      },
    },
    language: 'en-gb',
    googleSiteVerification: 'M758n9SBCJyeew08Nh19Jq9AWwFTIUeQKj7KPK6Tk2c',
    googleRecaptchaSiteKey,
    catalogId: '33056',
    langId: '-1',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
    orderReturnUrl:
      process.env.ORDER_RETURN_TOPMAN_URL ||
      'https://topman.returns.international',
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
      // Below will be uncommented when the brand upload their images in the CMS page.
      // bannersCMSPageId: '0000163986',
    },
    brandlockId: '14a0db9b',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatmusmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatmstage',
    prodReportSuiteId: 'arcadiatmrollup-prod',
    brandName: 'topman',
    brandDisplayName: 'Topman',
    siteId: 13051,
    storeCode: 'tmus',
    brandCode: 'tm',
    region: 'us',
    brandId: 2,
    name: 'Topman US',
    lang: 'en',
    locale: 'us',
    currencyCode: 'USD',
    currencySymbol: '$',
    country: 'United States',
    defaultLanguage: 'English',
    bazaarVoiceId: '1876-en_us',
    company_id:
      process.env.EXPONEA_TOPMAN_TOKEN ||
      '37fb597e-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.us.topman.com', 'us.topman.com'],
    },
    mediaHostname: 'media.topman.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topman.com`,
    qubit: {
      smartserveIds: {
        prod: 5682,
        stage: 5706,
      },
    },
    language: 'en-us',
    googleSiteVerification: 'M758n9SBCJyeew08Nh19Jq9AWwFTIUeQKj7KPK6Tk2c',
    googleRecaptchaSiteKey,
    catalogId: '33059',
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
    brandlockId: '14a0db9b',
    paypalSDKClientId: getBrandedEnvironmentVariableByRegion({
      variable: 'PAYPAL_SDK_CLIENT_ID',
      brandName: 'topman',
      region: 'us',
    }),
  },
  {
    analyticsId: 'arcadiatmdemobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatmstage',
    prodReportSuiteId: 'arcadiatmrollup-prod',
    brandName: 'topman',
    brandDisplayName: 'Topman',
    siteId: 13059,
    storeCode: 'tmde',
    brandCode: 'tm',
    region: 'de',
    brandId: 2,
    name: 'Topman DE',
    lang: 'de',
    locale: 'de',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'Germany',
    defaultLanguage: 'German',
    bazaarVoiceId: '6024-de_de',
    company_id:
      process.env.EXPONEA_TOPMAN_TOKEN ||
      '37fb597e-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.de.topman.com', 'de.topman.com'],
    },
    mediaHostname: 'media.topman.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topman.com`,
    qubit: {
      smartserveIds: {
        prod: 5683,
        stage: 5707,
      },
    },
    language: 'de-DE',
    googleSiteVerification: 'M758n9SBCJyeew08Nh19Jq9AWwFTIUeQKj7KPK6Tk2c',
    googleRecaptchaSiteKey,
    catalogId: '34060',
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
    brandlockId: '14a0db9b',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatmfrmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatmstage',
    prodReportSuiteId: 'arcadiatmrollup-prod',
    brandName: 'topman',
    brandDisplayName: 'Topman',
    siteId: 13060,
    storeCode: 'tmfr',
    brandCode: 'tm',
    region: 'fr',
    brandId: 2,
    name: 'Topman FR',
    lang: 'fr',
    locale: 'fr',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'France',
    defaultLanguage: 'French',
    bazaarVoiceId: '6024-fr_fr',
    company_id:
      process.env.EXPONEA_TOPMAN_TOKEN ||
      '37fb597e-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.fr.topman.com', 'fr.topman.com'],
    },
    mediaHostname: 'media.topman.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topman.com`,
    qubit: {
      smartserveIds: {
        prod: 5684,
        stage: 5708,
      },
    },
    language: 'fr-fr',
    googleSiteVerification: 'M758n9SBCJyeew08Nh19Jq9AWwFTIUeQKj7KPK6Tk2c',
    googleRecaptchaSiteKey,
    catalogId: '34062',
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
    brandlockId: '14a0db9b',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatmeumobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatmstage',
    prodReportSuiteId: 'arcadiatmrollup-prod',
    brandName: 'topman',
    brandDisplayName: 'Topman',
    siteId: 13061,
    storeCode: 'tmeu',
    brandCode: 'tm',
    region: 'eu',
    brandId: 2,
    name: 'Topman EU',
    lang: 'en',
    locale: 'eu',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'default',
    defaultLanguage: 'English',
    bazaarVoiceId: '6024-en_eu',
    company_id:
      process.env.EXPONEA_TOPMAN_TOKEN ||
      '37fb597e-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.eu.topman.com', 'eu.topman.com'],
    },
    mediaHostname: 'media.topman.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.topman.com`,
    qubit: {
      smartserveIds: {
        prod: 5685,
        stage: 5709,
      },
    },
    language: 'en-eu',
    googleSiteVerification: 'M758n9SBCJyeew08Nh19Jq9AWwFTIUeQKj7KPK6Tk2c',
    googleRecaptchaSiteKey,
    catalogId: '34064',
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
    brandlockId: '14a0db9b',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiatmmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiatmstage',
    prodReportSuiteId: 'arcadiatmrollup-prod',
    brandName: 'topman',
    brandDisplayName: 'Topman',
    brandCode: 'tm',
    country: 'nonEU',
    defaultLanguage: 'English',
    company_id:
      process.env.EXPONEA_TOPMAN_TOKEN ||
      '37fb597e-c31f-11e8-a65a-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.topman.com', 'www.topman.com'],
    },
    mediaHostname: 'media.topman.com',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
  },
]
