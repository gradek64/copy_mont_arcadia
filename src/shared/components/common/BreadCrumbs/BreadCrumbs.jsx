import PropTypes from 'prop-types'
import React from 'react'

export default class BreadCrumbs extends React.Component {
  static propTypes = {
    checkoutStage: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    checkoutStage: '',
  }

  render() {
    const { l } = this.context
    const { checkoutStage } = this.props
    return (
      <ul className={`BreadCrumbs BreadCrumbs--${checkoutStage}`}>
        <li className="BreadCrumbs-item BreadCrumbs-item1">
          <span className="BreadCrumbs-number">1</span>
          <span className="BreadCrumbs-label">{l`Delivery`}</span>
        </li>
        <li className="BreadCrumbs-item BreadCrumbs-item2">
          <span className="BreadCrumbs-number">2</span>
          <span className="BreadCrumbs-label">{l`Billing`}</span>
        </li>
        <li className="BreadCrumbs-item BreadCrumbs-item3">
          <span className="BreadCrumbs-number">3</span>
          <span className="BreadCrumbs-label">{l`Confirm`}</span>
        </li>
      </ul>
    )
  }
}
