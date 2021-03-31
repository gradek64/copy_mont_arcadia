import testComponentHelper from 'test/unit/helpers/test-component'

import { WrappedBundlesAddAll } from '../BundlesAddAll'
import AddToBag from '../../AddToBag/AddToBag'

describe('<BundlesAddAll />', () => {
  const skus = {
    29752415: '602017001154369',
    29750936: '602017001154351',
  }
  const requiredProps = {
    productId: 29434263,
    bundleProductIds: [29752415, 29750936],
    setFormMessage: () => {},
    bundleProducts: [],
  }
  const renderComponent = testComponentHelper(WrappedBundlesAddAll)

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should pass the bundle items as the `bundleItems` prop to <AddToBag />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        selectedSKUs: skus,
      })
      expect(wrapper.find(AddToBag).prop('bundleItems')).toEqual([
        {
          productId: 29752415,
          sku: '602017001154369',
        },
        {
          productId: 29750936,
          sku: '602017001154351',
        },
      ])
    })

    it('should pass the number of bundle items as the `quantity` prop to <AddToBag />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        selectedSKUs: skus,
      })
      expect(wrapper.find(AddToBag).prop('quantity')).toBe(2)
    })

    it('should pass `deliveryMessage` prop to <AddToBag />', () => {
      const deliveryMessage = 'Order in 9 hrs 23 mins for next day delivery'
      const { wrapper } = renderComponent({
        ...requiredProps,
        deliveryMessage,
      })
      expect(wrapper.find(AddToBag).prop('message')).toBe(deliveryMessage)
    })

    it('should pass `catEntryId` prop to <AddToBag /> if isFeatureAddItemV3 is enabled', () => {
      const expectedBundleItems = [
        {
          catEntryId: 234567,
          productId: 29752415,
          sku: '602017001154369',
        },
        {
          catEntryId: 94949494,
          productId: 29750936,
          sku: '602017001154351',
        },
      ]
      const { wrapper } = renderComponent({
        ...requiredProps,
        selectedSKUs: skus,
        bundleProducts: [
          {
            items: [
              {
                catEntryId: 234567,
                sku: '602017001154369',
              },
            ],
          },
          {
            items: [
              {
                catEntryId: 94949494,
                sku: '602017001154351',
              },
            ],
          },
        ],
      })

      expect(wrapper.find(AddToBag).prop('bundleItems')).toMatchObject(
        expectedBundleItems
      )
    })
  })

  describe('@events', () => {
    describe('on shouldAddToBag', () => {
      it('should return `true` if all bundle products have a selected sku', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          selectedSKUs: skus,
        })
        expect(wrapper.find(AddToBag).prop('shouldAddToBag')()).toBe(true)
      })

      describe('if not all bundle products have a selected sku', () => {
        it('should not return `true`', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            selectedSKUs: {
              29752415: '602017001154369',
            },
            scrollToElement: () => {},
          })
          expect(wrapper.find(AddToBag).prop('shouldAddToBag')()).not.toBe(true)
        })

        it('should call `setFormMessage` for each unselected bundle product', () => {
          const setFormMessageMock = jest.fn()
          const { wrapper } = renderComponent({
            ...requiredProps,
            selectedSKUs: {
              29752415: '602017001154369',
            },
            setFormMessage: setFormMessageMock,
            scrollToElement: () => {},
          })
          wrapper.find(AddToBag).prop('shouldAddToBag')()
          expect(setFormMessageMock).toHaveBeenCalledWith(
            'bundlesAddToBag',
            'Please select your size to continue',
            29750936
          )
        })

        it('should scroll to first failing bundle product', () => {
          const element = {}
          const getElementMock = jest.fn(() => element)
          const scrollToElementMock = jest.fn()
          const { wrapper } = renderComponent({
            ...requiredProps,
            selectedSKUs: {
              29752415: '602017001154369',
            },
            getElement: getElementMock,
            scrollToElement: scrollToElementMock,
          })
          wrapper.find(AddToBag).prop('shouldAddToBag')()
          expect(getElementMock).toHaveBeenCalledWith(
            '[data-product-id="29750936"]'
          )
          expect(scrollToElementMock).toHaveBeenCalledWith(element, 400, 200)
        })
      })
    })
  })
})
