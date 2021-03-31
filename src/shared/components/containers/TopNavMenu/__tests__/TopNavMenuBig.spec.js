import testComponentHelper from 'test/unit/helpers/test-component'
import TopNavMenuBig from '../TopNavMenuBig'

describe('<TopNavMenuBig />', () => {
  const initialProps = {
    categories: [
      {
        categoryId: 1,
        label: 'clothing',
      },
      {
        categoryId: 2,
        label: 'Whats new',
      },
      {
        categoryId: 3,
        label: 'Accesories',
      },
    ],
    featureLegacyNav: false,
  }
  const renderComponent = testComponentHelper(TopNavMenuBig.WrappedComponent)
  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
  })
})
