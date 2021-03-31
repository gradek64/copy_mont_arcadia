import SignInMessage from '../SignInMessage'
import testComponentHelper from 'test/unit/helpers/test-component'

describe('<SignInMessage />', () => {
  const renderComponent = testComponentHelper(SignInMessage)
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })

    it('should add a class to center align text', () => {
      expect(renderComponent({ centerAlign: true }).getTree()).toMatchSnapshot()
    })
  })
})
