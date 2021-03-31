import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'

/*
  @param header - optional bold header
  @param message - optional string or array of strings
  @param duration - length of time in ms for message to persist after transition in
  @param isError - true to display with error message styling
  @param isVisible - true to display immediately on render, false to delay display (can be triggered via redux action)
  @param showOnce - false to display permanently, true to display only once and then remove if onTransitionComplete is provided
  @param onTransitionComplete - optional callback, triggered after animation completes if duration value provided, or on unmount if showOnce=true
  @param renderChildrenOn - optional location to render children (top(default), bottom)
  @param isFromFilter - optional flag adds relevant filter classes for styling
*/
class EnhancedMessage extends Component {
  constructor(props) {
    super(props)

    this.state = { isVisible: false }
  }

  static propTypes = {
    id: PropTypes.string,
    header: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    duration: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    isError: PropTypes.bool,
    isVisible: PropTypes.bool,
    showOnce: PropTypes.bool,
    onTransitionComplete: PropTypes.func,
    renderChildrenOn: PropTypes.string,
    isFromFilter: PropTypes.bool,
    children: PropTypes.node,
  }

  static defaultProps = {
    duration: false,
    isError: false,
    isVisible: true,
    showOnce: false,
    onTransitionComplete: () => {},
    renderChildrenOn: 'top',
    isFromFilter: false,
  }

  componentDidMount() {
    const { isVisible } = this.props
    this.setDisplayState(isVisible)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible)
      this.setDisplayState(nextProps.isVisible)
  }

  componentWillUnmount() {
    const { showOnce } = this.props
    if (showOnce) this.handleOnExited()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only update if local state changes to avoid synchronisation issues with animations
    return this.state.isVisible !== nextState.isVisible
  }

  setDisplayState = (isVisible) => {
    this.setState({ isVisible })
  }

  handleOnEntered = () => {
    const { duration } = this.props
    if (duration) this.setDisplayState(false)
  }

  handleOnExited = () => {
    const { id, onTransitionComplete } = this.props
    if (id) onTransitionComplete(id)
  }

  renderMessage = () => {
    const {
      children,
      header,
      message,
      isError,
      renderChildrenOn,
      isFromFilter,
    } = this.props

    const messageClass = classnames('EnhancedMessage', {
      'is-error': isError,
      isFromFilter,
    })

    return message || children ? (
      <div className={messageClass}>
        <div
          className={`EnhancedMessage-wrapper ${
            isFromFilter ? 'isFromFilter' : ''
          }`}
        >
          {renderChildrenOn === 'top' && children}
          {message && (
            <div
              className={`EnhancedMessage-section ${
                isFromFilter ? 'isFromFilter' : ''
              }`}
            >
              <span className="EnhancedMessage-icon" />
              <p className="EnhancedMessage-content">
                {header && <h5 className="EnhancedMessage-header">{header}</h5>}
                {message instanceof Array ? (
                  message.map((msg) => (
                    <span className="EnhancedMessage-message">{msg}</span>
                  ))
                ) : (
                  <span className="EnhancedMessage-message">{message}</span>
                )}
              </p>
            </div>
          )}
          {renderChildrenOn === 'bottom' && children}
        </div>
      </div>
    ) : null
  }

  render() {
    const { duration, showOnce } = this.props
    const { isVisible } = this.state

    return duration ? (
      <CSSTransition
        in={isVisible}
        timeout={{ enter: duration, exit: 500 }}
        classNames="EnhancedMessage"
        onEntered={this.handleOnEntered}
        onExited={this.handleOnExited}
        unmountOnExit={showOnce}
      >
        {this.renderMessage()}
      </CSSTransition>
    ) : (
      this.renderMessage()
    )
  }
}

export default EnhancedMessage
