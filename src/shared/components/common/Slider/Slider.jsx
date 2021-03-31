import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getActiveRefinements } from '../../../selectors/refinementsSelectors'

import { pathOr } from 'ramda'

const addEvent = (node, handler, eventName) =>
  node.addEventListener(eventName, handler)

const removeEvent = (node, handler, eventName) =>
  node.removeEventListener(eventName, handler)

@connect((state) => ({
  viewportWidth: state.viewport.width,
  selectedOptions: pathOr({}, ['refinements', 'selectedOptions'], state),
  activeRefinements: getActiveRefinements(state),
  isShown: state.refinements.isShown,
}))
class Slider extends Component {
  static propTypes = {
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    activeRefinements: PropTypes.array,
    selectedOptions: PropTypes.object,
    onChangeFinished: PropTypes.func,
    isShown: PropTypes.bool,
    refinementIdentifier: PropTypes.string,
  }

  static contextTypes = {
    p: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      activeHandle: null,
      minHandle: {
        left: 0,
        value: this.currentNowPriceRefinement(props).min || props.minValue,
      },
      maxHandle: {
        left: 0,
        value: this.currentNowPriceRefinement(props).max || props.maxValue,
      },
    }

    this.slider = null
    this.iconWidth = 0
    this.height = 0
    this.width = 0
    this.left = 0
    this.offsetAllowance = 0
    this.handlerStartOffset = 0
    this.onPressEventHandlers = {
      minHandle: this.getOnPressHandlers('minHandle'),
      maxHandle: this.getOnPressHandlers('maxHandle'),
    }
    this.eventNames = {
      moving: ['touchmove', 'mousemove'],
      released: ['touchend', 'touchcancel', 'mouseup'],
    }
  }

  isNowPriceActiveRefinement = ({ activeRefinements }) =>
    activeRefinements
      ? activeRefinements.filter((refinement) => refinement.key === 'NOWPRICE')
      : false

  currentNowPriceRefinement = (refinementsProps) => {
    const activePriceRefinements = this.isNowPriceActiveRefinement(
      refinementsProps
    )
    if (activePriceRefinements.length) {
      return {
        min: parseFloat(activePriceRefinements[0].values[0].lowerBound),
        max: parseFloat(activePriceRefinements[0].values[0].upperBound),
      }
    }

    return {
      min: false,
      max: false,
    }
  }

  getMinMax = (props) => {
    let min = props.minValue
    let max = props.maxValue

    const userSelectedPrices = pathOr(
      null,
      ['selectedOptions', props.refinementIdentifier],
      props
    )

    const activePriceRefinements = this.isNowPriceActiveRefinement(props)

    if (userSelectedPrices) {
      min = parseFloat(userSelectedPrices[0])
      max = parseFloat(userSelectedPrices[1])
    } else if (activePriceRefinements.length) {
      min = parseFloat(activePriceRefinements[0].values[0].lowerBound)
      max = parseFloat(activePriceRefinements[0].values[0].upperBound)
    }

    return { min, max }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { left, width } = this.slider.getBoundingClientRect()
    const { minValue, maxValue } = this.props

    const newMinMax = {
      minValue: nextProps.minValue,
      maxValue: nextProps.maxValue,
    }

    const hasChanges =
      minValue !== newMinMax.minValue ||
      maxValue !== newMinMax.maxValue ||
      this.width !== width ||
      this.left !== left

    const isClosed = this.props.isShown && !nextProps.isShown

    let { min, max } = this.getMinMax(nextProps)

    //  Window size is changed or min/max (the full min/max range) changed
    if (hasChanges) {
      this.width = width
      this.left = left
    }

    // mobile filter mobal is closed, we reset to the current refinements range
    if (isClosed) {
      min = nextProps.minValue
      max = nextProps.maxValue
      this.width = width
      this.left = left
    }
    this.updateMinMaxState(min, max, newMinMax)
  }

  updateMinMaxState = (min, max, newMinMax) => {
    this.setState({
      minHandle: {
        value: min,
        left: this.getHandleLeft('minHandle', min, newMinMax),
      },
      maxHandle: {
        value: max,
        left: this.getHandleLeft('maxHandle', max, newMinMax),
      },
    })
  }

  onSliderMount = (slider) => {
    if (slider) {
      const { left, height, width } = slider.getBoundingClientRect()
      const { minHandle, maxHandle } = this.state

      this.slider = slider
      this.left = left
      this.width = width
      this.height = height
      this.offsetAllowance = height / 2 + 100
      this.iconWidth = this.icon.getBoundingClientRect().width

      this.setState({
        minHandle: {
          value: minHandle.value,
          left: this.getHandleLeft('minHandle', minHandle.value),
        },
        maxHandle: {
          value: maxHandle.value,
          left: this.getHandleLeft('maxHandle', maxHandle.value),
        },
      })
    }

    return this
  }

  onHandlePress = ({ currentTarget, ...event }, activeHandle) => {
    const pageX = this.getHandlerPosition(event).pageX
    const left = currentTarget
      .getElementsByClassName('Slider-icon')[0]
      .getBoundingClientRect().left
    this.handlerStartOffset = pageX - left
    this.setState({ activeHandle })
    this.eventNames.moving.forEach(
      addEvent.bind(null, document, this.onHandleMove)
    )
    this.eventNames.released.forEach(
      addEvent.bind(null, document, this.onHandleRelease)
    )

    return this
  }

  onHandleMove = (event) => {
    const { activeHandle } = this.state
    const { pageX } = this.getHandlerPosition(event)
    const handleLeft = pageX - this.handlerStartOffset - this.left
    const value = this.getHandleValue(activeHandle, handleLeft)
    const left = this.getHandleLeft(activeHandle, value)
    this.setState({
      [activeHandle]: { left, value },
    })

    return this
  }

  onHandleRelease = () => {
    const { activeHandle, minHandle, maxHandle } = this.state

    if (activeHandle) {
      this.setState({ activeHandle: null })
      this.props.onChangeFinished(minHandle.value, maxHandle.value)
    }
    this.eventNames.moving.forEach(
      removeEvent.bind(null, document, this.onHandleMove)
    )
    this.eventNames.released.forEach(
      removeEvent.bind(null, document, this.onHandleRelease)
    )

    return this
  }

  getAvailableWidth = () => this.width - this.iconWidth * 2

  getHandleValue = (handle, left) => {
    const { minHandle, maxHandle } = this.state
    const { minValue, maxValue } = this.props

    const isMinHandle = handle === 'minHandle'
    const minLeft = isMinHandle ? 0 : minHandle.left + this.iconWidth
    const maxLeft = (isMinHandle ? maxHandle.left : this.width) - this.iconWidth
    const inRangeLeft =
      Math.min(maxLeft, Math.max(minLeft, left)) +
      (isMinHandle ? 0 : -this.iconWidth)
    const percentage = inRangeLeft / this.getAvailableWidth()
    const exactValue = percentage * (maxValue - minValue) + minValue

    return Math.round(exactValue)
  }

  getHandleLeft = (handle, value, newMinMax) => {
    let { minValue, maxValue } = this.props
    if (newMinMax) {
      minValue = newMinMax.minValue
      maxValue = newMinMax.maxValue
    }
    const percentage = (value - minValue) / (maxValue - minValue)

    return (
      percentage * this.getAvailableWidth() +
      (handle === 'minHandle' ? 0 : this.iconWidth)
    )
  }

  getHandlerPosition = ({ changedTouches, pageX, pageY }) =>
    changedTouches ? changedTouches[0] : { pageX, pageY }

  getOnPressHandlers = (handle) => ({
    onTouchStart: (event) => this.onHandlePress(event, handle),
    onMouseDown: (event) => this.onHandlePress(event, handle),
  })

  renderHandle = (handle) => (
    <button
      {...this.onPressEventHandlers[handle]}
      ref={(element) => {
        this[handle] = element
      }}
      className={`Slider-handle Slider-handle--${handle} ${
        this.state.activeHandle === handle ? 'is-active' : ''
      }`}
      style={{
        transform: `translateX(${this.state[handle].left}px)`,
      }}
    >
      <span
        ref={(icon) => {
          this.icon = icon
        }}
        className="Slider-icon"
      />
    </button>
  )

  renderLabel = (handle) => (
    <span className={`Slider-label Slider-label--${handle}`}>
      {this.context.p(this.state[handle].value.toFixed(2))}
    </span>
  )

  render = () => {
    return (
      <div ref={this.onSliderMount} className="Slider">
        {this.renderLabel('minHandle')}
        {this.renderLabel('maxHandle')}
        {this.renderHandle('minHandle')}
        {this.renderHandle('maxHandle')}
        <div
          className="Slider-bar"
          style={{
            paddingLeft: `${this.state.minHandle.left + this.iconWidth / 2}px`,
            paddingRight: `${this.width -
              this.state.maxHandle.left -
              this.iconWidth / 2}px`,
          }}
        />
      </div>
    )
  }
}

export default Slider
