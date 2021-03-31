import testComponentHelper from 'test/unit/helpers/test-component'
import InternationalUserLocator from './InternationalUserLocator'

import storeLocatorConsts from '../../../constants/storeLocator'

const initialProps = {
  searchStores: jest.fn(),
  searchStoresCheckout: jest.fn(),
  setSelectedPlace: jest.fn(),
  resetPredictions: jest.fn(),
  resetSearchTerm: jest.fn(),
  resetSelectedPlace: jest.fn(),
  setFormField: jest.fn(),
  selectCountry: jest.fn(),
  navigateToStoreLocator: jest.fn(),
  getStoresLoading: jest.fn(),
  receiveStores: jest.fn(),
}

const renderComponent = testComponentHelper(
  InternationalUserLocator.WrappedComponent
)

describe('<InternationalUserLocator />', () => {
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('when selectedCountry is the defaultCountry and it is not the landing page', () => {
      expect(
        renderComponent({
          ...initialProps,
          selectedCountry: storeLocatorConsts.defaultCountry,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when selectedCountry is not the defaultCountry and it is not the landing page', () => {
      expect(
        renderComponent({
          ...initialProps,
          selectedCountry: 'Portugal',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when selectedCountry is the defaultCountry and it is the landing page', () => {
      expect(
        renderComponent({
          ...initialProps,
          selectedCountry: storeLocatorConsts.defaultCountry,
          storeLocatorLandingPage: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when selectedCountry is not the defaultCountry and it is the landing page', () => {
      expect(
        renderComponent({
          ...initialProps,
          selectedCountry: 'Portugal',
          storeLocatorLandingPage: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    describe('UNSAFE_componentWillReceiveProps', () => {
      it('should call searchStoresByCountry method if selectedCountry in nextProps', () => {
        const { instance } = renderComponent(initialProps)
        instance.searchStoresByCountry = jest.fn()
        const newCountry = 'France'

        expect(instance.searchStoresByCountry).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps({
          selectedCountry: newCountry,
        })
        expect(instance.searchStoresByCountry).toHaveBeenCalledTimes(1)
        expect(instance.searchStoresByCountry).toHaveBeenCalledWith(newCountry)
      })

      it('should not call searchStoresByCountry if selectedCountry remains the same', () => {
        const { instance } = renderComponent({
          ...initialProps,
          selectedCountry: storeLocatorConsts.defaultCountry,
        })
        instance.searchStoresByCountry = jest.fn()
        instance.UNSAFE_componentWillReceiveProps({
          selectCountry: storeLocatorConsts.defaultCountry,
        })
        expect(instance.searchStoresByCountry).not.toHaveBeenCalled()
      })
    })
  })

  describe('@instance methods', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('searchStoresByCountry', () => {
      it('should call selectCountry and resetLocator', () => {
        const { instance } = renderComponent(initialProps)
        instance.locatorReset = jest.fn()
        expect(instance.props.selectCountry).not.toHaveBeenCalled()
        instance.searchStoresByCountry('somecountry')
        expect(instance.props.selectCountry).toHaveBeenCalledTimes(1)
        expect(instance.props.selectCountry).toHaveBeenCalledWith('somecountry')
        expect(instance.locatorReset).toHaveBeenCalledTimes(1)
      })
      it('should reset the store locator landing page back to initial `state` when locatorReset func is called', () => {
        const { instance } = renderComponent(initialProps)
        instance.locatorReset()
        expect(instance.props.navigateToStoreLocator).toHaveBeenCalledTimes(1)
        expect(instance.props.navigateToStoreLocator).toHaveBeenCalledWith({})
        expect(instance.props.getStoresLoading).toHaveBeenCalledTimes(2)
        expect(instance.props.getStoresLoading).toHaveBeenCalledWith(true)
        expect(instance.props.getStoresLoading).toHaveBeenCalledWith(false)
        expect(instance.props.receiveStores).toHaveBeenCalledTimes(1)
        expect(instance.props.receiveStores).toHaveBeenCalledWith([])
      })
      it('should not call clearSearchField and searchStores if on storeLocatorLandingPage and with defaultCountry', () => {
        const { instance } = renderComponent({
          ...initialProps,
          storeLocatorLandingPage: true,
        })
        instance.clearSearchField = jest.fn()
        instance.searchStores = jest.fn()
        instance.locatorReset = jest.fn()
        instance.searchStoresByCountry(storeLocatorConsts.defaultCountry)
        expect(instance.locatorReset).toHaveBeenCalledTimes(1)
        expect(instance.clearSearchField).not.toHaveBeenCalled()
        expect(instance.searchStores).not.toHaveBeenCalled()
      })
      it('should call clearSearchField and searchStores if not on storeLocatorLandingPage', () => {
        const { instance } = renderComponent({
          ...initialProps,
          storeLocatorLandingPage: false,
        })
        instance.clearSearchField = jest.fn()
        instance.searchStores = jest.fn()
        instance.locatorReset = jest.fn()
        instance.searchStoresByCountry(storeLocatorConsts.defaultCountry)
        expect(instance.locatorReset).toHaveBeenCalledTimes(1)
        expect(instance.clearSearchField).not.toHaveBeenCalled()
        expect(instance.searchStores).not.toHaveBeenCalled()
      })
    })
    describe('submitHandler', () => {
      it('should call preventDefault and should call searchStores', () => {
        const { instance } = renderComponent(initialProps)
        const event = { preventDefault: jest.fn() }
        instance.searchStores = jest.fn()
        expect(event.preventDefault).not.toHaveBeenCalled()
        expect(instance.searchStores).not.toHaveBeenCalled()
        instance.submitHandler(event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
        expect(instance.searchStores).toHaveBeenCalledTimes(1)
      })
    })
    describe('searchStores', () => {
      it('if storeLocatorType === collectFromStore should call searchStoresCheckout and not searchStores', () => {
        const { instance } = renderComponent({
          ...initialProps,
          storeLocatorType: 'collectFromStore',
        })
        expect(instance.props.searchStoresCheckout).not.toHaveBeenCalled()
        instance.searchStores()
        expect(instance.props.searchStoresCheckout).toHaveBeenCalledTimes(1)
        expect(instance.props.searchStores).not.toHaveBeenCalled()
      })
      it('if storeLocatorType !== collectFromStore should call searchStores and not searchStoresCheckout', () => {
        const { instance } = renderComponent({
          ...initialProps,
          storeLocatorType: 'sometype',
        })
        expect(instance.props.searchStores).not.toHaveBeenCalled()
        instance.searchStores()
        expect(instance.props.searchStoresCheckout).not.toHaveBeenCalled()
        expect(instance.props.searchStores).toHaveBeenCalledTimes(1)
      })
    })
  })
})
