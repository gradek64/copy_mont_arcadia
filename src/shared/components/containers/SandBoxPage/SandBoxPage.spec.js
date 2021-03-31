import React from 'react'
import { shallow } from 'enzyme'
import SandBoxPage, { NotFound } from './SandBoxPage'
import SandBox from '../SandBox/SandBox'
import NotFoundComponent from '../NotFound/NotFound'
import { until } from 'test/unit/helpers/test-component'
import { GTM_CATEGORY } from '../../../analytics'
import { forAnalyticsDecorator as createMockStoreForAnalytics } from 'test/unit/helpers/mock-store'

describe('SandBoxPage', () => {
  const { WrappedComponent } = SandBoxPage
  const props = Object.freeze({
    foo: 'bar',
    baz: 'qux',
  })

  it('renders SandBox component and passes the props', () => {
    const wrapper = shallow(<WrappedComponent {...props} />)
    expect(wrapper.find(SandBox)).toHaveLength(1)
    expect(wrapper.find(SandBox).props()).toEqual(props)
  })

  it('gets decorated with AnalyticsDecorator', () => {
    const mockStore = createMockStoreForAnalytics({ preloadedState: {} })
    const shallowOptions = { context: { store: mockStore } }
    const wrapper = shallow(<SandBoxPage {...props} />, shallowOptions)

    expect(SandBoxPage.displayName).toMatch(/AnalyticsDecorator/)
    const analyticsDecorator = until(
      wrapper,
      'AnalyticsDecorator',
      shallowOptions
    )
    const analyticsInstance = analyticsDecorator.instance()
    expect(analyticsInstance.pageType).toBe(GTM_CATEGORY.MR_CMS)
    expect(analyticsInstance.isAsync).toBe(true)
  })

  it('should specify static needs', () => {
    expect(WrappedComponent.needs).toBe(SandBox.needs)
  })
})

describe('NotFound', () => {
  const mockCmsPageName = 'test'
  const props = Object.freeze({
    route: {
      cmsPageName: mockCmsPageName,
    },
  })

  it('attempts to pass the cmsPageName prop', () => {
    const wrapper = shallow(<NotFound {...props} />)
    const notFound = wrapper.find(NotFoundComponent).first()

    expect(notFound.prop('cmsPageName')).toBe(mockCmsPageName)
  })
})
