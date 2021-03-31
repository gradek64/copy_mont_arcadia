import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class QuickLinks extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    return (
      <nav className="QuickLinks">
        <a href="#Main-content" className="QuickLinks-link">
          {l`Skip to content`}
        </a>
      </nav>
    )
  }
}
