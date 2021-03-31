import testComponentHelper from 'test/unit/helpers/test-component'

import DeliveryCutoffMessage from '../DeliveryCutoffMessage'
import FeatureCheck from '../../FeatureCheck/FeatureCheck'

describe('<DeliveryCutoffMessage />', () => {
  const renderComponent = testComponentHelper(DeliveryCutoffMessage)

  describe('@renders', () => {
    it('should render nothing by default', () => {
      const { wrapper } = renderComponent()
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should render if there is a `message` prop', () => {
      const { getTree } = renderComponent({
        message: 'Order in 9 hrs 23 mins for next day delivery',
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should only display if `FEATURE_DELIVERY_CUTOFF_MESSAGE` feature flag is on', () => {
      const { wrapper } = renderComponent({
        message: 'Order in 9 hrs 23 mins for next day delivery',
      })
      expect(wrapper.find(FeatureCheck).prop('flag')).toBe(
        'FEATURE_DELIVERY_CUTOFF_MESSAGE'
      )
    })
  })
})
