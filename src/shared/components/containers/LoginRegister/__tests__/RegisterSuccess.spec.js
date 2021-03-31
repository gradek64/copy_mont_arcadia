import testComponentHelper from 'test/unit/helpers/test-component'
import RegisterSuccess from '../RegisterSuccess'
import { browserHistory } from 'react-router'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

beforeAll(() => jest.clearAllMocks())

describe('<ForgotPassword />', () => {
  const initialProps = {}
  const context = {
    l: jest.fn((lang, brand, m) => m),
  }
  const renderComponent = testComponentHelper(RegisterSuccess, { context })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
  describe('@instance methods', () => {
    describe('onContinue', () => {
      it("calls browserHistory.push('/')", () => {
        const { instance } = renderComponent(initialProps)
        instance.onContinue()
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenLastCalledWith('/')
      })
    })
  })
})
