import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { path } from 'ramda'

if (process.browser) require('./measure.css')

/* Helps to measure the width and the height of a component
 *
 * @example
 * <Measure>
 *  {(({ componentWidth, componentHeight }) =>
 *    <div>Size of this div: {componentWidth}/{componentHeight}</div>)}
 * </Measure>
 *
 * Based on: https://github.com/FezVrasta/react-resize-aware
 */
export class Measure extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      componentHeight: null,
      componentWidth: null,
    }
    this.updateDimensions = this.updateDimensions.bind(this)
    this.updateDimensionsDebounced = this.updateDimensionsDebounced.bind(this)
    this.containerDidLoad = this.containerDidLoad.bind(this)
  }

  componentDidMount() {
    this._resizeElement.data = 'about:blank'
  }

  componentWillUnmount() {
    if (this._elementObject) {
      this._elementObject.removeEventListener(
        'resize',
        this.updateDimensionsDebounced
      )
    }
    if (this._delayedFunction) {
      clearTimeout(this._delayedFunction)
    }
  }

  containerDidLoad(event) {
    const element = path(['target', 'contentDocument', 'defaultView'], event)
    if (element) {
      element.addEventListener('resize', this.updateDimensionsDebounced)
      this._elementObject = element
      this.updateDimensions()
    }
  }

  updateDimensions() {
    const { _element } = this
    if (_element) {
      this.setState({
        componentWidth: this._element.offsetWidth,
        componentHeight: this._element.offsetHeight,
      })
    }
  }

  updateDimensionsDebounced() {
    if (this._delayedFunction) {
      clearTimeout(this._delayedFunction)
    }
    this._delayedFunction = setTimeout(this.updateDimensions, 10)
  }

  render() {
    const { children: child } = this.props
    if (typeof child !== 'function') {
      throw new Error(
        'You have to pass one and only one function to <Measure/>'
      )
    }

    const { componentWidth, componentHeight } = this.state

    return (
      <div
        className="Measure--container"
        ref={(el) => {
          this._element = el
        }}
      >
        <object
          aria-label="measure"
          aria-hidden
          className="Measure"
          onLoad={this.containerDidLoad}
          ref={(el) => {
            this._resizeElement = el
          }}
          tabIndex={-1}
          type="text/html"
        />
        {child({ componentWidth, componentHeight })}
      </div>
    )
  }
}
