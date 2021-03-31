import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class AccessibleText extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  focus = (delay = 600) => {
    if (process.browser) {
      // Delay to allow for DOM updates to flush
      setTimeout(() => {
        if (this.text) this.text.focus()
      }, delay)
    }
  }

  render() {
    return (
      <p
        className="screen-reader-text"
        tabIndex="0"
        ref={(p) => {
          this.text = p
        }}
      >
        {this.props.children}
      </p>
    )
  }
}
