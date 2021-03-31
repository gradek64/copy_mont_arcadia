import testComponentHelper from 'test/unit/helpers/test-component'
import EReceipt from '../EReceipt'

describe('<EReceipt /> ', () => {
  const initialProps = {
    fakeProp: 'fake prop',
  }
  const renderComponent = testComponentHelper(EReceipt)
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
