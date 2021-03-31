import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderBurton from '../HeaderBurton'

describe('<HeaderBurton />', () => {
  const renderComponent = testComponentHelper(HeaderBurton)
  const initialProps = {
    brandName: 'burton',
    centreCol: 'HeaderBig-centre',
    contentWrapper: 'HeaderBig-content',
    leftCol: 'HeaderBig-left',
    rightCol: 'HeaderBig-right',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('renders correctly with sticky prop', () => {
      const { wrapper } = renderComponent({ ...initialProps, sticky: true })
      expect(wrapper.find('.is-sticky')).toHaveLength(1)
    })
  })
})
