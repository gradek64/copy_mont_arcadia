import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'

// components
import Input from '../../../../../common/FormComponents/Input/Input'
import Image from '../../../../../common/Image/Image'

export default class CVVField extends Component {
  static propTypes = {
    field: PropTypes.shape({
      value: PropTypes.string,
      isTouched: PropTypes.bool,
    }).isRequired,
    error: PropTypes.string,
    className: PropTypes.string,
    // functions
    setField: PropTypes.func.isRequired,
    touchedField: PropTypes.func.isRequired,
    messagePosition: PropTypes.oneOf(['default', 'bottom']),
    placeholder: PropTypes.string,
    label: PropTypes.string,
  }

  static defaultProps = {
    error: '',
    className: '',
    isMobile: false,
    messagePosition: 'default',
    placeholder: 'CVV*',
    label: 'CVV',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const {
      field,
      error,
      className,
      setField,
      touchedField,
      messagePosition,
      placeholder,
      label,
      savedPaymentType,
      storedPaymentDetails,
      isStoredCardExpired,
    } = this.props

    const CVVFieldClass = classnames('CVVField', className)
    const CvvInputClass = classnames('CVVField-cvv', {
      'CVVField-cvv--icon': savedPaymentType,
      'CVVField-cvv--warning': !!error && savedPaymentType,
    })

    const cvvWarningBoxStyle = classnames('CVVField-warningBox', {
      'CVVField-warningBox--cardExpired': isStoredCardExpired,
    })

    const cvvIconStyle = classnames('CVVField-icon', {
      'CVVField-icon--expired': isStoredCardExpired,
    })

    const fieldHasValue = field.value && field.value.length > 0

    return (
      <div className={CVVFieldClass}>
        {savedPaymentType &&
          !fieldHasValue &&
          !isStoredCardExpired && (
            <div className={cvvWarningBoxStyle}>
              <Image
                className={cvvIconStyle}
                src={'/assets/common/images/icon-cvv.svg'}
                alt=""
              />
              {l`Enter your CVV number to continue`}
            </div>
          )}
        {isStoredCardExpired ? (
          <div className={cvvWarningBoxStyle}>
            <Image
              className={cvvIconStyle}
              src={'/assets/common/images/icon-expired-card.svg'}
              alt=""
            />
            {l`Card ending in ${storedPaymentDetails.cardNumberStar.replace(
              /\*/g,
              ''
            )} has expired. Try a different card or payment method`}
          </div>
        ) : (
          <div className="CVVField-row">
            <Input
              className={CvvInputClass}
              field={field}
              name="cvv"
              label={l(label)}
              type="tel"
              placeholder={l(placeholder)}
              setField={setField}
              touchedField={touchedField}
              messagePosition={messagePosition}
              errors={{ cvv: l(error) }}
              isRequired
            />
          </div>
        )}
      </div>
    )
  }
}
