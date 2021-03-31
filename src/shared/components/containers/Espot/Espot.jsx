import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobile } from '../../../selectors/viewportSelectors'
import { getResponsiveCMSUrl } from '../../../selectors/espotSelectors'
import SandBox from '../SandBox/SandBox'
import cmsConsts from '../../../constants/cmsConsts'

@connect(
  (state, { identifier }) => ({
    responsiveCMSUrl: getResponsiveCMSUrl(state, identifier),
    isMobile: isMobile(state),
  }),
  {}
)
class Espot extends PureComponent {
  static propTypes = {
    responsiveCMSUrl: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    qubitid: PropTypes.string,
    customClassName: PropTypes.string,
    isResponsive: PropTypes.bool,
  }

  static defaultProps = {
    responsiveCMSUrl: '',
    customClassName: '',
    qubitid: null,
    isResponsive: false,
  }

  render() {
    const {
      isMobile,
      qubitid,
      responsiveCMSUrl,
      customClassName,
      isResponsive,
    } = this.props

    // TODO: remove this check at some point when we are ready to use sandbox for both mobile and desktop
    if (isMobile && !isResponsive) {
      return null
    }

    if (!responsiveCMSUrl) {
      return null
    }

    return (
      <SandBox
        location={{ pathname: responsiveCMSUrl }}
        shouldGetContentOnFirstLoad
        isFinalResponsiveEspotSolution
        qubitid={qubitid}
        sandBoxClassName={customClassName}
        contentType={cmsConsts.ESPOT_CONTENT_TYPE}
      />
    )
  }
}

export default Espot
