import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { localise } from '../../../../lib/localisation'
import HeaderWallis from '../HeaderWallis'
import ShippingDestination from '../../../common/ShippingDestination/ShippingDestination'
import BrandLogo from '../../../common/BrandLogo/BrandLogo'
import SearchBar from '../../SearchBar/SearchBar'
import AccountIcon from '../../../common/AccountIcon/AccountIcon'
import ShoppingCart from '../../../common/ShoppingCart/ShoppingCart'

const { WrappedComponent } = HeaderWallis

const props = {
  brandName: 'wallis',
  sticky: true,
  brandHeaderEspotName: 'brandHeaderEspotName',
}

const mountOptions = {
  context: { l: localise.bind(null, 'en-gb', 'wallis') },
}

describe('<HeaderWallis />', () => {
  describe('@renders', () => {
    it('in default state', () => {
      const wrapper = shallow(<WrappedComponent {...props} />, mountOptions)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('contains <ShippingDestination />', () => {
      const wrapper = shallow(<WrappedComponent {...props} />, mountOptions)
      expect(wrapper.find(ShippingDestination).length).toBe(1)
    })

    it('contains <BrandLogo />', () => {
      const wrapper = shallow(<WrappedComponent {...props} />, mountOptions)
      expect(wrapper.find(BrandLogo).length).toBe(1)
    })

    it('contains <SearchBar />', () => {
      const wrapper = shallow(<WrappedComponent {...props} />, mountOptions)
      expect(wrapper.find(SearchBar).length).toBe(1)
    })

    it('contains <AccountIcon />', () => {
      const wrapper = shallow(<WrappedComponent {...props} />, mountOptions)
      expect(wrapper.find(AccountIcon).length).toBe(1)
    })

    it('contains <ShoppingCart />', () => {
      const wrapper = shallow(<WrappedComponent {...props} />, mountOptions)
      expect(wrapper.find(ShoppingCart).length).toBe(1)
    })
  })

  it('renders correctly with sticky prop', () => {
    const wrapper = shallow(<WrappedComponent {...props} />, mountOptions)
    expect(wrapper.find('.is-sticky')).toHaveLength(1)
  })
})
