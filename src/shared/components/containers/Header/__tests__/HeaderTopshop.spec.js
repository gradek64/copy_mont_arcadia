import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderTopshop from '../HeaderTopshop'

describe('<HeaderTopshop />', () => {
  const renderComponent = testComponentHelper(HeaderTopshop.WrappedComponent)
  const initialProps = {
    brandName: 'topshop',
    brandHeaderEspotName: 'brandHeaderEspotName',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
