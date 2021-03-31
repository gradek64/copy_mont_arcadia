import testComponentHelper from 'test/unit/helpers/test-component'
import generateMockFormProps from 'test/unit/helpers/form-props-helper'
import {
  initialHomeDeliveryProps as initialProps,
  initialHomeDeliveryFormProps as initialFormProps,
  populatedHomeDeliveryFormProps as populatedFormProps,
} from './deliveryMocks'
import {
  GTM_ACTION,
  GTM_CATEGORY,
} from '../../../../../analytics/analytics-constants'

// components
import HomeDeliveryInstructions from '../../shared/DeliveryInstructions/DeliveryInstructionsContainer'
import DeliveryMethodsContainer from '../../shared/DeliveryMethodsContainer'
import HomeDelivery from '../HomeDelivery'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

import { browserHistory } from 'react-router'

describe('<HomeDelivery />', () => {
  jest.useFakeTimers()

  const renderComponent = testComponentHelper(HomeDelivery.WrappedComponent)
  const generateProps = (newFormProps) => ({
    ...initialProps,
    ...generateMockFormProps(initialFormProps, newFormProps),
  })

  beforeEach(() => jest.resetAllMocks())

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(generateProps()).getTree()).toMatchSnapshot()
    })

    it('hides the titles of its children components when "titlesHidden" = true ', () => {
      expect(
        renderComponent(generateProps({ titlesHidden: true })).getTree()
      ).toMatchSnapshot()
    })

    it('should not render delivery methods and delivery instructions if bag only contains DDP product', () => {
      const { wrapper } = renderComponent({
        ...generateProps(),
        bagContainsOnlyDDPProduct: true,
      })
      expect(wrapper.find(DeliveryMethodsContainer).exists()).toBe(false)
      expect(wrapper.find(HomeDeliveryInstructions).exists()).toBe(false)
    })

    it('isActive when there is no errors', () => {
      const { wrapper } = renderComponent(generateProps(populatedFormProps))
      expect(wrapper.find('DeliveryCTAProceed').prop('isActive')).toBe(true)
    })

    it('not isActive when there are some errors', () => {
      const { wrapper } = renderComponent(generateProps())
      expect(wrapper.find('DeliveryCTAProceed').prop('isActive')).toBe(false)
    })

    it('should render the guest email form if in guest checkout', () => {
      expect(
        renderComponent({
          ...generateProps(),
          guestUserForm: {
            fields: {
              email: {
                value: '',
              },
            },
          },
          isGuestOrder: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('on NEXT button click', () => {
      describe('with required fields missing', () => {
        it('shows errors on form fields', () => {
          const { instance, wrapper } = renderComponent(generateProps())
          instance.scrollToFirstError = jest.fn()

          wrapper
            .find('DeliveryCTAProceed')
            .props()
            .nextHandler()
          expect(instance.scrollToFirstError).toHaveBeenCalledTimes(1)
          expect(
            instance.props.touchedMultipleFormFields
          ).toHaveBeenCalledTimes(4)
        })

        it('disabled proceed button if Out of Stock is true', () => {
          const { wrapper } = renderComponent({
            ...generateProps(),
            isOutOfStock: true,
          })
          expect(wrapper.find('DeliveryCTAProceed').prop('isDisabled')).toBe(
            true
          )
        })

        it('should not be disable proceed button if Out of Stock is false', () => {
          const { wrapper } = renderComponent({
            ...generateProps(),
            isOutOfStock: false,
          })
          expect(wrapper.find('DeliveryCTAProceed').prop('isDisabled')).toBe(
            false
          )
        })

        it('should not redirect', () => {
          const { wrapper, instance } = renderComponent(generateProps())

          wrapper
            .find('DeliveryCTAProceed')
            .props()
            .nextHandler()
          expect(browserHistory.push).not.toHaveBeenCalled()
          expect(
            instance.props.sendAnalyticsErrorMessage
          ).toHaveBeenCalledTimes(1)
          expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledWith(
            'Error proceeding to payment'
          )
          expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledTimes(
            1
          )
          expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
            category: GTM_CATEGORY.CHECKOUT,
            action: GTM_ACTION.CLICKED,
            label: window.location.href,
            value: '',
          })
        })
      })

      describe('with required fields populated', () => {
        const props = generateProps(populatedFormProps)

        it('should redirect to payment route', () => {
          const { wrapper, instance } = renderComponent(props)

          wrapper
            .find('DeliveryCTAProceed')
            .props()
            .nextHandler()
          expect(browserHistory.push).toHaveBeenCalledWith('/checkout/payment')
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
          expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledTimes(
            1
          )
          expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
            category: GTM_CATEGORY.CHECKOUT,
            action: GTM_ACTION.CLICKED,
            label: window.location.href,
            value: '',
          })
          expect(
            instance.props.sendAnalyticsErrorMessage
          ).not.toHaveBeenCalled()
        })

        it('should redirect to guest checkout payment route', () => {
          const { wrapper } = renderComponent({
            ...props,
            guestUserForm: {
              fields: {
                email: {
                  value: 'email@mail.com',
                },
              },
            },
            isGuestOrder: true,
          })

          wrapper
            .find('DeliveryCTAProceed')
            .props()
            .nextHandler()
          expect(browserHistory.push).toHaveBeenCalledWith(
            '/guest/checkout/payment'
          )
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('@methods', () => {
    describe('validateHomeDelivery()', () => {
      describe('with valid required fields', () => {
        it('should not return errors', () => {
          const { instance } = renderComponent(
            generateProps(populatedFormProps)
          )
          expect(instance.validateHomeDelivery()).toMatchSnapshot()
        })
      })
      describe('with invalid or missing fields', () => {
        it('should return errors', () => {
          const { instance } = renderComponent(generateProps())
          expect(instance.validateHomeDelivery()).toMatchSnapshot()
        })

        it('should return `findAddress` errors if `findAddressIsVisible` is `true`', () => {
          const { instance } = renderComponent({
            ...generateProps(),
            isFindAddressVisible: true,
          })
          expect(
            Object.keys(instance.validateHomeDelivery().findAddress)
          ).toEqual(['postcode', 'country', 'findAddress', 'selectAddress'])
        })
      })
    })

    describe('focusEl()', () => {
      it('should call focus if a form input is found', () => {
        const { instance } = renderComponent(generateProps(populatedFormProps))
        const el = {
          querySelector: jest.fn(),
        }
        const focusMock = jest.fn()
        el.querySelector.mockReturnValue({
          focus: focusMock,
        })
        instance.focusEl(el)
        expect(focusMock).toHaveBeenCalledTimes(1)
        expect(el.querySelector).toHaveBeenCalledTimes(1)
        expect(el.querySelector).toHaveBeenCalledWith('input,select,button')
      })

      it('should not call focus if no found form input', () => {
        const { instance } = renderComponent(generateProps(populatedFormProps))
        const el = {
          querySelector: jest.fn(),
        }
        el.querySelector.mockReturnValue(null)
        instance.focusEl(el)
        expect(el.querySelector).toHaveBeenCalledTimes(1)
        expect(el.querySelector).toHaveBeenCalledWith('input,select,button')
      })
    })
  })

  describe('scrollToFirstError(name)', () => {
    it('should execute setTimeout', () => {
      const { instance } = renderComponent(generateProps())
      expect(setTimeout).not.toHaveBeenCalled()
      instance.scrollToFirstError('firstName')
      expect(setTimeout).toHaveBeenCalled()
      expect(setTimeout.mock.calls[0][1]).toBe(15)
    })
  })

  describe('showDDPAddressModal', () => {
    it('should execute showModal', () => {
      const { instance } = renderComponent(generateProps())
      expect(instance.props.showModal).not.toHaveBeenCalled()
      instance.showDDPAddressModal()
      expect(instance.props.showModal).toHaveBeenCalledTimes(1)
    })
  })
})
