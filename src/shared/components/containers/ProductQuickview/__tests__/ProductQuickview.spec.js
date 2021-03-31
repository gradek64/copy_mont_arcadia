import { clone } from 'ramda'

import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import productMock from 'test/mocks/product-detail'

import ProductQuickview from '../ProductQuickview'
import ProductSizes from '../../../common/ProductSizes/ProductSizes'
import AddToBag from '../../../common/AddToBag/AddToBag'
import FitAttributes from '../../../common/FitAttributes/FitAttributes'
import ProductMedia from '../../../common/ProductMedia/ProductMedia'
import FreeShippingMessage from '../../../common/FreeShippingMessage/FreeShippingMessage'

describe('<ProductQuickview />', () => {
  const renderComponent = testComponentHelper(
    ProductQuickview.WrappedComponent.WrappedComponent
  )
  const initialProps = {
    activeItem: {
      sku: '602016000925078',
      size: '4',
      quantity: 0,
      selected: false,
      wcsSizeADValueId: '4',
    },
    getQuickViewProduct: jest.fn(),
    product: {
      productId: 26942270,
      grouping: 'WL158836130',
      lineNumber: '158836130',
      isDDPProduct: true,
      colour: 'Blk/Wht',
      name: 'Monochrome Crochet Lace Shift Dress',
      description: 'one description',
      unitPrice: '55.00',
      sourceUrl: '/product/monochrome',
      attributes: {},
      assets: [{ assetType: 'IMAGE_SMALL' }, { assetType: 'IMAGE_LARGE' }],
      items: [
        {
          attrName: '226334388',
          attrValue: 'XS',
          attrValueId: 300783716,
          catEntryId: 35567608,
          quantity: 10,
          selected: false,
          size: 'XS',
          sizeMapping: 'XS',
          sku: '602019001338810',
          stockText: 'In stock',
        },
        {
          attrName: '226334388',
          attrValue: 'M',
          attrValueId: 300783261,
          catEntryId: 35570700,
          quantity: 10,
          selected: false,
          size: 'M',
          sizeMapping: 'M',
          sku: '602019001338812',
          stockText: 'In stock',
        },
      ],
    },
    productId: 26942270,
    toggleModal: jest.fn(),
    pathname: '/search',
    showItemError: false,
    updateQuickviewShowItemsError: () => {},
    maximumNumberOfSizeTiles: 8,
    enableSizeGuideButtonAsSizeTile: false,
    updateQuickViewActiveItem: jest.fn(),
    captureWishlistEvent: jest.fn(),
  }
  const wrongProduct = {
    productId: 'notTheSameId',
  }

  describe('@decorators', () => {
    analyticsDecoratorHelper(ProductQuickview, 'product-quick-view', {
      isAsync: true,
      suppressPageTypeTracking: true,
      redux: true,
      componentName: 'ProductQuickview',
    })
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('in loading state', () => {
      const newProps = {
        ...initialProps,
        product: wrongProduct,
      }
      expect(renderComponent(newProps).getTree()).toMatchSnapshot()
    })

    it('with no items/outOfStock', () => {
      const newProps = {
        ...initialProps,
        product: {
          ...initialProps.product,
          attributes: { notifyMe: 'Y' },
        },
      }
      expect(renderComponent(newProps).getTree()).toMatchSnapshot()
    })

    it('with select size error', () => {
      const newProps = {
        ...initialProps,
        product: {
          ...initialProps.product,
          attributes: { notifyMe: 'Y' },
          items: productMock.items,
        },
        showItemError: true,
      }
      expect(renderComponent(newProps).getTree()).toMatchSnapshot()
    })

    it('in ratingValue=3 state', () => {
      const newProps = {
        ...initialProps,
        product: {
          ...initialProps.product,
          ratingValue: 3,
        },
      }
      expect(renderComponent(newProps).getTree()).toMatchSnapshot()
    })

    it('should return `AddToBag` if the products have items', () => {
      const props = clone({
        ...initialProps,
      })
      props.product.attributes = {}
      props.product.items = [{ quantity: 1 }]
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(AddToBag).exists()).toBe(true)
    })

    it("shouldn't render 'AddToBag' if there are no items", () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        product: {
          ...initialProps.product,
          items: [],
        },
      })

      wrapper.update()

      expect(wrapper.find(AddToBag).exists()).toBe(false)
    })

    it('should render trimmed product description', () => {
      const productWithDescription = {
        ...initialProps.product,
        description:
          '&lt;p&gt;This multi-coloured midi dress screams statement style. The perfect way to turn heads this summer, our cold shoulder frock has frilled trims and a clashing print throughout thats bound to get compliments. The perfect day-to-night choice, wear yours with flats or heels.&lt;/p&gt; &lt;ul&gt; &lt;li&gt;Cold shoulder style&lt;/li&gt; &lt;li&gt;Midi length&lt;/li&gt; &lt;li&gt;A-line fit&lt;/li&gt; &lt;li&gt;Elasticated waist&lt;/li&gt; &lt;li&gt;Wearing length: 95cm&lt;/li&gt; &lt;li&gt;Fabric: 100% viscose&lt;/li&gt; &lt;li&gt;Care: machine washable&lt;/li&gt; &lt;li&gt;Model is 5&#x27;9 (175.2cm) and wears a size 8&lt;/li&gt;&lt;/ul&gt;',
      }
      expect(
        renderComponent({
          ...initialProps,
          product: productWithDescription,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should add FitAttributes if tmpLinks present', () => {
      const fitAttrs = [
        {
          catentryId: '20434610',
          TPMName: 'Tall',
          isTPMActive: true,
          TPMUrl: '/en/tsuk/product/moto-star-stud-denim-borg-jacket-7196268',
        },
        {
          catentryId: '20906473',
          TPMName: 'Petite',
          isTPMActive: false,
          TPMUrl: '/en/tsuk/product/moto-knot-tie-jumpsuit-7178618',
        },
      ]
      const { wrapper } = renderComponent({
        ...initialProps,
        product: {
          ...initialProps.product,
          tpmLinks: [fitAttrs],
        },
      })
      expect(wrapper.find(FitAttributes).exists()).toBe(true)
      expect(wrapper.find(FitAttributes).prop('fitAttributes')).toBe(fitAttrs)
      expect(wrapper.find(FitAttributes).prop('isQuickview')).toBe(true)
    })

    it('with size dropdown', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        product: { ...initialProps.product, items: [1, 2, 3, 4, 5] },
        maximumNumberOfSizeTiles: 3,
      })
      expect(wrapper.find(ProductSizes).prop('className')).toBe(
        'ProductSizes--pdp ProductSizes--sizeGuideDropdown'
      )
    })

    it('with size guide as size tile', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        enableSizeGuideButtonAsSizeTile: true,
      })
      expect(wrapper.find(ProductSizes).prop('className')).toBe(
        'ProductSizes--pdp ProductSizes--sizeGuideButtonAsSizeTile'
      )
    })

    it('with Amplience image URLs', () => {
      const amplienceAssets = ['url1', 'url2', 'url3']
      const props = {
        ...initialProps,
        product: {
          ...initialProps.product,
          amplienceAssets,
        },
      }
      const { wrapper } = renderComponent(props)

      const productMedia = wrapper.find(ProductMedia)
      expect(productMedia).toHaveLength(1)
      expect(productMedia.prop('amplienceAssets')).toBe(amplienceAssets)
    })

    it('should render <FreeShippingMessage> if feature flag active', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isThresholdEnabled: true,
      })

      const FreeShippingNode = wrapper.find(FreeShippingMessage)
      expect(FreeShippingNode.exists()).toBeTruthy()
    })
  })

  describe('@lifecycle', () => {
    const introNode = { focus: jest.fn() }
    let renderedComponent
    beforeEach(() => {
      jest.resetAllMocks()
      renderedComponent = renderComponent(initialProps)
    })

    describe('on UNSAFE_componentWillMount', () => {
      it('calls getQuickViewProduct()', () => {
        const { instance } = renderedComponent
        expect(instance.props.getQuickViewProduct).lastCalledWith({
          identifier: initialProps.productId,
        })
        expect(instance.props.getQuickViewProduct).toHaveBeenCalledTimes(1)
      })
    })

    describe('on componentDidMount', () => {
      it('calls intro.focus() if its the right product', () => {
        const { wrapper, instance } = renderedComponent
        wrapper
          .find('AccessibleText')
          .getElement()
          .ref(introNode)
        expect(instance.intro.focus).not.toBeCalled()
        instance.componentDidMount()
        expect(instance.intro.focus).toHaveBeenCalledTimes(1)
      })
      it('does nothing if its the wrong product', () => {
        const newProps = {
          ...initialProps,
          product: wrongProduct,
        }
        const { instance } = renderComponent(newProps)
        instance.componentDidMount()
        expect(introNode.focus).not.toBeCalled()
      })
    })

    describe('on UNSAFE_componentWillReceiveProps', () => {
      beforeEach(() => jest.resetAllMocks())
      it('calls getQuickViewProduct() if productId changed', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.setProps({ productId: 12 })
        expect(instance.props.getQuickViewProduct).lastCalledWith({
          identifier: 12,
        })
      })
      it('does nothing if productId is the same than before', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.setProps({ productId: initialProps.productId })
        expect(instance.props.getQuickViewProduct).not.toBeCalled()
      })
    })

    describe('on componentDidUpdate', () => {
      it('calls intro.focus() if productId changed', () => {
        const { wrapper, instance } = renderedComponent
        wrapper
          .find('AccessibleText')
          .getElement()
          .ref(introNode)
        expect(instance.intro.focus).not.toBeCalled()
        instance.componentDidUpdate({ productId: 12 })
        expect(instance.intro.focus).toHaveBeenCalledTimes(1)
      })
      it('does nothing if its the wrong product', () => {
        const newProps = {
          ...initialProps,
          product: wrongProduct,
        }
        const { instance } = renderComponent(initialProps)
        instance.componentDidUpdate(newProps)
        expect(introNode.focus).not.toBeCalled()
      })
    })
    describe('on componentWillUnmount', () => {
      it('should call updateQuickViewActiveItem', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        expect(instance.props.updateQuickViewActiveItem).not.toHaveBeenCalled()
        wrapper.unmount()
        expect(instance.props.updateQuickViewActiveItem).toHaveBeenCalledTimes(
          1
        )
      })
    })
  })

  describe('@events', () => {
    describe('on Select swatches', () => {
      const setProductIdQuickview = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        setProductIdQuickview,
      })

      expect(setProductIdQuickview).not.toBeCalled()

      wrapper
        .find('Swatches')
        .simulate('select', new Event('select'), { productId: 123 })

      expect(setProductIdQuickview).lastCalledWith(123)
    })

    describe('on shouldAddToBag', () => {
      it('should return `true` if `activeItem` has an `sku`', () => {
        const props = clone({
          ...initialProps,
        })
        props.product.attributes = {}
        props.product.items = [{ quantity: 1 }]
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(AddToBag).prop('shouldAddToBag')()).toBe(true)
      })

      it('should call `updateQuickviewShowItemsError` if `activeItem` doesn‘t have an `sku`', () => {
        const updateShowItemsErrorMock = jest.fn()
        const props = clone({
          ...initialProps,
          activeItem: {},
          updateQuickviewShowItemsError: updateShowItemsErrorMock,
        })
        props.product.attributes = {}
        props.product.items = [{ quantity: 1 }]
        const { wrapper } = renderComponent(props)
        wrapper.find(AddToBag).prop('shouldAddToBag')()
        expect(updateShowItemsErrorMock).toHaveBeenCalled()
      })
    })

    describe('updateWishlist in AddToBag', () => {
      it('if fromWishlist is false (default), updateWishlist function should be undefined', () => {
        const { instance } = renderComponent({
          ...initialProps,
        })

        const comp = instance.renderAddToBag()

        expect(comp.props.updateWishlist).toBeNull()
      })

      it('if fromWishlist is true, updateWishlist should be a function', () => {
        const { instance } = renderComponent({
          ...initialProps,
          fromWishlist: true,
        })

        const comp = instance.renderAddToBag()

        expect(typeof comp.props.updateWishlist).toEqual('function')
      })
    })

    describe('triggerWishlistEvent()', () => {
      const { instance } = renderComponent({
        ...initialProps,
      })

      const productDetails = {
        price: '1.00',
        productId: 12345,
        lineNumber: '0FENJI23748',
      }

      instance.triggerWishlistEvent(productDetails)()

      expect(instance.props.captureWishlistEvent).toHaveBeenCalledWith(
        'GA_ADD_TO_BAG_FROM_WISHLIST',
        productDetails
      )
    })
  })
})
