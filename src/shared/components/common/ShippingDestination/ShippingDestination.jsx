import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

// actions
import { showModal } from '../../../actions/common/modalActions'
import { updateShippingDestination } from '../../../actions/common/shippingDestinationActions'

// selectors
import { getCurrencySymbol } from '../../../selectors/configSelectors'
import { getShippingDestination } from '../../../selectors/shippingDestinationSelectors'

// components
import ShippingPreferencesSelectorModal from '../ShippingPreferencesSelectorModal/ShippingPreferencesSelectorModal'
import ShippingDestinationFlag from '../ShippingDestinationFlag/ShippingDestinationFlag'

@connect(
  (state) => ({
    currencySymbol: getCurrencySymbol(state),
    shippingDestination: getShippingDestination(state),
  }),
  (dispatch) => ({
    updateShippingDestination: () => dispatch(updateShippingDestination()),
    onShippingDestinationChange: () =>
      dispatch(showModal(<ShippingPreferencesSelectorModal />)),
  })
)
class ShippingDestination extends React.Component {
  static propTypes = {
    currencySymbol: PropTypes.string.isRequired,
    shippingDestination: PropTypes.string,
    className: PropTypes.string,
    modifier: PropTypes.string,
    text: PropTypes.string,
    currencySymbolPosition: PropTypes.oneOf(['left', 'right', 'hide']),
    currencySymbolStyle: PropTypes.oneOf(['standard', 'bracketed']),
    displayCountry: PropTypes.bool,
    onShippingDestinationChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    shippingDestination: undefined,
    modifier: undefined,
    className: '',
    text: undefined,
    currencySymbolPosition: 'left',
    currencySymbolStyle: 'standard',
    displayCountry: false,
  }

  componentDidMount() {
    this.props.updateShippingDestination()
  }

  render() {
    const {
      className,
      currencySymbol,
      shippingDestination,
      modifier,
      text,
      currencySymbolPosition,
      currencySymbolStyle,
      displayCountry,
      onShippingDestinationChange,
    } = this.props

    const classNames = classnames('ShippingDestination', className, {
      [`ShippingDestination--${modifier}`]: modifier,
    })
    const currencySymbolClassNames = classnames(
      'ShippingDestination-currencySymbol',
      {
        [`ShippingDestination-currencySymbol--${currencySymbolStyle}`]:
          currencySymbolStyle !== 'standard',
      }
    )

    return (
      <button className={classNames} onClick={onShippingDestinationChange}>
        {text && <span className="ShippingDestination-text">{text}</span>}
        {displayCountry &&
          shippingDestination && (
            <span className="ShippingDestination-country">
              {shippingDestination}
            </span>
          )}
        {currencySymbolPosition === 'left' && (
          <span className={currencySymbolClassNames}>{currencySymbol}</span>
        )}
        {shippingDestination && (
          <ShippingDestinationFlag shippingDestination={shippingDestination} />
        )}
        {currencySymbolPosition === 'right' && (
          <span className={currencySymbolClassNames}>{currencySymbol}</span>
        )}
      </button>
    )
  }
}

export default ShippingDestination
