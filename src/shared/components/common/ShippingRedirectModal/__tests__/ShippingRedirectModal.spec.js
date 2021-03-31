import ShippingRedirectModal, {
  WrappedShippingRedirectModal,
} from '../ShippingRedirectModal'
import { GTM_EVENT } from '../../../../analytics'
import Button from '../../../common/Button/Button'
import Select from '../../FormComponents/Select/Select'
import BagTransferNote from '../../../common/BagTransferNote/BagTransferNote'
import testComponentHelper, {
  renderConnectedComponentProps,
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'
import * as language from '../../../../lib/language'
import deepFreeze from 'deep-freeze'

jest.mock('../../../../lib/language')

describe('<ShippingRedirectModal />', () => {
  const renderComponent = testComponentHelper(WrappedShippingRedirectModal)
  const mount = () =>
    buildComponentRender(mountRender, WrappedShippingRedirectModal)

  const props = {
    country: 'France',
    brandCode: 'tsuk',
    closeModal: jest.fn(),
    redirect: jest.fn(),
    sendAnalyticsDisplayEvent: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Connected component', () => {
    it('should receive the correct props', () => {
      language.isMultiLanguageShippingCountry.mockReturnValue(false)
      language.getDefaultLanguageByShippingCountry.mockReturnValue('Foolish')
      language.getBrandLanguageOptions.mockReturnValue([
        { label: 'Foo', value: 'Foo' },
      ])

      const initialState = deepFreeze({
        config: {
          brandCode: 'tmuk',
        },
      })
      const { brandCode } = renderConnectedComponentProps(
        ShippingRedirectModal,
        initialState
      )
      expect(brandCode).toBe(initialState.config.brandCode)
    })
  })

  describe('@render', () => {
    it('should render correct elements', () => {
      const { wrapper } = renderComponent(props)

      expect(wrapper.find('.ShippingRedirectModal-intro').text()).toBe(
        'You are about to be taken to the website for:'
      )
      expect(wrapper.find('.ShippingRedirectModal-cancel')).toHaveLength(1)
      expect(wrapper.find(BagTransferNote)).toHaveLength(1)
    })

    it('should send tracking event when modal is shown', () => {
      mount()(props)
      expect(props.sendAnalyticsDisplayEvent).toHaveBeenCalledTimes(1)
      expect(props.sendAnalyticsDisplayEvent).toHaveBeenCalledWith(
        {
          shippingCountry: 'France',
          shippableCountry: false,
        },
        GTM_EVENT.CHECKOUT_SHIPPING_REDIRECT_MODAL_DISPLAYED
      )
    })
  })

  describe('@events', () => {
    it('should support a brand with one language', () => {
      language.isMultiLanguageShippingCountry.mockReturnValue(false)
      language.getDefaultLanguageByShippingCountry.mockReturnValue('Foolish')
      language.getBrandLanguageOptions.mockReturnValue([
        { label: 'Foo', value: 'Foo' },
        { label: 'Bar', value: 'Bar' },
      ])

      const { wrapper } = renderComponent(props)
      const Buttons = wrapper.find(Button)

      expect(language.isMultiLanguageShippingCountry).toHaveBeenCalledWith(
        props.country,
        true
      )
      expect(language.getDefaultLanguageByShippingCountry).toHaveBeenCalledWith(
        props.brandCode,
        props.country,
        true
      )
      expect(language.getBrandLanguageOptions).toHaveBeenCalledWith(
        props.brandCode,
        true
      )

      expect(Buttons).toHaveLength(1)
      expect(
        Buttons.first()
          .dive()
          .text()
      ).toBe('Continue')

      Buttons.first()
        .dive()
        .find('button')
        .simulate('click')
      expect(props.redirect).toHaveBeenCalledTimes(1)
      expect(props.redirect).toHaveBeenCalledWith(
        'France',
        'Foolish',
        'shippingRedirectModalCheckout'
      )
    })

    it('should support a brand with multiple languages', () => {
      language.isMultiLanguageShippingCountry.mockReturnValue(true)
      language.getDefaultLanguageByShippingCountry.mockReturnValue('French')
      language.getBrandLanguageOptions.mockReturnValue([
        { label: 'French', value: 'French' },
        { label: 'English', value: 'English' },
        { label: 'German', value: 'German' },
      ])

      const { wrapper } = renderComponent(props)
      const Selects = wrapper.find(Select)
      const cancelLink = wrapper.find('.ShippingRedirectModal-cancel')

      expect(Selects).toHaveLength(1)

      Selects.first().simulate('change', { target: { value: 'German' } })

      wrapper.update()

      const Buttons = wrapper.find(Button)
      Buttons.first()
        .dive()
        .find('button')
        .simulate('click')
      expect(props.redirect).toHaveBeenCalledTimes(1)
      expect(props.redirect).toHaveBeenCalledWith(
        'France',
        'German',
        'shippingRedirectModalCheckout'
      )

      expect(props.closeModal).toHaveBeenCalledTimes(0)
      cancelLink.simulate('click', { preventDefault() {} })
      expect(props.closeModal).toHaveBeenCalledTimes(1)
    })
  })
})
