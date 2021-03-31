import React, { Component } from 'react'
import SandBox from '../SandBox/SandBox'
import espots from '../../../constants/espotsMobile'
import cmsConsts from '../../../constants/cmsConsts'

export default class TacticalMessage extends Component {
  render() {
    return (
      <SandBox
        cmsPageName={espots.tacticalMessage[0]}
        contentType={cmsConsts.ESPOT_CONTENT_TYPE}
        isInPageContent
        shouldGetContentOnFirstLoad
      />
    )
  }
}
