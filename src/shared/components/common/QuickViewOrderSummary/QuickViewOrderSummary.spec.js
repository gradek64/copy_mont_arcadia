import testComponentHelper from 'test/unit/helpers/test-component'
import QuickViewOrderSummary from './QuickViewOrderSummary'

describe('<QuickViewOrderSummary/>', () => {
  const initialProps = {
    openMiniBag: jest.fn(),
    l: jest.fn(),
  }

  const renderComponent = testComponentHelper(QuickViewOrderSummary)

  describe('@renders', () => {
    it('should render correct default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
