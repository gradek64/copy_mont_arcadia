import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderDorothyPerkins from '../HeaderDorothyPerkins'

describe('<HeaderDorothyPerkins />', () => {
  const renderComponent = testComponentHelper(HeaderDorothyPerkins)
  const initialProps = {
    brandName: 'dorothyperkins',
    contentWrapper: 'HeaderBig-content',
    leftCol: 'HeaderBig-left',
    rightCol: 'HeaderBig-right',
    centreCol: 'HeaderBig-centre',
    shoppingBagTotalItems: 3,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
