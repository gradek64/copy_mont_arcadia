import testComponentHelper from 'test/unit/helpers/test-component'
import LoginRegisterHeader from '../LoginRegisterHeader'

describe('<LoginRegister />', () => {
  const renderComponent = testComponentHelper(LoginRegisterHeader)

  describe('@renders', () => {
    it('in default state', () => {
      expect(
        renderComponent({
          children: 'Title',
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
