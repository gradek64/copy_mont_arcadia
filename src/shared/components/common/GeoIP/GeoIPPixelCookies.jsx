import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAllBrandHostnames } from '../../../../server/config'
import { handleDevRedirect } from '../../../lib/geo-ip-utils'
import { isFeatureEnableGeoIPDesktopPixelRequest } from '../../../../shared/selectors/featureSelectors'
import { addClientURLPartsToLink } from './'
import {
  isHostnameMobileMainDev,
  isHostnameDesktopMainDev,
} from '../../../selectors/hostnameSelectors'

@connect((state) => ({
  brandName: state.config.brandName,
  geoIPReduxState: state.geoIP,
  featureEnableGeoIPDesktopPixelRequest: isFeatureEnableGeoIPDesktopPixelRequest(
    state
  ),
  isMobileMainDev: isHostnameMobileMainDev(state),
  isDesktopMainDev: isHostnameDesktopMainDev(state),
}))
class GeoIPPixelCookies extends React.Component {
  static propTypes = {
    brandName: PropTypes.string.isRequired,
    cookieValue: PropTypes.string.isRequired,
    handleSuccess: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    featureEnableGeoIPDesktopPixelRequest: PropTypes.object,
    isMobileMainDev: PropTypes.bool.isRequired,
    isDesktopMainDev: PropTypes.bool.isRequired,
  }

  onAllImageResponse(numImages) {
    const { handleSuccess, handleError } = this.props
    let outstandingResponseCount = numImages
    return (err) => {
      if (err) {
        handleError(err)
      }
      --outstandingResponseCount
      if (outstandingResponseCount <= 0) {
        handleSuccess()
      }
    }
  }

  getHostnames() {
    return getAllBrandHostnames(
      this.props.brandName,
      this.props.currentHostname,
      this.props.featureEnableGeoIPDesktopPixelRequest
    ).filter((hostname) => !/m\.de\.dorothyperkins\.com$/.test(hostname))
  }

  render() {
    const {
      brandName,
      geoIPReduxState: { hostname: currentHostname },
      cookieValue,
      isMobileMainDev,
      isDesktopMainDev,
    } = this.props

    const hostnames = this.getHostnames()
    const onEvent = this.onAllImageResponse(hostnames.length)

    return (
      <div>
        {hostnames.map((hostname) => (
          <img
            alt=""
            style={{
              visibility: 'hidden',
              position: 'absolute',
              left: '-1000px',
            }}
            key={hostname}
            src={`${addClientURLPartsToLink(
              handleDevRedirect({
                brandName,
                hostname: currentHostname,
                userISOPreference: cookieValue,
                redirectDomain: hostname,
                isMobileMainDev,
                isDesktopMainDev,
              })
            )}api/geo-ip-pixel/${cookieValue}`}
            onLoad={() => onEvent()}
            onError={(err) => onEvent(err, hostname)}
          />
        ))}
      </div>
    )
  }
}

export default GeoIPPixelCookies
