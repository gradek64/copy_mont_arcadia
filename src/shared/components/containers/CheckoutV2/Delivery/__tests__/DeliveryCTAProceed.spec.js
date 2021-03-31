import testComponentHelper from 'test/unit/helpers/test-component'
import DeliveryCTAProceed from '../DeliveryCTAProceed'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

describe('<DeliveryCTAProceed />', () => {
  const renderComponent = testComponentHelper(DeliveryCTAProceed)

  const initialProps = {
    nextButtonHidden: false,
    isActive: true,
    isDisabled: false,
    nextHandler: jest.fn(),
    isMobile: false,
    isOutOfStock: false,
    pathname: '/checkout/delivery',
  }

  describe('@renders', () => {
    it('should render the DeliveryCTAProceed button', () => {
      const { wrapper } = renderComponent(initialProps)
      const buttonContainer = wrapper.find(
        '.DeliveryCTAProceed-nextButtonContainer'
      )
      const buttonContainerWithError = wrapper.find(
        '.DeliveryCTAProceed-nextButtonContainer--hasError'
      )

      expect(buttonContainer.exists()).toBe(true)
      expect(buttonContainerWithError.exists()).toBe(false)
    })

    it('should not render the DeliveryCTAProceed button if nextButtonHidden is true', () => {
      const props = {
        ...initialProps,
        nextButtonHidden: true,
      }
      const { wrapper } = renderComponent(props)
      const buttonContainer = wrapper.find(
        '.DeliveryCTAProceed-nextButtonContainer'
      )
      expect(buttonContainer.exists()).toBe(false)
    })

    it('should render with the hasError class if Out of Stock is true on mobile', () => {
      const props = {
        ...initialProps,
        isOutOfStock: true,
        isMobile: true,
      }
      const { wrapper } = renderComponent(props)
      const buttonContainerWithError = wrapper.find(
        '.DeliveryCTAProceed-nextButtonContainer--hasError'
      )
      expect(buttonContainerWithError.exists()).toBe(true)
    })

    it('should not render with the hasError class if Out of Stock is true on desktop', () => {
      const props = {
        ...initialProps,
        isOutOfStock: true,
      }
      const { wrapper } = renderComponent(props)
      const buttonContainerWithError = wrapper.find(
        '.DeliveryCTAProceed-nextButtonContainer--hasError'
      )
      expect(buttonContainerWithError.exists()).toBe(false)
    })

    it('should render with the mobile class if isMobile is true', () => {
      const props = {
        ...initialProps,
        isMobile: true,
      }
      const { wrapper } = renderComponent(props)
      const ctaButtonMobile = wrapper.find('.DeliveryCTAProceed-nextButton')
      expect(ctaButtonMobile.exists()).toBe(true)
    })

    it('should render with the desktop class if isMobile is false', () => {
      const props = {
        ...initialProps,
        isMobile: false,
      }
      const { wrapper } = renderComponent(props)
      const ctaButtonMobile = wrapper.find(
        '.DeliveryCTAProceed-nextButton--desktop'
      )
      expect(ctaButtonMobile.exists()).toBe(true)
    })

    it('should display the OrderProductNotification if Out of Stock is true', () => {
      const props = {
        ...initialProps,
        isOutOfStock: true,
      }
      const { wrapper } = renderComponent(props)
      const productNotification = wrapper.find('OrderProductNotification')
      expect(productNotification.exists()).toBe(true)
    })

    it('should not render OrderProductNotification if Out of Stock is false', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('OrderProductNotification').exists()).toBe(false)
    })
  })
})
