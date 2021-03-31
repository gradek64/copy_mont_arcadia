import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import buildStore from 'test/unit/build-store'
import mockProductsCategories from 'test/mocks/topnavmenu-prods-group'
import mockHelpAndInfoMenuItems from 'test/mocks/help-and-info-menu-items'

import Categories from './Categories'
import {
  pushCategoryHistory,
  resetCategoryHistory,
} from '../../../actions/common/navigationActions'
import { clearInfinityPage } from '../../../actions/common/infinityScrollActions'
import {
  toggleTopNavMenu,
  toggleScrollToTop,
} from '../../../actions/components/TopNavMenuActions'

jest.mock('react-router', () => {
  return {
    Link: (props) => <div {...props} />,
  }
})

jest.mock('../../../analytics/tracking/site-interactions', () => ({
  analyticsGlobalNavClickEvent: jest.fn(),
}))

jest.mock('../../../actions/common/navigationActions', () => ({
  pushCategoryHistory: jest.fn(() => ({ type: 'MOCK_ACTION' })),
  resetCategoryHistory: jest.fn(() => ({ type: 'MOCK_ACTION' })),
}))

jest.mock('../../../actions/common/infinityScrollActions', () => ({
  clearInfinityPage: jest.fn(() => ({ type: 'MOCK_ACTION' })),
}))

jest.mock('../../../actions/components/TopNavMenuActions', () => ({
  toggleTopNavMenu: jest.fn(() => ({ type: 'MOCK_ACTION' })),
  toggleScrollToTop: jest.fn(() => ({ type: 'MOCK_ACTION' })),
}))

function hydrateStoreWithNavigation(store, categoryTypesData) {
  store.dispatch({
    type: 'GET_CATEGORIES',
    ...categoryTypesData,
  })
}

describe('<Categories/>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty div when no data given', () => {
    const store = buildStore()
    const wrapper = mount(<Categories />, { context: { store } })

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  describe('displays sub categories', () => {
    const store = buildStore()
    hydrateStoreWithNavigation(store, {
      productCategories: mockProductsCategories.productCategories,
    })
    const wrapper = mount(<Categories type="productCategories" />, {
      context: { store },
    })

    it('"New In" is a category button and visible', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(0)

      expect(node.text()).toBe('New In')
      expect(node.find('button').length).toBe(1)
      expect(node.find('button span.Categories-arrow').length).toBe(1)
      expect(node.find('.is-active').length).toBe(1)
    })

    it('"Foo" is a link and not visible', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(1)

      expect(node.text()).toBe('Foo')
      expect(node.find('button').length).toBe(0)
      expect(node.find('button span.Categories-arrow').length).toBe(0)
      expect(node.find('.is-active').length).toBe(0)
    })
  })

  describe('href/to, target and exists business rules', () => {
    const store = buildStore()
    hydrateStoreWithNavigation(store, {
      helpAndInfoGroup: mockHelpAndInfoMenuItems.helpAndInfoGroup,
    })
    const wrapper = mount(<Categories type="helpAndInfoGroup" />, {
      context: { store },
    })

    it('"Delivery" has link "http://help.topshop.com/system/templates/selfservice/topshop/#!portal/403700000001009/topic/403700000001078/Delivery?LANGUAGE=en&COUNTRY=uk" has target _blank', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(0)

      expect(node.text()).toBe('Delivery')
      expect(node.find('Link').prop('to')).toBe(
        'http://help.topshop.com/system/templates/selfservice/topshop/#!portal/403700000001009/topic/403700000001078/Delivery?LANGUAGE=en&COUNTRY=uk'
      )
      expect(node.find('Link').prop('target')).toBe('_blank')
    })

    // internal redirectionUrl
    it('"Size Guide and Washcare" has link "/size_guide" no target and is internal route', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(2)

      expect(node.text()).toBe('Size Guide and Washcare')
      expect(node.find('Link').prop('to')).toBe('/size_guide')
      expect(node.find('Link').prop('target')).toBe(undefined)
      expect(node.find('Link').length).toBe(1)
    })

    it('"T&Cs" has link "/en/tsuk/category/terms-conditions-19/home?cat2=259987" no target and is internal route', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(5)

      expect(node.text()).toBe('T&Cs')
      expect(node.find('Link').prop('target')).toBe(undefined)
      expect(node.find('Link').prop('to')).toBe(
        '/en/tsuk/category/terms-conditions-19/home?cat2=259987'
      )
      expect(node.find('Link').length).toBe(1)
    })

    // seoUrl
    it('"Test test test" has link "/test-test-test" no target', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(14)

      expect(node.text()).toBe('Test test test')
      expect(node.find('Link').prop('to')).toBe('/test-test-test')
      expect(node.find('Link').prop('target')).toBe(undefined)
    })

    // */blog/* seoUrl
    it('"Blog link" has link "/foo/blog/blah" no target and is not internal route', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(15)

      expect(node.text()).toBe('Blog link')
      expect(node.find('a').prop('href')).toBe('/foo/blog/blah')
      expect(node.find('a').prop('target')).toBe(undefined)
      expect(node.find('Link').length).toBe(0)
    })

    // */blog/* redirectionUrl
    it('"Blog link 2" has link "/foo/blog/blah" no target and is not internal route', () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(16)

      expect(node.text()).toBe('Blog link 2')
      expect(node.find('a').prop('href')).toBe('/foo/blog/blah')
      expect(node.find('a').prop('target')).toBe(undefined)
      expect(node.find('Link').length).toBe(0)
    })

    it("doesn't render /switch-to-full-homepage menu item", () => {
      const node = wrapper
        .find('.Categories-listItem')
        .hostNodes()
        .at(17)

      expect(node.length).toBe(0)
    })
  })

  it('click menu link should call clear categories', () => {
    const store = buildStore()
    hydrateStoreWithNavigation(store, {
      productCategories: mockProductsCategories.productCategories,
    })

    const wrapper = mount(<Categories type="productCategories" />, {
      context: { store },
    })
    const node = wrapper
      .find('.Categories-listItem')
      .find('.ListItemLink')
      .at(1)
    node.simulate('click')

    expect(resetCategoryHistory).toHaveBeenCalledTimes(1)
    expect(clearInfinityPage).toHaveBeenCalledTimes(1)
    expect(toggleTopNavMenu).toHaveBeenCalledTimes(1)
    expect(toggleScrollToTop).toHaveBeenCalledTimes(1)
    expect(pushCategoryHistory).not.toHaveBeenCalled()
  })

  it('click menu category should push to categories', () => {
    const store = buildStore()
    hydrateStoreWithNavigation(store, {
      productCategories: mockProductsCategories.productCategories,
    })
    const wrapper = mount(<Categories type="productCategories" />, {
      context: { store },
    })
    const node = wrapper
      .find('.Categories-listItem')
      .find('.ListItemLink')
      .at(0)
    node.simulate('click')

    expect(toggleScrollToTop).toHaveBeenCalledTimes(1)
    expect(resetCategoryHistory).not.toHaveBeenCalled()
    expect(clearInfinityPage).not.toHaveBeenCalled()
    expect(toggleTopNavMenu).not.toHaveBeenCalled()

    expect(pushCategoryHistory).toHaveBeenCalledTimes(1)
    expect(pushCategoryHistory).toHaveBeenCalledWith(
      mockProductsCategories.productCategories[0]
    )
  })
})
