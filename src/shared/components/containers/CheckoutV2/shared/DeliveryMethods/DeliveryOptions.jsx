import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

// Qubit Wrapper
import QubitReact from 'qubit-react/wrapper'

const DeliveryOptions = ({
  deliveryType,
  deliveryOptions,
  onChange,
  className,
  onAccordionToggle,
}) => {
  return deliveryOptions.length ? (
    <QubitReact
      id="qubit-delivery-calender-view"
      onChange={onChange}
      deliveryOptions={deliveryOptions}
    >
      <div className={className}>
        {deliveryOptions &&
          deliveryOptions.map((option) => {
            const { dateText, dayText, selected, shipModeId } = option
            const buttonClassNames = classNames(`${className}-dateButton`, {
              [`${className}-dateButton--selected`]: selected,
            })
            const dayTextClassNames = classNames(`${className}-dayText`, {
              [`${className}-dayText--notSelected`]: !selected,
            })
            const monthTextClassNames = classNames(`${className}-monthText`, {
              [`${className}-monthText--notSelected`]: !selected,
            })
            const dayButtonContainerClassNames = classNames(
              `${className}-dayButtonContainer`
            )
            return (
              <div key={dayText} className={dayButtonContainerClassNames}>
                <span className={dayTextClassNames}>{dayText && dayText}</span>
                <button
                  className={buttonClassNames}
                  name={deliveryType.toLowerCase()}
                  value={shipModeId}
                  onClick={({ target }) => {
                    onChange(target.value)
                    onAccordionToggle()
                  }}
                >
                  {dateText && dateText.substring(0, 2)}
                </button>
                <span className={monthTextClassNames}>
                  {dayText && dateText.substring(3, dateText.length)}
                </span>
              </div>
            )
          })}
      </div>
    </QubitReact>
  ) : null
}

DeliveryOptions.propTypes = {
  deliveryType: PropTypes.string.isRequired,
  deliveryOptions: PropTypes.arrayOf(
    PropTypes.shape({
      shipModeId: PropTypes.number,
      dayText: PropTypes.string,
      dateText: PropTypes.string,
      price: PropTypes.string,
      selected: PropTypes.bool,
    })
  ),
  onChange: PropTypes.func,
}

DeliveryOptions.defaultProps = {
  deliveryOptions: [],
  onChange: () => {},
}

DeliveryOptions.contextTypes = {
  p: PropTypes.func,
}

export default DeliveryOptions
