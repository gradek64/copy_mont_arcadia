import testComponentHelper from 'test/unit/helpers/test-component'
import ProductQuickViewButton from '../ProductQuickViewButton'

describe('<ProductQuickViewButton/>', () => {
  const renderComponent = testComponentHelper(ProductQuickViewButton)
  const initialProps = {
    onClick: () => {},
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
