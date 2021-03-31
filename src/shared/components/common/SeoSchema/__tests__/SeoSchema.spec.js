import React from 'react'
import { shallow } from 'enzyme'
import testComponentHelper from 'test/unit/helpers/test-component'

import SeoSchema from '../SeoSchema'

describe('<SeoSchema />', () => {
  const renderComponent = testComponentHelper(SeoSchema.WrappedComponent)

  describe('@renders', () => {
    it('should render empty in default state', () => {
      const { wrapper } = renderComponent()
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should render `productSchema` if `type` is `Product`', () => {
      const productSchemaMock = jest.fn(() => ({
        '@type': 'Product',
      }))
      const { getTree } = renderComponent({
        type: 'Product',
        data: {
          foo: 'bar',
        },
        brandName: 'topshop',
        brandUrl: 'http://m.topshop.com',
        location: {
          pathname: '/search',
        },
        currencyCode: 'GBP',
        productSchema: productSchemaMock,
      })
      expect(productSchemaMock).toHaveBeenCalledWith(
        { foo: 'bar' },
        'topshop',
        'http://m.topshop.com/search',
        'GBP'
      )
      expect(getTree()).toMatchSnapshot()
    })

    it('should render `breadcrumbListSchema` if `type` is `BreadcrumbList`', () => {
      const breadcrumbListSchemaMock = jest.fn(() => ({
        '@type': 'BreadcrumbList',
      }))
      const { getTree } = renderComponent({
        type: 'BreadcrumbList',
        data: {
          foo: 'bar',
        },
        breadcrumbListSchema: breadcrumbListSchemaMock,
      })
      expect(breadcrumbListSchemaMock).toHaveBeenCalledWith({ foo: 'bar' })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render `storeSchema` if `type` is `Store`', () => {
      const storeSchemaMock = jest.fn(() => ({
        '@type': 'ClothingStore',
      }))
      const { getTree } = renderComponent({
        type: 'Store',
        data: {
          foo: 'bar',
        },
        storeSchema: storeSchemaMock,
      })
      expect(storeSchemaMock).toHaveBeenCalledWith({ foo: 'bar' })
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('mapStateToProps', () => {
    it('builds props from state', () => {
      const store = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => ({
          config: {
            brandName: 'topshop',
          },
          routing: {
            location: {
              hostname: 'm.topshop.com',
            },
          },
          siteOptions: {
            currencyCode: 'GBP',
          },
        }),
      }
      const wrapper = shallow(
        <SeoSchema store={store} type="Store" data={{ foo: 'bar' }} />
      )

      expect(wrapper.first().props()).toMatchObject({
        brandUrl: 'm.topshop.com',
        brandName: 'topshop',
        currencyCode: 'GBP',
      })
    })
  })
})
