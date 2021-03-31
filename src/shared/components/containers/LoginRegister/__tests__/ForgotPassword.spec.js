import testComponentHelper from 'test/unit/helpers/test-component'
import { WrappedForgotPassword as ForgotPassword } from '../ForgotPassword'
import { browserHistory } from 'react-router'

jest.mock('react-router', () => ({
  browserHistory: {
    goBack: jest.fn(),
  },
}))

beforeAll(() => jest.clearAllMocks())

describe('<ForgotPassword />', () => {
  const initialProps = {}
  const context = {
    l: jest.fn((lang, brand, m) => m),
  }
  const renderComponent = testComponentHelper(ForgotPassword, { context })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
  describe('@events', () => {
    it('click button', () => {
      const { wrapper } = renderComponent(initialProps)
      wrapper.find('button').simulate('click')
      expect(browserHistory.goBack).toHaveBeenCalledTimes(1)
    })
  })
})
