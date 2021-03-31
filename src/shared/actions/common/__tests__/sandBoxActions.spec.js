import nock from 'nock'
import { identity } from 'ramda'

import { createStore } from 'test/unit/helpers/get-redux-mock-store'

import * as apiService from '../../../lib/api-service'
import * as sandboxActions from '../sandBoxActions'
import * as featureSelectors from '../../../selectors/featureSelectors'
import espotsDesktopConstants from '../../../constants/espotsDesktop'

jest.mock('../../../lib/api-service')
jest.mock('../../../selectors/featureSelectors')

const getState = (params = {}) => ({
  config: 'config',
  viewport: {},
  ...params,
})

const getDesktopState = () =>
  getState({
    viewport: { media: 'desktop' },
  })

const getMobileState = () =>
  getState({
    viewport: { media: 'mobile' },
  })

describe('sandboxActions', () => {
  const dispatch = jest.fn()
  beforeEach(() => {
    nock.cleanAll()
    process.env.FUNCTIONAL_TESTS = ''
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('#getContent', () => {
    it('should not call mobile espots in a desktop viewport', () => {
      const actionCreator = sandboxActions.getContent(
        {},
        'mobileTacticalMessageESpotPos1',
        undefined,
        undefined,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )
      return actionCreator(dispatch, getState).then(() => {
        expect(apiService.get).not.toHaveBeenCalled()
      })
    })

    it('dispatches SET_SANDBOX_CONTENT with body and pageName', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          location: { pathname: '' },
          cmsPageName: 'pageName',
        })
        .reply(200, {
          foo: 'bar',
        })
      const actionCreator = sandboxActions.getContent(
        { pathname: '' },
        'pageName',
        undefined,
        undefined,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      expect(dispatch).toHaveBeenCalledTimes(0)

      return actionCreator(dispatch, getState).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_SANDBOX_CONTENT',
          key: 'pageName',
          content: {
            foo: 'bar',
          },
        })
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('dispatches SET_SANDBOX_CONTENT with metaDescription from cmscontent response', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          location: { pathname: '' },
          cmsPageName: 'pageName',
        })
        .reply(200, {
          head: {
            metaDescription: 'meta desc from cmscontent',
          },
        })
      const actionCreator = sandboxActions.getContent(
        { pathname: '' },
        'pageName',
        undefined,
        undefined,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      expect(dispatch).toHaveBeenCalledTimes(0)

      return actionCreator(dispatch, getState).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_SANDBOX_CONTENT',
          key: 'pageName',
          content: {
            head: {
              meta: [
                {
                  content: 'meta desc from cmscontent',
                  name: 'description',
                },
              ],
              metaDescription: 'meta desc from cmscontent',
            },
          },
        })
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('dispatches SET_SANDBOX_CONTENT with empty metaDescription from cmscontent response', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          location: { pathname: '' },
          cmsPageName: 'pageName',
        })
        .reply(200, {
          head: {
            metaDescription: '',
          },
        })
      const actionCreator = sandboxActions.getContent(
        { pathname: '' },
        'pageName',
        undefined,
        undefined,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      expect(dispatch).toHaveBeenCalledTimes(0)

      return actionCreator(dispatch, getState).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_SANDBOX_CONTENT',
          key: 'pageName',
          content: {
            head: {
              metaDescription: '',
            },
          },
        })
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('dispatches SET_SANDBOX_CONTENT with body and location.pathname', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          location: { pathname: 'locationpathname' },
        })
        .reply(200, {
          foo: 'bar',
        })
      const actionCreator = sandboxActions.getContent(
        { pathname: 'locationpathname' },
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      expect(dispatch).toHaveBeenCalledTimes(0)

      return actionCreator(dispatch, getState).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_SANDBOX_CONTENT',
          key: 'locationpathname',
          content: {
            foo: 'bar',
          },
        })
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('dispatches SET_SANDBOX_CONTENT with error content in case of missing body in response', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          location: { pathname: 'locationpathname' },
        })
        .reply(200)
      const actionCreator = sandboxActions.getContent(
        { pathname: 'locationpathname' },
        undefined,
        undefined,
        true,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      expect(dispatch).toHaveBeenCalledTimes(0)

      return actionCreator(dispatch, getState).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_SANDBOX_CONTENT',
          key: 'locationpathname',
          content: 'Empty response body from mrCMS',
        })
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('dispatches SET_SANDBOX_CONTENT with error message in case e-spot error', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          cmsPageName: 'espot1',
        })
        .reply(200, {
          props: {
            data: {
              pageName: 'error - 404',
            },
          },
        })
      const actionCreator = sandboxActions.getContent(
        undefined,
        'espot1',
        'espot',
        true,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      expect(dispatch).toHaveBeenCalledTimes(0)

      return actionCreator(dispatch, getState).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_SANDBOX_CONTENT',
          key: 'espot1',
          content: 'Error retrieving CMS content',
        })
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('should pass the `mobileCMSUrl` from the query string to the `cmscontent` endpoint', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          mobileCMSUrl:
            'https://www.topshop.com/cms/pages/json/json-0000116968/json-0000116968.json',
        })
        .reply(200)
      const actionCreator = sandboxActions.getContent(
        {
          query: {
            mobileCMSUrl:
              'https://www.topshop.com/cms/pages/json/json-0000116968/json-0000116968.json',
          },
        },
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      return actionCreator(() => {}, getState).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('should set the `responsiveCMSUrl` as the pathname to the `cmscontent` endpoint', () => {
      const nockScope = nock('https://cms.digital.arcadiagroup.co.uk')
        .get('/cmscontent')
        .query({
          location: {
            pathname:
              'https%3A%2F%2Fwww.topshop.com%2Fcms%2Fpages%2Fjson%2Fjson-0000116968%2Fjson-0000116968.json',
          },
        })
        .reply(200)
      const actionCreator = sandboxActions.getContent(
        {
          query: {
            responsiveCMSUrl:
              'https://www.topshop.com/cms/pages/json/json-0000116968/json-0000116968.json',
          },
        },
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://cms.digital.arcadiagroup.co.uk' }
      )

      return actionCreator(() => {}, getState).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('sends viewportMedia and siteId query parameter', () => {
      const tsukSiteId = 12556
      const nockScope = nock('https://whatever')
        .get('/cmscontent')
        .query({
          viewportMedia: 'desktop',
          siteId: tsukSiteId,
        })
        .reply(200, { body: 'body' })
      const actionCreator = sandboxActions.getContent(
        {},
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://whatever' }
      )

      return actionCreator(
        () => {},
        () => ({
          config: { siteId: tsukSiteId },
          viewport: { media: 'desktop' },
        })
      ).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('sends forceMobile=true as query parameter when it receives forceMobile argument as "true"', () => {
      const tsukSiteId = 12556
      const nockScope = nock('https://whatever')
        .get('/cmscontent')
        .query({
          viewportMedia: 'desktop',
          siteId: tsukSiteId,
          forceMobile: true,
        })
        .reply(200, { body: 'body' })
      const actionCreator = sandboxActions.getContent(
        {},
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://whatever' },
        true
      )

      return actionCreator(
        () => {},
        () => ({
          config: { siteId: tsukSiteId },
          viewport: { media: 'desktop' },
        })
      ).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('does not send forceMobile as query parameter when it does not receive forceMobile argument', () => {
      const tsukSiteId = 12556
      const nockScope = nock('https://whatever')
        .get('/cmscontent')
        .query({
          viewportMedia: 'desktop',
          siteId: tsukSiteId,
        })
        .reply(200, { body: 'body' })
      const actionCreator = sandboxActions.getContent(
        {},
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://whatever' }
      )

      return actionCreator(
        () => {},
        () => ({
          config: { siteId: tsukSiteId },
          viewport: { media: 'desktop' },
        })
      ).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('encodes location.pathname query parameter', () => {
      const tsukSiteId = 12556
      const nockScope = nock('https://whatever')
        .get('/cmscontent')
        .query({
          location: { pathname: 'abc%2Ftest' },
          viewportMedia: 'desktop',
          siteId: 12556,
        })
        .reply(200, { body: 'body' })

      const actionCreator = sandboxActions.getContent(
        {
          pathname: 'abc/test',
        },
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://whatever' }
      )

      return actionCreator(
        () => {},
        () => ({
          config: { siteId: tsukSiteId },
          viewport: { media: 'desktop' },
        })
      ).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('avoids sending double encoded location.pathname query parameter', () => {
      const tsukSiteId = 12556
      const nockScope = nock('https://whatever')
        .get('/cmscontent')
        .query({
          location: { pathname: 'abc%2F%26' },
          viewportMedia: 'desktop',
          siteId: 12556,
        })
        .reply(200, { body: 'body' })

      const actionCreator = sandboxActions.getContent(
        {
          pathname: 'abc%2F%26',
        },
        undefined,
        undefined,
        undefined,
        undefined,
        { host: 'https://whatever' }
      )

      return actionCreator(
        () => {},
        () => ({
          config: { siteId: tsukSiteId },
          viewport: { media: 'desktop' },
        })
      ).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('should use the originalPage as the state key if provided', () => {
      const nockScope = nock('https://whatever')
        .get('/cmscontent')
        .query({
          location: { pathname: 'jason.json' },
          cmsPageName: 'nameWeDontWant',
        })
        .reply(200, { body: 'body' })

      const actionCreator = sandboxActions.getContent(
        { pathname: 'jason.json' },
        'nameWeDontWant',
        null,
        null,
        'whatWeWant',
        { host: 'https://whatever' }
      )

      return actionCreator(dispatch, getState).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_SANDBOX_CONTENT',
          key: 'whatWeWant',
          content: {
            body: 'body',
          },
        })
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('sends request to mock server during functional tests', async () => {
      const fun = process.env.FUNCTIONAL_TESTS
      process.env.FUNCTIONAL_TESTS = 'true'
      process.env.CORE_API_PORT = '4000'

      nock('http://localhost:4000')
        .get('/cmscontent')
        .query(true)
        .reply(200, {})

      await sandboxActions.getContent(
        { pathname: 'jason.json' },
        'nameWeDontWant',
        null,
        null,
        'whatWeWant',
        { host: 'https://whatever' }
      )(jest.fn(), getState)

      expect(nock.pendingMocks()).toEqual([])

      process.env.FUNCTIONAL_TESTS = fun
    })
  })

  describe('getSegmentedContent()', () => {
    const getState = () => ({
      config: 'config',
      viewport: {},
    })
    const identifier = 'id1'
    const passedPageName = 'page-name'
    const responsiveCMSUrl = 'responsiveCMSUrl.json'

    let actionCreator
    beforeEach(() => {
      apiService.get.mockResolvedValue({
        body: {
          [identifier]: {
            EspotContents: {
              cmsMobileContent: {
                responsiveCMSUrl,
              },
            },
          },
        },
      })
      actionCreator = sandboxActions.getSegmentedContent(
        '/endpoint',
        identifier,
        passedPageName,
        false
      )
    })

    afterAll(() => {
      apiService.get.mockClear()
    })

    it('should send a GET request to the given wcsEndpoint', () => {
      nock('http://localhost:3000')
        .get('/cmscontent')
        .query(true)
        .reply(200, { data: {} })
      dispatch.mockImplementation(identity)
      expect(apiService.get).not.toHaveBeenCalled()
      return actionCreator(dispatch, getState).then(() => {
        expect(apiService.get).toHaveBeenCalled()
        expect(apiService.get).toHaveBeenCalledWith('/endpoint')
      })
    })

    it('should call call cmsContent endpoint with passed responsiveCMSUrl and dispatch action with passedPageName', async () => {
      nock('http://localhost:3000')
        .get(`/cmscontent`)
        .query({
          storeCode: 'tsuk',
          brandName: 'topshop',
          viewportMedia: 'mobile',
          siteId: '12556',
          forceMobile: '',
          location: { pathname: '%2FresponsiveCMSUrl.json' },
          cmsPageName: '',
          lazyLoad: 'false',
        })

        .reply(200, {
          body: 'body',
        })

      const store = createStore(getState())
      await store.dispatch(actionCreator)

      expect(apiService.get).toHaveBeenCalledTimes(1)
      expect(store.getActions()).toEqual([
        {
          type: 'SET_SANDBOX_CONTENT',
          key: passedPageName,
          content: { body: 'body' },
        },
      ])
    })
  })

  describe('getHomePageContent()', () => {
    describe('if FEATURE_HOME_PAGE_SEGMENTATION is enabled and is NOT mobile device', () => {
      it('should call getSegmentedContent which calls apiService', async () => {
        // apiService will be called if getSegmentedContent is called
        apiService.get.mockResolvedValue({
          body: {
            [espotsDesktopConstants.home.mainBody]: {
              EspotContents: {
                cmsMobileContent: {
                  responsiveCMSUrl: 'jason.json',
                },
              },
            },
          },
        })
        nock('http://localhost:3000')
          .get('/cmscontent')
          .query({
            storeCode: 'tsuk',
            brandName: 'topshop',
            viewportMedia: 'desktop',
            siteId: '12556',
            forceMobile: '',
            location: { pathname: '%2Fjason.json' },
            cmsPageName: '',
            lazyLoad: 'false',
          })
          .reply(200, {
            body: 'body',
          })

        featureSelectors.isFeatureHomePageSegmentationEnabled.mockReturnValue(
          true
        )
        featureSelectors.isFeatureDeferCmsContentEnabled.mockReturnValue(false)

        const store = createStore(getDesktopState())

        await store.dispatch(sandboxActions.getHomePageContent())

        expect(apiService.get).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toEqual([
          {
            type: 'SET_SANDBOX_CONTENT',
            key: 'home',
            content: { body: 'body' },
          },
        ])
      })
    })
    describe('if FEATURE_HOME_PAGE_SEGMENTATION is enabled and is mobile device', () => {
      it('should not call getSegmentedContent which calls the apiService.get()', async () => {
        // apiService won't be called if getSegmentedContent is called
        // but SET_SANDBOX_ACTION will be
        nock('http://localhost:3000')
          .get('/cmscontent')
          .query({
            storeCode: 'tsuk',
            brandName: 'topshop',
            viewportMedia: 'mobile',
            siteId: '12556',
            forceMobile: '',
            cmsPageName: 'home',
            lazyLoad: 'true',
          })
          .reply(200, { body: 'body' })
        featureSelectors.isFeatureHomePageSegmentationEnabled.mockReturnValue(
          true
        )
        featureSelectors.isFeatureDeferCmsContentEnabled.mockReturnValue(true)

        const store = createStore(getMobileState())

        await store.dispatch(sandboxActions.getHomePageContent())

        expect(apiService.get).not.toHaveBeenCalled()
        expect(store.getActions()).toEqual([
          {
            type: 'SET_SANDBOX_CONTENT',
            key: 'home',
            content: { body: 'body' },
          },
        ])
      })
    })
    describe('if FEATURE_HOME_PAGE_SEGMENTATION is disabled and is NOT a mobile device', () => {
      it('should not call getSegmentedContent which calls apiService.get()', async () => {
        featureSelectors.isFeatureHomePageSegmentationEnabled.mockReturnValue(
          false
        )
        featureSelectors.isFeatureDeferCmsContentEnabled.mockReturnValue(true)
        nock('http://localhost:3000')
          .get('/cmscontent')
          .query({
            storeCode: 'tsuk',
            brandName: 'topshop',
            viewportMedia: 'desktop',
            siteId: '12556',
            forceMobile: '',
            cmsPageName: 'home',
            lazyLoad: 'true',
          })
          .reply(200, { body: 'body' })

        const store = createStore(getDesktopState())

        await store.dispatch(sandboxActions.getHomePageContent())

        expect(apiService.get).not.toHaveBeenCalled()
        expect(store.getActions()).toEqual([
          {
            type: 'SET_SANDBOX_CONTENT',
            key: 'home',
            content: { body: 'body' },
          },
        ])
      })
    })
    describe('if FEATURE_HOME_PAGE_SEGMENTATION is disabled and is mobile device', () => {
      it("should not call getSegmentedContent (therefore shoudn't call apiService.get())", async () => {
        featureSelectors.isFeatureHomePageSegmentationEnabled.mockReturnValue(
          false
        )
        featureSelectors.isFeatureDeferCmsContentEnabled.mockReturnValue(true)
        nock('http://localhost:3000')
          .get('/cmscontent')
          .query({
            storeCode: 'tsuk',
            brandName: 'topshop',
            viewportMedia: 'mobile',
            siteId: '12556',
            forceMobile: '',
            cmsPageName: 'home',
            lazyLoad: 'true',
          })
          .reply(200, { body: 'body' })

        const store = createStore(getMobileState())

        await store.dispatch(sandboxActions.getHomePageContent())

        expect(apiService.get).not.toHaveBeenCalled()
        expect(store.getActions()).toEqual([
          {
            type: 'SET_SANDBOX_CONTENT',
            key: 'home',
            content: { body: 'body' },
          },
        ])
      })
    })
  })

  describe('#resetContent', () => {
    it('returns action RESET_SANDBOX_CONTENT', () => {
      expect(sandboxActions.resetContent()).toEqual({
        type: 'RESET_SANDBOX_CONTENT',
      })
    })
  })
})
