import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import { WrappedExpiredPassword as ExpiredPassword } from '../ExpiredPassword'

const renderComponent = testComponentHelper(ExpiredPassword)

describe('<ExpiredPassword />', () => {
  const props = {}

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@render', () => {
    it('renders', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })
})
