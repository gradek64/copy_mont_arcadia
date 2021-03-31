import testComponentHelper from 'test/unit/helpers/test-component'

import BreadCrumbs from '../BreadCrumbs'

describe('<BreadCrumbs />', () => {
  const renderComponent = testComponentHelper(BreadCrumbs)
  const initialProps = {
    checkoutStage: 'delivery',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
