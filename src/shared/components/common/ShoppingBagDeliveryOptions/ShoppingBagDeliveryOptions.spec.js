import { reverse } from 'ramda'
import testComponentHelper from 'test/unit/helpers/test-component'
import ShoppingBagDeliveryOptions from './ShoppingBagDeliveryOptions'
import Select from '../FormComponents/Select/Select'

describe('<ShoppingBagDeliveryOptions />', () => {
  const renderComponent = testComponentHelper(
    ShoppingBagDeliveryOptions.WrappedComponent
  )

  const initialProps = {
    changeDeliveryType: jest.fn(),
    shoppingBag: {
      bag: {
        deliveryOptions: [
          {
            deliveryOptionId: 51017,
            label: 'Collect From Store Today £3.00',
            selected: false,
            enabled: true,
          },
          {
            deliveryOptionId: 45020,
            label: 'Collect From Store Express £3.00',
            selected: false,
            enabled: true,
          },
          {
            deliveryOptionId: 26504,
            label: 'Standard Delivery £4.00',
            selected: true,
            enabled: true,
          },
          {
            deliveryOptionId: 45019,
            label: 'Free Collect From Store Standard £0.00',
            selected: false,
            enabled: true,
          },
          {
            deliveryOptionId: 50517,
            label: 'Collect from ParcelShop £4.00',
            selected: false,
            enabled: true,
          },
          {
            deliveryOptionId: 28002,
            label: 'Next or Named Day Delivery £6.00',
            selected: false,
            enabled: true,
          },
        ],
      },
    },
    isCFSIEnabled: false,
    isPUDOEnabled: true,
  }

  describe('@renders', () => {
    it('in default state', () => {
      const { wrapper, getTree } = renderComponent(initialProps)
      expect(wrapper.find(Select).prop('options').length).toBe(5)
      expect(getTree()).toMatchSnapshot()
    })

    it('should display collect today when feature CFSi is true', () => {
      const { wrapper, getTree } = renderComponent({
        ...initialProps,
        isCFSIEnabled: true,
      })
      expect(wrapper.find(Select).prop('options').length).toBe(6)
      expect(getTree()).toMatchSnapshot()
    })

    it('should not display ParcelShop option when PUDO feature is disabled', () => {
      const { wrapper, getTree } = renderComponent({
        ...initialProps,
        isPUDOEnabled: false,
      })
      expect(wrapper.find(Select).prop('options').length).toBe(4)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('instance methods', () => {
    describe('selectedValue()', () => {
      it('should return selected deliveryOptionId if any value is selected', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          instance.selectedValue(instance.props.shoppingBag.bag.deliveryOptions)
        ).toBe('26504')
      })
    })
  })

  describe('@events', () => {
    describe('onChange Select', () => {
      it('should call changedeliveryType() with the changed value', () => {
        const event = {
          target: {
            value:
              initialProps.shoppingBag.bag.deliveryOptions[2].deliveryOptionId,
          },
        }
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.changeDeliveryType).not.toHaveBeenCalled()
        wrapper.find(Select).simulate('change', event)
        expect(instance.props.changeDeliveryType).toHaveBeenCalledTimes(1)
        expect(instance.props.changeDeliveryType).toHaveBeenLastCalledWith({
          deliveryOptionId: event.target.value,
        })
      })
    })
  })

  describe('@functions', () => {
    describe('@applicableOptions', () => {
      const { instance } = renderComponent({
        ...initialProps,
        isCFSIEnabled: false,
        isPUDOEnabled: true,
      })

      it('should disable Collect from Store Today if CFSi flag is not today', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isCFSIEnabled: true,
          isPUDOEnabled: true,
        })
        const label = 'Collect From Store Today £3.00'
        const id = 26405
        const option = [
          {
            label,
            deliveryOptionId: id,
          },
        ]
        const expected = [
          {
            value: id,
            disabled: true,
            label,
          },
        ]
        expect(instance.applicableOptions(option)).toEqual(expected)
      })

      it('should disable the Collect from Store Express if enabled flag is false', () => {
        const label = 'Collect From Store Express £3.00'
        const id = 45020
        const option = [
          {
            label,
            deliveryOptionId: id,
            enabled: false,
          },
        ]
        const expected = [
          {
            value: id,
            disabled: true,
            label,
          },
        ]
        expect(instance.applicableOptions(option)).toEqual(expected)
      })

      it('should disable the Collect from ParcelShop option if enabled flag is false', () => {
        const label = 'Collect from ParcelShop £4.00'
        const id = 50517
        const option = [
          {
            label,
            deliveryOptionId: id,
            enabled: false,
          },
        ]
        const expected = [
          {
            value: id,
            disabled: true,
            label,
          },
        ]
        expect(instance.applicableOptions(option)).toEqual(expected)
      })

      it('should disable Next or Named Day Delivery if enabled flag is false', () => {
        const label = 'Next or Named Day Delivery £6.00'
        const id = 28002
        const option = [
          {
            deliveryOptionId: id,
            label,
            enabled: false,
          },
        ]
        const expected = [
          {
            value: id,
            disabled: true,
            label,
          },
        ]
        expect(instance.applicableOptions(option)).toEqual(expected)
      })

      it('should sort the options', () => {
        const label1 = 'Next or Named Day Delivery £6.00'
        const label2 = 'Collect from Store Express'
        const id1 = 28002
        const id2 = 30012

        const options = [
          {
            deliveryOptionId: id1,
            label: label1,
            enabled: false,
          },
          {
            deliveryOptionId: id2,
            label: label2,
            enabled: false,
          },
        ]

        const expected = [
          {
            value: id1,
            disabled: true,
            label: label1,
          },
          {
            value: id2,
            disabled: true,
            label: label2,
          },
        ]

        expect(instance.applicableOptions(options)).toEqual(expected)
        expect(instance.applicableOptions(reverse(options))).toEqual(expected)
      })
    })
  })
})
