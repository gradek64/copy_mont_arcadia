import PropTypes from 'prop-types'
import React, { Component } from 'react'

import SandBox from '../SandBox/SandBox'
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import cmsConsts from '../../../constants/cmsConsts'

export default class EReceipts extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }
  render() {
    const { l } = this.context
    return (
      <section>
        <AccountHeader
          link="/my-account"
          label={l`Back to My Account`}
          title={l`E-receipts`}
          classNames=" screen-reader-text"
        />
        <SandBox
          contentType={cmsConsts.PAGE_CONTENT_TYPE}
          cmsPageName="eReceipts"
          {...this.props}
        />
      </section>
    )
  }
}
