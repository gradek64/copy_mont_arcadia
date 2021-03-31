import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from '../Button/Button'

export default class FindInStoreButton extends Component {
  static propTypes = {
    region: PropTypes.string.isRequired,
    type: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderDesktop() {
    const { l } = this.context
    const { onClick } = this.props
    return (
      <button className="FindInStoreButton-desktop" onClick={onClick}>
        <span className="FindInStoreButton-desktopWrapper">{l`Find in store`}</span>
      </button>
    )
  }

  render() {
    const { l } = this.context
    const { region, type, onClick } = this.props

    if (!region.includes('uk')) return null

    if (type === 'desktop') {
      return this.renderDesktop()
    }
    return (
      <Button
        className="FindInStoreButton Button Button--secondary"
        clickHandler={onClick}
      >
        {l`Find in store`}
      </Button>
    )
  }
}
