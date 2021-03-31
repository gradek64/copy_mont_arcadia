import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobile } from '../../../selectors/viewportSelectors'

function PaymentOption(props) {
  const {
    label,
    value,
    icons,
    children,
    onChange,
    isMobile,
    isChecked,
    description,
  } = props

  return (
    <div className="PaymentOption" key={value}>
      <label className="PaymentOption-container RadioButton" htmlFor={value}>
        <input
          className="RadioButton-input"
          type="radio"
          id={value}
          value={value}
          onChange={onChange}
          checked={isChecked}
        />
        <span className="PaymentOption-content RadioButton-content">
          <span className="PaymentOption-label">{label}</span>
          {description && (
            <span className="PaymentOption-description">{description}</span>
          )}
        </span>
        {!isMobile &&
          icons.length > 0 && (
            <span className="PaymentOption-icons">
              {icons.map((icon) => (
                <img
                  className="PaymentOption-icon"
                  key={icon}
                  src={`/assets/common/images/${icon}`}
                  alt=""
                />
              ))}
            </span>
          )}
      </label>
      {children}
    </div>
  )
}

PaymentOption.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  description: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.string),
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
}

PaymentOption.defaultProps = {
  description: '',
  icons: [],
  isChecked: false,
  onChange: () => {},
}

const mapStateToProps = (state) => ({
  isMobile: isMobile(state),
})

export default connect(mapStateToProps)(PaymentOption)

export { PaymentOption as WrappedPaymentOption }
