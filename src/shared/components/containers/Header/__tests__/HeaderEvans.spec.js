import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderEvans from '../HeaderEvans'
import ShippingDestination from '../../../common/ShippingDestination/ShippingDestination'
import Espot from '../../Espot/Espot'
import BrandLogo from '../../../common/BrandLogo/BrandLogo'
import SearchBar from '../../SearchBar/SearchBar'
import AccountIcon from '../../../common/AccountIcon/AccountIcon'
import ShoppingCart from '../../../common/ShoppingCart/ShoppingCart'

const initialProps = {
  brandName: 'evans',
  brandHeaderEspotName: 'some brand espot name',
}

describe('<HeaderEvans />', () => {
  const renderComponent = testComponentHelper(HeaderEvans.WrappedComponent)
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with brand header espot', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Espot).prop('identifier')).toBe(
        initialProps.brandHeaderEspotName
      )
    })

    it('contains <ShippingDestination />', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(ShippingDestination).length).toBe(1)
    })

    it('contains <BrandLogo />', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(BrandLogo).length).toBe(1)
    })

    it('contains <SearchBar />', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(SearchBar).length).toBe(1)
    })

    it('contains <AccountIcon />', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(AccountIcon).length).toBe(1)
    })

    it('contains <ShoppingCart />', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(ShoppingCart).length).toBe(1)
    })

    it('renders correctly with sticky prop', () => {
      const { wrapper } = renderComponent({ ...initialProps, sticky: true })
      expect(wrapper.find('.is-sticky')).toHaveLength(1)
    })
  })
})
