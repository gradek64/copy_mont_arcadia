import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SandBox from '../../containers/SandBox/SandBox'
import cmsConsts from '../../../constants/cmsConsts'

import { getSizeGuideType } from '../../../selectors/productSelectors'

@connect((state) => ({
  sizeGuideType: getSizeGuideType(state),
}))
class SizeGuideDrawer extends Component {
  static propTypes = {
    sizeGuideType: PropTypes.string,
  }

  render() {
    const { sizeGuideType } = this.props
    return (
      <SandBox
        isInPageContent
        contentType={cmsConsts.PAGE_CONTENT_TYPE}
        cmsPageName={sizeGuideType}
        shouldGetContentOnFirstLoad
        forceMobile
      />
    )
  }
}

export default SizeGuideDrawer
