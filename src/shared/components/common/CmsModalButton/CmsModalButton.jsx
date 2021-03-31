import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CmsWrapper from '../../containers/CmsWrapper/CmsWrapper'
import * as modalActions from '../../../actions/common/modalActions'

@connect(
  () => ({}),
  { ...modalActions }
)
class CmsModalButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    cmsPageName: PropTypes.string,
    showModal: PropTypes.func,
    className: PropTypes.string,
  }

  openPage = () => {
    const { showModal, cmsPageName } = this.props
    showModal(
      <CmsWrapper params={{ cmsPageName, contentType: 'page' }} isModal />,
      { mode: 'large' }
    )
  }

  render() {
    const { children, className } = this.props
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        onClick={this.openPage}
        className={className || ''}
      >
        {children}
      </div>
    )
  }
}

export default CmsModalButton
