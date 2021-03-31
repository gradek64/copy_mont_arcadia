import testComponentHelper from 'test/unit/helpers/test-component'

import QuickLinks from '../QuickLinks'

describe('<QuickLinks />', () => {
  const renderComponent = testComponentHelper(QuickLinks)

  describe('@renders', () => {
    it('in default state - rating number', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })
  })
})
