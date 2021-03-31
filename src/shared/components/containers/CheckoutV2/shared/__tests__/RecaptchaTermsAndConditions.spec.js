import testComponentHelper from 'test/unit/helpers/test-component'
import RecaptchaTermsAndConditions from '../RecaptchaTermsAndConditions'

describe('<RecaptchaTermsAndConditions />', () => {
  const renderComponent = testComponentHelper(RecaptchaTermsAndConditions)

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })

    it('should render a div with className equal to `TermsAndConditions`', () => {
      const { wrapper } = renderComponent()
      expect(wrapper.find('.TermsAndConditions')).toHaveLength(1)
    })
  })
})
