import testComponentHelper from 'test/unit/helpers/test-component'
import AccountItem from './AccountItem'

describe('<AccountItem />', () => {
  const initialProps = {
    description: 'link to homepage',
    link: '/homepage',
    title: 'To Home page',
    clickHandler: () => jest.fn(),
    onlyActiveOnIndex: false,
  }
  const renderComponent = testComponentHelper(AccountItem)
  describe('@renders', () => {
    it('renders relative links', () => {
      const props = {
        ...initialProps,
        isExternal: false,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('renders external links with a target', () => {
      const props = {
        ...initialProps,
        isExternal: true,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })
})
