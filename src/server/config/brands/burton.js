import { getBrandedEnvironmentVariable } from '../../lib/env-utils'

const googleTagManagerOptions = {
  id: 'GTM-W6VVN27',
  environment: {
    // default gtm is to specify no environment
    default: {},
    // production env variables should be empty
    production: {},
    acc1: {
      preview: 'env-551',
      auth: 'c98UApQUqI9APyVsC3Gkkg',
      cookiesWin: 'x',
    },
    'GTM-analytics': {
      preview: 'env-670',
      auth: 'EeIChvDJzbU7frz0uqw7WA',
      cookiesWin: 'x',
    },
  },
}

const googleRecaptchaSiteKey = getBrandedEnvironmentVariable({
  variable: 'GOOGLE_RECAPTCHA_SITEKEY',
  brandName: 'burton',
})

const paypalSDKClientId = getBrandedEnvironmentVariable({
  variable: 'PAYPAL_SDK_CLIENT_ID',
  brandName: 'burton',
})

export default [
  {
    analyticsId: 'arcadiabmmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiaburtonstage',
    prodReportSuiteId: 'arcadiaburtonrollup-prod',
    brandName: 'burton',
    brandDisplayName: 'Burton',
    siteId: 12551,
    storeCode: 'bruk',
    brandCode: 'br',
    region: 'uk',
    brandId: 6,
    name: 'Burton UK',
    lang: 'en',
    locale: 'gb',
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    country: 'United Kingdom',
    defaultLanguage: 'English',
    bazaarVoiceId: '6028-en_gb',
    company_id:
      process.env.EXPONEA_BURTON_TOKEN ||
      '1dc6e370-c31f-11e8-9341-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.burton.co.uk', 'www.burton.co.uk'],
    },
    mediaHostname: 'media.burton.co.uk',
    staticAmplienceHost: 'static.burton.co.uk',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.burton.co.uk`,
    qubit: {
      smartserveIds: {
        prod: 5669,
        stage: 5693,
      },
    },
    language: 'en-gb',
    googleSiteVerification: '1Idtd6Vfos79ZnwmGEJYIg0-ec3F-jzuulQ06Qe_fuI',
    googleRecaptchaSiteKey,
    catalogId: '33052',
    langId: '-1',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
    orderReturnUrl:
      process.env.ORDER_RETURN_BURTON_URL ||
      'https://burton.returns.international',
    socialProof: {
      views: {
        default: {
          counter: 'addToBag_monty',
          k: '250',
          minimumThreshold: 3,
          timePeriod: 60 * 48,
        },
      },
      maximumPDPMessageViewsPerSession: 3,
      bannersCMSPageId: '0000168055',
    },
    brandlockId: '8eb91efd',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiabmeumobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiaburtonstage',
    prodReportSuiteId: 'arcadiaburtonrollup-prod',
    brandName: 'burton',
    brandDisplayName: 'Burton',
    siteId: 13091,
    storeCode: 'breu',
    brandCode: 'br',
    region: 'eu',
    brandId: 6,
    name: 'Burton EU',
    lang: 'en',
    locale: 'eu',
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    country: 'default',
    defaultLanguage: 'English',
    bazaarVoiceId: '6028-en_eu',
    company_id:
      process.env.EXPONEA_BURTON_TOKEN ||
      '1dc6e370-c31f-11e8-9341-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.eu.burton-menswear.com', 'eu.burton-menswear.com'],
    },
    mediaHostname: 'media.burton.co.uk',
    dressipiBaseUrl: `${process.env.DRESSIPI_ENVIRONMENT}.burton-menswear.com`,
    qubit: {
      smartserveIds: {
        prod: 5670,
        stage: 5694,
      },
    },
    language: 'en-eu',
    googleSiteVerification: 'hRLkws-hktGFSGglBsK5SsoEwn89ssAkXkOxtia-YSU',
    googleRecaptchaSiteKey,
    catalogId: '35119',
    langId: '-1',
    preferredISOs: [
      'AD',
      'AT',
      'BE',
      'EE',
      'FI',
      'DE',
      'FR',
      'IE',
      'GR',
      'VA',
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
          timePeriod: 60 * 48,
        },
      },
      maximumPDPMessageViewsPerSession: 3,
      bannersCMSPageId: '0000168056',
    },
    brandlockId: '8eb91efd',
    paypalSDKClientId,
  },
  {
    analyticsId: 'arcadiabmmobile',
    googleTagManager: googleTagManagerOptions,
    stagingReportSuiteId: 'arcadiaburtonstage',
    prodReportSuiteId: 'arcadiaburtonrollup-prod',
    brandName: 'burton',
    brandDisplayName: 'Burton',
    brandCode: 'br',
    country: 'nonEU',
    defaultLanguage: 'English',
    company_id:
      process.env.EXPONEA_BURTON_TOKEN ||
      '1dc6e370-c31f-11e8-9341-0a580a202514',
    current_url: 'get_consent_url',
    domains: {
      prod: ['m.burton.co.uk', 'www.burton.co.uk'],
    },
    mediaHostname: 'media.burton.co.uk',
    preferredISOs: ['GB'],
    siteDeliveryISOs: [],
  },
]
