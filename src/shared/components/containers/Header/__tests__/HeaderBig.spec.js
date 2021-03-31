import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderBig from '../HeaderBig'

describe('<HeaderBig />', () => {
  const renderComponent = testComponentHelper(HeaderBig.WrappedComponent)
  const initialProps = {
    brandName: 'topshop',
    shoppingBagTotalItems: 3,
    sticky: false,
    isFeatureStickyHeaderEnabled: false,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with featureMegaNav', () => {
      expect(
        renderComponent({
          ...initialProps,
          featureMegaNav: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    describe('with sticky headers feature enabled', () => {
      it('with default props', () => {
        expect(
          renderComponent({
            ...initialProps,
            isFeatureStickyHeaderEnabled: true,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with sticky=true', () => {
        expect(
          renderComponent({
            ...initialProps,
            isFeatureStickyHeaderEnabled: true,
            sticky: true,
          }).getTree()
        ).toMatchSnapshot()
      })
    })
  })
})
