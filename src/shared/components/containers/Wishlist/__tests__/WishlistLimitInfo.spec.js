import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import WishlistLimitInfo from '../WishlistLimitInfo'

const context = { l: jest.fn() }
const renderComponent = testComponentHelper(WishlistLimitInfo, { context })

describe(WishlistLimitInfo.name, () => {
  it('renders correctly', () => {
    expect(renderComponent({}).getTree()).toMatchSnapshot()
  })

  describe('if the `withMarginTop` prop is true', () => {
    it('should apply the `--withMarginTop` modified classname to the outermost element', () => {
      const { wrapper } = renderComponent({ withMarginTop: true })
      expect(
        wrapper.hasClass('WishlistLimitInfo-outerWrapper--withMarginTop')
      ).toBe(true)
    })
  })
})
