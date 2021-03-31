import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Image from '../Image/Image'

export default class BrandLogo extends Component {
  static propTypes = {
    className: PropTypes.string,
    brandName: PropTypes.string,
    logoVersion: PropTypes.string,
    hasResponsive: PropTypes.bool,
    region: PropTypes.string,
    isRegionSpecific: PropTypes.bool,
  }

  static defaultTypes = {
    hasResponsive: false,
    className: '',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const {
      className,
      brandName,
      logoVersion,
      hasResponsive,
      region,
      isRegionSpecific,
      imageAlt,
    } = this.props
    const responsivePostFix = hasResponsive ? '-responsive' : ''
    const regionSpecificPostFix =
      isRegionSpecific && region !== 'uk' ? `-${region}` : ''
    const logoSrc = `/assets/${brandName}/images/logo${responsivePostFix}${regionSpecificPostFix}.svg?version=${logoVersion}`
    return (
      <div className={`BrandLogo ${className}`}>
        <Image alt={imageAlt} className="BrandLogo-img" src={logoSrc} />
      </div>
    )
  }
}
