import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

// helpers
import { isMultiLanguageShippingCountry } from '../../../lib/language'

// selectors
import { getShippingDestination } from '../../../selectors/shippingDestinationSelectors'
import { getLang } from '../../../selectors/configSelectors'
// actions
import { updateShippingDestination } from '../../../actions/common/shippingDestinationActions'
import { toggleTopNavMenu } from '../../../actions/components/TopNavMenuActions'
import { resetCategoryHistory } from '../../../actions/common/navigationActions'
import { clearInfinityPage } from '../../../actions/common/infinityScrollActions'
// components
import ShippingDestinationFlag from '../ShippingDestinationFlag/ShippingDestinationFlag'
import TopSectionItemLayout from '../../containers/TopNavMenu/TopSectionItemLayout'
// analytics
import { analyticsGlobalNavClickEvent } from '../../../analytics/tracking/site-interactions'
// constants
import navigationConsts from '../../../../shared/constants/navigation'

const MENU_ITEM_LABEL_FOR_ANALYTICS = navigationConsts.CHANGE_SHIPPING_DESTINATION_LABEL.toLowerCase()
const PATH_TO = 'change-your-shipping-destination'

@connect(
  (state) => ({
    shippingDestination: getShippingDestination(state),
    language: getLang(state),
  }),
  {
    updateShippingDestination,
    toggleTopNavMenu,
    resetCategoryHistory,
    clearInfinityPage,
  }
)
class ShippingDestinationMobile extends Component {
  static propTypes = {
    shippingDestination: PropTypes.string,
    updateShippingDestination: PropTypes.func,
    toggleTopNavMenu: PropTypes.func,
    resetCategoryHistory: PropTypes.func,
    clearInfinityPage: PropTypes.func,
    language: PropTypes.string.isRequired,
  }
  static defaultProps = {
    shippingDestination: null,
  }
  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.props.updateShippingDestination()
  }

  shouldShowLanguageCode() {
    return isMultiLanguageShippingCountry(this.props.shippingDestination)
  }

  handleClick = () => {
    const { l } = this.context
    this.props.toggleTopNavMenu()
    this.props.resetCategoryHistory()
    this.props.clearInfinityPage()
    analyticsGlobalNavClickEvent(l(MENU_ITEM_LABEL_FOR_ANALYTICS))
  }

  render() {
    const { l } = this.context
    const { shippingDestination, language } = this.props
    const label = shippingDestination || 'Country Selector'
    const languageCodeUpperCased = this.shouldShowLanguageCode()
      ? `(${language.toUpperCase()}) `
      : ''
    const text = (
      <div>
        {languageCodeUpperCased}
        <span className="ShippingDestinationMobile-countryName">
          {label === 'default' ? 'Europe' : label}
        </span>
      </div>
    )
    return (
      <Link
        className="ShippingDestinationMobile"
        to={`/${l(PATH_TO)}`}
        onClick={this.handleClick}
      >
        <TopSectionItemLayout
          leftIcon={
            <ShippingDestinationFlag
              shippingDestination={shippingDestination}
            />
          }
          text={text}
        />
      </Link>
    )
  }
}

export default ShippingDestinationMobile
