import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Link from '../../common/Link'

export default class AccountItem extends Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired,
    isExternal: PropTypes.bool.isRequired,
  }

  render() {
    const { title, link, description, clickHandler, isExternal } = this.props
    return (
      <li className={'AccountItem'}>
        <Link
          to={link}
          className="NoLink AccountItem-link"
          onClick={clickHandler}
          isExternal={isExternal}
          target={isExternal ? '_blank' : null}
          onlyActiveOnIndex={false}
        >
          <h3 className="AccountItem-title">{title}</h3>
          <p className="AccountItem-description">{description}</p>
        </Link>
      </li>
    )
  }
}

AccountItem.defaultProps = {
  clickHandler: () => {},
}
