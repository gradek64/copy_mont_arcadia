import testComponentHelper from 'test/unit/helpers/test-component'

import CVVInfo from '../CVVInfo'

describe('<CVVInfo/>', () => {
  const renderComponent = testComponentHelper(CVVInfo)

  describe('@renders', () => {
    it('should render default state correctly', () => {
      const component = renderComponent()
      expect(component.getTree()).toMatchSnapshot()
    })
  })
})
