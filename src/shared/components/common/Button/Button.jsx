import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    isDisabled: PropTypes.bool,
    isActive: PropTypes.bool,
    clickHandler: PropTypes.func,
    type: PropTypes.string,
    ariaLabel: PropTypes.string,
    lang: PropTypes.string,
  }

  handleClick = (e) => {
    const { isDisabled, clickHandler } = this.props
    if (!isDisabled && clickHandler) clickHandler(e)
  }

  render() {
    const {
      isDisabled,
      isActive,
      type,
      className,
      ariaLabel,
      children,
      lang,
    } = this.props
    const classNames = classnames('Button', className, {
      'is-active': isActive,
      // ADP-3192 - add to bag button breaks when text is translated
      // If React is not text only element, add notranslate to prevent google
      // translate from breaking children of button component
      // any children passed to button with text nodes should add className='...classes translate'
      // to the text nodes to reenable translation on those elements.
      // See this for more info: https://github.com/facebook/react/issues/11538
      notranslate: typeof children !== 'string',
    })

    return (
      <button
        className={classNames}
        type={type || 'button'}
        role="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-hidden={isDisabled}
        aria-label={ariaLabel}
        onClick={this.handleClick}
        lang={lang}
      >
        {children}
      </button>
    )
  }
}
