import nock from 'nock'
import { createStore } from '../../../../../test/unit/helpers/get-redux-mock-store'

import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import { getContent } from '../cmsActions'
import { setPageStatusCode } from '../routingActions'

jest.mock('../routingActions', () => ({
  setPageStatusCode: jest.fn(() => () => {}),
}))

const testState = {
  config: { language: 'en-gb', brandName: 'topshop' },
  navigation: {
    menuLinks: [
      {
        navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
        index: 10,
        label: 'Students',
        categoryId: 2690109,
        categoryFilter: '2691008,2690109',
        seoUrl: '/en/tsuk/category/help-information-4912595/students-4912533',
        redirectionUrl:
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd?catalogId=33057&storeId=12556&langId=-1&viewAllFlag=false&categoryId=1924856&interstitial=true&TS=1463651801527',
        navigationEntries: [],
      },
    ],
  },
}

describe('cmsActions', () => {
  it('getContent retrieves and saves the content from the home page', () => {
    const store = configureMockStore({
      config: { language: 'en-gb', brandName: 'topshop' },
    })
    nock('http://localhost:3000')
      .get('/api/cms/pages/home')
      .reply(200, { pageName: 'home', pageData: [] })

    store.dispatch(getContent({ cmsPageName: 'home' }))

    return new Promise((resolve) => {
      store.subscribeUntilPasses(() => {
        expect(store.getState().cms.pages.home.pageName).toBe('home')
        resolve()
      })
    })
  })

  it('getContent retrieves and saves the content for the studends page', () => {
    const store = configureMockStore({
      config: { language: 'en-gb', brandName: 'topshop' },
      navigation: {
        menuLinks: [
          {
            navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
            index: 10,
            label: 'Students',
            categoryId: 2690109,
            categoryFilter: '2691008,2690109',
            seoUrl:
              '/en/tsuk/category/help-information-4912595/students-4912533',
            redirectionUrl:
              '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd?catalogId=33057&storeId=12556&langId=-1&viewAllFlag=false&categoryId=1924856&interstitial=true&TS=1463651801527',
            navigationEntries: [],
          },
        ],
      },
    })
    nock('http://localhost:3000')
      .get(
        '/api/cms/page/url?url=%2Fwebapp%2Fwcs%2Fstores%2Fservlet%2FCatalogNavigationSearchResultCmd%3FcatalogId%3D33057%26storeId%3D12556%26langId%3D-1%26viewAllFlag%3Dfalse%26categoryId%3D1924856%26interstitial%3Dtrue%26TS%3D1463651801527'
      )
      .reply(200, { pageName: 'students', pageData: [] })

    store.dispatch(
      getContent({
        cmsPageName: null,
        pathname: '/en/tsuk/category/help-information-4912595/students-4912533',
        hygieneType: 'students',
      })
    )

    return new Promise((resolve) => {
      store.subscribeUntilPasses(() => {
        expect(store.getState().cms.pages.students).toEqual({
          pageName: 'students',
          pageData: [],
        })
        resolve()
      })
    })
  })
  it('sets page status code if the page name is error404', async () => {
    const store = configureMockStore({
      config: { language: 'en-gb', brandName: 'topshop' },
    })
    nock('http://localhost:3000')
      .get('/api/cms/pages/error404')
      .reply(200, { pageName: 'error404', pageData: [] })

    await store.dispatch(
      getContent({
        cmsPageName: 'error404',
        shouldHandleError: false,
        contentType: 'page',
      })
    )

    expect(setPageStatusCode).toHaveBeenCalled()
    expect(setPageStatusCode).toHaveBeenCalledTimes(1)
  })
  it('catches 404 errors with page name set as error404', async () => {
    const store = createStore({
      ...testState,
    })
    nock('http://localhost:3000')
      .get('/api/cms/pages/error404')
      .reply(404, { pageName: 'error404', pageData: [] })

    await store.dispatch(
      getContent({
        cmsPageName: 'error404',
        shouldHandleError: false,
        contentType: 'page',
      })
    )

    const expectedActions = [
      { type: 'SET_ERROR', error: { statusCode: 404 } },
      {
        type: 'SET_CONTENT',
        pageName: 'error404',
        content: { error: 'Not Found', statusCode: 404 },
      },
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })
})
