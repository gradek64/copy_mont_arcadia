import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'
import { browserHistory } from 'react-router'

import mockBundles from 'test/mocks/bundleMocks'
import testComponentHelper from 'test/unit/helpers/test-component'
import { getProductRouteFromId } from '../../../../lib/get-product-route'

import MiniProduct from '../MiniProduct'
import ResponsiveImage from '../../ResponsiveImage/ResponsiveImage'
import AddToBag from '../../AddToBag/AddToBag'
import WishlistButton from '../../WishlistButton/WishlistButton'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))
jest.mock('../../../../lib/get-product-route', () => ({
  getProductRouteFromId: jest.fn(),
}))

const miniProduct = {
  ...mockBundles.bundleProducts[0],
  setFormMessage: jest.fn(),
  isBundleFlexible: false,
  lang: 'en',
  enableQuickViewButtonOnBundlePages: false,
  isFeatureWishlistEnabled: false,
}

describe('<MiniProduct />', () => {
  const noop = () => {}
  const renderComponent = testComponentHelper(MiniProduct.WrappedComponent)

  describe('@render', () => {
    it('has all required components', () => {
      const { WrappedComponent } = MiniProduct
      const wrapper = shallow(<WrappedComponent {...miniProduct} />)
      expect(wrapper.find('.MiniProduct-image').length).toEqual(1)
      expect(wrapper.find('.MiniProduct-title').text()).toEqual(
        miniProduct.name
      )
      expect(wrapper.find('.HistoricalPrice--miniProduct').length).toEqual(1)
    })
    it('in default state', () => {
      expect(
        renderComponent({
          ...miniProduct,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('in flexible bundle state', () => {
      expect(
        renderComponent({
          ...miniProduct,
          isBundleFlexible: true,
          attributes: {
            BundleType: 'Fixed',
            ECMC_PROD_SIZE_GUIDE_1: 'Jackets & Coats',
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('in flexible bundle state with sku', () => {
      expect(
        renderComponent({
          ...miniProduct,
          isBundleFlexible: true,
          sku: '152015000263214',
          items: [
            {
              sku: '152015000263214',
              catEntryid: 123,
            },
          ],
          attributes: {
            BundleType: 'Fixed',
            ECMC_PROD_SIZE_GUIDE_1: 'Jackets & Coats',
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('in flexible bundle state with SKU as ""', () => {
      expect(
        renderComponent({
          ...miniProduct,
          isBundleFlexible: true,
          sku: '',
          attributes: {
            BundleType: 'Fixed',
            ECMC_PROD_SIZE_GUIDE_1: 'Jackets & Coats',
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with quickview button', () => {
      expect(
        renderComponent({
          ...miniProduct,
          enableQuickViewButtonOnBundlePages: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('<ResponsiveImage />', () => {
      it('should get the src url from the second element in the assets array', () => {
        const assets = [{ url: 'url1' }, { url: 'url2' }]
        const { wrapper } = renderComponent({
          ...miniProduct,
          assets,
        })
        expect(wrapper.find(ResponsiveImage).prop('src')).toBe('url2')
      })

      it('should pass down undefined as the src url if the assets array is empty', () => {
        const { wrapper } = renderComponent({
          ...miniProduct,
          assets: [],
        })
        expect(wrapper.find(ResponsiveImage).prop('src')).toBeUndefined()
      })

      it('should provide amplience url to the responsive image', () => {
        const { wrapper } = renderComponent({
          ...miniProduct,
          amplienceAssets: {
            images: ['amplience image 1', 'amplience image 2'],
            videos: ['amplience video 1'],
          },
        })
        expect(wrapper.find(ResponsiveImage).prop('amplienceUrl')).toBe(
          'amplience image 1'
        )
      })
    })

    describe('<AddToBag />', () => {
      it('should render if `bundleType` prop is ‘Flexible’ ', () => {
        const { wrapper } = renderComponent({
          ...miniProduct,
          isBundleFlexible: true,
        })
        expect(toJson(wrapper.find(AddToBag))).toMatchSnapshot()
      })

      it('should pass `deliveryMessage` prop to <AddToBag />', () => {
        const deliveryMessage = 'Order in 9 hrs 23 mins for next day delivery'
        const { wrapper } = renderComponent({
          ...miniProduct,
          isBundleFlexible: true,
          deliveryMessage,
        })
        expect(wrapper.find(AddToBag).prop('deliveryMessage')).toBe(
          deliveryMessage
        )
      })

      it('should pass `catEntryId` prop to <AddToBag /> if isFeatureAddItemV3 is enabled', () => {
        const { wrapper } = renderComponent({
          ...miniProduct,
          isBundleFlexible: true,
          sku: '123475649',
          items: [
            {
              sku: '123475649',
              catEntryId: 234567,
            },
          ],
        })

        expect(wrapper.find(AddToBag).prop('catEntryId')).toBe(234567)
      })
    })

    describe('<Wishlistbutton />', () => {
      it('should render a Wishlist button when the wishlist feature flag is enabled and bundleType is flexible', () => {
        const { wrapper } = renderComponent({
          ...miniProduct,
          isFeatureWishlistEnabled: true,
          isBundleFlexible: true,
        })
        expect(wrapper.find(WishlistButton).length).toBe(1)
      })

      it('should not render a Wishlist button when the bundleType is not flexible', () => {
        const { wrapper } = renderComponent({
          ...miniProduct,
          isFeatureWishlistEnabled: true,
        })
        expect(wrapper.find(WishlistButton).length).toBe(0)
      })
    })
  })

  describe('@lifeCycles', () => {
    let renderedComponent
    beforeEach(() => {
      jest.clearAllMocks()
      renderedComponent = renderComponent(miniProduct)
    })
    it('should call handleLoad', () => {
      const { instance } = renderedComponent
      instance.handleLoad = jest.fn()
      instance.componentDidMount = jest.fn(() => {
        instance.handleLoad()
      })
      expect(instance.handleLoad).not.toHaveBeenCalled()
      instance.componentDidMount()
      expect(instance.handleLoad).toHaveBeenCalled()
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('on shouldAddToBag', () => {
      describe('if no `sku`', () => {
        it('should call setFormMessage', () => {
          const setFormMessageMock = jest.fn()
          const { wrapper } = renderComponent({
            ...miniProduct,
            isBundleFlexible: true,
            setFormMessage: setFormMessageMock,
          })
          wrapper.find(AddToBag).prop('shouldAddToBag')()

          expect(setFormMessageMock).toHaveBeenCalledTimes(1)
          expect(setFormMessageMock).toHaveBeenLastCalledWith(
            'bundlesAddToBag',
            'Please select your size to continue',
            19411969
          )
        })
      })

      describe('if there is an `sku`', () => {
        it('should return `true`', () => {
          const { wrapper } = renderComponent({
            ...miniProduct,
            isBundleFlexible: true,
            sku: '602017001144086',
            items: [
              {
                sku: '602017001144086',
                catEntryid: 123,
              },
            ],
          })
          expect(wrapper.find(AddToBag).prop('shouldAddToBag')()).toBe(true)
        })
      })
    })

    describe('click on image', () => {
      it('should open quick view when desktop or tablet', () => {
        const props = {
          ...miniProduct,
          setProductQuickview: jest.fn(),
          setProductIdQuickview: jest.fn(),
          showModal: jest.fn(),
          isMobile: false,
        }

        const { wrapper } = renderComponent(props)
        wrapper.find('.MiniProduct-image').simulate('click', {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        })

        expect(props.setProductQuickview).toHaveBeenCalledTimes(1)
        expect(
          Object.keys(props.setProductQuickview.mock.calls[0][0]).length
        ).toEqual(0)
        expect(props.setProductIdQuickview).toHaveBeenCalledTimes(1)
        expect(props.setProductIdQuickview).lastCalledWith(
          miniProduct.productId
        )
        expect(props.showModal).toHaveBeenCalledTimes(1)
      })
      it('should redirect to pdp when mobile', () => {
        const pathname = 'some/pathname'
        const props = {
          ...miniProduct,
          pathname,
          isMobile: true,
          location: {},
        }

        const { wrapper } = renderComponent(props)
        wrapper.find('.MiniProduct-image').simulate('click', {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        })

        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(getProductRouteFromId).toHaveBeenCalledTimes(1)
        expect(getProductRouteFromId.mock.calls[0][0]).toBe(pathname)
        expect(getProductRouteFromId.mock.calls[0][1]).toBe(19411969)
      })

      it('should use supplied modal mode when showing modal', () => {
        const showModalMock = jest.fn()
        const { wrapper } = renderComponent({
          ...miniProduct,
          setProductQuickview: noop,
          setProductIdQuickview: noop,
          showModal: showModalMock,
          modalMode: 'plpQuickview',
          isMobile: false,
        })
        // Simulate click
        wrapper.find(ResponsiveImage).prop('onClick')({
          preventDefault: noop,
        })

        expect(showModalMock.mock.calls[0][1].mode).toBe('plpQuickview')
      })
    })
    describe('click on title', () => {
      it('should open quick view when desktop or tablet', () => {
        const props = {
          ...miniProduct,
          setProductQuickview: jest.fn(),
          setProductIdQuickview: jest.fn(),
          showModal: jest.fn(),
          isMobile: false,
        }

        const { wrapper } = renderComponent(props)
        wrapper.find('.MiniProduct-title').simulate('click', {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        })

        expect(props.setProductQuickview).toHaveBeenCalledTimes(1)
        expect(
          Object.keys(props.setProductQuickview.mock.calls[0][0]).length
        ).toEqual(0)
        expect(props.setProductIdQuickview).toHaveBeenCalledTimes(1)
        expect(props.setProductIdQuickview).lastCalledWith(
          miniProduct.productId
        )
        expect(props.showModal).toHaveBeenCalledTimes(1)
      })
      it('should redirect to pdp when mobile', () => {
        const pathname = 'some/pathname'
        const props = {
          ...miniProduct,
          pathname,
          isMobile: true,
        }

        const { wrapper } = renderComponent(props)
        wrapper.find('.MiniProduct-title').simulate('click', {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        })

        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(getProductRouteFromId).toHaveBeenCalledTimes(1)
        expect(getProductRouteFromId.mock.calls[0][0]).toBe(pathname)
        expect(getProductRouteFromId.mock.calls[0][1]).toBe(19411969)
      })
    })
  })
})
