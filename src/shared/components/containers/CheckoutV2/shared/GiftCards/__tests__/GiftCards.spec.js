import testComponentHelper from 'test/unit/helpers/test-component'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import GiftCards from '../GiftCards'
import Accordion from '../../../../../common/Accordion/Accordion'
import Message from '../../../../../common/FormComponents/Message/Message'
import Input from '../../../../../common/FormComponents/Input/Input'

import {
  sendAnalyticsErrorMessage,
  sendAnalyticsClickEvent,
  GTM_ACTION,
  GTM_CATEGORY,
  ANALYTICS_ERROR,
} from '../../../../../../analytics'

const giftCards = [
  {
    giftCardId: '4624940',
    giftCardNumber: 'XXXX XXXX XXXX 5039',
    amountUsed: '34.00',
  },
  {
    giftCardId: '4624944',
    giftCardNumber: 'XXXX XXXX XXXX 7689',
    amountUsed: '10.00',
  },
  {
    giftCardId: '4624948',
    giftCardNumber: 'XXXX XXXX XXXX 5448',
    amountUsed: '20.00',
  },
]

const requiredProps = {
  fields: {
    giftCardNumber: {
      value: '6331456634615448',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    pin: {
      value: '8398',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
  },
  onAddGiftCard: () => {},
  onRemoveGiftCard: () => {},
  hideBanner: () => {},
  setAndValidateField: () => {},
  validate: () => {},
  touchField: () => {},
  setMeta: () => {},
  clearErrors: () => {},
  sendAnalyticsClickEvent: () => {},
  isFeatureGiftCardsEnabled: true,
  isGiftCardRedemptionEnabled: false,
  isGiftCardValueThresholdMet: false,
  giftCardRedemptionPercentage: 100,
}

describe('<GiftCards />', () => {
  const renderComponent = testComponentHelper(GiftCards)

  describe('@renders', () => {
    it('should render default state', () => {
      expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
    })

    it('should not render if the feature flag is disabled state', () => {
      expect(
        renderComponent({
          ...requiredProps,
          isFeatureGiftCardsEnabled: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render gift cards', () => {
      const props = {
        ...requiredProps,
        giftCards,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('should display total if supplied', () => {
      const props = {
        ...requiredProps,
        giftCards,
        total: '10.50',
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('Price').prop('price')).toBe('10.50')
    })

    it('should not show another gift card form if the total is 0', () => {
      const props = {
        ...requiredProps,
        giftCards,
        total: '0.00',
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(Input)).toHaveLength(0)
    })

    it('should allow a maximum of 5 gift cards by default', () => {
      const props = {
        ...requiredProps,
        giftCards: giftCards.concat(giftCards).slice(0, 5),
      }
      const { wrapper } = renderComponent(props)
      const message = wrapper.find('Message')
      expect(wrapper.find(Input)).toHaveLength(0)
      expect(message.hasClass('GiftCards-message')).toBe(true)
      expect(message.prop('message')).toBe(
        'You have added the maximum number of gift cards for this order.'
      )
      expect(message.prop('type')).toBe('message')
    })

    it('should show the error message', () => {
      const props = {
        ...requiredProps,
        errorMessage: 'The gift card number must be valid',
      }
      const message = renderComponent(props).wrapper.find('Message')
      expect(message.hasClass('GiftCards-message')).toBe(true)
      expect(message.prop('message')).toBe('The gift card number must be valid')
      expect(message.prop('type')).toBe('error')
    })

    it('should show the banner message', () => {
      const props = {
        ...requiredProps,
        bannerMessage: 'Thank you, your gift card has been added.',
      }
      const banner = renderComponent(props).wrapper.find('Message')
      expect(banner.hasClass('GiftCards-banner')).toBe(true)
      expect(banner.prop('message')).toBe(
        'Thank you, your gift card has been added.'
      )
    })

    it('should disable ‘Apply Card’ button if errors', () => {
      const props = {
        ...requiredProps,
        giftCardNumberError: 'Giftcard number needs to be 16 characters long.',
        pinError: 'Giftcard PIN needs to be 4 characters long.',
      }
      expect(
        renderComponent(props)
          .wrapper.find('Button')
          .prop('isDisabled')
      ).toBe(true)
    })

    describe('when `isGiftCardRedemptionEnabled` and `isGiftCardValueThresholdMet` are equal to false', () => {
      it('should not show the redemption percentage warning', () => {
        const { wrapper } = renderComponent(requiredProps)
        expect(wrapper.find(Message)).toHaveLength(0)
      })
    })

    describe('when `isGiftCardRedemptionEnabled` is equal to true and `isGiftCardValueThresholdMet` is equal false', () => {
      it('should not show the redemption percentage warning and should show the form', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          isGiftCardRedemptionEnabled: true,
        })

        expect(wrapper.find(Message)).toHaveLength(0)
        expect(wrapper.find(Input)).toHaveLength(2)
      })
    })

    describe('when `isGiftCardRedemptionEnabled` and `isGiftCardValueThresholdMet` are equal to true', () => {
      it('should show the redemption percentage warning and hide the form', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          isGiftCardRedemptionEnabled: true,
          isGiftCardValueThresholdMet: true,
          giftCardRedemptionPercentage: 50,
        })

        expect(wrapper.find(Message)).toHaveLength(1)
        expect(wrapper.find(Message).prop('message')).toEqual(
          'You can use gift cards to pay for up to 50% of each order. Any balance will remain on your gift card for future purchases.'
        )
        expect(wrapper.find(Input)).toHaveLength(0)
      })
    })
  })

  describe('@lifecycle', () => {
    describe('constructor', () => {
      it('should set initial state for accordion to be contracted', () => {
        const { instance } = renderComponent(requiredProps)
        expect(instance.state.isAccordionExpanded).toBe(false)
      })
    })
  })

  describe('@events', () => {
    describe('Accordion', () => {
      describe('onAccordionToggle', () => {
        it('should toggle instance state of accordion', () => {
          const { instance, wrapper } = renderComponent({
            ...requiredProps,
            clearErrors: jest.fn(),
          })
          wrapper.find(Accordion).prop('onAccordionToggle')()
          expect(instance.state.isAccordionExpanded).toBe(true)
          expect(instance.props.clearErrors).toHaveBeenCalledTimes(0)
          wrapper.find(Accordion).prop('onAccordionToggle')()
          expect(instance.state.isAccordionExpanded).toBe(false)
          expect(instance.props.clearErrors).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('Gift card', () => {
      it('should pass gift card ID to `onRemoveGiftCard` on remove', () => {
        const onRemoveGiftCardMock = jest.fn()
        const props = {
          ...requiredProps,
          giftCards,
          onRemoveGiftCard: onRemoveGiftCardMock,
        }
        const { wrapper } = renderComponent(props)
        wrapper
          .find('GiftCard')
          .first()
          .prop('onRemove')()
        expect(onRemoveGiftCardMock).toHaveBeenCalledWith('4624940')
      })
    })

    describe('Gift card number input', () => {
      it('should set `giftCardNumber` form field on change', () => {
        const setAndValidateFieldMock = jest.fn()
        const props = {
          ...requiredProps,
          setAndValidateField: setAndValidateFieldMock,
        }
        const { wrapper } = renderComponent(props)
        wrapper.find({ name: 'giftCardNumber' }).prop('setField')(
          'giftCardNumber'
        )({ target: { value: '633145663461544' } })
        expect(setAndValidateFieldMock).toHaveBeenCalledWith(
          'giftCardNumber',
          '633145663461544',
          []
        )
      })

      it('should touch `giftCardNumber` form field and clear message on touch', () => {
        const touchFieldMock = jest.fn()
        const setMetaMock = jest.fn()
        const props = {
          ...requiredProps,
          touchField: touchFieldMock,
          setMeta: setMetaMock,
        }
        const { wrapper } = renderComponent(props)
        wrapper.find({ name: 'giftCardNumber' }).prop('touchedField')(
          'giftCardNumber'
        )()
        expect(touchFieldMock).toHaveBeenCalledWith('giftCardNumber')
        expect(setMetaMock).toHaveBeenCalledWith('message', {})
      })
    })

    describe('Apply card button', () => {
      it('should pass field values to `onAddGiftCard` on click', () => {
        const onAddGiftCardMock = jest.fn()
        const props = {
          ...requiredProps,
          onAddGiftCard: onAddGiftCardMock,
        }
        const { wrapper } = renderComponent(props)
        wrapper.find('Button').prop('clickHandler')()
        expect(onAddGiftCardMock).toHaveBeenCalledWith({
          giftCardNumber: '6331456634615448',
          pin: '8398',
        })
      })

      it('should force an error if fields are empty', () => {
        const onAddGiftCardMock = jest.fn()
        const props = {
          ...requiredProps,
          fields: {
            giftCardNumber: {
              value: '',
              isDirty: false,
              isTouched: true,
              isFocused: false,
            },
            pin: {
              value: '',
              isDirty: false,
              isTouched: true,
              isFocused: false,
            },
          },
          onAddGiftCard: onAddGiftCardMock,
          touchField: jest.fn(),
          setAndValidateField: jest.fn(),
        }
        const { wrapper } = renderComponent(props)
        wrapper.find('Button').prop('clickHandler')()
        expect(onAddGiftCardMock).toHaveBeenCalledTimes(0)
        expect(props.touchField).toHaveBeenCalledTimes(2)
        expect(props.setAndValidateField).toHaveBeenCalledTimes(2)
      })

      it('should push the click event to GTM', () => {
        const props = {
          ...requiredProps,
          sendAnalyticsClickEvent: jest.fn(),
        }

        const { wrapper, instance } = renderComponent(props)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        wrapper.find('Button').prop('clickHandler')()
        expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
        expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.CHECKOUT,
          action: GTM_ACTION.GIFT_CARD,
          label: requiredProps.fields.giftCardNumber.value,
          value: '',
        })
      })

      it('should call the GTM error action', async () => {
        const middlewares = [thunk]
        const mockStore = configureMockStore(middlewares)
        const store = mockStore({})
        const expectedActions = [
          {
            type: 'MONTY/ANALYTICS.SEND_ERROR_MESSAGE',
            errorMessage: 'Error applying gift card in checkout',
          },
          {
            type: 'MONTY/ANALYTICS.SEND_CLICK_EVENT',
            payload: {
              category: 'checkout',
              action: 'giftCardApplied',
              label: requiredProps.fields.giftCardNumber.value,
              value: '',
            },
          },
        ]

        await store.dispatch(
          sendAnalyticsErrorMessage(ANALYTICS_ERROR.GIFT_CARD_ERROR)
        )

        await store.dispatch(
          sendAnalyticsClickEvent({
            category: GTM_CATEGORY.CHECKOUT,
            action: GTM_ACTION.GIFT_CARD,
            label: requiredProps.fields.giftCardNumber.value,
            value: '',
          })
        )

        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })
  })

  describe('@methods', () => {
    describe('isSomethingLeftToPay', () => {
      it('should decide whether to show the additional card', () => {
        const props = {
          ...requiredProps,
          giftCards,
        }
        const { instance } = renderComponent(props)
        expect(instance.isSomethingLeftToPay('0.00')).toBe(false)
        expect(instance.isSomethingLeftToPay('')).toBe(true)
        expect(instance.isSomethingLeftToPay('4.12')).toBe(true)
      })
    })
  })
})
