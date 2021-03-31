import testComponentHelper from 'test/unit/helpers/test-component'
import RefinementSummary from '../RefinementSummary'
import { browserHistory } from 'react-router'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

describe('<RefinementSummary/>', () => {
  const renderComponent = testComponentHelper(
    RefinementSummary.WrappedComponent
  )
  const defaultProps = {
    products: {
      sortOptions: {},
      products: [],
    },
    removeAllFilters:
      '/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&categoryId=null',
    categoryTitle: 'Dress',
    canonicalUrl: '/en/tsuk/category/shoes-430',
  }
  const activeRefinements = [
    {
      key: 'TOPSHOP_UK_CE3_PRODUCT_TYPE',
      title: 'Product Type',
      values: [
        {
          key: 'ECMC_PROD_CE3_PRODUCT_TYPE_1_DRESSES',
          label: 'dresses',
          seoUrl: 'XXXXX',
        },
      ],
    },
    {
      key: 'NOWPRICE',
      title: 'Price',
      values: [
        {
          key: 'NOWPRICE5.032.0',
          label: '',
          upperBound: '32.0',
          lowerBound: '5.0',
        },
      ],
    },
    {
      key: 'TOPSHOP_UK_CATEGORY',
      title: 'Category',
      values: [
        {
          key: 3552,
          label: 'Dress',
        },
      ],
    },
  ]

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
    })
    it('with activeRefinements', () => {
      expect(
        renderComponent({ ...defaultProps, activeRefinements }).getTree()
      ).toMatchSnapshot()
    })

    it('Should not display Refinements value block under the category if the value is empty', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        categoryTitle: '',
      })
      const refinementsSummaryValue = wrapper.find('.RefinementSummary-value')
      expect(refinementsSummaryValue).toHaveLength(0)
    })
  })

  describe('@events', () => {
    it('removes a refinement option value', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        categoryTitle: 'Dress',
        activeRefinements,
      })
      wrapper
        .find('.RefinementSummary-removeTextValue')
        .at(0)
        .prop('onClick')()
      expect(browserHistory.push).not.toHaveBeenCalledWith(['XXXXX'])
    })

    it('when clear refinements button is clicked', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        activeRefinements,
        sendAnalyticsFilterUsedEvent: jest.fn(),
      })
      const clearRefinementsButton = wrapper.find(
        '.RefinementSummary-clearRefinementsButton'
      )
      clearRefinementsButton.simulate('click')
      expect(browserHistory.push).toHaveBeenCalled()
      expect(browserHistory.push).toHaveBeenCalledWith(
        '/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&categoryId=null&clearAll=true'
      )
    })

    it('when clear refinements button is clicked WHIT SEARCH RESULT', () => {
      const { instance, wrapper } = renderComponent({
        ...defaultProps,
        removeAllFilters: '?seo=false&siteId=%2F12556',
        currentSearchPath: '?Nrpp=24&Ntt=red&seo=false&siteId=%2F12556',
        activeRefinements,
        sendAnalyticsFilterUsedEvent: jest.fn(),
      })
      const clearRefinementsButton = wrapper.find(
        '.RefinementSummary-clearRefinementsButton'
      )
      expect(instance.disableClearAllButton()).toBe(false)
      clearRefinementsButton.simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith('/search/?q=red')
    })

    it('clear button should disabled', () => {
      const { instance } = renderComponent({
        ...defaultProps,
        removeAllFilters: '/N-275aZdgl?Nrpp=24&siteId=%2F12556&categoryId=null',
        activeRefinements: [],
        sendAnalyticsFilterUsedEvent: jest.fn(),
      })
      expect(instance.disableClearAllButton()).toBe(true)
    })
  })
})
