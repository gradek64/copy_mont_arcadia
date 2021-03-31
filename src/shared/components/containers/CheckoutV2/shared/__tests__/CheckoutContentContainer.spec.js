import { openMiniBag } from '../../../../../actions/common/shoppingBagActions'
import testComponent, {
  renderConnectedComponentProps,
} from '../../../../../../../test/unit/helpers/test-component'
import CheckoutContentContainer from '../CheckoutContentContainer'

jest.mock('../../../../../actions/common/shoppingBagActions', () => ({
  openMiniBag: jest.fn(() => ({ type: 'foo' })),
}))

const renderComponent = testComponent(CheckoutContentContainer.WrappedComponent)

describe('@renders', () => {
  describe('the default rendering', () => {
    const props = {
      getAccount: jest.fn(),
    }
    const component = renderComponent(props)

    it('renders as expected', () => {
      expect(component.getTree()).toMatchSnapshot()
    })
  })
})

describe('@connected', () => {
  describe('mapping dispatch to props', () => {
    const props = renderConnectedComponentProps(CheckoutContentContainer)
    props.openMiniBag('bar')

    it('correctly maps dispatch to props', () => {
      expect(openMiniBag).toHaveBeenCalledTimes(1)
      expect(openMiniBag).toHaveBeenCalledWith('bar')
    })
  })
})
