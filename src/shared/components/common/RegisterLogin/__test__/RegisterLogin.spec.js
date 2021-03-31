import RegisterLogin from '../RegisterLogin'
import testComponentHelper from 'test/unit/helpers/test-component'

describe('<RegisterLogin />', () => {
  const renderComponent = testComponentHelper(RegisterLogin)
  const initState = {
    source: 'TIMEOUT',
    getLoginNextRoute: () => null,
    getRegisterNextRoute: () => null,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initState).getTree()).toMatchSnapshot()
    })

    it('should add class names to hide register component and remove margins to login component', () => {
      expect(
        renderComponent({ ...initState, hideRegister: true }).getTree()
      ).toMatchSnapshot()
    })
  })
})
