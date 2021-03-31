import helper from 'test/unit/helpers/test-component'
import SimpleTotals from '../SimpleTotals'

describe('<SimpleTotals />', () => {
  const renderComponent = helper(SimpleTotals)
  const defaultProps = {
    isDDPStandaloneOrder: false,
    shippingInfo: {
      label: 'UK Standard',
    },
    priceInfo: {
      subTotal: '12.00',
      total: '12.00',
    },
  }
  const $ = {
    deliveryTotalsColumn: '.SimpleTotals-delivery',
  }
  describe('@renders', () => {
    it('in default state', () => {
      const component = renderComponent(defaultProps)
      expect(component.getTree()).toMatchSnapshot()
    })
    it('with isDDPStandaloneOrder', () => {
      const component = renderComponent({
        ...defaultProps,
        isDDPStandaloneOrder: true,
      })
      expect(component.getTree()).toMatchSnapshot()
    })
    it('with isDDPStandaloneOrder', () => {
      const component = renderComponent({
        ...defaultProps,
        isDDPStandaloneOrder: true,
      })
      expect(component.getTree()).toMatchSnapshot()
    })
    it('with the cost prop being passed', () => {
      const newProps = {
        shippingInfo: {
          label: 'UK Standard',
          cost: '4.00',
        },
        priceInfo: {
          subTotal: '12.00',
          total: '16.00',
        },
      }
      const component = renderComponent(newProps)
      expect(component.getTree()).toMatchSnapshot()
    })
    it('with discounts', () => {
      const newProps = {
        priceInfo: {
          subTotal: '12.00',
          total: '6.00',
        },
        discounts: [
          {
            label: 'Topshop Card- £5 Welcome offer',
            value: '5.00',
          },
          {
            label: 'Topshop Card- £1 Offer',
            value: '1.00',
          },
        ],
      }
      const component = renderComponent({ ...defaultProps, ...newProps })
      expect(component.wrapper.find('.SimpleTotals-discount').length).toBe(2)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('with a class being passed in', () => {
      const component = renderComponent({
        ...defaultProps,
        className: 'SomeComponent-totals',
      })
      expect(component.wrapper.find('.SomeComponent-totals').length).toBe(1)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('does not render the delivery field if there is no label', () => {
      const component = renderComponent({
        ...defaultProps,
        shippingInfo: {},
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    describe('the delivery totals column', () => {
      const props = { ...defaultProps }

      describe('when there is a delivery label', () => {
        it('renders the delivery totals column', () => {
          props.shippingInfo.label = 'foo...'
          const component = renderComponent(props)
          expect(component.wrapper.find($.deliveryTotalsColumn)).toHaveLength(1)
        })
      })

      describe('when there is no delivery label', () => {
        it('does not render the delivery totals column', () => {
          props.shippingInfo.label = ''
          const component = renderComponent(props)
          expect(component.wrapper.find($.deliveryTotalsColumn)).toHaveLength(0)
        })
      })
    })
  })
})
