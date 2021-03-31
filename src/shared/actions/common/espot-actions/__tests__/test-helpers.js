import { createStore } from '../../../../../../test/unit/helpers/get-redux-mock-store'
import * as espotActions from '../../espotActions'

export const createApiResponseForProduct = (
  responsePath,
  responsiveCMSUrl
) => ({
  [responsePath]: {
    EspotContents: {
      cmsMobileContent: {
        responsiveCMSUrl,
      },
    },
  },
})

// make sure that each of these are used below in the pdpResponse
const transformedResponseData = [
  {
    initialKey: 'CE Product espot - column 2 position 2',
    responsiveCMSUrl: '/cms/pages/json/json-0000156388/json-0000156388.json',
    expectedIdentifier: 'CEProductEspotCol2Pos2',
  },
  {
    initialKey: 'CE Product espot - column 2 position 4',
    responsiveCMSUrl: '/cms/pages/json/json-0000156389/json-0000156389.json',
    expectedIdentifier: 'CEProductEspotCol2Pos4',
  },
  {
    initialKey: 'CE3_CONTENT_ESPOT_1',
    responsiveCMSUrl: '/cms/pages/json/json-0000159641/json-0000159641.json',
    expectedIdentifier: 'CE3ContentEspot1',
  },
]

export const generateEspotResponse = (identifier, responsiveCMSUrl) => ({
  response: {
    espots: {
      [identifier]: {
        EspotContents: {
          cmsMobileContent: {
            pageId: 161621,
            pageName: 'static-0000161621',
            breadcrumb: '',
            baseline: '1',
            revision: '0',
            lastPublished: '2019-05-29 14:09:26.629365',
            contentPath:
              'cms/pages/static/static-0000161621/static-0000161621.html',
            seoUrl: '',
            mobileCMSUrl: '',
            responsiveCMSUrl,
          },
          encodedcmsMobileContent: '',
        },
      },
    },
  },
})

export const noSearchResultEspotResponse = {
  espots: {
    NO_SEARCH_RESULT_ESPOT: {
      EspotContents: {
        cmsMobileContent: {
          pageId: 161621,
          pageName: 'static-0000161621',
          breadcrumb: '',
          baseline: '1',
          revision: '0',
          lastPublished: '2019-05-29 14:09:26.629365',
          contentPath:
            'cms/pages/static/static-0000161621/static-0000161621.html',
          seoUrl: '',
          mobileCMSUrl: '',
          responsiveCMSUrl:
            'cms/pages/json/json-0000161620/json-0000161620.json',
        },
        encodedcmsMobileContent: '',
      },
    },
  },
}

const CEProdEspot_c1p1 = {}
const CEProdEspot_c1p2 = {}
const CEProdEspot_c2p1 = {}
const CEProdEspot_c2p2 = {
  EspotContents: {
    cmsMobileContent: {
      pageId: 12582,
      pageName: 'static-0000012582',
      breadcrumb: 'PDP COL2 POS2',
      baseline: '137',
      revision: '0',
      lastPublished: '2019-02-25 07:50:21.249161',
      contentPath: 'cms/pages/static/static-0000012582/static-0000012582.html',
      seoUrl: '',
      mobileCMSUrl: '',
      responsiveCMSUrl: transformedResponseData[0].responsiveCMSUrl,
    },
    encodedcmsMobileContent: '',
  },
}
const CEProdEspot_c2p4 = {
  EspotContents: {
    cmsMobileContent: {
      pageId: 12581,
      pageName: 'static-0000012581',
      breadcrumb: 'PDP COL2 POS4',
      baseline: '243',
      revision: '0',
      lastPublished: '2019-02-25 07:50:11.542786',
      contentPath: 'cms/pages/static/static-0000012581/static-0000012581.html',
      seoUrl: '',
      mobileCMSUrl: '',
      responsiveCMSUrl: transformedResponseData[1].responsiveCMSUrl,
    },
    encodedcmsMobileContent: '',
  },
}
const KlarnaPDPEspot1 = {}
const KlarnaPDPEspot2 = {}
const CE3ContentEspot1 = {
  EspotContents: {
    cmsMobileContent: {
      pageId: 113071,
      pageName: 'static-0000113071',
      breadcrumb: '',
      baseline: '30',
      revision: '0',
      lastPublished: '2019-03-07 12:52:38.87303',
      contentPath: 'cms/pages/static/static-0000113071/static-0000113071.html',
      seoUrl: '',
      mobileCMSUrl: '',
      responsiveCMSUrl: transformedResponseData[2].responsiveCMSUrl,
    },
    encodedcmsMobileContent: '',
  },
}

const pdpResponse = {
  espots: {
    'CE Product espot - column 1 position 1': CEProdEspot_c1p1,
    'CE Product espot - column 1 position 2': CEProdEspot_c1p2,
    'Klarna-PDP-E-Spot-1': KlarnaPDPEspot1,
    'Klarna-PDP-E-Spot-2': KlarnaPDPEspot2,
    'CE Product espot - column 2 position 1': CEProdEspot_c2p1,
    'CE Product espot - column 2 position 2': CEProdEspot_c2p2,
    'CE Product espot - column 2 position 4': CEProdEspot_c2p4,
    CE3_CONTENT_ESPOT_1: CE3ContentEspot1,
  },
}

const bundleResponse = {
  espots: {
    'CE Product espot - column 1 position 1': CEProdEspot_c1p1,
    'Klarna-PDP-E-Spot-1': KlarnaPDPEspot1,
    'Klarna-PDP-E-Spot-2': KlarnaPDPEspot2,
    CE3_CONTENT_ESPOT_1: CE3ContentEspot1,
  },
}

const createApiResponse = (identifierList, responsiveCMSUrl, products) =>
  identifierList.reduce(
    (acc, id) => ({
      ...acc,
      [id]: {
        EspotContents: {
          cmsMobileContent: {
            responsiveCMSUrl,
          },
        },
      },
      products,
    }),
    {}
  )

export const generateNockData = (espotKeyList) => {
  const expectedQuery = `${encodeURIComponent('items')}=${encodeURIComponent(
    espotKeyList.join(',')
  )}`
  const getEndpoint = `/api${espotActions.espotEndpoint}?${expectedQuery}`

  return {
    expectedQuery,
    getEndpoint,
  }
}

export const createStoreForEspots = (
  { identifierList, responsiveCMSUrl, identifier, products } = {
    identifierList: ['id2'],
    responsiveCMSUrl: 'test.url',
    identifier: 'test',
    products: [],
  }
) => {
  const store = createStore({
    config: {},
    viewport: {},
    espot: {
      identifiers: {
        navigation: [],
        [identifier]: identifierList,
      },
    },
  })
  const apiResponse = createApiResponse(
    identifierList,
    responsiveCMSUrl,
    products
  )
  return {
    store,
    apiResponse,
    pdpResponse,
    transformedResponseData,
    bundleResponse,
  }
}
