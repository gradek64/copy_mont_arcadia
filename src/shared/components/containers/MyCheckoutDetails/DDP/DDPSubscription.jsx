import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../../common/Button/Button'

import { browserHistory } from 'react-router'

const eGainPortal = {
  br:
    'http://help.burton.co.uk/system/templates/selfservice/burton/#!portal/403700000001071/article/Prod-34781/Can-I-cancel-my-Burton-Premier-Delivery-membership',
  dp:
    'http://help.dorothyperkins.com/system/templates/selfservice/dorothyperkins/#!portal/403700000001066/article/Prod-34779/Can-I-cancel-my-Dorothy-Perkins-Premier-Delivery-membership',
  ev:
    'http://help.evans.co.uk/system/templates/selfservice/evans/#!portal/403700000001062/article/Prod-34783/Can-I-cancel-my-Evans-Unlimited-Delivery-membership',
  ms:
    'http://help.missselfridge.com/system/templates/selfservice/missselfridge/#!portal/403700000001057/article/Prod-34799/Can-I-cancel-my-Miss-S-Unlimited-membership',
  tm:
    'http://help.topman.com/system/templates/selfservice/topman/#!portal/403700000001052/article/Prod-34788/Can-I-cancel-my-Topman-Unlimited-membership',
  ts:
    'http://help.topshop.com/system/templates/selfservice/topshop/#!portal/403700000001048/article/Prod-34796/Can-I-cancel-my-Topshop-Unlimited-Delivery-membership',
  wl:
    'http://help.wallis.co.uk/system/templates/selfservice/wallis/#!portal/403700000001045/article/Prod-34808/Can-I-cancel-my-Wallis-Unlimited-Delivery-membership',
}

const productPage = {
  br: '/en/bruk/category/ddp-8068633/home?cat2=3681049',
  dp: '/en/dpuk/category/digital-delivery-pass-8069175/home?cat2=3677539',
  ev: '/en/evuk/category/unlimited-delivery-8060594/home',
  ms: '/en/msuk/category/miss-s-unlimited-8073836/home',
  tm: '/en/tmuk/category/topman-unlimited-8059933/home',
  ts: '/en/tsuk/category/topshop-unlimited-8040085/home',
  wl: '/en/wluk/category/unlimited-delivery-8036879/home',
}

const DDPSubscription = (
  { user, brandCode, isDDPRenewablePostWindow, ddpProduct },
  { l }
) => {
  const { ddpEndDate, isDDPRenewable, isDDPUser } = user
  const expiringDateMessage = l`Your delivery subscription expires on`
  const hasExpiredMessage = l`Your subscription has expired`

  return (
    <div className="DDPSubscription">
      <h3>{ddpProduct.name || l`DDP Subscription`}</h3>
      <div className="DDPSubscription-container">
        <span className="DDPSubscription-icon" />
        <div className="DDPSubscription-renewal">
          <span className="DDPSubscription-message">
            {isDDPUser
              ? `${expiringDateMessage} ${ddpEndDate}`
              : isDDPRenewablePostWindow && hasExpiredMessage}
          </span>
          {isDDPRenewable && (
            <Button
              className="DDPSubscription-renewButton Button--secondary"
              clickHandler={() => {
                browserHistory.push(productPage[brandCode])
              }}
            >
              {l`RENEW`}
            </Button>
          )}
          {isDDPUser && (
            <a
              className="DDPSubscription-cancel"
              href={eGainPortal[brandCode]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`Cancel`}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

DDPSubscription.propTypes = {
  user: PropTypes.object.isRequired,
  brandCode: PropTypes.string.isRequired,
  isDDPRenewablePostWindow: PropTypes.bool.isRequired,
  ddpProduct: PropTypes.object.isRequired,
}

DDPSubscription.defaultProps = {
  ddpProduct: {},
}

DDPSubscription.contextTypes = {
  l: PropTypes.func,
}

export default DDPSubscription
