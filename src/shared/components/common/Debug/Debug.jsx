/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Accordion from '../../common/Accordion/Accordion'
import * as shoppingBagActions from '../../../actions/common/shoppingBagActions'

import * as authActions from '../../../actions/common/authActions'
import * as checkoutActions from '../../../actions/common/checkoutActions'
import * as FormActions from '../../../actions/common/formActions'
import * as debugActions from '../../../actions/components/debugActions'
import * as featuresActions from '../../../actions/common/featuresActions'
import * as cmsActions from '../../../actions/common/cmsActions'

import { connect } from 'react-redux'

@connect(
  (state) => ({
    featureStatus: state.features.status,
    featureOverrides: state.features.overrides,
    debugInfo: state.debug,
  }),
  {
    ...debugActions,
    ...shoppingBagActions,
    ...checkoutActions,
    ...FormActions,
    ...authActions,
    ...featuresActions,
    ...cmsActions,
  }
)
class Debug extends Component {
  static propTypes = {
    hideDebug: PropTypes.func,
    getBag: PropTypes.func,
    getOrderSummary: PropTypes.func,
    addToBag: PropTypes.func,
    setFormField: PropTypes.func,
    loginRequest: PropTypes.func,
    featureStatus: PropTypes.object.isRequired,
    featureOverrides: PropTypes.object,
    debugInfo: PropTypes.object.isRequired,
    toggleFeature: PropTypes.func,
    resetFeatures: PropTypes.func,
  }

  getMultipleOrderSummaries() {
    const { getOrderSummary } = this.props
    getOrderSummary()
    getOrderSummary()
    getOrderSummary()
    getOrderSummary()
  }

  addRandomProduct() {
    const { addToBag } = this.props
    const products = [
      { id: 25658756, sku: 602016000993693 },
      { id: 25658756, sku: 602016000993694 },
      { id: 25658756, sku: 602016000993695 },
      { id: 25658756, sku: 602016000993696 },
      { id: 25473376, sku: 602016000987555 },
      { id: 25473376, sku: 602016000987556 },
      { id: 25473376, sku: 602016000987557 },
      { id: 25653359, sku: 602016000993458 },
      { id: 25653359, sku: 602016000993459 },
      { id: 25653359, sku: 602016000993460 },
      { id: 25653359, sku: 602016000993461 },
      { id: 25598559, sku: 602016000991659 },
      { id: 25598559, sku: 602016000991660 },
      { id: 25598559, sku: 602016000991661 },
      { id: 25598559, sku: 602016000991662 },
      { id: 25610136, sku: 602016000992154 },
      { id: 25610136, sku: 602016000992155 },
      { id: 25610136, sku: 602016000992156 },
      { id: 25659462, sku: 602016000993777 },
      { id: 25659462, sku: 602016000993778 },
      { id: 25659462, sku: 602016000993779 },
      { id: 25549771, sku: 602016000989747 },
      { id: 25549771, sku: 602016000989748 },
      { id: 25549771, sku: 602016000989750 },
      { id: 25684189, sku: 602016000994517 },
      { id: 25684189, sku: 602016000994518 },
      { id: 25684189, sku: 602016000994519 },
    ]
    const product = products[Math.floor(Math.random() * products.length)]

    addToBag(product.id, product.sku, undefined, 'Random Product Added', null)
  }

  fillInAnonymousDelivery() {
    const { setFormField } = this.props
    setFormField('yourDetails', 'firstName', 'Vu')
    setFormField('yourDetails', 'lastName', 'Nguyen')
    setFormField('yourDetails', 'telephone', '07436864294')
    setFormField('yourAddress', 'address1', 'Crondall Court')
    setFormField('yourAddress', 'postcode', 'N1 6JH')
    setFormField('yourAddress', 'city', 'London')
  }

  loginToSummary() {
    const { loginRequest } = this.props
    const getNextRoute = () => '/checkout/summary'

    loginRequest(
      {
        credentials: {
          username: 'vu7@test.com',
          password: 'test123',
        },
        getNextRoute,
      },
      () => {}
    )
  }

  renderBuildInfo() {
    const { buildInfo } = this.props.debugInfo
    return (
      <li>
        Build
        <ul>
          {Object.keys(buildInfo).map((prop, i) => {
            return (
              <li
                key={`info-${i}`} // eslint-disable-line react/no-array-index-key
              >
                {prop}: {buildInfo[prop]}
              </li>
            )
          })}
        </ul>
      </li>
    )
  }

  render() {
    const {
      getBag,
      getOrderSummary,
      hideDebug,
      featureStatus,
      featureOverrides,
      toggleFeature,
      resetFeatures,
    } = this.props
    const { environment, buildInfo } = this.props.debugInfo
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className="Debug"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="Debug-content">
          <header className="Debug-header">
            <h2 className="Debug-title">Debug menu</h2>
            <button className="Debug-close" onClick={hideDebug}>
              ×
            </button>
          </header>
          <Accordion
            header="Build info"
            accordionName="Build-info"
            className="Build-info"
          >
            <ul>
              <li>API Environment: {environment}</li>
              {buildInfo ? this.renderBuildInfo() : null}
            </ul>
          </Accordion>
          <Accordion
            header="Feature flags"
            accordionName="Debug-features"
            noContentPadding
            className="Debug-features"
          >
            <div>
              <button
                className="Debug-button Debug-feature"
                id="reset-features-button"
                onClick={resetFeatures}
              >
                Reset features
              </button>
            </div>
            <div>
              {Object.keys(featureStatus).map((feature, i) => {
                const isEnabled = featureStatus[feature]
                const isOverridden = feature in featureOverrides
                return (
                  <button
                    key={`feature-${i}`} // eslint-disable-line react/no-array-index-key
                    className={`Debug-button Debug-feature ${
                      isEnabled ? 'is-enabled' : ''
                    }`}
                    onClick={() => toggleFeature(feature)}
                  >
                    Toggle {feature} - {isEnabled ? 'enabled' : 'disabled'}{' '}
                    {isOverridden ? ' - OVERRIDDEN' : ''}
                  </button>
                )
              })}
            </div>
          </Accordion>
          <Accordion
            header="Checkout"
            accordionName="Debug-checkout"
            noContentPadding
            className="Debug-checkout"
          >
            <div>
              <button className="Debug-button" onClick={() => getBag()}>
                Get mini bag
              </button>
              <button
                className="Debug-button"
                onClick={() => getOrderSummary()}
              >
                Get order summary bag
              </button>
              <button
                className="Debug-button"
                onClick={() => this.addRandomProduct()}
              >
                Add item to bag
              </button>
              <button
                className="Debug-button"
                onClick={() => this.loginToSummary()}
              >
                Login go to checkout summary
              </button>
              <button
                className="Debug-button"
                onClick={() => this.getMultipleOrderSummaries()}
              >
                Get multiple order summaries
              </button>
              <Link
                className="Debug-button"
                to="/checkout/summary"
                onClick={hideDebug}
              >
                Go to checkout summary
              </Link>
              <Link
                className="Debug-button"
                to="/checkout/delivery?isAnonymous=true"
                onClick={hideDebug}
              >
                Go to checkout anonymous
              </Link>
              <Link
                className="Debug-button"
                to="/checkout/klarna"
                onClick={hideDebug}
              >
                Klarna Test
              </Link>
              <button
                className="Debug-button"
                onClick={() => this.fillInAnonymousDelivery()}
              >
                Fill in delivery page
              </button>
            </div>
          </Accordion>
        </div>
      </div>
    )
  }
}

export default Debug
