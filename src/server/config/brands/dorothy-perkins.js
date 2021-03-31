import { getBrandedEnvironmentVariable } from '../../lib/env-utils'

const googleTagManagerOptions = {
  id: 'GTM-5MZP3Z4',
  environment: {
    // default gtm is to specify no environment
    default: {},
    // production env variables should be empty
    production: {},
    acc1: {
      preview: 'env-552',
      auth: 'PDjH2VEmhh51RE4eik4QHg',
      cookiesWin: 'x',
    },
    'GTM-analytics': {
      preview: 'env-674',
      auth: 'e7JlLrbmoe4BwUdtQ1ICCQ',
      cookiesWin: 'x',
    },
  },
}

const googleRecaptchaSiteKey = getBrandedEnvironmentVariable({
  variable: 'GOOGLE_RECAPTCHA_SITEKEY',
  brandName: 'dorothyperkins',
})

const paypalSDKClientId = getBrandedEnvironmentVariable({
  variable: 'PAYPAL_SDK_CLIENT_ID',
  brandName: 'dorothyperkins',
})

export default [
  {
    analyticsId: 'arcadiadpmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiadpstage',
    prodReportSuiteId: 'arcadiadprollup-prod',
    brandName: 'dorothyperkins',
    brandDisplayName: 'Dorothy Perkins',
    siteId: 12552,
    storeCode: 'dpuk',
    brandCode: 'dp',
    region: 'uk',
    brandId: 3,
    name: 'Dorothy Perkins UK',
    lang: 'en',
    locale: 'gb',
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    country: 'United Kingdom',
    defaultLanguage: 'English',
    bazaarVoiceId: '6026-en_gb',
    company_id:
      process.env.EXPONEA_DOROTHYPERKINS_TOKEN ||
      '0b9f84ea-c31f-11e8-a9ae-0a580a2039b4',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.dorothyperkins.com', 'www.dorothyperkins.com'],
    },
    mediaHostname: 'media.dorothyperkins.com',
    staticAmplienceHost: 'static.dorothyperkins.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.dorothyperkins.com`,
    qubit: {
      smartserveIds: {
        prod: 5671,
        stage: 5695,
      },
    },
    language: 'en-gb',
    googleSiteVerification: 'vCoxW9NUYvxzNjmY1EHaNvoRgnGFBe4n4BA5xybjHjQ',
    googleRecaptchaSiteKey,
    catalogId: '33053',
    langId: '-1',
    sizeTileMaximumDesktop: 9,
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
    orderReturnUrl:
      process.env.ORDER_RETURN_DOROTHYPERKINS_URL ||
      'https://dorothyperkins.returns.international',
    socialProof: {
      // You can specify a config for each view: PLP, PDP, minibag & checkout
      // or we will fall back to the default config values
      // Remember to give each config object in here a unique `counter` name
      views: {
        PDP: {
          counter: 'addToBag_PDP_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 4,
        },
        default: {
          counter: 'addToBag_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 24 * 3,
        },
      },
      // set to false if you want to show both attributeBanner and socialProofBanner
      // otherwise if you want to show just one banner, specify the banner you want to show as first choice
      showSingleProductOverlayBannerOnPLP: 'attributeBanner',
      bannersCMSPageId: '0000168053',
      maximumPDPMessageViewsPerSession: 3,
    },
    brandlockId: '69ef9f11',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiadpeumobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiadpstage',
    prodReportSuiteId: 'arcadiadprollup-prod',
    brandName: 'dorothyperkins',
    brandDisplayName: 'Dorothy Perkins',
    siteId: 13064,
    storeCode: 'dpeu',
    brandCode: 'dp',
    region: 'eu',
    brandId: 3,
    name: 'Dorothy Perkins EU',
    lang: 'en',
    locale: 'eu',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'default',
    defaultLanguage: 'English',
    bazaarVoiceId: '6026-en_eu',
    company_id:
      process.env.EXPONEA_DOROTHYPERKINS_TOKEN ||
      '0b9f84ea-c31f-11e8-a9ae-0a580a2039b4',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.euro.dorothyperkins.com', 'euro.dorothyperkins.com'],
    },
    mediaHostname: 'media.dorothyperkins.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.dorothyperkins.com`,
    qubit: {
      smartserveIds: {
        prod: 5672,
        stage: 5696,
      },
    },
    language: 'en-eu',
    googleSiteVerification: 'vCoxW9NUYvxzNjmY1EHaNvoRgnGFBe4n4BA5xybjHjQ',
    googleRecaptchaSiteKey,
    catalogId: '34070',
    langId: '-1',
    sizeTileMaximumDesktop: 9,
    preferredISOs: [
      'AD',
      'FR',
      'MC',
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
        PDP: {
          counter: 'addToBag_PDP_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 4,
        },
        default: {
          counter: 'addToBag_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 24 * 3,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'attributeBanner',
      bannersCMSPageId: '0000168053',
      maximumPDPMessageViewsPerSession: 3,
    },
    brandlockId: '69ef9f11',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiadpusmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiadpstage',
    prodReportSuiteId: 'arcadiadprollup-prod',
    brandName: 'dorothyperkins',
    brandDisplayName: 'Dorothy Perkins',
    siteId: 13065,
    storeCode: 'dpus',
    brandCode: 'dp',
    region: 'us',
    brandId: 3,
    name: 'Dorothy Perkins US',
    lang: 'en',
    locale: 'us',
    currencyCode: 'USD',
    currencySymbol: '$',
    country: 'United States',
    defaultLanguage: 'English',
    bazaarVoiceId: '6026-en_us',
    company_id:
      process.env.EXPONEA_DOROTHYPERKINS_TOKEN ||
      '0b9f84ea-c31f-11e8-a9ae-0a580a2039b4',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.us.dorothyperkins.com', 'us.dorothyperkins.com'],
    },
    mediaHostname: 'media.dorothyperkins.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.dorothyperkins.com`,
    qubit: {
      smartserveIds: {
        prod: 5673,
        stage: 5697,
      },
    },
    language: 'en-us',
    googleSiteVerification: 'vCoxW9NUYvxzNjmY1EHaNvoRgnGFBe4n4BA5xybjHjQ',
    googleRecaptchaSiteKey,
    catalogId: '34072',
    langId: '-1',
    sizeTileMaximumDesktop: 9,
    preferredISOs: ['US'],
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        PDP: {
          counter: 'addToBag_PDP_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 4,
        },
        default: {
          counter: 'addToBag_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 24 * 3,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'attributeBanner',
      maximumPDPMessageViewsPerSession: 3,
    },
    brandlockId: '69ef9f11',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiadpmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiadpstage',
    prodReportSuiteId: 'arcadiadprollup-prod',
    brandName: 'dorothyperkins',
    brandDisplayName: 'Dorothy Perkins',
    siteId: 13062,
    storeCode: 'dpde',
    brandCode: 'dp',
    region: 'de',
    brandId: 3,
    name: 'Dorothy Perkins DE',
    lang: 'de',
    locale: 'de',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'Germany',
    defaultLanguage: 'German',
    bazaarVoiceId: '6026-de_de',
    company_id:
      process.env.EXPONEA_DOROTHYPERKINS_TOKEN ||
      '0b9f84ea-c31f-11e8-a9ae-0a580a2039b4',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.de.dorothyperkins.com', 'de.dorothyperkins.com'],
    },
    mediaHostname: 'media.dorothyperkins.com',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.dorothyperkins.com`,
    qubit: {
      smartserveIds: {
        prod: 5674,
        stage: 5698,
      },
    },
    language: 'de-DE',
    googleSiteVerification: 'vCoxW9NUYvxzNjmY1EHaNvoRgnGFBe4n4BA5xybjHjQ',
    googleRecaptchaSiteKey,
    catalogId: '34066',
    langId: '-3',
    sizeTileMaximumDesktop: 9,
    preferredISOs: ['DE', 'LI', 'AT'],
    siteDeliveryISOs: [],
    socialProof: {
      views: {
        PDP: {
          counter: 'addToBag_PDP_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 4,
        },
        default: {
          counter: 'addToBag_monty',
          k: '600',
          minimumThreshold: 10,
          timePeriod: 60 * 24 * 3,
        },
      },
      showSingleProductOverlayBannerOnPLP: 'attributeBanner',
      maximumPDPMessageViewsPerSession: 3,
    },
    brandlockId: '69ef9f11',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiadpmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiadpstage',
    prodReportSuiteId: 'arcadiadprollup-prod',
    brandName: 'dorothyperkins',
    brandDisplayName: 'Dorothy Perkins',
    brandCode: 'dp',
    country: 'nonEU',
    defaultLanguage: 'English',
    company_id:
      process.env.EXPONEA_DOROTHYPERKINS_TOKEN ||
      '0b9f84ea-c31f-11e8-a9ae-0a580a2039b4',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.dorothyperkins.com', 'www.dorothyperkins.com'],
    },
    mediaHostname: 'media.dorothyperkins.com',
    sizeTileMaximumDesktop: 9,
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
  },
]
