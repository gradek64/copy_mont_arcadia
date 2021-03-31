import testComponentHelper from 'test/unit/helpers/test-component'
import StoreList from './StoreList'

describe('<StoreList/>', () => {
  jest.useFakeTimers()
  jest.fn()

  const mockStore = {
    storeId: '123',
    name: 'Megastore',
    brandName: 'Topshop',
    distance: '0.82',
    latitude: '51.5157',
    longitude: '-0.141396',
    address: {
      line1: '214 Oxford Street',
      line2: 'Oxford Circus',
      city: 'Greater London',
      postcode: 'W1W 8LG',
    },
    stock: 8,
    openingHours: {
      monday: '10:00-21:00',
      tuesday: '10:00-21:00',
      wednesday: '10:00-21:00',
      thursday: '10:00-21:00',
      friday: '10:00-21:00',
      saturday: '11:00-21:00',
      sunday: '12:00-18:00',
    },
    telephoneNumber: '03448 487487',
  }

  const props = {
    deselectStore: jest.fn(),
    fetchStores: jest.fn(),
    selectDeliveryStore: jest.fn(),
    selectedStoreIndex: 0,
    selectStore: jest.fn(),
    stores: [mockStore, mockStore],
    selectCFSIStore: jest.fn(),
  }
  const renderComponent = testComponentHelper(StoreList.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('with hasFilters=true', () => {
      expect(
        renderComponent({ ...props, hasFilters: true }).getTree()
      ).toMatchSnapshot()
    })
    it('with brandName', () => {
      const brandName = 'Topshop'
      const selectCFSIStore = jest.fn()
      expect(
        renderComponent({ ...props, brandName, selectCFSIStore }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => jest.resetAllMocks())

    describe('on componentDidUpdate', () => {
      it('sets timeout()', () => {
        const { instance } = renderComponent(props)
        instance.componentDidUpdate({ selectedStoreIndex: 666 })
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout.mock.calls[0][1]).toBe(300)
      })
    })
    describe('on componentWillUnmount', () => {
      it('clear timeout()', () => {
        const { instance } = renderComponent(props)
        instance.timeout = 1
        instance.componentWillUnmount()
        expect(clearTimeout).toHaveBeenCalledTimes(1)
      })
    })
  })
})
