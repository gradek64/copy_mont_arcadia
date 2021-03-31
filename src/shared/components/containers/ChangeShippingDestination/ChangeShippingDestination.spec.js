import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import ChangeShippingDestination from './ChangeShippingDestination'
import ShippingPreferencesSelector from '../../common/ShippingPreferencesSelector/ShippingPreferencesSelector'

describe('<ChangeShippingDestination />', () => {
  const renderComponent = testComponentHelper(
    ChangeShippingDestination.WrappedComponent
  )

  describe('@decorators', () => {
    analyticsDecoratorHelper(
      ChangeShippingDestination,
      'change-shipping-destination',
      {
        componentName: 'ChangeShippingDestination',
      }
    )
  })

  describe('@renders', () => {
    it('should contain the ShippingPreferencesSelector', () => {
      expect(
        renderComponent({}).wrapper.find(ShippingPreferencesSelector)
      ).toHaveLength(1)
    })
  })
})
