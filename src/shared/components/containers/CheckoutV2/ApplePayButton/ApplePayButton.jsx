import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from '../../../common/Button/Button'

class ApplePayButton extends Component {
  render() {
    const { clickHandler, isActive, isDisabled, lang } = this.props
    const { l } = this.context

    return (
      <div className="ApplePayButton">
        <Button
          lang={lang}
          className="ApplePayButton--button"
          clickHandler={clickHandler}
          isActive={isActive}
          isDisabled={isDisabled}
        >
          {/*
      According to the ApplePay doc, old versions of Safari don't support -webkit-appearance: -apple-pay-button,
      which will handle to show the button and translate the text.
      The html below is to support old versions of Safari.
      */}
          <span className="text">{l`Buy with`}</span>
          <span className="logo" />
        </Button>
      </div>
    )
  }
}

ApplePayButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
}

ApplePayButton.contextTypes = {
  l: PropTypes.func,
}

export default ApplePayButton
