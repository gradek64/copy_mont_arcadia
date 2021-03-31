import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'

import * as checkoutActions from '../../../../../actions/common/checkoutActions'

import {
  WrappedDeliveryOptionsContainer,
  mapDispatchToProps,
} from '../DeliveryOptionsContainer'
import DeliveryOptions from '../../Delivery/DeliveryOptions'
import Accordion from '../../../../common/Accordion/Accordion'
import CheckoutSubPrimaryTitle from '../../shared/CheckoutSubPrimaryTitle'
import CheckoutPrimaryTitle from '../../shared/CheckoutPrimaryTitle'

describe('<DeliveryOptionsContainer />', () => {
  const deliveryLocations = {
    home: {
      deliveryLocationType: 'HOME',
      title: 'Home Delivery',
      iconUrl: '/assets/topshop/images/lorry-icon.svg',
    },
    store: {
      deliveryLocationType: 'PARCELSHOP',
      title: 'Collect from ParcelShop',
      iconUrl: '/assets/topshop/images/hermes-icon.svg',
    },
  }
  const requiredProps = {
    onChangeDeliveryLocation: jest.fn(),
    selectedDeliveryLocationType: 'HOME',
    deliveryCountry: 'United Kingdom',
    setScrollToFirstErrorActive: jest.fn(),
  }
  const renderComponent = testComponentHelper(WrappedDeliveryOptionsContainer)

  describe('mapDispatchToProps', () => {
    const selectDeliveryLocationSpy = jest
      .spyOn(checkoutActions, 'selectDeliveryLocation')
      .mockImplementation(() => ({
        type: 'SELECT_DELIVERY_LOCATION',
      }))

    afterEach(() => {
      selectDeliveryLocationSpy.mockReset()
    })

    afterAll(() => {
      selectDeliveryLocationSpy.mockRestore()
    })

    it('should return `selectDeliveryLocation` action for `onChangeDeliveryLocation` prop', () => {
      const dispatchMock = jest.fn()
      const { onChangeDeliveryLocation } = mapDispatchToProps(dispatchMock)
      onChangeDeliveryLocation(deliveryLocations.store)
      expect(selectDeliveryLocationSpy).toHaveBeenCalledWith(
        deliveryLocations.store
      )
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'SELECT_DELIVERY_LOCATION',
      })
    })

    it('should use `onChangeDeliveryLocation` own prop if supplied', () => {
      const onChangeDeliveryLocation = () => {}
      const props = mapDispatchToProps(null, { onChangeDeliveryLocation })
      expect(props.onChangeDeliveryLocation).toBe(onChangeDeliveryLocation)
    })
  })

  describe('@render', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    describe('when there is less than two delivery location', () => {
      it('should not render delivery options', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: [deliveryLocations.home],
        })
        expect(wrapper.find(DeliveryOptions).exists()).toBe(false)
      })
    })

    describe('when there is more than one delivery location', () => {
      describe('when there is no saveAddresses and deliveryLocation is home', () => {
        describe('when delivery location has not changed', () => {
          it('should not render delivery options inside an accordion', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              deliveryLocations: [
                deliveryLocations.home,
                deliveryLocations.store,
              ],
              hasSavedAddresses: false,
            })
            const accordion = wrapper.find(Accordion)
            expect(accordion).toHaveLength(0)
            expect(wrapper.find(DeliveryOptions)).toHaveLength(1)
          })
        })

        describe('when delivery location has changed', () => {
          it('should render delivery options inside an accordion', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              deliveryLocations: [
                deliveryLocations.home,
                deliveryLocations.store,
              ],
              hasSavedAddresses: false,
            })

            wrapper.find(DeliveryOptions).prop('onChangeDeliveryLocation')(
              deliveryLocations.store
            )
            const accordion = wrapper.find(Accordion)
            expect(accordion).toHaveLength(1)
            expect(wrapper.find(DeliveryOptions)).toHaveLength(1)
          })
        })
      })

      describe('when there is saveAddresses and deliveryLocation is home', () => {
        let wrapper

        beforeEach(() => {
          const component = renderComponent({
            ...requiredProps,
            deliveryLocations: [
              deliveryLocations.home,
              deliveryLocations.store,
            ],
            hasSavedAddresses: true,
          })

          wrapper = component.wrapper
        })

        it('should render delivery options inside an accordion', () => {
          const accordion = wrapper.find(Accordion)
          expect(accordion).toHaveLength(1)
          expect(accordion.find(DeliveryOptions)).toHaveLength(1)
        })

        describe('<Accordion />', () => {
          it('should have the `expanded` prop set to false', () => {
            expect(wrapper.find(Accordion).prop('expanded')).toBe(false)
          })

          it('should pass `<CheckoutPrimaryTitle /> component as header prop with the right title value', () => {
            expect(wrapper.find(Accordion).prop('header')).toEqual(
              <CheckoutPrimaryTitle title="Delivery Method" />
            )
          })

          describe('when accordion is expanded', () => {
            it('should display `CANCEL` text on the CTA that toggles the expanded prop', () => {
              wrapper.find(Accordion).prop('onAccordionToggle')()
              expect(wrapper.find(Accordion).prop('statusIndicatorText')).toBe(
                'CANCEL'
              )
            })

            it('should not display subHeader', () => {
              wrapper.find(Accordion).prop('onAccordionToggle')()
              expect(wrapper.find(Accordion).prop('subHeader')).toBe('')
            })
          })

          describe('when accordion is not expanded', () => {
            it('should display `CHANGE` text on the CTA that toggles the expanded prop', () => {
              expect(wrapper.find(Accordion).prop('statusIndicatorText')).toBe(
                'CHANGE'
              )
            })

            it('should pass `<CheckoutSubPrimaryTitle /> component as subHeader prop with the right title value', () => {
              expect(wrapper.find(Accordion).prop('subHeader')).toEqual(
                <CheckoutSubPrimaryTitle title="Home Delivery" />
              )
            })
          })

          describe('when deliveryCountry is not equal to `United Kingdom`', () => {
            it('should have the the `isDisabled` set to true', () => {
              const { wrapper } = renderComponent({
                ...requiredProps,
                deliveryCountry: 'Turkey',
                deliveryLocations: [
                  deliveryLocations.home,
                  deliveryLocations.store,
                ],
                hasSavedAddresses: true,
              })

              expect(wrapper.find(Accordion).prop('isDisabled')).toBe(true)
            })
          })

          describe('when deliveryCountry is equal to `United Kingdom`', () => {
            it('should have the the `isDisabled` set to false', () => {
              const { wrapper } = renderComponent({
                ...requiredProps,
                deliveryLocations: [
                  deliveryLocations.home,
                  deliveryLocations.store,
                ],
                hasSavedAddresses: true,
              })

              expect(wrapper.find(Accordion).prop('isDisabled')).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('@events', () => {
    describe('onAccordionToggle', () => {
      it('should toggle expanded prop', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: [deliveryLocations.home, deliveryLocations.store],
          hasSavedAddresses: true,
        })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(false)
        wrapper.find(Accordion).prop('onAccordionToggle')()
        expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
      })

      it('should call setScrollToFirstErrorActive when toggles Accordion', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: [deliveryLocations.home, deliveryLocations.store],
          hasSavedAddresses: true,
        })
        wrapper.find(Accordion).prop('onAccordionToggle')()
        expect(requiredProps.setScrollToFirstErrorActive).toHaveBeenCalled()
      })
    })

    describe('handleOnChangeDeliveryLocation', () => {
      const location = {
        additionalDescription: 'Express Delivery (next day)',
        collectionDay: '',
        deliveryLocationType: 'STORE',
        deliveryMethods: [],
        description: 'Standard Delivery (3-7 working days)',
        enabled: true,
        iconUrl: '/assets/burton/images/cfs.svg',
        label:
          'Collect from Store Standard Delivery (2 to 7 working days) Next Day Delivery',
        selected: true,
        title: 'Collect from Store',
      }

      it('should call setScrollToFirstErrorActive when delivery location change', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: [deliveryLocations.home, deliveryLocations.store],
          hasSavedAddresses: true,
        })
        wrapper.find(DeliveryOptions).prop('onChangeDeliveryLocation')(location)
        expect(requiredProps.setScrollToFirstErrorActive).toHaveBeenCalled()
      })

      it('should call onChangeDeliveryLocation with location when delivery location change', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: [deliveryLocations.home, deliveryLocations.store],
          hasSavedAddresses: true,
        })
        wrapper.find(DeliveryOptions).prop('onChangeDeliveryLocation')(location)
        expect(requiredProps.onChangeDeliveryLocation).toHaveBeenCalledWith(
          location
        )
      })

      it('should not expand Accordion when delivery location change', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: [deliveryLocations.home, deliveryLocations.store],
          hasSavedAddresses: true,
        })
        wrapper.find(DeliveryOptions).prop('onChangeDeliveryLocation')(location)
        expect(wrapper.find(Accordion).prop('expanded')).toBe(false)
      })
    })

    it('wraps DeliveryOptions with QubitWrapper', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        deliveryLocations: [deliveryLocations.home, deliveryLocations.store],
        hasSavedAddresses: true,
      })

      const qubitWrapper = wrapper
        .find(DeliveryOptions)
        .parent()
        .getElement()
      expect(qubitWrapper.props.id).toBe('qubit-checkout-delivery-locations')
    })
  })
})
