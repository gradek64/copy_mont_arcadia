import testComponentHelper from 'test/unit/helpers/test-component'
import SignOut from '../SignOut'

const initialProps = {
  logoutRequest: jest.fn(),
}

const renderComponent = testComponentHelper(SignOut.WrappedComponent)

describe('<SignOut />', () => {
  beforeEach(() => jest.resetAllMocks())

  it('renders the loader', () => {
    const { wrapper } = renderComponent(initialProps)
    expect(wrapper.html()).toBeNull()
  })

  it('calls logoutRequest', () => {
    renderComponent(initialProps)
    expect(initialProps.logoutRequest).toHaveBeenCalledTimes(1)
  })
})
