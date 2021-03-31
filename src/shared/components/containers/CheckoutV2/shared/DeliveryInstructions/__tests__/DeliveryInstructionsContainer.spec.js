import testComponentHelper from 'test/unit/helpers/test-component'

import DeliveryInstructions from '../DeliveryInstructions'
import {
  WrappedDeliveryInstructionsContainer,
  mapStateToProps,
} from '../DeliveryInstructionsContainer'

describe('<DeliveryInstructionsContainer />', () => {
  const renderComponent = testComponentHelper(
    WrappedDeliveryInstructionsContainer
  )

  describe('mapStateToProps', () => {
    describe('deliveryInstructionsField', () => {
      it('should get the data form the state', () => {
        const { deliveryInstructionsField } = mapStateToProps({
          forms: {
            checkout: {
              deliveryInstructions: {
                fields: {
                  deliveryInstructions: {
                    value: 'foo',
                    isTouched: true,
                  },
                },
              },
            },
          },
        })
        expect(deliveryInstructionsField).toEqual({
          value: 'foo',
          isTouched: true,
        })
      })
    })

    describe('deliveryInstructionsError', () => {
      it('should not allow emojis in the instructions', () => {
        const { deliveryInstructionsError } = mapStateToProps({
          forms: {
            checkout: {
              deliveryInstructions: {
                errors: {
                  deliveryInstructions: 'Please remove all emoji characters',
                },
              },
            },
          },
        })
        expect(deliveryInstructionsError).toEqual(
          'Please remove all emoji characters'
        )
      })
    })
  })

  describe('@render', () => {
    const noop = () => {}
    const requiredProps = {
      setAndValidateFormField: noop,
      touchFormField: noop,
    }

    it('should not render if `shippingCountry` isn‘t `United Kingdom`', () => {
      const { wrapper } = renderComponent({
        shippingCountry: 'France',
      })
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should not render if `deliveryLocationType` isn‘t `HOME`', () => {
      const { wrapper } = renderComponent({
        deliveryLocationType: 'STORE',
      })
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should display if `shouldDisplay` is `true`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        shouldDisplay: true,
      })
      expect(wrapper.find(DeliveryInstructions).length).toBe(1)
    })
  })
})
