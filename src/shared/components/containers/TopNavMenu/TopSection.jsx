import React from 'react'
// components
import StoreFinder from './StoreFinder'
import ShippingDestinationMobile from '../../common/ShippingDestination/ShippingDestinationMobile'

const TopSection = () => (
  <div>
    <StoreFinder locator="TopNavMenu" />
    <ShippingDestinationMobile />
  </div>
)

export default TopSection
