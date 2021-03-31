import nock from 'nock'
import * as espotActions from '../../espotActions'
import * as sandBoxActions from '../../sandBoxActions'
import cmsConsts from '../../../../constants/cmsConsts'
import {
  createStoreForEspots,
  createApiResponseForProduct,
  generateNockData,
  generateEspotResponse,
} from './test-helpers'
import { espotGroupId } from '../../../../constants/espotsDesktop'

jest.mock('../../sandBoxActions')

describe('Espot Actions', () => {
  let getContentSpy

  beforeEach(() => {
    getContentSpy = jest.fn(() => () => {})
    sandBoxActions.getContent = getContentSpy
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('setNavigationEspots', () => {
    it('should set responsive espots for navigation', async () => {
      const identifierList = ['id2']
      const identifier = 'navigation'
      const responsiveCMSUrl = 'test.url'

      sandBoxActions.getContent = getContentSpy
      const { store, apiResponse } = createStoreForEspots({
        identifierList,
        identifier,
        responsiveCMSUrl,
      })

      await store.dispatch(espotActions.setNavigationEspots(apiResponse))

      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: `/${responsiveCMSUrl}`,
          query: { responsiveCMSUrl: `/${responsiveCMSUrl}` },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
      expect(store.getActions()).toEqual([
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[0],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('setMiniBagEspot', () => {
    it('should not dispatch for middle responsive espot when no product', async () => {
      const identifierList = ['shoppingBagTopEspot', 'shoppingBagTotalEspot']
      const identifier = 'fakeEspot'
      const responsiveCMSUrl = 'test.url'

      sandBoxActions.getContent = getContentSpy
      const { store, apiResponse } = createStoreForEspots({
        identifierList,
        identifier,
        responsiveCMSUrl,
        products: [],
      })

      await store.dispatch(
        espotActions.setMiniBagEspots({ espots: apiResponse })
      )

      expect(getContentSpy).toHaveBeenCalledTimes(2)
      expect(getContentSpy).toHaveBeenLastCalledWith(
        {
          pathname: `/${responsiveCMSUrl}`,
          query: { responsiveCMSUrl: `/${responsiveCMSUrl}` },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
      expect(store.getActions()).toEqual([
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[0],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[1],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })

    it('should set responsive espots for top / bottom and middle when there are products', async () => {
      const identifierList = [
        'shoppingBagTopEspot',
        'shoppingBagTotalEspot',
        'Delivery2HOMEEXPRESS',
      ]
      const identifier = 'fakeEspot'
      const responsiveCMSUrl = 'test.url'
      const products = [
        createApiResponseForProduct('Delivery2HOMEEXPRESS', responsiveCMSUrl),
      ]

      sandBoxActions.getContent = getContentSpy
      const { store, apiResponse } = createStoreForEspots({
        identifierList,
        identifier,
        responsiveCMSUrl,
        products,
      })

      await store.dispatch(
        espotActions.setMiniBagEspots({ espots: apiResponse, products })
      )

      expect(getContentSpy).toHaveBeenCalledTimes(3)
      expect(getContentSpy).toHaveBeenLastCalledWith(
        {
          pathname: `/${responsiveCMSUrl}`,
          query: { responsiveCMSUrl: `/${responsiveCMSUrl}` },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
      expect(store.getActions()).toEqual([
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[0],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[1],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[2],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('setPDPEspots', () => {
    it('should call `setEspot` with the response provided and `product` as the `espotGroupId`', async () => {
      const identifierList = ['id2']
      const identifier = espotGroupId.PRODUCT
      const responsiveCMSUrl = 'test.url'

      sandBoxActions.getContent = getContentSpy
      const { store, apiResponse } = createStoreForEspots({
        identifierList,
        identifier,
        responsiveCMSUrl,
      })

      await store.dispatch(espotActions.setPDPEspots(apiResponse))

      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: `/${responsiveCMSUrl}`,
          query: { responsiveCMSUrl: `/${responsiveCMSUrl}` },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
      expect(store.getActions()).toEqual([
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[0],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('setThankyouPageEspots', () => {
    it('should set responsive espots for thank you page', async () => {
      const identifierList = ['id2']
      const identifier = espotGroupId.THANKYOU
      const responsiveCMSUrl = 'test.url'

      sandBoxActions.getContent = getContentSpy
      const { store, apiResponse } = createStoreForEspots({
        identifierList,
        identifier,
        responsiveCMSUrl,
      })

      await store.dispatch(
        espotActions.setThankyouPageEspots({ espots: apiResponse })
      )

      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: `/${responsiveCMSUrl}`,
          query: { responsiveCMSUrl: `/${responsiveCMSUrl}` },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
      expect(store.getActions()).toEqual([
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[0],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('setProductListEspots', () => {
    const data = {
      records: [
        {
          Position: 1,
          contentForMonty: {
            members: {
              cmsMobileContent: {
                responsiveCMSUrl: 'url1',
              },
              encodedcmsMobileContent: 'encoded content 1',
            },
          },
        },
        {
          Position: 2,
          contentForMonty: {
            members: {
              cmsMobileContent: {
                responsiveCMSUrl: 'url2',
              },
              encodedcmsMobileContent: 'encoded content 2',
            },
          },
        },
      ],
    }
    let store
    let dispatchedActions

    beforeEach(async () => {
      ;({ store } = createStoreForEspots())
      await store.dispatch(espotActions.setProductListEspots(data))
      dispatchedActions = store.getActions()
    })

    it('should remove previously set PLP espots', async () => {
      expect(dispatchedActions[0]).toEqual({
        type: espotActions.REMOVE_PLP_ESPOTS,
      })
    })

    it('should set product list espot data with passed products', async () => {
      expect(dispatchedActions[1]).toEqual({
        type: espotActions.SET_ESPOT_DATA,
        payload: {
          identifier: 'productList1',
          responsiveCMSUrl: '/url1',
          position: 1,
          isPlpEspot: true,
        },
      })
      expect(dispatchedActions[2]).toEqual({
        type: espotActions.SET_ESPOT_DATA,
        payload: {
          identifier: 'productList2',
          responsiveCMSUrl: '/url2',
          position: 2,
          isPlpEspot: true,
        },
      })
    })

    it('should call getContent with passed responsiveCMSUrls', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(2)
      expect(getContentSpy).toHaveBeenLastCalledWith(
        {
          pathname: `/url2`,
          query: { responsiveCMSUrl: '/url2' },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })
  })

  describe('setOrderSummaryEspots', () => {
    it('should set responsive espots with correct content', async () => {
      const identifierList = ['id2']
      const identifier = espotGroupId.ORDER_SUMMARY
      const responsiveCMSUrl = 'test.url'

      const { store, apiResponse } = createStoreForEspots({
        identifierList,
        identifier,
        responsiveCMSUrl,
      })

      await store.dispatch(espotActions.setOrderSummaryEspots(apiResponse))

      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: `/${responsiveCMSUrl}`,
          query: { responsiveCMSUrl: `/${responsiveCMSUrl}` },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
      expect(store.getActions()).toEqual([
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: identifierList[0],
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('getPDPEspots', () => {
    // calls getEspotData which calls libApiService.get with required espotsKeys joined
    // as , separated string

    // calls mapEspotKeys with response body from above, page (defaults to pdp) and espotGroupId.PRODUCT

    // mapEspotKeys loops over espots in apiResponse and creates object of
    // mapped keys with values

    // call setPDPEspots function with transformed values

    const pdpKeysMap = espotActions.espotKeysMap.pdp
    const pdpKeysArray = Object.keys(pdpKeysMap)
    const expectedQuery = `${encodeURIComponent('items')}=${encodeURIComponent(
      pdpKeysArray.join(',')
    )}`
    const getEndpoint = `${espotActions.espotEndpoint}?${expectedQuery}`

    let store
    let pdpResponse
    let transformedResponseData
    let scope

    beforeEach(async () => {
      // Three of the items in the mocked pdpResponse have
      // responsiveCMSUrls contains all those responsiveCMSUrls that are present
      // in the nested pdpResponse
      ;({
        store,
        pdpResponse,
        transformedResponseData,
      } = createStoreForEspots())
      scope = nock('http://localhost:3000')
        .get(`/api${getEndpoint}`)
        .reply(200, pdpResponse)
      await store.dispatch(espotActions.getPDPEspots())
    })

    it('should call libApiService pdp Object keys', async () => {
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent with any items that have responsiveCMSUrls', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(
        transformedResponseData.length
      )
      expect(getContentSpy).toHaveBeenLastCalledWith(
        {
          pathname: transformedResponseData[2].responsiveCMSUrl,
          query: {
            responsiveCMSUrl: transformedResponseData[2].responsiveCMSUrl,
          },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })

    it('should dispatch a SET_ESPOT_DATA action for each responsiveCMSUrl returned by libServiceApi.get', async () => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toHaveLength(3)
      expect(store.getActions()).toEqual(
        transformedResponseData.map(
          ({ responsiveCMSUrl, expectedIdentifier }) => ({
            type: espotActions.SET_ESPOT_DATA,
            payload: {
              identifier: expectedIdentifier,
              responsiveCMSUrl,
              position: undefined,
              isPlpEspot: false,
            },
          })
        )
      )
    })
  })

  describe('getPDPBundleEspots', () => {
    // This function is just getPDPEpots but with 'bundles' as a parameter
    const pdpKeysMap = espotActions.espotKeysMap.bundles
    const pdpKeysArray = Object.keys(pdpKeysMap)
    const expectedQuery = `${encodeURIComponent('items')}=${encodeURIComponent(
      pdpKeysArray.join(',')
    )}`
    const getEndpoint = `${espotActions.espotEndpoint}?${expectedQuery}`

    let store
    let bundleResponse
    let transformedResponseData
    let scope

    beforeEach(async () => {
      ;({
        store,
        bundleResponse,
        transformedResponseData,
      } = createStoreForEspots())
      scope = nock('http://localhost:3000')
        .get(`/api${getEndpoint}`)
        .reply(200, bundleResponse)
      await store.dispatch(espotActions.getPDPBundleEspots())
    })

    it('should call libApiService bundle Object keys', async () => {
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent once with passed responsiveCMSUrl', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: transformedResponseData[2].responsiveCMSUrl,
          query: {
            responsiveCMSUrl: transformedResponseData[2].responsiveCMSUrl,
          },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })
  })

  describe('getOrderCompleteEspot', () => {
    const espotKeyList = ['CONFIRMATION_DISCOVER_MORE']
    const responsiveCMSUrl = 'this/is/a/test.url.json'
    const expectedRespCMSUrl = `/${responsiveCMSUrl}`
    let getEndpoint
    let scope
    let store

    beforeEach(async () => {
      ;({ store } = createStoreForEspots())
      ;({ getEndpoint } = generateNockData(espotKeyList))
      const { response } = generateEspotResponse(
        espotKeyList[0],
        responsiveCMSUrl
      )
      scope = nock('http://localhost:3000')
        .get(getEndpoint)
        .reply(200, response)
      await store.dispatch(espotActions.getOrderCompleteEspot())
    })

    it('should call libApiService with expected keys in query string', async () => {
      // if the wrong query string is provided then the nock scope won't be done
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent with returned responsiveCMSUrl', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: expectedRespCMSUrl,
          query: { responsiveCMSUrl: expectedRespCMSUrl },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })

    it('should dispatch actions to store with provided identifier and responsiveCMSUrl', () => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toHaveLength(1)
      expect(dispatchedActions).toEqual([
        {
          type: espotActions.SET_ESPOT_DATA,
          payload: {
            identifier: espotKeyList[0],
            responsiveCMSUrl: expectedRespCMSUrl,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('getContactBanner', () => {
    const espotKeyList = ['CONTACT_BANNER']
    const responsiveCMSUrl = 'this/is/another/test.url.json'
    const expectedRespCMSUrl = `/${responsiveCMSUrl}`
    let getEndpoint
    let scope
    let store

    beforeEach(async () => {
      ;({ store } = createStoreForEspots())
      ;({ getEndpoint } = generateNockData(espotKeyList))
      const { response } = generateEspotResponse(
        espotKeyList[0],
        responsiveCMSUrl
      )
      scope = nock('http://localhost:3000')
        .get(getEndpoint)
        .reply(200, response)
      await store.dispatch(espotActions.getContactBanner())
    })

    it('should call libApiService with expected keys in query string', async () => {
      // if the wrong query string is provided then the nock scope won't be done
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent with returned responsiveCMSUrl', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: expectedRespCMSUrl,
          query: { responsiveCMSUrl: expectedRespCMSUrl },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })

    it('should dispatch actions to store with provided identifier and responsiveCMSUrl', () => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toHaveLength(1)
      expect(dispatchedActions).toEqual([
        {
          type: espotActions.SET_ESPOT_DATA,
          payload: {
            identifier: espotKeyList[0],
            responsiveCMSUrl: expectedRespCMSUrl,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('getNoSearchResultsEspot', () => {
    const espotKeyList = ['NO_SEARCH_RESULT_ESPOT']
    const responsiveCMSUrl = 'this/is/nosearch/test.url.json'
    const expectedRespCMSUrl = `/${responsiveCMSUrl}`
    let getEndpoint
    let scope
    let store

    beforeEach(async () => {
      ;({ store } = createStoreForEspots())
      ;({ getEndpoint } = generateNockData(espotKeyList))
      const { response } = generateEspotResponse(
        espotKeyList[0],
        responsiveCMSUrl
      )
      scope = nock('http://localhost:3000')
        .get(getEndpoint)
        .reply(200, response)
      await store.dispatch(espotActions.getNoSearchResultsEspot())
    })

    it('should call libApiService with expected keys in query string', async () => {
      // if the wrong query string is provided then the nock scope won't be done
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent with returned responsiveCMSUrl', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: expectedRespCMSUrl,
          query: { responsiveCMSUrl: expectedRespCMSUrl },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })

    it('should dispatch actions to store with provided identifier and responsiveCMSUrl', () => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toHaveLength(1)
      expect(dispatchedActions).toEqual([
        {
          type: espotActions.SET_ESPOT_DATA,
          payload: {
            identifier: espotKeyList[0],
            responsiveCMSUrl: expectedRespCMSUrl,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('getMarketingSlideUpEspot', () => {
    const espotKeyList = ['MARKETING_SLIDE_UP_ESPOT']
    const responsiveCMSUrl = 'this/is/nosearch/test.url.json'
    const expectedRespCMSUrl = `/${responsiveCMSUrl}`
    let getEndpoint
    let scope
    let store

    beforeEach(async () => {
      ;({ store } = createStoreForEspots())
      ;({ getEndpoint } = generateNockData(espotKeyList))
      const { response } = generateEspotResponse(
        espotKeyList[0],
        responsiveCMSUrl
      )
      scope = nock('http://localhost:3000')
        .get(getEndpoint)
        .reply(200, response)
      await store.dispatch(espotActions.getMarketingSlideUpEspot())
    })

    it('should call libApiService with expected keys in query string', async () => {
      // if the wrong query string is provided then the nock scope won't be done
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent with returned responsiveCMSUrl', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: expectedRespCMSUrl,
          query: { responsiveCMSUrl: expectedRespCMSUrl },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })

    it('should dispatch actions to store with provided identifier and responsiveCMSUrl', () => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toHaveLength(1)
      expect(dispatchedActions).toEqual([
        {
          type: espotActions.SET_ESPOT_DATA,
          payload: {
            identifier: espotKeyList[0],
            responsiveCMSUrl: expectedRespCMSUrl,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('getDDPTermsAndConditions', () => {
    const espotKeyList = ['ddp_terms_and_conditions']
    const responsiveCMSUrl = 'this/is/another/test.url.json'
    const expectedRespCMSUrl = `/${responsiveCMSUrl}`
    let getEndpoint
    let scope
    let store

    beforeEach(async () => {
      ;({ store } = createStoreForEspots())
      ;({ getEndpoint } = generateNockData(espotKeyList))
      const { response } = generateEspotResponse(
        espotKeyList[0],
        responsiveCMSUrl
      )
      scope = nock('http://localhost:3000')
        .get(getEndpoint)
        .reply(200, response)
      await store.dispatch(espotActions.getDDPTermsAndConditions())
    })

    it('should call libApiService with expected keys in query string', async () => {
      // if the wrong query string is provided then the nock scope won't be done
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent with returned responsiveCMSUrl', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: expectedRespCMSUrl,
          query: { responsiveCMSUrl: expectedRespCMSUrl },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })

    it('should dispatch actions to store with provided identifier and responsiveCMSUrl', () => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toHaveLength(1)
      expect(dispatchedActions).toEqual([
        {
          type: espotActions.SET_ESPOT_DATA,
          payload: {
            identifier: espotKeyList[0],
            responsiveCMSUrl: expectedRespCMSUrl,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('getDDPRenewalEspots', () => {
    const espotKeyList = ['ddp_renewal_expiring', 'ddp_renewal_expired']
    const responsiveCMSUrl = 'this/is/another/test.url.json'
    const expectedRespCMSUrl = `/${responsiveCMSUrl}`
    let getEndpoint
    let scope
    let store

    beforeEach(async () => {
      ;({ store } = createStoreForEspots())
      ;({ getEndpoint } = generateNockData(espotKeyList))
      const { response } = generateEspotResponse(
        espotKeyList[0],
        responsiveCMSUrl
      )
      scope = nock('http://localhost:3000')
        .get(getEndpoint)
        .reply(200, response)
      await store.dispatch(espotActions.getDDPRenewalEspots())
    })

    it('should call libApiService with expected keys in query string', async () => {
      // if the wrong query string is provided then the nock scope won't be done
      expect(scope.isDone()).toBe(true)
    })

    it('should call getContent with returned responsiveCMSUrl', () => {
      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: expectedRespCMSUrl,
          query: { responsiveCMSUrl: expectedRespCMSUrl },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })

    it('should dispatch actions to store with provided identifier and responsiveCMSUrl', () => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toHaveLength(1)
      expect(dispatchedActions).toEqual([
        {
          type: espotActions.SET_ESPOT_DATA,
          payload: {
            identifier: espotKeyList[0],
            responsiveCMSUrl: expectedRespCMSUrl,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('getAbandonmentModalEspot', () => {
    describe('successful response', () => {
      const espotKeyList = ['ABANDONMENT_SIGNUP_MODAL_HOME']
      const responsiveCMSUrl = 'this/is/abandon/test.url.json'
      const expectedRespCMSUrl = `/${responsiveCMSUrl}`
      let getEndpoint
      let scope
      let store

      beforeEach(async () => {
        ;({ store } = createStoreForEspots())
        ;({ getEndpoint } = generateNockData(espotKeyList))
        const { response } = generateEspotResponse(
          espotKeyList[0],
          responsiveCMSUrl
        )
        scope = nock('http://localhost:3000')
          .get(getEndpoint)
          .reply(200, response)
        await store.dispatch(
          espotActions.getAbandonmentModalEspot('ABANDONMENT_SIGNUP_MODAL_HOME')
        )
      })

      it('should call libApiService with expected keys in query string', async () => {
        // if the wrong query string is provided then the nock scope won't be done
        expect(scope.isDone()).toBe(true)
      })

      it('should call getContent with returned responsiveCMSUrl', () => {
        expect(getContentSpy).toHaveBeenCalledTimes(1)
        expect(getContentSpy).toHaveBeenCalledWith(
          {
            pathname: expectedRespCMSUrl,
            query: { responsiveCMSUrl: expectedRespCMSUrl },
          },
          null,
          cmsConsts.ESPOT_CONTENT_TYPE
        )
      })

      it('should dispatch actions to store with provided identifier and responsiveCMSUrl', () => {
        const dispatchedActions = store.getActions()
        expect(dispatchedActions).toHaveLength(1)
        expect(dispatchedActions).toEqual([
          {
            type: espotActions.SET_ESPOT_DATA,
            payload: {
              identifier: espotKeyList[0],
              responsiveCMSUrl: expectedRespCMSUrl,
              position: undefined,
              isPlpEspot: false,
            },
          },
        ])
      })
    })
    describe('session timeout', () => {
      const espotKeyList = ['ABANDONMENT_SIGNUP_MODAL_HOME']
      let getEndpoint
      let store

      beforeEach(async () => {
        ;({ store } = createStoreForEspots())
        ;({ getEndpoint } = generateNockData(espotKeyList))
        nock('http://localhost:3000')
          .get(getEndpoint)
          .reply(440)
        await store.dispatch(
          espotActions.getAbandonmentModalEspot('ABANDONMENT_SIGNUP_MODAL_HOME')
        )
      })

      it('should set the abandonment modal espot error', () => {
        expect(store.getActions()).toEqual([
          { type: 'ABANDONMENT_MODAL_ERROR' },
        ])
      })
    })
  })
})
