import testComponentHelper from 'test/unit/helpers/test-component'
import DigitalDeliveryPass from '../DigitalDeliveryPass'

const initialProps = {
  brandName: 'burton',
  ddpDefaultSku: {
    name: 'Digital Delivery Pass',
  },
}

describe('<DigitalDeliveryPass />', () => {
  const renderComponent = testComponentHelper(
    DigitalDeliveryPass.WrappedComponent
  )

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })

    it('should be expanded with loader displayed by default', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.prop('expanded')).toBe(true)
      expect(wrapper.prop('showLoader')).toBe(true)
    })

    it('should render the correct title if DDPDefaultSku is returned', () => {
      const props = {
        ...initialProps,
        ddpDefaultSku: {
          name: 'DDP VIP 1 Month',
        },
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('should render the fallback title if DDPDefaultSku is undefined', () => {
      const props = {
        ...initialProps,
        ddpDefaultSku: undefined,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@instance methods', () => {
    describe('onContentLoaded', () => {
      it('updates Accordion to not show loader', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(wrapper.prop('showLoader')).toBe(true)
        instance.onContentLoaded()
        wrapper.update()
        expect(wrapper.prop('showLoader')).toBe(false)
      })
    })
  })
})
