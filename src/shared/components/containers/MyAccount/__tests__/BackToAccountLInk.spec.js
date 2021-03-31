import testComponentHelper from 'test/unit/helpers/test-component'
import BackToAccountLink from '../BackToAccountLink'

describe('<BackToAccountLink />', () => {
  const renderComponent = testComponentHelper(BackToAccountLink)
  const initialProps = {
    text: 'message',
  }

  describe('@render', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
