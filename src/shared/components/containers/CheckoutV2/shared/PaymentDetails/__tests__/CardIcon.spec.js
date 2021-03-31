import testComponentHelper from '../../../../../../../../test/unit/helpers/test-component'
import CardIcon from '../CardIcon'

describe('<CardIcon/>', () => {
  const renderComponent = testComponentHelper(CardIcon)

  describe('@renders', () => {
    it('should render default state correctly', () => {
      const component = renderComponent({
        icon: 'icon.svg',
      })
      expect(component.getTree()).toMatchSnapshot()
    })
  })
})
