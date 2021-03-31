import FindInStore from './FindInStore'
import DynamicGoogleMap from '../StoreLocator/DynamicGoogleMap'
import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import { getItem } from '../../../../client/lib/cookie'

jest.mock('../../../../client/lib/cookie', () => ({
  getItem: jest.fn(() => 'TS0001'),
}))
const items = [
  {
    size: '3',
    quantity: 5,
  },
  {
    size: '4',
    quantity: 5,
  },
]

const productMock = {
  productId: 23074019,
  lineNumber: '07L04JWNA',
  colour: 'Blue',
  size: 'L',
  name: 'Name Product',
  description: 'Descri Product',
  unitPrice: '85.00',
  assets: [
    {
      assetType: 'IMAGE_SMALL',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_small.jpg',
    },
    {
      assetType: 'IMAGE_THUMB',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_thumb.jpg',
    },
  ],
  items,
  productDataQuantity: {},
}

const mockStores = [
  {
    storeId: 'TS0001',
    brandId: 12556,
    brandName: 'Topshop',
    name: 'Oxford Circus',
    distance: 0.16,
    latitude: 51.5157,
    longitude: -0.141396,
    address: {
      line1: '214 Oxford Street',
      line2: 'Oxford Circus',
      city: 'West End',
      postcode: 'W1W 8LG',
    },
    openingHours: {
      monday: '09:30-21:00',
      tuesday: '09:30-21:00',
      wednesday: '09:30-21:00',
      thursday: '09:30-21:00',
      friday: '09:30-21:00',
      saturday: '09:00-21:00',
      sunday: '11:30-18:00',
    },
    telephoneNumber: '03448 487487',
    collectFromStore: {
      standard: {
        dates: [
          {
            availableUntil: '2017-02-08 11:30:00',
            collectFrom: '2017-02-11',
          },
          {
            availableUntil: '2017-02-09 11:30:00',
            collectFrom: '2017-02-12',
          },
          {
            availableUntil: '2017-02-10 11:30:00',
            collectFrom: '2017-02-13',
          },
        ],
        price: 0,
      },
      express: {
        dates: [
          {
            availableUntil: '2017-02-08 20:30:00',
            collectFrom: '2017-02-09',
          },
          {
            availableUntil: '2017-02-09 20:30:00',
            collectFrom: '2017-02-10',
          },
          {
            availableUntil: '2017-02-10 20:30:00,',
            collectFrom: '2017-02-11',
          },
        ],
        price: 3,
      },
    },
  },
]

describe('<FindInStore />', () => {
  const props = {
    activeItem: items[0],
    closeModal: jest.fn(),
    product: productMock,
    resetStoreLocator: jest.fn(),
    setStoreStockList: jest.fn(),
    getRecentStores: jest.fn(),
    updateFindInStoreActiveItem: jest.fn(),
    viewportHeight: 500,
    setStoreCookie: jest.fn(),
    siteId: 42,
    clearFindInStoreActiveItem: jest.fn(),
    mapCentrePointAndZoom: {
      lat: 2,
      long: 1,
      zoom: 15,
      markers: [[1, 2], [3, 4]],
      iconDomain: 'static.brand.com',
    },
    initMapWhenGoogleMapsAvailable: jest.fn(),
  }

  const renderComponent = testComponentHelper(
    FindInStore.WrappedComponent.WrappedComponent
  )

  describe('@renders', () => {
    const leftColumnNode = { scrollHeight: 100 }
    describe('mobile', () => {
      it('in default state', () => {
        const renderedComponent = renderComponent({ ...props, isMobile: true })
        renderedComponent.wrapper
          .find('.FindInStore-columnLeft')
          .getElement()
          .ref(leftColumnNode)
        renderedComponent.wrapper.update()
        expect(renderedComponent.getTree()).toMatchSnapshot()
      })
      it('with stores state', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: true,
            stores: mockStores,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('renders DynamicGoogleMap', () => {
        const { wrapper } = renderComponent({
          ...props,
          isMobile: true,
        })
        expect(wrapper.find(DynamicGoogleMap)).toHaveLength(1)
      })
      it('with isStoresLoading', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: true,
            isStoresLoading: true,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with isStoresListOpen', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: true,
            isStoresListOpen: true,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with one size', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: true,
            product: {
              ...productMock,
              items: [items[0]],
            },
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with error', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...props,
          error: 'Something went wrong.',
          isMobile: true,
        })
        expect(
          getTreeFor(wrapper.find('.ProductSizes-errorMessage'))
        ).toMatchSnapshot()
      })
    })
    describe('desktop', () => {
      it('in default state', () => {
        expect(
          renderComponent({ ...props, isMobile: false }).getTree()
        ).toMatchSnapshot()
      })
      it('does not render DynamicGoogleMap', () => {
        const { wrapper } = renderComponent({
          ...props,
          isMobile: false,
        })
        expect(wrapper.find(DynamicGoogleMap)).toHaveLength(0)
      })
      it('with stores state', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: false,
            stores: mockStores,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with isStoresLoading', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: false,
            isStoresListOpen: true,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with isStoresListOpen', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: false,
            isStoresListOpen: true,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with one size', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: false,
            product: {
              ...productMock,
              items: [items[0]],
            },
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with error', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...props,
          error: 'Something went wrong.',
          isMobile: false,
        })
        expect(
          getTreeFor(wrapper.find('.ProductSizes-errorMessage'))
        ).toMatchSnapshot()
      })
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => jest.clearAllMocks())

    describe('on UNSAFE_componentWillMount', () => {
      it('should call updateFindInStoreActiveItem if activeItem is empty and productDetails is not', () => {
        const { instance } = renderComponent({
          ...props,
          activeItem: {},
          activeItemProductDetails: productMock,
        })
        instance.UNSAFE_componentWillMount()
        expect(instance.props.updateFindInStoreActiveItem).toHaveBeenCalled()
      })
      it('should not call updateFindInStoreActiveItem if activeItem and productDetails are empty', () => {
        const { instance } = renderComponent({
          ...props,
          activeItem: {},
          activeItemProductDetails: {},
        })
        instance.UNSAFE_componentWillMount()
        expect(
          instance.props.updateFindInStoreActiveItem
        ).not.toHaveBeenCalled()
      })
    })

    describe('on componentWillUnmount', () => {
      it('gets recent stores', () => {
        const { instance } = renderComponent({
          ...props,
          CFSi: true,
        })
        expect(instance.props.getRecentStores).toHaveBeenCalledTimes(1)
      })
      it('sets storeStockList to false', () => {
        const { instance } = renderComponent(props)
        expect(instance.props.setStoreStockList).not.toHaveBeenCalled()
        expect(instance.props.resetStoreLocator).not.toHaveBeenCalled()
        instance.componentWillUnmount()
        expect(instance.props.setStoreStockList).toHaveBeenCalledWith(false)
        expect(instance.props.setStoreStockList).toHaveBeenCalledTimes(1)
        expect(instance.props.resetStoreLocator).toHaveBeenCalledTimes(1)
      })
      it('should call clearFindInStoreActiveItem if activeItem is not empty', () => {
        const { instance } = renderComponent({
          ...props,
          activeItem: productMock,
        })
        instance.componentWillUnmount()
        expect(instance.props.clearFindInStoreActiveItem).toHaveBeenCalled()
      })
      it('should not call clearFindInStoreActiveItem if activeItem is empty', () => {
        const { instance } = renderComponent({
          ...props,
          activeItem: {},
        })
        instance.componentWillUnmount()
        expect(instance.props.clearFindInStoreActiveItem).not.toHaveBeenCalled()
      })
    })

    describe('on UNSAFE_componentWillReceiveProps', () => {
      it('closes Modal if screen changed from mobile to desktop and vice versa', () => {
        const { instance } = renderComponent(props)
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps({ ...props, isMobile: true })
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('not closes Modal if screen not changed from mobile to desktop and vice versa', () => {
        const { instance } = renderComponent(props)
        instance.UNSAFE_componentWillReceiveProps(props)
        expect(instance.props.closeModal).not.toHaveBeenCalled()
      })
      it('add recent stores to state', () => {
        const { instance } = renderComponent(props)
        instance.UNSAFE_componentWillReceiveProps({
          recentStores: [{ id: 'TS001', place_id: 'BLAH' }],
        })
        expect(instance.state.recent).toEqual([
          { id: 'TS001', place_id: 'BLAH' },
        ])
        instance.UNSAFE_componentWillReceiveProps({
          recentStores: [{ id: 'TS001', place_id: 'BLAH' }],
        })
        expect(instance.state.recent).toEqual([
          { id: 'TS001', place_id: 'BLAH' },
        ])
        instance.UNSAFE_componentWillReceiveProps({
          recentStores: [{ id: 'TS003', place_id: 'BLAH2' }],
        })
        expect(instance.state.recent).toEqual([
          { id: 'TS001', place_id: 'BLAH' },
          { id: 'TS003', place_id: 'BLAH2' },
        ])
      })
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it('on submit form', () => {
      const { instance, wrapper } = renderComponent({
        ...props,
        isMobile: true,
        getStoreForModal: jest.fn(),
        analyticsReceiveStores: jest.fn(),
        activeItem: productMock,
      })
      expect(instance.props.getStoreForModal).not.toHaveBeenCalled()
      wrapper.find('Form.FindInStore-search').simulate('submit')
      expect(instance.props.getStoreForModal).toHaveBeenCalledTimes(1)
      expect(instance.props.getStoreForModal).toHaveBeenCalledWith(
        'findInStore',
        productMock
      )
    })
    it('on submit form in the case of an validation error', () => {
      const { instance, wrapper } = renderComponent({
        ...props,
        isMobile: true,
        activeItem: {},
        getStoreForModal: jest.fn(),
        analyticsReceiveStores: jest.fn(),
      })
      wrapper.find('Form.FindInStore-search').simulate('submit')
      expect(instance.props.getStoreForModal).not.toHaveBeenCalled()
      expect(instance.state.shouldValidate).toBe(true)
    })
    describe('@functions', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })
      it('getRecentStoreCookie', () => {
        const { instance } = renderComponent(props)
        expect(instance.props.getRecentStores).toHaveBeenCalledTimes(0)
        instance.getRecentStoreCookie()
        expect(getItem).toHaveBeenCalledTimes(1)
        expect(instance.props.getRecentStores).toHaveBeenCalledTimes(1)
        expect(instance.props.getRecentStores).toHaveBeenCalledWith({
          search: `?storeIds=TS0001&brandPrimaryEStoreId=${props.siteId}`,
        })
      })
      it('getRecentStores with recentStores', () => {
        const { instance } = renderComponent(props)
        const nextProps = {
          recentStores: [
            {
              place_id: 'place',
              id: 'TS0001',
              description: 'des',
            },
          ],
        }
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.getRecentStores()).toMatchSnapshot()
        expect(getItem).toHaveBeenCalledTimes(1)
      })
      it('getRecentStores without recentStores', () => {
        const { instance } = renderComponent(props)
        expect(instance.getRecentStores()).toMatchSnapshot()
        expect(getItem).toHaveBeenCalledTimes(1)
      })
      it('submitHandler with no errors and product size selected', () => {
        const event = { preventDefault: jest.fn() }
        const { instance } = renderComponent({
          ...props,
          activeItem: productMock,
          getStoreForModal: jest.fn(),
          product: productMock,
        })
        instance.submitHandler(event, '')
        expect(instance.props.getStoreForModal).toHaveBeenCalledWith(
          'findInStore',
          productMock
        )
        expect(instance.state.shouldValidate).toBe(false)
      })
      it('submitHandler with product size ONE', () => {
        const event = { preventDefault: jest.fn() }
        const item = {
          ...productMock,
          items: [
            {
              ...items[0],
              size: 'ONE',
            },
          ],
        }
        const { instance } = renderComponent({
          ...props,
          activeItem: productMock,
          getStoreForModal: jest.fn(),
          product: item,
        })
        instance.submitHandler(event, '')
        expect(instance.props.getStoreForModal).toHaveBeenCalled()
        expect(instance.state.shouldValidate).toBe(false)
      })
      it('submitHandler product size not selected', () => {
        const event = { preventDefault: jest.fn() }
        const item = {
          ...productMock,
          items: [
            {
              ...items[0],
              size: '2',
            },
          ],
        }
        const { instance } = renderComponent({
          ...props,
          activeItem: productMock,
          getStoreForModal: jest.fn(),
          product: item,
        })
        instance.submitHandler(event, 'Please select your size to continue')
        expect(instance.props.getStoreForModal).not.toHaveBeenCalled()
        expect(instance.state.shouldValidate).toBe(true)
      })
      it('click on <ProductSizes/> will call updateFindInStoreActiveItem()', () => {
        const item = 'mockedItem'
        const { instance, wrapper } = renderComponent({
          ...props,
          updateFindInStoreActiveItem: jest.fn(),
        })
        expect(
          instance.props.updateFindInStoreActiveItem
        ).not.toHaveBeenCalled()
        wrapper
          .find('.FindInStore-productSizes')
          .props()
          .clickHandler(item)
        expect(
          instance.props.updateFindInStoreActiveItem
        ).toHaveBeenCalledTimes(1)
        expect(instance.props.updateFindInStoreActiveItem).toHaveBeenCalledWith(
          item
        )
      })
      it('submitHandlerCFSI', () => {
        const changeFulfilmentStore = jest.fn()
        const closeModal = jest.fn()

        const { instance } = renderComponent({
          ...props,
          changeFulfilmentStore,
          closeModal,
        })
        expect(instance.props.changeFulfilmentStore).toHaveBeenCalledTimes(0)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(0)
        instance.submitHandlerCFSI({})
        expect(instance.props.changeFulfilmentStore).toHaveBeenCalledTimes(1)
        expect(instance.props.changeFulfilmentStore).toHaveBeenCalledWith({})
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('selectRecent', () => {
        const setSelectedPlace = jest.fn()
        const resetRecentStores = jest.fn()
        const setFormField = jest.fn()

        const store = {
          description: 'des',
        }
        const { instance } = renderComponent({
          ...props,
          setSelectedPlace,
          resetRecentStores,
          setFormField,
        })
        expect(instance.props.setSelectedPlace).toHaveBeenCalledTimes(0)
        expect(instance.props.resetRecentStores).toHaveBeenCalledTimes(0)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(0)
        instance.selectRecent(store)
        expect(instance.props.setSelectedPlace).toHaveBeenCalledTimes(1)
        expect(instance.props.resetRecentStores).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)

        expect(instance.props.setSelectedPlace).toHaveBeenCalledWith(store)
        expect(instance.props.setFormField).toHaveBeenCalledWith(
          'userLocator',
          'userLocation',
          store.description
        )
      })
    })

    describe('getSizeIndex', () => {
      it('should return -1 if activeItem is empty', () => {
        const { instance } = renderComponent({
          ...props,
          activeItem: {},
        })
        expect(instance.getSizeIndex()).toBe(-1)
      })
      it('should return 1 if activeItem is is second on list', () => {
        const { instance } = renderComponent({
          ...props,
          activeItem: props.product.items[1],
        })
        expect(instance.getSizeIndex()).toBe(1)
      })
    })
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(FindInStore, 'find-in-store', {
      componentName: 'FindInStore',
      suppressPageTypeTracking: true,
      isAsync: true,
      redux: true,
    })
  })
})
