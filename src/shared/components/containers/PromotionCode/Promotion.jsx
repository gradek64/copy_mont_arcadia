import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class Promotion extends Component {
  static propTypes = {
    promotion: PropTypes.object.isRequired,
    showAddButton: PropTypes.bool,
    removePromotionCode: PropTypes.func,
    showForm: PropTypes.func,
  }

  render() {
    const {
      showAddButton,
      removePromotionCode,
      showForm,
      promotion,
    } = this.props
    const { label, promotionCode } = promotion
    const actionRowClass = showAddButton ? ' PromotionCode-codeActionSpace' : ''
    return (
      <div key={promotionCode} className="PromotionCode-code">
        <span className="PromotionCode-codeTitle"> {promotionCode} </span>
        <p className="PromotionCode-codeDescription">{label}</p>
        <div className={`PromotionCode-codeActions${actionRowClass}`}>
          {showAddButton && (
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="PromotionCode-addText"
              onClick={showForm}
            >
              {' '}
              Add another
            </a>
          )}
          <a // eslint-disable-line jsx-a11y/no-static-element-interactions
            className="PromotionCode-removeText"
            onClick={() => removePromotionCode(promotionCode)}
          >
            Remove
          </a>
        </div>
      </div>
    )
  }
}
