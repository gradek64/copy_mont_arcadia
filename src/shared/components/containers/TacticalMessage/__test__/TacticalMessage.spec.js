import testComponentHelper from 'test/unit/helpers/test-component'

import TacticalMessage from '../TacticalMessage'
import SandBox from '../../SandBox/SandBox'

describe('<TacticalMessage />', () => {
  const renderComponent = testComponentHelper(TacticalMessage)

  describe('renders', () => {
    it('with defaults', () => {
      const { wrapper } = renderComponent({})
      const sandBox = wrapper.find(SandBox)
      expect(sandBox).toHaveLength(1)
      expect(sandBox.prop('contentType')).toBe('espot')
      expect(sandBox.prop('cmsPageName')).toBe('mobileTacticalMessageESpotPos1')
    })
  })
})
