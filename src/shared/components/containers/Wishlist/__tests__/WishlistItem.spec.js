import { Link } from 'react-router'
import testComponentHelper, {
  mockLocalise,
  mockPrice,
} from '../../../../../../test/unit/helpers/test-component'
import WishlistItem from '../WishlistItem'
import Message from '../../../common/FormComponents/Message/Message'
import ProductQuickViewButton from '../../../../components/common/ProductQuickViewButton/ProductQuickViewButton'
import Button from '../../../../components/common/Button/Button'
import Select from '../../../../components/common/FormComponents/Select/Select'

const props = {
  item: {
    attributes: {
      countryExclusion: 'GB',
    },
    parentProductId: '555666',
    productImageUrl:
      'https://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/19H30IGRY_3col_F_1.jpg',
    outfitImageUrl:
      'https://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/19H30IGRY_3col_M_1.jpg',
    sourceUrl:
      'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ProductDisplay?langId=-1&storeId=12556&catalogId=33057&productId=21642083&categoryId=209987&parent_category_rn=208549',
    colour: 'GREY',
    productId: 21642083,
    catEntryId: 21642091,
    lineNumber: '19H30IGRY',
    name: 'Lightweight Knit Beanie Hat',
    shipModeId: '',
    addToBagURL:
      'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/InterestItemDelete?updatePrices=1&calculationUsageId=-1&calculationUsageId=-2&calculationUsageId=-7&langId=-1&storeId=12556&catalogId=33057&productId=21642083&catEntryId=21642091&orderId=700385209&calculateOrder=1&quantity=1.0&pageName=shoppingBag&savedItem=true&URL=OrderItemAddAjax%3fURL%3dOrderCalculate%3fURL%3dAddToBagFromIntListAjaxView',
    removeSavedItemURL:
      'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/InterestItemDelete?updatePrices=1&calculationUsageId=-1&langId=-1&storeId=12556&catalogId=33057&productId=21642083&catEntryId=21642091&orderId=700385209&calculateOrder=1&quantity=1.0&URL=InterestItemsRemoveItemAjaxView',
    size: 'ONE',
    quantity: 1,
    itemquantity: 'Quantity',
    instock: true,
    updateURL:
      'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ChangeDetailsDisplayAjaxView?orderId=700385209&langId=-1&storeId=12556&catalogId=33057&productId=21642083&catEntryId=21642091&offerPrice=9.72&size=ONE&quantity=1.0&pageName=interestItem',
    wasPrice: 12,
    unitPrice: 9.72,
    totalLabel: 'Total',
    total: '9.72',
    sizeAndQuantity: [{ catentryId: '1234', size: 'M', quantity: 10 }],
    price: {
      nowPrice: '1.00000',
      was1Price: '3.00',
      was2Price: '300.00',
    },
  },
  listItemId: 2112433,
  grid: 2,
  handleAddToBag: jest.fn(),
  handleQuickView: jest.fn(),
  handleSizeChange: jest.fn(),
  handleRemoveFromWishlist: jest.fn(),
  selectedSize: '123455',
  baseUrlPath: '/en/tsuk',
  dispatch: jest.fn(),
  sizeValidationError: false,
  handleLinkClick: jest.fn(),
  isCountryExcluded: false,
}

describe(WishlistItem.name, () => {
  const context = {
    l: jest.fn(mockLocalise),
    p: jest.fn(mockPrice),
  }
  const renderComponent = testComponentHelper(WishlistItem.WrappedComponent, {
    context,
  })
  describe('@render', () => {
    it('should render correctly', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('should render validation error message when passed validation error prop', () => {
      const component = renderComponent({ ...props, sizeValidationError: true })
      const { wrapper } = component

      expect(wrapper.find(Message)).toHaveLength(1)
      expect(component.getTree()).toMatchSnapshot()
    })
    it('should render Button as active when selectedCatEntryId is set', () => {
      const component = renderComponent({ ...props, selectedCatEntryId: '24' })

      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render Button as disabled when isCountryExcluded is set to true', () => {
      const component = renderComponent({
        ...props,
        isCountryExcluded: true,
      })
      const { wrapper } = component
      expect(wrapper.find('.WishlistItem-button').props().isDisabled).toEqual(
        true
      )
    })

    it('should render Button as active when isCountryExcluded is set to false', () => {
      const component = renderComponent({
        ...props,
        isCountryExcluded: false,
      })
      const { wrapper } = component
      expect(wrapper.find('.WishlistItem-button').props().isDisabled).toEqual(
        false
      )
    })

    it('should render the expected image when given asset props', () => {
      const assetItem = {
        ...props.item,
        assets: [
          {
            assetType: 'IMAGE_OUTFIT_THUMB',
            url: 'http://bruce.wayne/batman.jpg',
          },
          {
            assetType: 'IMAGE_OUTFIT_NORMAL',
            url: 'http://clark.kent/superman.jpg',
          },
          {
            assetType: 'IMAGE_OUTFIT_LARGE',
            url: 'http://karen.starr/powergirl.jpg',
          },
        ],
      }
      const component = renderComponent({ ...props, item: assetItem })
      const { wrapper } = component

      expect(wrapper.find('.WishlistItem-image').props().src).toEqual(
        assetItem.assets[1].url
      )
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render the expected image when given less preferred asset props', () => {
      const assetItem = {
        ...props.item,
        assets: [
          {
            assetType: 'IMAGE_OUTFIT_THUMB',
            url: 'http://bruce.wayne/batman.jpg',
          },
          {
            assetType: 'IMAGE_NORMAL',
            url: 'http://clark.kent/superman.jpg',
          },
          {
            assetType: 'IMAGE_OUTFIT_LARGE',
            url: 'http://karen.starr/powergirl.jpg',
          },
        ],
      }
      const component = renderComponent({ ...props, item: assetItem })
      const { wrapper } = component

      expect(wrapper.find('.WishlistItem-image').props().src).toEqual(
        assetItem.assets[2].url
      )
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render the expected image when given no preferred asset props', () => {
      const assetItem = {
        ...props.item,
        assets: [
          {
            assetType: 'IMAGE_THUMB',
            url: 'http://bruce.wayne/batman.jpg',
          },
          {
            assetType: 'IMAGE_NORMAL',
            url: 'http://clark.kent/superman.jpg',
          },
          {
            assetType: 'IMAGE_LARGE',
            url: 'http://karen.starr/powergirl.jpg',
          },
        ],
      }
      const component = renderComponent({ ...props, item: assetItem })
      const { wrapper } = component

      expect(wrapper.find('.WishlistItem-image').props().src).toEqual(
        assetItem.assets[0].url
      )
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render the default image when given no asset props', () => {
      const assetItem = {
        ...props.item,
        assets: [],
      }
      const component = renderComponent({ ...props, item: assetItem })
      const { wrapper } = component

      expect(wrapper.find('.WishlistItem-image').props().src).toEqual(
        props.item.outfitImageUrl
      )
      expect(component.getTree()).toMatchSnapshot()
    })

    describe('item out of stock', () => {
      const outOfStockProps = {
        ...props,
        item: {
          ...props.item,
          sizeAndQuantity: [
            { catentryId: '1234', size: 'M', quantity: 0 },
            { catentryId: '5678', size: 'L', quantity: 0 },
          ],
        },
      }
      const outOfSizeProps = {
        ...props,
        item: {
          ...props.item,
          sizeAndQuantity: [
            { catentryId: '1234', size: 'M', quantity: 0 },
            { catentryId: '5678', size: 'L', quantity: 10 },
          ],
        },
      }
      const expectedOptions = [
        {
          value: '1234',
          label: 'Size M: Out of stock',
          disabled: true,
        },
        {
          value: '5678',
          label: 'Size L',
        },
      ]

      it('should render a disabled select input', () => {
        const { wrapper } = renderComponent({ ...outOfStockProps })
        expect(
          wrapper.find('.WishlistItem-select').props().isDisabled
        ).toBeTruthy()
      })

      it('should render a <Message />', () => {
        const { wrapper } = renderComponent({ ...outOfStockProps })
        expect(wrapper.find(Message)).toHaveLength(1)
      })

      it('should not render the Add to Bag CTA', () => {
        const { wrapper } = renderComponent({ ...outOfStockProps })
        expect(wrapper.find('.WishlistItem-button')).toHaveLength(0)
      })

      it('should render individual sizes as out of stock in the select input', () => {
        const { wrapper } = renderComponent({ ...outOfSizeProps })
        expect(wrapper.find('.WishlistItem-select').props().options).toEqual(
          expectedOptions
        )
      })
    })

    describe('when there are products with only one size', () => {
      it('should assign an empty string to the firstDisabled prop on the Select component', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(Select).prop('firstDisabled')).toBe('')
      })
    })
  })

  describe('WishlistItem interaction', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const expectButtonText = (wrapper, text) => {
      expect(
        wrapper
          .find(Button)
          .render()
          .text()
      ).toBe(text)
    }

    const expectButtonAfterClick = (
      wrapper,
      { text = null, isDisabled = null, ellipsisLength = null }
    ) => {
      wrapper
        .find(Button)
        .first()
        .prop('clickHandler')()
      wrapper.update()

      if (text !== null) {
        expectButtonText(wrapper, text)
      }

      if (isDisabled !== null) {
        const expectation = expect(
          wrapper
            .find(Button)
            .render()
            .prop('disabled')
        )
        if (isDisabled) {
          expectation.toBeTruthy()
        } else {
          expectation.toBeFalsy()
        }
      }

      if (ellipsisLength !== null) {
        expect(
          wrapper
            .find(Button)
            .first()
            .find('.ellipsis').length
        ).toBe(ellipsisLength)
      }
    }

    it('clicking the quick view item calls the `handleQuickView` function with the appropriate arguments', () => {
      const { wrapper } = renderComponent(props)
      wrapper.find(ProductQuickViewButton).simulate('click')

      expect(props.handleQuickView).toHaveBeenCalledWith(
        props.item.parentProductId
      )
    })

    it('clicking the addToBag button calls the `handleAddToBag` function with the appropriate arguments', () => {
      const { wrapper } = renderComponent(props)
      wrapper
        .find('.WishlistItem-button')
        .dive()
        .simulate('click')

      expect(props.handleAddToBag).toHaveBeenCalledWith(
        undefined,
        props.item.parentProductId,
        {
          price: mockPrice(props.item.price.nowPrice, true).value,
          lineNumber: props.item.lineNumber,
        }
      )
    })
    it('clicking button (CTA) "Add to Bag" should change button from "Add to bag" to "Adding to bag"', () => {
      const clickProps = {
        ...props,
        isAddingToBag: { item: '555666', loading: true },
      }
      const { wrapper } = renderComponent(clickProps)
      wrapper
        .find('.WishlistItem-button')
        .dive()
        .simulate('click')

      expectButtonText(wrapper, 'Adding to bag')
      expectButtonAfterClick(wrapper, {
        text: 'Adding to bag',
        ellipsisLength: 1,
        isDisabled: true,
      })
    })
    it('By default the (CTA) "Add to bag" button should not display "Adding to bag" or show elipsis span', () => {
      const clickProps = {
        ...props,
      }
      const { wrapper } = renderComponent(clickProps)
      wrapper
        .find('.WishlistItem-button')
        .dive()
        .simulate('click')

      expectButtonAfterClick(wrapper, {
        text: 'Add to bag',
        ellipsisLength: 0,
        isDisabled: false,
      })
    })
    it('When clicking "Add to bag", it should display "Adding to bag" and go back to default "Add to bag"', () => {
      const clickProps = {
        ...props,
        isAddingToBag: { item: '555666', loading: true },
      }
      const { wrapper } = renderComponent(clickProps)
      wrapper
        .find('.WishlistItem-button')
        .dive()
        .simulate('click')

      expectButtonText(wrapper, 'Adding to bag')

      expectButtonAfterClick(wrapper, {
        text: 'Adding to bag',
        ellipsisLength: 1,
        isDisabled: true,
      })

      expect(
        renderComponent({ ...props })
          .wrapper.find(Button)
          .render()
          .text()
      ).toBe('Add to bag')
    })

    it('clicking the remove button calls the `handleRemoveFromWishlist` function with the appropriate arguments', () => {
      const { wrapper } = renderComponent(props)
      wrapper.find('.WishlistItem-remove').simulate('click')

      expect(props.handleRemoveFromWishlist).toHaveBeenCalledWith(
        props.item.parentProductId,
        { price: '1.00', lineNumber: '19H30IGRY' }
      )
    })

    it('should call the `handleLinkClick` function when clicking the product image', () => {
      const { wrapper } = renderComponent(props)
      wrapper
        .find(Link)
        .first()
        .simulate('click')
      expect(props.handleLinkClick).toHaveBeenCalledTimes(1)
    })

    it('should call the `handleLinkClick` function when clicking the product title', () => {
      const { wrapper } = renderComponent(props)
      wrapper
        .find(Link)
        .last()
        .simulate('click')
      expect(props.handleLinkClick).toHaveBeenCalledTimes(1)
    })
  })
})
