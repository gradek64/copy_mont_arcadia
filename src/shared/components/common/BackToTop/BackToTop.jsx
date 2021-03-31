import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../Button/Button'
import { withWindowScroll } from '../../containers/WindowEventProvider/withWindowScroll'
import { connect } from 'react-redux'
import { removeHiddenPages } from '../../../actions/common/infinityScrollActions'
import { scrollToTop } from '../../../lib/scroll-helper'

const mapDispatchToProps = { removeHiddenPages }
class BackToTop extends Component {
  static propTypes = {
    hasPassedThreshold: PropTypes.bool,
  }

  static defaultProps = {
    hasPassedThreshold: false,
    isPlp: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  handleOnClick = () => {
    const { isPlp, removeHiddenPages } = this.props

    const time = 200
    scrollToTop(time)
    removeHiddenPages(isPlp)
  }

  render() {
    const { l } = this.context
    const visibleClass = this.props.hasPassedThreshold ? 'is-visible' : ''

    return (
      <div className="BackToTop">
        <Button
          clickHandler={this.handleOnClick}
          className={`BackToTop-returnButton ${visibleClass}`}
        >
          <span className="BackToTop-content">
            <span className="BackToTop-arrow" />
            <span className="BackToTop-label translate">{l`Back to top`}</span>
          </span>
        </Button>
      </div>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps
)(withWindowScroll({ scrollPastThreshold: 0.9 })(BackToTop))
