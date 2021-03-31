import testComponentHelper from 'test/unit/helpers/test-component'
import SubmitButton from '../SubmitButton'

describe('<SubmitButton />', () => {
  const initialProps = {
    formMode: 'default',
    isActive: true,
  }
  const renderComponent = testComponentHelper(SubmitButton)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
