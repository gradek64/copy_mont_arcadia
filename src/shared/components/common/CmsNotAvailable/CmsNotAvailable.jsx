import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class CmsNotAvailable extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    return (
      <div className="CmsNotAvailable">{l`Sorry, there's been an error with loading the page. Please try again later`}</div>
    )
  }
}
