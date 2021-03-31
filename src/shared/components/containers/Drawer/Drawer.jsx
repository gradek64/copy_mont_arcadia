import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

export default class Drawer extends Component {
  static defaultProps = {
    isScrollable: false,
  }

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isScrollable: PropTypes.bool,
    direction: PropTypes.string,
  }

  render() {
    const { isOpen, isScrollable, children, direction } = this.props

    const drawerClasseNames = cn('Drawer', {
      'is-scrollable': isScrollable,
      'is-open': isOpen,
      [`direction-${direction}`]: direction,
    })

    return <div className={drawerClasseNames}>{children}</div>
  }
}
