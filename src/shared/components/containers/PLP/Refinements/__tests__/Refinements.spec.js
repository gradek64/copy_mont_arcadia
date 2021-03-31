import testComponentHelper from 'test/unit/helpers/test-component'
import PropTypes from 'prop-types'
import React from 'react'
import { mount } from 'enzyme'
import { createStore } from 'redux'
import Refinements from '../Refinements'

describe('<RefinementList/>', () => {
  jest.mock('../../../../../lib/products-utils', () => ({
    isSeoUrlSearchFilter: jest.fn(
      (seoUrl) => seoUrl && seoUrl.includes('seo=false')
    ),
    isSearchUrl: jest.fn((seoUrl) => seoUrl && seoUrl.includes('/search/')),
    getResetSearchUrl: jest.fn(
      (currentSearchPath) =>
        `/search/?q=${currentSearchPath.match(/Ntt=(.*?)&/)[1]}`
    ),
  }))
  const renderComponent = testComponentHelper(Refinements.WrappedComponent)
  const refinements = [
    {
      label: 'Colour',
      refinementOptions: [
        {
          type: 'VALUE',
          label: 'black',
          value: 'black',
        },
      ],
    },
    {
      label: 'Size',
      refinementOptions: [
        {
          type: 'VALUE',
          label: 4,
          value: 4,
        },
        {
          type: 'VALUE',
          label: 6,
          value: 6,
        },
      ],
    },
    {
      label: 'Price',
      refinementOptions: [
        {
          type: 'RANGE',
          label: 0,
          value: 0,
        },
      ],
    },
  ]
  const defaultProps = {
    refinements: [],
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
    })
    it('with refinements', () => {
      expect(
        renderComponent({ ...defaultProps, refinements }).getTree()
      ).toMatchSnapshot()
    })
    it('with refinements and selectedOptions', () => {
      const selectedOptions = {
        Size: [4],
      }
      expect(
        renderComponent({
          ...defaultProps,
          numRefinements: 1,
          refinements,
          selectedOptions,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with isShown', () => {
      expect(
        renderComponent({ ...defaultProps, isShown: true }).getTree()
      ).toMatchSnapshot()
    })
    it('with location', () => {
      expect(
        renderComponent({
          ...defaultProps,
          location: {
            pathname: 'some/pathname',
          },
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with isMobile as false', () => {
      expect(
        renderComponent({ ...defaultProps, isMobile: false }).getTree()
      ).toMatchSnapshot()
    })
    it('renders overlay when loading and featureflag on', () => {
      expect(
        renderComponent({
          ...defaultProps,
          isLoadingRefinements: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    describe('componentDidUpdate', () => {
      it('should focus description', () => {
        const state = {
          config: {
            brandName: 'TS',
            brandCode: 'TS',
          },
          products: {
            refinements: [],
          },
          refinements: {},
          features: {
            status: {},
          },
        }
        const store = createStore((state) => state, state)
        const { WrappedComponent } = Refinements
        const context = {
          l: (value) => {
            return value
          },
          store,
        }
        const wrapper = mount(<WrappedComponent isShown {...defaultProps} />, {
          context,
          childContextTypes: {
            l: PropTypes.any,
            store: PropTypes.any,
          },
        })
        const instance = wrapper.instance()
        instance.description.focus = jest.fn()
        instance.componentDidUpdate({ isShown: false })
        expect(instance.description.focus).toHaveBeenCalled()
      })
    })
    describe('componentWillUnmount', () => {
      it('should call toggleRefinements', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          resetRefinements: jest.fn(),
          toggleRefinements: jest.fn(),
        })
        instance.componentWillUnmount()
        expect(instance.props.toggleRefinements).toHaveBeenCalledTimes(1)
        expect(instance.props.toggleRefinements).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('@events', () => {
    describe('clearAndApplyRefinements', () => {
      const refinementProps = {
        ...defaultProps,
        updateRefinements: jest.fn(),
        sendAnalyticsFilterUsedEvent: jest.fn(),
        removeOptionRange: jest.fn(),
      }
      beforeEach(() => jest.clearAllMocks())

      it('should update refinements with remove all path', () => {
        const removeAllRefinement =
          '/en/tsuk/category/clothing-427/N-82zZdgl?Nrpp=24&siteId=%2F12556&categoryId=null&clearAll=true'
        const { instance, wrapper } = renderComponent({
          ...refinementProps,
          removeAllRefinement,
        })
        wrapper.find('.Refinements-clearButton').simulate('click')
        expect(instance.props.updateRefinements).toHaveBeenCalledTimes(1)
        expect(instance.props.updateRefinements).toHaveBeenCalledWith(
          removeAllRefinement
        )
      })
      it('should update refinements with remove all path in search filter', () => {
        const { instance, wrapper } = renderComponent({
          ...refinementProps,
          removeAllRefinement: '?seo=false&siteId=%2F12556',
          currentPath: '/filter/N-deoZdgl',
          currentSearchPath: '?Nrpp=24&Ntt=red&seo=false&siteId=%2F12556',
        })
        wrapper.find('.Refinements-clearButton').simulate('click')
        expect(instance.props.updateRefinements).toHaveBeenCalledTimes(1)
        expect(instance.props.updateRefinements).toHaveBeenCalledWith(
          '/search/?q=red'
        )
      })
      it('should update refinements with remove all path in initial search path', () => {
        const { instance, wrapper } = renderComponent({
          ...refinementProps,
          removeAllRefinement: '?seo=false&siteId=%2F12556',
          currentPath: '/search/',
          currentSearchPath: '?q=red',
        })
        wrapper.find('.Refinements-clearButton').simulate('click')
        expect(instance.props.updateRefinements).toHaveBeenCalledTimes(1)
        expect(instance.props.updateRefinements).toHaveBeenCalledWith(
          '/search/?q=red'
        )
      })
    })
  })

  describe('@functions', () => {
    describe('applyRefinementsHandler', () => {
      it('should call toggleRefinements and applyRefinementsMobile', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          toggleRefinements: jest.fn(),
          applyRefinementsMobile: jest.fn(),
          sendAnalyticsFilterUsedEvent: jest.fn(),
        })
        instance.applyRefinementsHandler()
        expect(instance.props.toggleRefinements).toHaveBeenCalledTimes(1)
        expect(instance.props.toggleRefinements).toHaveBeenCalledWith(false)
        expect(
          instance.props.sendAnalyticsFilterUsedEvent
        ).toHaveBeenCalledWith({
          filterCategory: 'apply filters',
          filterOption: 'apply filters',
          filterAction: 'click',
        })
        expect(instance.props.applyRefinementsMobile).toHaveBeenCalledTimes(1)
        expect(instance.props.toggleRefinements).toHaveBeenCalledTimes(1)
      })
    })

    describe('closeRefinementsHandler', () => {
      it('should call toggle refinements with false', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          resetRefinements: jest.fn(),
          toggleRefinements: jest.fn(),
        })

        instance.closeRefinementsHandler()
        expect(instance.props.toggleRefinements).toHaveBeenCalledTimes(1)
        expect(instance.props.toggleRefinements).toHaveBeenCalledWith(false)
      })
      it('should call resetRefinements', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          toggleRefinements: jest.fn(),
          resetRefinements: jest.fn(),
        })

        instance.closeRefinementsHandler()
        expect(instance.props.resetRefinements).toHaveBeenCalledTimes(1)
      })
    })
  })
})
