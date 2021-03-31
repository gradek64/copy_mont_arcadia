import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import AccountItem from '../../common/AccountItem/AccountItem'
import DDPRenewal from '../../containers/CheckoutV2/shared/DigitalDeliveryPass/DDPRenewal'
import {
  getPreferenceLink,
  getAccount,
} from '../../../actions/common/accountActions'
import { connect } from 'react-redux'
import { isCheckoutProfile } from '../../../lib/checkout'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import {
  getExponeaMemberId,
  getExponeaLink,
} from '../../../selectors/common/accountSelectors'
import { isFeatureMyPreferencesEnabled } from '../../../selectors/featureSelectors'
import {
  getDDPDefaultName,
  ddpRenewalEnabled,
} from '../../../selectors/ddpSelectors'

// Libs
import { path } from 'ramda'
import { getBag } from '../../../actions/common/shoppingBagActions'

@analyticsDecorator('my-account')
@connect(
  (state) => ({
    isMobile: state.viewport.media === 'mobile',
    user: state.account.user,
    exponeaLink: getExponeaLink(state),
    region: state.config.region,
    location: state.routing.location,
    memberId: getExponeaMemberId(state),
    isFeatureMyPreferencesEnabled: isFeatureMyPreferencesEnabled(state),
    locale: state.config.locale,
    ddpProductName: getDDPDefaultName(state),
    ddpRenewalEnabled: ddpRenewalEnabled(state),
  }),
  {
    getBag,
    getPreferenceLink,
    getAccount,
  }
)
class MyAccount extends Component {
  static propTypes = {
    region: PropTypes.string.isRequired,
    user: PropTypes.object,
    location: PropTypes.object,
    getBag: PropTypes.func,
    getPreferenceLink: PropTypes.func,
    ddpProductName: PropTypes.string.isRequired,
    ddpRenewalEnabled: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static needs = [getAccount]

  componentDidMount() {
    const {
      location,
      getBag,
      exponeaLink,
      getPreferenceLink,
      isFeatureMyPreferencesEnabled,
    } = this.props
    if (path(['query', 'getBasket'], location) === 'true') getBag()
    if (isFeatureMyPreferencesEnabled && !exponeaLink) getPreferenceLink()
  }

  /**
   *
   * @param {array} listItems
   * @param {string} alignment
   * @returns {object} react component
   */
  renderList(listItems, alignment = 'left') {
    const classNames = `MyAccount-list MyAccount-list${alignment}`
    return (
      <ul className={classNames} tabIndex="-1">
        {listItems.map((entry, index) => (
          <AccountItem
            key={index} // eslint-disable-line react/no-array-index-key
            title={entry.title}
            description={entry.description}
            link={entry.link}
            isExternal={entry.isExternal}
          />
        ))}
      </ul>
    )
  }

  /**
   * @function - if isCheckoutProfile > true, we return array of all elements
   * other wise we return defaults
   * @returns {array}
   */
  getMenuEntriesLeft() {
    const { l } = this.context
    const {
      user,
      isFeatureMyPreferencesEnabled,
      exponeaLink,
      ddpProductName,
      ddpRenewalEnabled,
    } = this.props

    const checkoutProfileDescription = () =>
      ddpRenewalEnabled
        ? l`Check your saved delivery, payment details and ${ddpProductName} Subscription`
        : l`Check your saved delivery and payment details`

    return [
      {
        title: l`My details`,
        description: l`Add your name or change your email address`,
        link: '/my-account/my-details',
        isExternal: false,
      },
      {
        title: l`My password`,
        description: l`Change your account password`,
        link: '/my-account/my-password',
        isExternal: false,
      },
      ...(isFeatureMyPreferencesEnabled && exponeaLink
        ? [
            {
              title: l`My Preferences`,
              description: l`Manage your email preferences`,
              link: exponeaLink,
              isExternal: true,
            },
          ]
        : []),
      ...(isCheckoutProfile(user)
        ? [
            {
              title: l`My Delivery & Payment Details`,
              description: checkoutProfileDescription(),
              link: '/my-account/details',
              isExternal: false,
            },
          ]
        : []),
    ]
  }

  getMenuEntriesRight() {
    const { region, user } = this.props
    const { l } = this.context
    const menuList = [
      {
        title: l`My orders`,
        description: l`Track your current orders, view your order history and start a return`,
        link: '/my-account/order-history',
        isExternal: false,
      },
    ]

    const myReturns = {
      title: l`My Returns`,
      description: l`Track your current returns and view your return history`,
      link: '/my-account/return-history',
      isExternal: false,
    }
    if (isCheckoutProfile(user)) menuList.push(myReturns)

    const eReceiptLink = {
      title: l`E-receipts`,
      description: l`Manage your E-receipts here`,
      link: '/my-account/e-receipts',
      isExternal: false,
    }
    if (region === 'uk') menuList.push(eReceiptLink)
    return menuList
  }

  render() {
    const { l } = this.context
    const { isMobile } = this.props
    const listItemsLeft = this.getMenuEntriesLeft()
    const listItemsRight = this.getMenuEntriesRight()
    const showHeadingClass = isMobile ? 'screen-reader-text' : ''
    return (
      <div className="MyAccount">
        <Helmet title={l`My account`} />
        <div className="MyAccount-inner">
          <h1 className={showHeadingClass}>{l`My account`}</h1>
          <DDPRenewal isMyAccount withMoreDetailsLink />
          {this.renderList(listItemsLeft)}
          {this.renderList(listItemsRight, 'right')}
        </div>
      </div>
    )
  }
}

export default MyAccount
