import testComponentHelper from '../../../../../test/unit/helpers/test-component'
import ShippingPreferencesSelectorModal from './ShippingPreferencesSelectorModal'
import ShippingPreferencesSelector from '../../common/ShippingPreferencesSelector/ShippingPreferencesSelector'

describe('<ShippingPreferencesSelectorModal />', () => {
  const renderComponent = testComponentHelper(ShippingPreferencesSelectorModal)

  describe('@renders', () => {
    it('should contain the ShippingPreferencesSelector', () => {
      expect(
        renderComponent({}).wrapper.find(ShippingPreferencesSelector)
      ).toHaveLength(1)
    })
  })
})
