import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'

export default class BackToAccountLink extends Component {
  static propTypes = {
    clickHandler: PropTypes.func,
    text: PropTypes.string.isRequired,
  }

  render() {
    const { text, clickHandler } = this.props
    return (
      <p className="BackToAccountLink-container">
        <Link
          to="/my-account"
          onClick={clickHandler}
          className="BackToAccountLink-link"
        >
          {text}
        </Link>
      </p>
    )
  }
}
