import testComponentHelper from '../../../../../test/unit/helpers/test-component'
import OrderProductNotification from './OrderProductNotification'

describe('<OrderProductNotification/>', () => {
  const renderComponent = testComponentHelper(OrderProductNotification)

  describe('@renders', () => {
    it('in default state', () => {
      expect(
        renderComponent({ message: 'test message' }).getTree()
      ).toMatchSnapshot()
    })
    it('in error state', () => {
      expect(
        renderComponent({
          message: 'test error message',
          hasError: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('a bold message', () => {
      expect(
        renderComponent({
          boldMessage: 'another bold messsage',
          message: 'test error message',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('no message or icon', () => {
      expect(
        renderComponent({
          message: '',
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
