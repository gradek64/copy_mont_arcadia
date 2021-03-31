import testComponentHelper from 'test/unit/helpers/test-component'
import CollectFromStore from '../CollectFromStore'

const mockedStoreList = [
  {
    brandId: 12556,
    distance: '0.16',
    latitude: 51.509599,
    longitude: -0.123069,
    name: 'Strand',
    storeId: 'TS0032',
  },
  {
    brandId: 45655,
    distance: '1.16',
    latitude: 51.439599,
    longitude: -0.123069,
    name: 'Strand 2',
    storeId: 'TS0033',
  },
  {
    brandId: 56784,
    distance: '1.56',
    latitude: 51.639599,
    longitude: -0.123069,
    name: 'Strand 3',
    storeId: 'TS0034',
  },
]
const mockStorefilters = {
  brand: {
    selected: true,
    applied: true,
  },
  other: {
    selected: true,
    applied: false,
  },
  parcel: {
    selected: false,
    applied: true,
  },
}

describe('<CollectFromStore/>', () => {
  const initialProps = {
    isMobile: false,
    stores: mockedStoreList,
    isStoresLoading: false,
    filters: mockStorefilters,
    getStoresForCheckoutModal: jest.fn(),
    selectDeliveryStore: jest.fn(),
    selectDeliveryStoreForQubit: jest.fn(),
    closeModal: jest.fn(),
    setStoreUpdating: jest.fn(),
    mapCentrePointAndZoom: {
      lat: 2,
      long: 1,
      zoom: 15,
      markers: [[1, 2], [3, 4]],
      iconDomain: 'static.brand.com',
    },
  }
  const renderComponent = testComponentHelper(
    CollectFromStore.WrappedComponent,
    { disableLifecycleMethods: false }
  )

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('when stores is empty', () => {
      expect(
        renderComponent({
          ...initialProps,
          stores: [],
        }).getTree()
      ).toMatchSnapshot()
    })
    it('should render no results message', () => {
      const { wrapper, getTree } = renderComponent(initialProps)

      wrapper.setProps({
        stores: [],
      })

      expect(getTree()).toMatchSnapshot()
    })
    it('when stores exist and getStoresLoading is true', () => {
      expect(
        renderComponent({
          ...initialProps,
          isStoresLoading: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when stores exist and getStoresLoading is false', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    describe('UNSAFE_componentWillMount', () => {
      it('should not call getStoresForCheckoutModal if storeQuery is not defined', () => {
        const { instance } = renderComponent({
          ...initialProps,
          selectedPlaceDetails: {
            storeId: 2344,
          },
        })
        expect(instance.props.getStoresForCheckoutModal).not.toHaveBeenCalled()
      })
      it('should not call getStoresForCheckoutModal if filters have already been applied ie the storeQuery type matches the filter', () => {
        const { instance } = renderComponent({
          ...initialProps,
          storeQuery: {
            types: 'brand,parcel',
          },
          selectedPlaceDetails: {
            storeId: 2344,
          },
        })
        expect(instance.props.getStoresForCheckoutModal).not.toHaveBeenCalled()
      })
      it('should not call getStoresForCheckoutModal if selectedPlaceDetails is empty', () => {
        const { instance } = renderComponent({
          ...initialProps,
          storeQuery: {
            types: 'brand',
          },
          selectedPlaceDetails: {},
        })
        expect(instance.props.getStoresForCheckoutModal).not.toHaveBeenCalled()
      })
      it('should call getStoresForCheckoutModal if storeQuery is defined and the filters have not yet been applied and selectedPlaceDetails is not empty', () => {
        const { instance } = renderComponent({
          ...initialProps,
          storeQuery: {
            types: 'brand',
          },
          selectedPlaceDetails: {
            storeId: 2344,
          },
        })
        jest.resetAllMocks()
        expect(instance.props.getStoresForCheckoutModal).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillMount()
        expect(instance.props.getStoresForCheckoutModal).toHaveBeenCalledTimes(
          1
        )
      })
    })
    describe('UNSAFE_componentWillReceiveProps', () => {
      it('should call closeModal when changing media from desktop to mobile', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        wrapper.setProps({
          isMobile: true,
        })
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('should not call closeModal when the media does not change', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        wrapper.setProps({
          isStoresLoading: true,
        })
        expect(instance.props.closeModal).not.toHaveBeenCalled()
      })
      it('should not call closeModal when the media changes to anything other than mobile', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          isMobile: true,
        })
        wrapper.setProps({
          isMobile: false,
        })
        expect(instance.props.closeModal).not.toHaveBeenCalled()
      })
    })
    describe('componentDidUpdate', () => {
      it('should update `noStoresFound` state prop when stores are fetched', () => {
        const { wrapper } = renderComponent(initialProps)

        expect(wrapper.state('noStoresFound')).toBe(false)
        wrapper.setProps({
          stores: [],
        })

        expect(wrapper.state('noStoresFound')).toBe(true)
      })
    })
    describe('componentWillUnmount', () => {
      it('should call setStoreUpdating with false', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        expect(instance.props.setStoreUpdating).not.toHaveBeenCalled()
        wrapper.unmount()
        expect(instance.props.setStoreUpdating).toHaveBeenCalledTimes(1)
        expect(instance.props.setStoreUpdating).toHaveBeenLastCalledWith(false)
      })
    })
  })

  describe('@events', () => {
    const event = {
      preventDefault: jest.fn(),
    }
    beforeEach(() => {
      jest.resetAllMocks()
    })
    describe('search form onSubmit', () => {
      it('should call getStoresForCheckoutModal() with "collectFromStore" and preventDefault', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          analyticsReceiveStores: jest.fn(),
        })
        expect(instance.props.getStoresForCheckoutModal).not.toHaveBeenCalled()
        expect(event.preventDefault).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.getStoresForCheckoutModal).toHaveBeenCalledTimes(
          1
        )
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })
    })
    describe('storelist', () => {
      it('on calling fetchStores should call getStoresForCheckoutModal() with "collectFromStore" and preventDefault', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          analyticsReceiveStores: jest.fn(),
        })
        expect(instance.props.getStoresForCheckoutModal).not.toHaveBeenCalled()
        wrapper
          .find('Connect(StoreList)')
          .getElement()
          .props.fetchStores()
        expect(instance.props.getStoresForCheckoutModal).toHaveBeenCalledTimes(
          1
        )
        expect(event.preventDefault).not.toHaveBeenCalled()
      })
      it('on calling selectDeliveryStore should call selectDeliveryStore() and closeModal()', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        const store = mockedStoreList[2]
        expect(instance.props.selectDeliveryStore).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        wrapper
          .find('Connect(StoreList)')
          .getElement()
          .props.selectDeliveryStore(store)
        expect(instance.props.selectDeliveryStore).toHaveBeenCalledTimes(1)
        expect(instance.props.selectDeliveryStore).toHaveBeenLastCalledWith(
          store
        )
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
    })
  })
})
