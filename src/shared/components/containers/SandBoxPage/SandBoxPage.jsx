import React, { Component } from 'react'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import SandBox from '../SandBox/SandBox'
import NotFoundComponent from '../NotFound/NotFound'
import { GTM_CATEGORY } from '../../../analytics'

@analyticsDecorator(GTM_CATEGORY.MR_CMS, {
  isAsync: true,
})
class SandBoxPage extends Component {
  static needs = SandBox.needs

  render() {
    return <SandBox {...this.props} />
  }
}

export default SandBoxPage

/* eslint-disable */
export class NotFound extends Component {
  static needs = SandBox.needs

  render() {
    const { route: { cmsPageName } = {} } = this.props

    return <NotFoundComponent cmsPageName={cmsPageName} {...this.props} />
  }
}
/* eslint-enable */
