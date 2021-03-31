import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderMissSelfridge from '../HeaderMissSelfridge'

describe('<HeaderMissSelfridge />', () => {
  const renderComponent = testComponentHelper(
    HeaderMissSelfridge.WrappedComponent
  )
  const initialProps = {
    brandName: 'missselfridge',
    randHeaderEspotName: 'brandHeaderEspotName',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
