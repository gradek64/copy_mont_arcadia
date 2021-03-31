import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Button from '../../common/Button/Button'
import Image from '../../common/Image/Image'

export default class PlayVideoButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    clickHandler: PropTypes.func.isRequired,
    isVideoPlaying: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    isVideoPlaying: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const { isVideoPlaying, className } = this.props
    const status = isVideoPlaying ? 'stop' : 'play'
    const message = `${status} video`

    return (
      <Button
        className={`PlayVideoButton ${className}`}
        clickHandler={() => {
          this.props.clickHandler()
        }}
      >
        <Image
          key="icon"
          className="PlayVideoButton-icon"
          src={`/assets/{brandName}/images/${status}.svg`}
        />
        <span key="text" className="PlayVideoButton-label translate">
          {l(message)}
        </span>
      </Button>
    )
  }
}
