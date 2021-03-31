import testComponentHelper from 'test/unit/helpers/test-component'
import { GTM_CATEGORY } from '../../../../analytics/analytics-constants'
import Accordion from '../../../common/Accordion/Accordion'
import PromotionCode from '../PromotionCode'
import PromotionForm from '../PromotionForm'

describe('<PromotionCode />', () => {
  const initialProps = {
    checkoutV2Enabled: false,
    setFormMeta: jest.fn(),
    setFormMessage: jest.fn(),
    resetForm: jest.fn(),
    promotionForm: {
      isVisible: true,
    },
    gtmCategory: GTM_CATEGORY.CHECKOUT,
    scrollOnPromoCodeError: true,
  }
  const promotion1 = {
    promotionCode: 'TSCARD1',
    label: 'Topshop Card- £5 Welcome offer on a £50+ spend',
  }
  const promotion2 = {
    promotionCode: 'TSCARD2',
    label: 'Topshop Card- £10 Welcome offer on a £50+ spend',
  }
  const renderComponent = testComponentHelper(
    PromotionCode.WrappedComponent.WrappedComponent
  )

  beforeEach(() => jest.resetAllMocks())
  jest.useFakeTimers()

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('should render a h3 accordion header with different copy if in new checkout', () => {
      expect(
        renderComponent({
          ...initialProps,
          checkoutV2Enabled: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should add a className if is groupMember is true', () => {
      expect(
        renderComponent({
          ...initialProps,
          groupMember: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should add className if it exists', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'banana',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should add is-shown class to confirm message if promotionCodeConfirmation is true', () => {
      expect(
        renderComponent({
          ...initialProps,
          promotionCodeConfirmation: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('PromotionForm should receive show=true is isVisible is false and currentPromotions is empty', () => {
      expect(
        renderComponent({
          ...initialProps,
          promotionForm: {
            isVisible: false,
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('PromotionForm should receive show=false is isVisible is false and currentPromotions is not empty', () => {
      expect(
        renderComponent({
          ...initialProps,
          promotionForm: {
            isVisible: false,
          },
          currentPromotions: [promotion1],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('Only the last Promotion should have showAddButton as true', () => {
      expect(
        renderComponent({
          ...initialProps,
          promotionForm: {
            isVisible: false,
          },
          currentPromotions: [promotion1, promotion2],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('The last Promotion should have showAddButton as false if promotionForm.isVisible is true', () => {
      expect(
        renderComponent({
          ...initialProps,
          promotionForm: {
            isVisible: true,
          },
          currentPromotions: [promotion1, promotion2],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should be able to disable Accordion header padding', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isHeaderPadded: false,
      })
      expect(wrapper.find(Accordion).prop('noHeaderPadding')).toBe(true)
    })

    it('should be able to disable Accordion content padding', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isContentPadded: false,
      })
      expect(wrapper.find(Accordion).prop('noContentPadding')).toBe(true)
    })

    it('should add `is-compact` class to Accordion header if `isCompactHeader` prop is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isCompactHeader: true,
      })
      const accordionHeaderClasses = wrapper
        .find(Accordion)
        .prop('header')
        .props.className.split(' ')
      expect(accordionHeaderClasses).toContain('is-compact')
    })
  })

  describe('@lifecycles', () => {
    describe('constructor', () => {
      it('should have initial state of accordion set to false by default', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.state.isAccordionExpanded).toBe(false)
      })

      it('should have initial state of accordion set to false when there are no promotions added', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isOpenIfPopulated: true,
        })
        expect(instance.state.isAccordionExpanded).toBe(false)
      })

      it('should have initial state of accordion set to true when there are promotions added', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isOpenIfPopulated: true,
          currentPromotions: [
            {
              promotionCode: 'TSCARD1',
              label: 'Topshop Card- £5 Welcome offer on a £50+ spend',
            },
          ],
        })
        expect(instance.state.isAccordionExpanded).toBe(true)
      })
    })
    describe('UNSAFE_componentWillMount', () => {
      it('should call setFormMeta and set isVisible to false if there are promotions', () => {
        renderComponent({
          ...initialProps,
          currentPromotions: [promotion1],
        })
        expect(initialProps.setFormMeta).toHaveBeenCalledTimes(1)
        expect(initialProps.setFormMeta).toHaveBeenCalledWith(
          'promotionCode',
          'isVisible',
          false
        )
      })

      it('should call setFormMeta and set isVisible to true if there are no promotions', () => {
        renderComponent(initialProps)
        expect(initialProps.setFormMeta).toHaveBeenCalledTimes(1)
        expect(initialProps.setFormMeta).toHaveBeenCalledWith(
          'promotionCode',
          'isVisible',
          true
        )
      })

      it('should call resetForm', () => {
        const { instance } = renderComponent(initialProps)
        instance.resetForm = jest.fn()
        instance.UNSAFE_componentWillMount()
        expect(instance.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.resetForm).toHaveBeenCalledWith()
      })

      it('should render open accordion if isOpenIfPopulated is true and currentPromotions is not empty', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isOpenIfPopulated: true,
          currentPromotions: [promotion1],
        })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
      })
    })

    describe('UNSAFE_componentWillReceiveProps', () => {
      it('shoud call setTimeout if promotionCodeConfirmation is false and nextProps.promotionCodeConfirmation is true', () => {
        const { instance } = renderComponent(initialProps)
        instance.UNSAFE_componentWillReceiveProps({
          ...initialProps,
          promotionCodeConfirmation: true,
        })
        expect(setTimeout).toHaveBeenCalledTimes(1)
      })

      it('should open accordion when promotions are added', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isOpenIfPopulated: true,
        })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(false)
        wrapper.setProps({ currentPromotions: [promotion1] })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
      })

      it('should open accordion if there is an error message', () => {
        const { wrapper } = renderComponent(initialProps)
        wrapper.setProps({
          promotionForm: {
            message: {
              message: 'fake promo code',
              type: 'error',
            },
          },
        })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
      })

      it('should not open accordion when isOpenIfPopulated is false and no error message', () => {
        const props = {
          ...initialProps,
          isOpenIfPopulated: false,
        }
        const { wrapper } = renderComponent(props)
        wrapper.setProps({
          promotionForm: {
            message: {},
          },
        })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(false)
      })

      it('should keep accordion expanded when there are no more promotions', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isOpenIfPopulated: true,
          currentPromotions: [promotion1],
        })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
        wrapper.setProps({ currentPromotions: [] })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
      })
    })
  })

  describe('@methods', () => {
    describe('onSubmitHandler', () => {
      it('should call addPromotionCode', () => {
        const addPromotionCode = jest.fn(({ errorCallback }) => errorCallback)
        const { instance } = renderComponent({
          ...initialProps,
          addPromotionCode,
        })
        const promotionCode = 'TSCARD1'
        expect(addPromotionCode).not.toHaveBeenCalled()
        instance.onSubmitHandler({ promotionCode })
        expect(addPromotionCode).toHaveBeenCalledTimes(1)
        expect(addPromotionCode).toHaveBeenCalledWith({
          promotionId: promotionCode,
          gtmCategory: GTM_CATEGORY.CHECKOUT,
          errorCallback: instance.scrollToPromoCodeError,
        })
      })
    })

    describe('setField', () => {
      it('should call setFormField', () => {
        const setFormField = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          setFormField,
        })
        const name = 'banana'
        const value = 'mango'
        const fn = instance.setField(name)
        expect(setFormField).not.toHaveBeenCalled()
        fn({ target: { value } })
        expect(setFormField).toHaveBeenCalledTimes(1)
        expect(setFormField).toHaveBeenCalledWith(
          'promotionCode',
          name,
          value.toUpperCase()
        )
      })
    })

    describe('resetForm', () => {
      it('should call setFormMessage and resetForm', () => {
        const { instance } = renderComponent(initialProps)
        jest.resetAllMocks()
        expect(initialProps.setFormMessage).not.toHaveBeenCalled()
        expect(initialProps.resetForm).not.toHaveBeenCalled()
        instance.resetForm()
        expect(initialProps.setFormMessage).toHaveBeenCalledTimes(1)
        expect(initialProps.setFormMessage).toHaveBeenCalledWith(
          'promotionCode',
          {}
        )
        expect(initialProps.resetForm).toHaveBeenCalledTimes(1)
        expect(initialProps.resetForm).toHaveBeenCalledWith('promotionCode', {
          promotionCode: '',
        })
      })
    })

    describe('removePromotionCode', () => {
      it('should call delPromotionCode', () => {
        const delPromotionCode = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          delPromotionCode,
        })
        const code = 'TSCARD1'
        expect(delPromotionCode).not.toHaveBeenCalled()
        instance.removePromotionCode(code)
        expect(delPromotionCode).toHaveBeenCalledTimes(1)
        expect(delPromotionCode).toHaveBeenCalledWith({
          promotionCode: code,
        })
      })
    })

    describe('showForm', () => {
      it('should call setFormMeta', () => {
        const { instance } = renderComponent(initialProps)
        jest.resetAllMocks()
        expect(initialProps.setFormMeta).not.toHaveBeenCalled()
        instance.showForm()
        expect(initialProps.setFormMeta).toHaveBeenCalledTimes(1)
        expect(initialProps.setFormMeta).toHaveBeenCalledWith(
          'promotionCode',
          'isVisible',
          true
        )
      })
    })

    describe('touchedField', () => {
      it('should call touchedFormField', () => {
        const touchedFormField = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          touchedFormField,
        })
        const name = 'banana'
        const fn = instance.touchedField(name)
        expect(touchedFormField).not.toHaveBeenCalled()
        fn()
        expect(touchedFormField).toHaveBeenCalledTimes(1)
        expect(touchedFormField).toHaveBeenCalledWith('promotionCode', name)
      })
    })
  })

  describe('@events', () => {
    describe('onAccordionToggle', () => {
      it('should toggle instance state of accordion', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          isOpenIfPopulated: true,
          currentPromotions: [promotion1],
        })
        wrapper.find(Accordion).prop('onAccordionToggle')()
        expect(instance.state.isAccordionExpanded).toBe(false)
        wrapper.find(Accordion).prop('onAccordionToggle')()
        expect(instance.state.isAccordionExpanded).toBe(true)
      })
    })

    it('should keep the state of accordion when data is entered', () => {
      const promotionFormWithField = (value) => ({
        fields: {
          promotionCode: {
            value,
          },
        },
      })
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        isOpenIfPopulated: true,
        currentPromotions: [promotion1],
        promotionForm: promotionFormWithField(''),
      })

      expect(instance.state.isAccordionExpanded).toBe(true)
      wrapper.setProps({ promotionForm: promotionFormWithField('TEST') })
      expect(instance.state.isAccordionExpanded).toBe(true)
    })
  })

  describe('promotion code error message', () => {
    it('should open the accordion and display an error message', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isOpenIfPopulated: true,
        currentPromotions: [],
        promotionForm: {
          message: {
            message: 'error message',
            type: 'error',
          },
          fields: {
            promotionCode: {
              value: '',
            },
          },
        },
      })
      const errorMsg = 'This is an error'

      wrapper.setProps({
        promotionForm: {
          fields: {
            promotionCode: {
              value: '',
            },
          },
          message: {
            message: errorMsg,
            type: 'error',
          },
        },
      })
      const accordion = wrapper.find(Accordion).dive()
      const form = wrapper.find(PromotionForm).dive()
      expect(accordion.find('.is-expanded').exists()).toBeTruthy()
      expect(
        form
          .find('.PromotionCode-message')
          .dive()
          .text()
      ).toBe(errorMsg)
    })
  })
})
