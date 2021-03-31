import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { closeModal } from '../../../actions/common/modalActions'
import * as ShippingDestinationActions from '../../../actions/common/shippingDestinationActions'

import Select from '../FormComponents/Select/Select'
import Button from '../../common/Button/Button'
import BagTransferNote from '../BagTransferNote/BagTransferNote'
import {
  isMultiLanguageShippingCountry,
  getDefaultLanguageByShippingCountry,
  getBrandLanguageOptions,
} from '../../../lib/language'
import { getBrandCode } from '../../../selectors/configSelectors'
import { GTM_EVENT, sendAnalyticsDisplayEvent } from '../../../analytics'
import { camelCaseify } from '../../../lib/string-utils'

class ShippingRedirectModal extends React.Component {
  static propTypes = {
    country: PropTypes.string.isRequired,
    brandCode: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    sendAnalyticsDisplayEvent: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    country: '',
  }

  state = {
    language: getDefaultLanguageByShippingCountry(
      this.props.brandCode,
      this.props.country,
      true
    ),
  }

  componentDidMount() {
    const { country, sendAnalyticsDisplayEvent } = this.props

    sendAnalyticsDisplayEvent(
      {
        shippingCountry: country,
        shippableCountry: false,
      },
      GTM_EVENT.CHECKOUT_SHIPPING_REDIRECT_MODAL_DISPLAYED
    )
  }

  handleOnChange = (e) => {
    this.setState({ language: e.target.value })
  }

  render() {
    const { closeModal, redirect, country, brandCode } = this.props
    const { l } = this.context
    const showLanguageOptions = isMultiLanguageShippingCountry(country, true)
    const languageOptions = getBrandLanguageOptions(brandCode, true)

    const handleContinueLinkClick = () => {
      redirect(country, this.state.language, 'shippingRedirectModalCheckout')
    }

    const handleCancelClick = (e) => {
      e.preventDefault()
      closeModal()
    }

    return (
      <div className="ShippingRedirectModal">
        <p className="ShippingRedirectModal-intro">
          {l('You are about to be taken to the website for')}:
        </p>
        <p className="ShippingRedirectModal-country">
          <span
            className={`ShippingRedirectModal-flag FlagIcons FlagIcons--${camelCaseify(
              country
            )}`}
          />
          {country}
        </p>

        {showLanguageOptions && (
          <div className="ShippingRedirectModal-languages">
            <Select
              label={l('Select language')}
              name="language"
              onChange={this.handleOnChange}
              options={languageOptions}
              defaultValue={this.state.language}
            />
          </div>
        )}

        <div className="ShippingRedirectModal-continue">
          <Button
            className="Button--primary ShippingRedirectModal-button"
            clickHandler={handleContinueLinkClick}
          >
            {l('Continue')}
          </Button>
        </div>

        <p>
          <a
            href=""
            className="ShippingRedirectModal-cancel"
            role="button"
            tabIndex={0}
            onClick={handleCancelClick}
          >
            {l('Cancel')}
          </a>
        </p>

        <BagTransferNote />
      </div>
    )
  }
}

export default connect(
  (state) => ({
    brandCode: getBrandCode(state),
  }),
  {
    closeModal,
    redirect: ShippingDestinationActions.redirect,
    sendAnalyticsDisplayEvent,
  }
)(ShippingRedirectModal)

export { ShippingRedirectModal as WrappedShippingRedirectModal }
