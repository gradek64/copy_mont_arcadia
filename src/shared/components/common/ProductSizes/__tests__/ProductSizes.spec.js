import React from 'react'

import testComponentHelper from 'test/unit/helpers/test-component'
import ProductSizes from '../ProductSizes'
import { analyticsPdpClickEvent } from '../../../../analytics/tracking/site-interactions'

jest.mock('../../../../analytics/tracking/site-interactions', () => ({
  analyticsPdpClickEvent: jest.fn(),
}))

jest.mock('../../../../actions/common/productsActions')

describe('ProductSizes', () => {
  const renderComponent = testComponentHelper(ProductSizes.WrappedComponent)

  const itemInStock = {
    sku: '608',
    size: '4',
    quantity: 10,
  }
  const itemLowStock = {
    sku: '608',
    size: '5',
    quantity: 1,
  }
  const itemOos = {
    sku: '609',
    size: '6',
    quantity: 0,
  }
  const itemLongSize = {
    sku: '609',
    size: 'Size 6 years',
    quantity: 1,
  }

  const initialProps = {
    items: [itemInStock, itemOos],
    activeItem: {},
    maximumNumberOfSizeTiles: 8,
    enableDropdownForLongSizes: false,
    getProductStock: jest.fn(),
  }

  function createOssItems() {
    const outOfStockArr = [1, 2, 3, 4, 5, 6, 7].reduce((acc, val) => {
      acc.push({
        sku: `11${val}`,
        size: `1${val}`,
        quantity: 0,
      })

      return acc
    }, [])

    return outOfStockArr
  }

  describe('@renders', () => {
    it('set default props', () => {
      const defaultPropsComp = renderComponent(initialProps).instance.props
      expect(defaultPropsComp).toMatchSnapshot()
    })

    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with label', () => {
      expect(
        renderComponent({ ...initialProps, label: 'myLabel' }).getTree()
      ).toMatchSnapshot()
    })

    it('with className', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'Super-Classname',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with notifyEmail', () => {
      expect(
        renderComponent({ ...initialProps, notifyEmail: true }).getTree()
      ).toMatchSnapshot()
    })

    it('with notifyEmail in forced select mode', () => {
      expect(
        renderComponent({
          ...initialProps,
          activeItem: initialProps.items[0],
          forceToUseSelect: true,
          label: 'my beautiful label',
          notifyEmail: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with quickview out of stock', () => {
      expect(
        renderComponent({
          ...initialProps,
          showOutOfStockLabel: true,
          items: [itemOos],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with quickview item available', () => {
      expect(
        renderComponent({
          ...initialProps,
          showOutOfStockLabel: true,
          items: [itemInStock],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with activeItem is in list of items', () => {
      expect(
        renderComponent({
          ...initialProps,
          activeItem: initialProps.items[0],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with showOosOnly=true', () => {
      expect(
        renderComponent({ ...initialProps, showOosOnly: true }).getTree()
      ).toMatchSnapshot()
    })

    it('with forceToUseSelect=true', () => {
      expect(
        renderComponent({
          ...initialProps,
          activeItem: initialProps.items[0],
          forceToUseSelect: true,
          label: 'my beautiful label',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with 8 items or more', () => {
      expect(
        renderComponent({
          ...initialProps,
          items: [
            itemInStock,
            itemLowStock,
            itemOos,
            itemInStock,
            itemLowStock,
            itemOos,
            itemInStock,
            itemInStock,
          ],
          activeItem: initialProps.items[0],
          forceToUseSelect: true,
          label: 'my beautiful label',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with maxSwatches greater than items length, should display dropdown', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        items: [1, 2, 3, 4],
        maximumNumberOfSizeTiles: 3,
      })
      expect(wrapper.find('.ProductSizes--dropdown')).toHaveLength(1)
      expect(wrapper.find('.ProductSizes-button')).toHaveLength(0)
    })

    it('with maxSwatches less than items length, should display dropdown', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        items: [1, 2, 3, 4],
        maximumNumberOfSizeTiles: 6,
      })
      expect(wrapper.find('.ProductSizes--dropdown')).toHaveLength(0)
      expect(wrapper.find('.ProductSizes-button').length).toBeGreaterThan(0)
    })

    it('with showOutOfStockLabel=false', () => {
      expect(
        renderComponent({
          ...initialProps,
          showOutOfStockLabel: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with showLowStockLabel=false', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'Super-Classname',
          items: [itemInStock, itemLowStock],
          showLowStockLabel: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with showOutOfStockLabel=false and select mode with itemOos', () => {
      expect(
        renderComponent({
          ...initialProps,
          activeItem: initialProps.items[0],
          forceToUseSelect: true,
          showOutOfStockLabel: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with showLowStockLabel=false and select mode', () => {
      expect(
        renderComponent({
          ...initialProps,
          activeItem: initialProps.items[0],
          items: [itemInStock, itemLowStock],
          forceToUseSelect: true,
          showLowStockLabel: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with enableOutOfStockSelectedItems=true and select mode items should not be disabled', () => {
      expect(
        renderComponent({
          ...initialProps,
          forceToUseSelect: true,
          enableOutOfStockSelectedItems: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has no product items', () => {
      expect(
        renderComponent({
          ...initialProps,
          items: undefined,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has empty array of products', () => {
      expect(
        renderComponent({
          ...initialProps,
          items: [],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has hideIfOSS of true and all products are out of stock', () => {
      expect(
        renderComponent({
          ...initialProps,
          hideIfOSS: true,
          items: createOssItems(),
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has hideIfOSS of false and all products are out of stock', () => {
      expect(
        renderComponent({
          ...initialProps,
          hideIfOSS: false,
          items: createOssItems(),
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has productSizeLabelClass', () => {
      expect(
        renderComponent({
          ...initialProps,
          label: 'my beautiful label',
          productSizeLabelClass: 'lovely--classname',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has notifyEmail but showOosOnly is false', () => {
      expect(
        renderComponent({
          ...initialProps,
          notifyEmail: true,
          showOosOnly: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with error', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        error: 'Sample error',
      })
      expect(
        getTreeFor(wrapper.find('.ProductSizes-errorMessage'))
      ).toMatchSnapshot()
    })

    it('with size guide button', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sizeGuideButton: <div className="size-guide-button" />,
      })
      expect(wrapper.find('.size-guide-button')).toHaveLength(1)
    })
  })

  describe('@instance methods', () => {
    describe('shouldHideSizes', () => {
      it('should return false when hideIfOSS is false', () => {
        const { instance } = renderComponent({
          ...initialProps,
          hideIfOSS: false,
          items: createOssItems(),
        })

        expect(instance.shouldHideSizes()).toBe(false)
      })
      it('should return false  when hideIfOSS is true  but any product has stock', () => {
        const { instance } = renderComponent({
          ...initialProps,
          hideIfOSS: true,
        })
        expect(instance.shouldHideSizes()).toBe(false)
      })

      it('should return true when hideIfOSS is true and no product have stock', () => {
        const { instance } = renderComponent({
          ...initialProps,
          hideIfOSS: true,
          items: createOssItems(),
        })
        expect(instance.shouldHideSizes()).toBe(true)
      })
    })

    describe('hasItemsBiggerSizes', () => {
      it('should return true when item size has more than 2 chars and enableDropdownForLongSizes is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          enableDropdownForLongSizes: true,
          items: [itemLongSize, itemInStock],
        })
        expect(instance.hasItemsBiggerSizes()).toBe(true)
      })
      it('should return false when item size has more than 2 chars and enableDropdownForLongSizes is false', () => {
        const { instance } = renderComponent({
          ...initialProps,
          enableDropdownForLongSizes: false,
          items: [itemLongSize, itemInStock],
        })
        expect(instance.hasItemsBiggerSizes()).toBe(false)
      })
      it('should return false when item size has less than 2  and enableDropdownForLongSizes is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          enableDropdownForLongSizes: true,
          items: [itemInStock],
        })
        expect(instance.hasItemsBiggerSizes()).toBe(false)
      })
    })

    describe('createClassNamesForList', () => {
      it('should return correct classes when showOosOnly is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          showOosOnly: true,
        })

        expect(instance.createClassNamesForList()).toBe(
          'ProductSizes-list ProductSizes-list--oosOnly'
        )
      })

      it('should return correct classes when showOosOnly is false and notifyEmail is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          showOosOnly: false,
          notifyEmail: true,
        })

        expect(instance.createClassNamesForList()).toBe(
          'ProductSizes-list ProductSizes-list--emailStock'
        )
      })

      it('should return correct classes when showOosOnly is false and notifyEmail is false', () => {
        const { instance } = renderComponent({
          ...initialProps,
          showOosOnly: false,
          notifyEmail: false,
        })

        expect(instance.createClassNamesForList()).toBe('ProductSizes-list')
      })
    })
  })

  describe('@events', () => {
    describe('onClick button', () => {
      beforeEach(() => jest.resetAllMocks())

      it('calls props clickHandler', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          clickHandler: jest.fn(),
        })
        expect(instance.props.clickHandler).not.toBeCalled()
        wrapper
          .find('.ProductSizes-button')
          .first()
          .simulate('click')

        expect(instance.props.clickHandler).toHaveBeenCalledTimes(1)
        expect(instance.props.clickHandler).lastCalledWith(
          initialProps.items[0]
        )
      })

      it('calls onSelectSize if clickHandler is not defined and item is in stock', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          onSelectSize: jest.fn(),
          updateSelectedOosItem: jest.fn(),
        })
        const { onSelectSize, updateSelectedOosItem } = instance.props
        expect(onSelectSize).not.toBeCalled()
        expect(updateSelectedOosItem).not.toBeCalled()
        wrapper
          .find('.ProductSizes-button')
          .first()
          .simulate('click')

        expect(updateSelectedOosItem).not.toBeCalled()
        expect(onSelectSize).toHaveBeenCalledTimes(1)
        expect(onSelectSize).lastCalledWith(initialProps.items[0])
      })

      it('calls updateSelectedOosItem if clickHandler is not defined and  item in stock and notifyEmail=true', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          clickHandler: undefined,
          items: [itemOos, itemInStock],
          notifyEmail: true,
          onSelectSize: jest.fn(),
          updateSelectedOosItem: jest.fn(),
        })
        const { onSelectSize, updateSelectedOosItem } = instance.props
        expect(onSelectSize).not.toBeCalled()
        expect(updateSelectedOosItem).not.toBeCalled()

        wrapper
          .find('.ProductSizes-button')
          .first()
          .simulate('click')
        expect(onSelectSize).not.toBeCalled()
        expect(updateSelectedOosItem).toHaveBeenCalledTimes(1)
        expect(updateSelectedOosItem).lastCalledWith(instance.props.items[0])
      })
    })
    describe('select onChange', () => {
      beforeEach(() => jest.resetAllMocks())

      it('calls props clickHandler', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          forceToUseSelect: true,
          clickHandler: jest.fn(),
        })
        expect(instance.props.clickHandler).not.toBeCalled()
        wrapper.find('.ProductSizes-sizes').simulate('change', {
          target: { value: instance.props.items[0].size },
        })

        expect(instance.props.clickHandler).toHaveBeenCalledTimes(1)
        expect(instance.props.clickHandler).lastCalledWith(
          initialProps.items[0]
        )
        expect(analyticsPdpClickEvent).toHaveBeenCalledWith(
          `productsize-${instance.props.items[0].size}`
        )
      })

      it('calls onSelectSize if clickHandler is not defined and item is in stock', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          forceToUseSelect: true,
          onSelectSize: jest.fn(),
          updateSelectedOosItem: jest.fn(),
        })
        const { onSelectSize, updateSelectedOosItem } = instance.props
        expect(onSelectSize).not.toBeCalled()
        expect(updateSelectedOosItem).not.toBeCalled()
        wrapper.find('.ProductSizes-sizes').simulate('change', {
          target: { value: instance.props.items[0].size },
        })

        expect(updateSelectedOosItem).not.toBeCalled()
        expect(onSelectSize).toHaveBeenCalledTimes(1)
        expect(onSelectSize).lastCalledWith(initialProps.items[0])
      })

      it('calls updateSelectedOosItem if clickHandler is not defined and  item in stock and notifyEmail=true', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          forceToUseSelect: true,
          items: [itemOos, itemInStock],
          notifyEmail: true,
          onSelectSize: jest.fn(),
          updateSelectedOosItem: jest.fn(),
        })
        const { onSelectSize, updateSelectedOosItem } = instance.props
        expect(onSelectSize).not.toBeCalled()
        expect(updateSelectedOosItem).not.toBeCalled()

        wrapper.find('.ProductSizes-sizes').simulate('change', {
          target: { value: instance.props.items[0].size },
        })
        expect(onSelectSize).not.toBeCalled()
        expect(updateSelectedOosItem).toHaveBeenCalledTimes(1)
        expect(updateSelectedOosItem).lastCalledWith(instance.props.items[0])
      })
    })
  })
})
