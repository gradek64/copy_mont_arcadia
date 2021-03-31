// Imports
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Components
import BrandLogo from '../../common/BrandLogo/BrandLogo'
import Image from '../../common/Image/Image'
import CheckoutCTA from '../../common/Button/OnePageCheckoutButton/CheckoutCTA'

const HeaderCheckout = (
  { isMobile, goToHomePage, brandName, logoVersion, region, isRegionSpecific },
  { l }
) => {
  const headerClasses = classnames('HeaderCheckout', {
    'Header is-checkoutBig': !isMobile,
  })

  const headerCenterClasess = classnames({ 'Header-center': !isMobile })

  return (
    <div className={headerClasses}>
      <div className={headerCenterClasess}>
        <BrandLogo
          brandName={brandName}
          className="Header-brandLogo"
          logoVersion={logoVersion}
          imageAlt={`${brandName} ${l`homepage`}`}
          region={region}
          isRegionSpecific={isRegionSpecific}
        />
      </div>
      <div className="HeaderCheckout-buttonContainer">
        {isMobile ? (
          <div
            tabIndex={0}
            role="button"
            className="HeaderCheckout-imageContainer"
            onClick={goToHomePage}
          >
            <Image src={'/assets/common/images/close-checkout-header.svg'} />
          </div>
        ) : (
          <CheckoutCTA copy={l`Back to shopping`} action={goToHomePage} />
        )}
      </div>
    </div>
  )
}

HeaderCheckout.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  goToHomePage: PropTypes.func.isRequired,
}

HeaderCheckout.contextTypes = {
  l: PropTypes.func,
}

export default HeaderCheckout
