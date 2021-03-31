import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import FindInStoreButton from '../FindInStoreButton'

const onClick = jest.fn()

describe('</FindInStoreButton>', () => {
  const renderComponent = testComponentHelper(FindInStoreButton)

  describe('@renders', () => {
    it('desktop button', () => {
      expect(
        renderComponent({ type: 'desktop', region: 'uk', onClick }).getTree()
      ).toMatchSnapshot()
    })
    it('mobile button', () => {
      expect(
        renderComponent({ type: 'mobile', region: 'uk', onClick }).getTree()
      ).toMatchSnapshot()
    })
    it('nothing if region is not uk', () => {
      expect(
        renderComponent({ type: 'mobile', region: 'us', onClick }).getTree()
      ).toMatchSnapshot()
    })
  })
})
