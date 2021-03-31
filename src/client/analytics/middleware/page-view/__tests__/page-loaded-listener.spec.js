describe('pageLoadedListener()', () => {
  const mockAction = { payload: { pageName: 'fish' } }

  const mockState = Object.freeze({ fake: 'state' })
  const mockStore = {
    getState() {
      return mockState
    },
  }

  /**
   * we have to set `global.process.browser` to true before importing the
   * dataLayer module
   */
  let oldProcessBrowser
  let dataLayer
  let pageLoadedListener
  let gpd
  let configSelectors
  let debugSelectors
  let featureSelectors
  let viewportSelectors
  beforeAll(() => {
    oldProcessBrowser = global.process.browser

    global.process.browser = true

    dataLayer = require('../../../../../shared/analytics/dataLayer').default
    pageLoadedListener = require('../page-loaded-listener').pageLoadedListener
    gpd = require('../get-page-data')
    configSelectors = require('../../../../../shared/selectors/configSelectors')
    debugSelectors = require('../../../../../shared/selectors/debugSelectors')
    featureSelectors = require('../../../../../shared/selectors/featureSelectors')
    viewportSelectors = require('../../../../../shared/selectors/viewportSelectors')
  })
  beforeEach(() => {
    jest.resetAllMocks()
  })
  afterAll(() => {
    global.process.browser = oldProcessBrowser
  })

  it('should retrieve page data from `getPageData()`', () => {
    jest.spyOn(gpd, 'getPageData').mockReturnValue({})
    jest.spyOn(configSelectors, 'getBrandCode').mockReturnValue('')

    pageLoadedListener(mockAction, mockStore)

    expect(gpd.getPageData).toHaveBeenCalledTimes(1)
    expect(gpd.getPageData).toHaveBeenCalledWith('fish', mockState)
  })

  it('should provide correct data to Google Analytics via `dataLayer.push()`', () => {
    jest.spyOn(dataLayer, 'push')

    jest.spyOn(gpd, 'getPageData').mockReturnValue({
      type: 'some type',
      category: 'some category',
      more: 'data',
      and: 'stuff',
    })

    jest.spyOn(configSelectors, 'getBrandCode').mockReturnValue('fishfingers')
    jest.spyOn(debugSelectors, 'getBuildVersion').mockReturnValue('alpha')
    jest
      .spyOn(featureSelectors, 'getFeaturesStatus')
      .mockReturnValue('fake status')
    jest
      .spyOn(viewportSelectors, 'getViewportMedia')
      .mockReturnValue('fake media')

    pageLoadedListener(mockAction, mockStore)

    expect(dataLayer.push).toHaveBeenCalledTimes(1)
    expect(dataLayer.push).toHaveBeenCalledWith(
      {
        pageType: 'FISHFINGERS:some type',
        pageCategory: 'FISHFINGERS:some category',
        buildVersion: 'alpha',
        features: 'fake status',
        viewport: 'fake media',
        more: 'data',
        and: 'stuff',
      },
      'pageSchema',
      'pageView'
    )
  })

  it('should not invoke `dataLayer.push()` for unknown pages', () => {
    jest.spyOn(dataLayer, 'push')

    jest.spyOn(gpd, 'getPageData').mockReturnValue(undefined)

    pageLoadedListener(mockAction, mockStore)

    expect(dataLayer.push).not.toHaveBeenCalled()
  })
})
