import testComponentHelper, {
  withStore,
  mountRender,
  buildComponentRender,
} from 'test/unit/helpers/test-component'
import { compose } from 'ramda'
import ProductAttributeBanner from '../ProductAttributeBanner'

import { error } from '../../../../../server/lib/logger'

jest.mock('../../../../../server/lib/logger', () => ({
  error: jest.fn(),
}))

describe('<ProductAttributeBanner/>', () => {
  const renderComponent = testComponentHelper(ProductAttributeBanner)
  const render = compose(
    mountRender,
    withStore({
      config: {
        brandName: 'XXXXX',
        brandCode: 'XXXXX',
      },
    })
  )
  const mountComponent = buildComponentRender(render, ProductAttributeBanner)

  describe('@renders', () => {
    it('in default state', () => {
      expect(
        renderComponent({
          src:
            'http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Small_Petite3.png',
          productURL:
            'http://local.m.topshop.com:8080/en/tsuk/product/clothing-427/jackets-coats-2390889/relaxed-coat-7930523',
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('Error handling', () => {
    it('renders nothing if theres an error', () => {
      const { wrapper } = mountComponent({
        isFeatureLogBadAttributeBannersEnabled: true,
        src: null,
      })

      wrapper
        .find('Image')
        .first()
        .props()
        .onError()

      wrapper.update()

      expect(wrapper.html()).toBe(null)
    })

    it('logs an error when the image fails to load', () => {
      const productURL =
        'http://local.m.topshop.com:8080/en/tsuk/product/clothing-427/jackets-coats-2390889/relaxed-coat-7930523'

      const { wrapper } = mountComponent({
        isFeatureLogBadAttributeBannersEnabled: true,
        src: null,
        productURL,
      })

      wrapper.instance().handleError()

      expect(error).toBeCalledWith('Failed to load attribute banner', {
        message: 'Failed to load attribute banner',
        src: null,
        location: window.location.href,
        productURL,
      })
    })

    it('resets error state if the src changes', () => {
      const { wrapper } = mountComponent({
        isFeatureLogBadAttributeBannersEnabled: true,
        src: null,
      })

      wrapper
        .find('Image')
        .props()
        .onError()

      wrapper.update()
      wrapper.setProps({
        src:
          'http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Small_Petite3.png',
      })

      expect(wrapper.find('Image')).toHaveLength(1)
    })
  })
})
