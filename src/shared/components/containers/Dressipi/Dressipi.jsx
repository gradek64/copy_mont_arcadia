import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import CmsNotAvailable from '../../common/CmsNotAvailable/CmsNotAvailable'
import { getDressipiBrand } from '../../../lib/dressipi'
import { getCanonicalHostname } from '../../../../shared/lib/canonicalisation'
import { fromSeoUrlToRedirectionUrl } from '../../../../shared/lib/navigation'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'

// Selectors
import { isFeatureHttpsCanonicalEnabled } from '../../../selectors/featureSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

@analyticsDecorator('style-adviser')
@connect(
  (state) => ({
    height: state.viewport.height,
    width: state.viewport.width,
    brandCode: state.config.brandCode,
    region: state.config.region,
    baseUrl: state.routing.location.hostname,
    pathname: state.routing.location.pathname,
    menuLinks: state.navigation.menuLinks,
    isFeatureHttpsCanonicalEnabled: isFeatureHttpsCanonicalEnabled(state),
    isMobile: isMobile(state),
  }),
  {}
)
class Dressipi extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    brandCode: PropTypes.string,
    region: PropTypes.string,
    baseUrl: PropTypes.string,
    pathname: PropTypes.string,
    menuLinks: PropTypes.array,
    isFeatureHttpsCanonicalEnabled: PropTypes.bool,
    isMobile: PropTypes.bool,
  }

  render() {
    const {
      height,
      width,
      brandCode,
      region,
      baseUrl,
      pathname,
      menuLinks,
      isFeatureHttpsCanonicalEnabled,
      isMobile,
    } = this.props

    const { location, brand } = getDressipiBrand(brandCode, region)
    const redirectionUrl = fromSeoUrlToRedirectionUrl(pathname, menuLinks)
    const canonicalPath = redirectionUrl
      ? decodeURIComponent(redirectionUrl)
      : ''
    const isMobileParam = isMobile ? '1' : '0'

    return (
      <div>
        {brand ? (
          <div className="Dressipi">
            <Helmet
              title={
                brand === 'topshop.com'
                  ? 'My Topshop Wardrobe'
                  : 'Style Adviser'
              }
              link={[
                {
                  rel: 'canonical',
                  href:
                    getCanonicalHostname(
                      baseUrl,
                      isFeatureHttpsCanonicalEnabled
                    ) + canonicalPath,
                },
              ]}
            />
            <iframe
              className="Dressipi-module"
              src={`//dressipi-production${location}.${brand}?mobile=${isMobileParam}`}
              width={`${width}px`}
              height={`${height - 48}px`}
            />
          </div>
        ) : (
          <CmsNotAvailable />
        )}
      </div>
    )
  }
}

export default Dressipi
