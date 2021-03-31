import testComponentHelper from 'test/unit/helpers/test-component'
import ShippingDestination from '../ShippingDestination'
import ShippingDestinationFlag from '../../ShippingDestinationFlag/ShippingDestinationFlag'

jest.mock('../../../../../client/lib/storage')

describe('<ShippingDestination />', () => {
  const defaultProps = {
    currencySymbol: '£',
    onShippingDestinationChange: () => {},
    updateShippingDestination: jest.fn(),
  }
  const renderComponent = testComponentHelper(
    ShippingDestination.WrappedComponent
  )

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render the `shippingDestinationFlag` component if shippingDestination prop is supplied', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        shippingDestination: 'United States',
      })
      expect(
        wrapper.find(ShippingDestinationFlag).prop('shippingDestination')
      ).toBe('United States')
      expect(wrapper.find(ShippingDestinationFlag)).toHaveLength(1)
    })

    it('should add class modifier if `modifier` prop supplied', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        modifier: 'myComponent',
      })
      expect(wrapper.hasClass('ShippingDestination--myComponent')).toBe(true)
    })

    it('should add text if `text` prop supplied', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        text: 'Ship to',
      })
      expect(wrapper.find('.ShippingDestination-text').text()).toBe('Ship to')
    })

    describe('`currencySymbolPosition`', () => {
      it('should put symbol before icon if `currencySymbolPosition` prop is `left`', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          shippingDestination: 'United States',
          currencySymbolPosition: 'left',
        })
        expect(
          wrapper.childAt(0).hasClass('ShippingDestination-currencySymbol')
        ).toBe(true)
        expect(wrapper.find(ShippingDestinationFlag)).toHaveLength(1)
      })

      it('should put symbol after icon if `currencySymbolPosition` prop is `right`', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          shippingDestination: 'United States',
          currencySymbolPosition: 'right',
        })
        expect(wrapper.find(ShippingDestinationFlag)).toHaveLength(1)
        expect(
          wrapper.childAt(1).hasClass('ShippingDestination-currencySymbol')
        ).toBe(true)
      })

      it('should not display symbol if `currencySymbolPosition` prop is `hide`', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          shippingDestination: 'United States',
          currencySymbolPosition: 'hide',
        })
        expect(
          wrapper.find('ShippingDestination-currencySymbol').exists()
        ).toBe(false)
      })
    })

    describe('`currencySymbolStyle`', () => {
      it('should add `bracketed` modifier to symbol if `currencySymbolStyle` prop is `bracketed`', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          currencySymbolStyle: 'bracketed',
        })
        expect(
          wrapper
            .find('.ShippingDestination-currencySymbol')
            .hasClass('ShippingDestination-currencySymbol--bracketed')
        ).toBe(true)
      })
    })

    it('should display the country if `displayCountry` prop is `true`', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        shippingDestination: 'United States',
        displayCountry: true,
      })
      expect(wrapper.find('.ShippingDestination-country').text()).toBe(
        'United States'
      )
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('componentDidMount()', () => {
      it('should call updateShippingDestination with no arguments', () => {
        const { instance } = renderComponent({
          ...defaultProps,
        })
        instance.componentDidMount()
        expect(defaultProps.updateShippingDestination).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@events', () => {
    it('should call `onCurrencyChange` on change currency button click', () => {
      const onShippingDestinationChangeMock = jest.fn()
      const { wrapper } = renderComponent({
        ...defaultProps,
        onShippingDestinationChange: onShippingDestinationChangeMock,
      })
      wrapper.prop('onClick')()
      expect(onShippingDestinationChangeMock).toHaveBeenCalled()
    })
  })
})
