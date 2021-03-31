import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderTopman from '../HeaderTopman'

describe('<HeaderTopman />', () => {
  const renderComponent = testComponentHelper(HeaderTopman.WrappedComponent)
  const initialProps = {
    brandName: 'topman',
    brandHeaderEspotName: 'brandHeaderEspotName',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
