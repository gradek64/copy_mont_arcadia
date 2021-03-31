import testComponentHelper from 'test/unit/helpers/test-component'
import FreeShippingMessage from '../FreeShippingMessage'

const initialProps = {
  bagDiscounts: 0,
  bagSubtotal: 0,
  brandCode: 'ts',
  modifier: 'minibag',
  isFeatureThresholdNudgeMessageEnabled: false,
  currencyCode: 'GBP',
  deliveryMessageThresholds: {
    nudgeMessageThreshold: 30.0,
    standardDeliveryThreshold: 50.0,
    expressDeliveryThreshold: 70.0,
  },
}

const render = testComponentHelper(FreeShippingMessage.WrappedComponent)

describe('<FreeShippingMessage>', () => {
  describe('@renders', () => {
    describe('thresholds are missing', () => {
      it('returns null if isFeatureThresholdNudgeMessageEnabled is false', () => {
        const { wrapper } = render({
          ...initialProps,
          deliveryMessageThresholds: {},
          bagSubtotal: '40.0',
        })

        expect(wrapper.html()).toBe(null)
      })

      it('returns null if isFeatureThresholdNudgeMessageEnabled is true', () => {
        const { wrapper } = render({
          ...initialProps,
          deliveryMessageThresholds: {},
          isFeatureThresholdNudgeMessageEnabled: true,
          bagSubtotal: '40.0',
        })

        expect(wrapper.html()).toBe(null)
      })

      it('returns null if isFeatureThresholdNudgeMessageEnabled and isFeatureFreeExpressDeliveryMessageEnabled are true', () => {
        const { wrapper } = render({
          ...initialProps,
          deliveryMessageThresholds: {},
          isFeatureThresholdNudgeMessageEnabled: true,
          isFeatureFreeExpressDeliveryMessageEnabled: true,
          bagSubtotal: '40.0',
        })

        expect(wrapper.html()).toBe(null)
      })
    })

    describe('thresholds are present', () => {
      it('render default status', () => {
        expect(
          render({
            ...initialProps,
            bagSubtotal: 55.0,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('renders a message informing user that they have reached the free delivery', () => {
        const { wrapper } = render({
          ...initialProps,
          bagSubtotal: 55.0,
        })

        expect(wrapper.text()).toEqual('Your bag qualifies for free shipping')
      })

      it('renders a message informing user theyre close to free delivery', () => {
        const { wrapper } = render({
          ...initialProps,
          brandCode: 'dp',
          bagSubtotal: 40.0,
          isFeatureThresholdNudgeMessageEnabled: true,
        })

        expect(wrapper.text()).toEqual(
          'Spend £10.00 more and get FREE Standard Delivery'
        )
      })

      it('render topshop message string as default if missed', () => {
        const { wrapper } = render({
          ...initialProps,
          brandCode: 'fake',
          currencyCode: 'cats',
          bagSubtotal: 55.0,
        })

        expect(wrapper.text()).toEqual('Your bag qualifies for free shipping')
      })

      describe('isFeatureFreeExpressDeliveryEnabled is enabled', () => {
        it('renders express delivery message if bagSubtotal is greater than or equal to express threshold ', () => {
          const { wrapper } = render({
            ...initialProps,
            brandCode: 'ms',
            currencyCode: 'GBP',
            isFeatureFreeExpressDeliveryMessageEnabled: true,
            bagSubtotal: 70.0,
          })
          expect(wrapper.text()).toBe(
            `Congratulations! You've qualified for FREE express delivery`
          )
        })
        it('renders standard delivery message if bagSubtotal is less than express threshold ', () => {
          const { wrapper } = render({
            ...initialProps,
            brandCode: 'ms',
            currencyCode: 'GBP',
            isFeatureFreeExpressDeliveryMessageEnabled: true,
            bagSubtotal: 69.0,
          })
          expect(wrapper.text()).toBe(
            `Congratulations! You've qualified for FREE standard delivery`
          )
        })

        it('renders nudge message if bagSubtotal is less than express and standard thresholds and isFeatureThresholdNudgeMessage is true', () => {
          const { wrapper } = render({
            ...initialProps,
            brandCode: 'ms',
            currencyCode: 'GBP',
            isFeatureThresholdNudgeMessageEnabled: true,
            isFeatureFreeExpressDeliveryMessageEnabled: true,
            bagSubtotal: 39.0,
          })

          expect(wrapper.text()).toBe(
            `You're only £11.00 away from FREE standard deliveryGo on, treat yourself...`
          )
        })
      })
    })
  })
})
