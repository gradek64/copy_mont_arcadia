import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import FulfilmentInfo from './FulfilmentInfo'
import { getFulfilmentDetails } from '../../../lib/get-delivery-days/get-fulfilments'

jest.mock('../../../lib/get-delivery-days/get-fulfilments', () => ({
  getFulfilmentDetails: jest.fn(),
}))

describe('<FulfilmentInfo />', () => {
  const brandName = 'Topshop'
  const name = 'Oxford Circus'
  const props = {
    brandName: 'topshop',
    siteId: 12556,
    activeProduct: {
      catEntryId: 1234,
      sku: '43234',
      quantity: 1,
      inventoryPositions: {
        inventorys: [
          { cutofftime: '2359', expressdates: ['03-28-2017', '03-28-2017'] },
        ],
      },
    },
    getFindInStoreButton: jest.fn((params) => (
      <a // eslint-disable-line jsx-a11y/href-no-hash
        className="ProductDetail-findInStoreButton"
        href="#"
      >
        {params.text}
      </a>
    )),
    getSelectedStoreIdFromCookie: jest.fn(),
    getFulfilmentStore: jest.fn(),
  }
  const selectedStore = {
    brandName,
    name,
    cfsiAvailableOn: new Date().toDateString(),
  }
  const milliseconds = new Date().getTime() + 60 * 60 * 1000
  // 1 hour from now
  const hours = new Date(milliseconds).getHours()
  selectedStore.cfsiPickCutOffTime = `${hours}:30`

  const renderComponent = testComponentHelper(FulfilmentInfo.WrappedComponent, {
    disableLifecycleMethods: true,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    getFulfilmentDetails.mockReturnValue({
      CFSiDay: 'today',
      expressDeliveryDay: 'Tuesday',
      parcelCollectDay: 'Tuesday',
    })
  })

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
    it('with selected store', () => {
      const { getTree } = renderComponent({ ...props, selectedStore })
      expect(getTree()).toMatchSnapshot()
    })
    it('with selectedStoreSKU not matches activeSku and state.calledStoreSearch is false', () => {
      const { wrapper, instance } = renderComponent({
        ...props,
        selectedStore,
        selectedStoreSKU: '234234',
      })
      expect(instance.state.calledStoreSearch).toBe(false)
      expect(wrapper.find('.FulfilmentInfo-spinner').length).toBe(0)
    })
    it('with selectedStoreSKU matches activeSku and state.calledStoreSearch is true', () => {
      const { wrapper, instance } = renderComponent({
        ...props,
        selectedStore,
        selectedStoreSKU: props.activeProduct.sku,
      })
      expect(instance.state.calledStoreSearch).toBe(false)
      wrapper.setState({ calledStoreSearch: true })
      expect(instance.state.calledStoreSearch).toBe(true)
      expect(wrapper.find('.FulfilmentInfo-spinner').length).toBe(0)
    })
    it('with selectedStoreSKU not matches activeSku and state.calledStoreSearch is true', () => {
      const { wrapper, instance, getTree } = renderComponent({
        ...props,
        selectedStore,
        selectedStoreSKU: '000007',
      })
      expect(instance.state.calledStoreSearch).toBe(false)
      wrapper.setState({ calledStoreSearch: true })
      expect(instance.state.calledStoreSearch).toBe(true)
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('.FulfilmentInfo-spinner').length).toBe(1)
    })
    it('with getFulfilmentDetails returns CFSiDay as tomorrow', () => {
      getFulfilmentDetails.mockReturnValueOnce({ CFSiDay: 'tomorrow' })
      expect(
        renderComponent({ ...props, selectedStore }).getTree()
      ).toMatchSnapshot()
    })
    it('should not render without an active item', () => {
      const { getTree } = renderComponent({ ...props, activeProduct: null })
      expect(getTree()).toMatchSnapshot()
    })
    it('should call getFulfilmentDetails with the store if store is a brand store', () => {
      const { instance } = renderComponent({
        ...props,
        selectedStore: {
          ...props.selectedStore,
          brandName,
        },
      })
      expect(getFulfilmentDetails).toHaveBeenCalledTimes(1)
      expect(getFulfilmentDetails).toHaveBeenLastCalledWith(
        instance.props.activeProduct,
        instance.props.selectedStore
      )
    })
    it('should call getFulfilmentDetails with the empty object if store is not a brand store', () => {
      const { instance } = renderComponent({
        ...props,
        selectedStore: {
          ...props.selectedStore,
          brandName: 'Burton',
        },
      })
      expect(getFulfilmentDetails).toHaveBeenCalledTimes(1)
      expect(getFulfilmentDetails).toHaveBeenLastCalledWith(
        instance.props.activeProduct,
        {}
      )
    })
  })
  describe('@lifecycle', () => {
    describe('constructor', () => {
      it('should set calledStoreSearch state to false', () => {
        const { instance, wrapper } = renderComponent(props)
        expect(instance.state.calledStoreSearch).toBe(false)
        wrapper.setState({ calledStoreSearch: true })
        expect(instance.state.calledStoreSearch).toBe(true)
      })
    })

    describe('on componentDidMount', () => {
      it('get store id from cookie', () => {
        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(
          instance.props.getSelectedStoreIdFromCookie
        ).toHaveBeenCalledTimes(1)
      })
    })
    describe('on UNSAFE_componentWillReceiveProps', () => {
      beforeEach(() => jest.clearAllMocks())
      it('should call getFulfilmentStore if nextProps has "activeProduct.sku", "selectedStoreId" and calledStoreSearch state is false', () => {
        const { instance } = renderComponent(props)
        const nextProps = {
          ...props,
          selectedStoreId: 'TS0001',
        }
        expect(instance.state.calledStoreSearch).toBe(false)
        expect(instance.props.getFulfilmentStore).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.state.calledStoreSearch).toBe(true)
        expect(instance.props.getFulfilmentStore).toHaveBeenCalledTimes(1)
        expect(instance.props.getFulfilmentStore).toHaveBeenLastCalledWith(
          {
            search: `?storeIds=${nextProps.selectedStoreId}&brandPrimaryEStoreId=${nextProps.siteId}&skuList=${nextProps.activeProduct.sku}`,
          },
          true,
          nextProps.activeProduct.sku
        )
      })
      it('should call getFulfilmentStore if nextProps has "activeProduct.sku", "selectedStoreId" and current and next values of "activeProduct.sku" are different', () => {
        const { instance, wrapper } = renderComponent(props)
        const nextProps = {
          ...props,
          selectedStoreId: 'TS0001',
          activeProduct: {
            ...props.activeProduct,
            sku: 'tgd3',
          },
        }
        wrapper.setState({ calledStoreSearch: true })
        expect(instance.props.getFulfilmentStore).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.state.calledStoreSearch).toBe(true)
        expect(instance.props.getFulfilmentStore).toHaveBeenCalledTimes(1)
        expect(instance.props.getFulfilmentStore).toHaveBeenLastCalledWith(
          {
            search: `?storeIds=${nextProps.selectedStoreId}&brandPrimaryEStoreId=${nextProps.siteId}&skuList=${nextProps.activeProduct.sku}`,
          },
          true,
          nextProps.activeProduct.sku
        )
      })
      it('should not call getFulfilmentStore if nextProps does not have "activeItem.sku"', () => {
        const { instance } = renderComponent(props)
        const nextProps = {
          ...props,
          selectedStoreId: 'TS0001',
          activeProduct: null,
        }
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.state.calledStoreSearch).toBe(false)
        expect(instance.props.getFulfilmentStore).not.toHaveBeenCalled()
      })
      it('should not call getFulfilmentStore if nextProps does not have selectedStoreId', () => {
        const { instance } = renderComponent(props)
        const nextProps = {
          ...props,
          selectedStoreId: undefined,
          activeItem: {
            sku: 'tgd3',
          },
        }
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.state.calledStoreSearch).toBe(false)
        expect(instance.props.getFulfilmentStore).not.toHaveBeenCalled()
      })
      it('should not call getFulfilmentStore if current and next values of "activeItem.sku" are same and calledStoreSearch state is true', () => {
        const { instance, wrapper } = renderComponent(props)
        const nextProps = {
          ...props,
          selectedStoreId: 'TS0001',
        }
        wrapper.setState({ calledStoreSearch: true })
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.state.calledStoreSearch).toBe(true)
        expect(instance.props.getFulfilmentStore).not.toHaveBeenCalled()
      })
    })
  })
  describe('@functions', () => {
    describe('getStoreName', () => {
      it('returns a store name', () => {
        const { instance } = renderComponent({ ...props, selectedStore })
        const storeName = instance.getStoreName()
        expect(storeName).toEqual(`${brandName} ${name}`)
      })
    })
    describe('getDescription', () => {
      beforeEach(jest.clearAllMocks)
      it(' without storeName', () => {
        const { instance } = renderComponent({ ...props, selectedStore })
        instance.getStoreName = jest.fn()
        expect(instance.getStoreName).not.toHaveBeenCalled()
        expect(instance.getDescription()).toMatchSnapshot()
        expect(instance.getStoreName).toHaveBeenCalledTimes(1)
      })
      it(' with storeName', () => {
        const { instance } = renderComponent({ ...props, selectedStore })
        instance.getStoreName = jest.fn(() => 'topshop')
        expect(instance.getStoreName).not.toHaveBeenCalled()
        expect(instance.getDescription()).toMatchSnapshot()
        expect(instance.getStoreName).toHaveBeenCalledTimes(1)
      })
      it('if selectedStore.brandPrimaryEStoreId exists and selectedStore.brandPrimaryEStoreId !== siteId', () => {
        const { instance } = renderComponent({
          ...props,
          selectedStore: {
            ...selectedStore,
            brandPrimaryEStoreId: '23423',
          },
        })
        instance.getStoreName = jest.fn(() => 'topshop')
        expect(instance.getDescription()).toMatchSnapshot()
        expect(instance.getStoreName).not.toHaveBeenCalled()
        expect(instance.props.getFindInStoreButton).toHaveBeenCalledTimes(2)
        expect(instance.props.getFindInStoreButton).toHaveBeenLastCalledWith({
          type: 'link',
          text: 'find in store',
        })
      })
      it('if selectedStore.brandName exists and selectedStore.brandName !== brandName', () => {
        const { instance } = renderComponent({
          ...props,
          selectedStore: {
            ...selectedStore,
            brandName: 'Burton',
          },
        })
        instance.getStoreName = jest.fn(() => 'topshop')
        expect(instance.getDescription()).toMatchSnapshot()
        expect(instance.getStoreName).not.toHaveBeenCalled()
        expect(instance.props.getFindInStoreButton).toHaveBeenCalledTimes(2)
        expect(instance.props.getFindInStoreButton).toHaveBeenLastCalledWith({
          type: 'link',
          text: 'find in store',
        })
      })
      it('if selectedStore.brandPrimaryEStoreId !== siteId && selectedStore.brandName !== brandName', () => {
        const { instance } = renderComponent({
          ...props,
          selectedStore: {
            ...selectedStore,
            brandPrimaryEStoreId: '12556',
            brandName: 'Topshop',
          },
        })
        instance.getStoreName = jest.fn(() => 'topshop')
        expect(instance.getDescription()).toMatchSnapshot()
        expect(instance.getStoreName).toHaveBeenCalledTimes(1)
        expect(instance.props.getFindInStoreButton).toHaveBeenCalledTimes(2)
        expect(instance.props.getFindInStoreButton).toHaveBeenLastCalledWith({
          type: 'link',
          text: 'topshop',
        })
      })
    })
  })
})
