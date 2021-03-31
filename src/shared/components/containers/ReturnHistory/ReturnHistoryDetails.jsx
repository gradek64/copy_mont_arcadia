import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  setReturnHistoryDetails,
  returnHistoryDetailsRequest,
  returnHistoryRequest,
} from '../../../actions/common/accountActions'
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import ReturnHistoryDetailsSummary from './ReturnHistoryDetailsSummary'
import NotFound from '../OrderListContainer/NotFound'
import ReturnHistoryOrder from './ReturnHistoryOrder'
import { PrivacyGuard } from './../../../lib/privacy-guard'
import ReturnHistoryDetailsPayment from './ReturnHistoryDetailsPayment'

import { find, propEq } from 'ramda'
import { getDecoratedReturnDetails } from '../../../selectors/common/accountSelectors'

export const mapStateToProps = (state) => ({
  isMobile: state.viewport.media === 'mobile',
  visited: state.routing.visited,
  returnDetails: getDecoratedReturnDetails(state),
  returns: state.returnHistory.returns,
})

@connect(
  mapStateToProps,
  {
    returnHistoryDetailsRequest,
    setReturnHistoryDetails,
    returnHistoryRequest,
  }
)
class ReturnHistoryDetails extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    returns: PropTypes.array,
    returnDetails: PropTypes.object,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static needs = [
    ({ param: orderId, id }) => returnHistoryDetailsRequest(orderId, id),
    returnHistoryRequest,
  ]

  componentDidMount() {
    const { returnHistoryDetailsRequest, params } = this.props

    const { param: orderId, id } = params
    if (this.shouldRequestReturnListDetails(id))
      returnHistoryDetailsRequest(orderId, id)
  }

  shouldRequestReturnListDetails = (id) => {
    const { visited, returnDetails } = this.props
    const isStored =
      // eslint-disable-next-line eqeqeq
      typeof returnDetails !== 'undefined' && returnDetails.rmaId == id
    return visited.length > 1 && !isStored
  }

  setOrderComponent(orderLines) {
    const { l } = this.context

    if (!orderLines || !orderLines.length)
      return <NotFound message={l`There are no returns found`} />

    return orderLines.map((key, i) => {
      return (
        <ReturnHistoryOrder key={orderLines[i].lineNo} {...orderLines[i]} />
      )
    })
  }

  extractDateFromList = () => {
    const { returns, returnDetails } = this.props
    const rmaId =
      typeof returnDetails !== 'undefined' ? returnDetails.rmaId : false
    return rmaId ? find(propEq('rmaId', rmaId))(returns) : false
  }

  render() {
    if (!this.props.returnDetails.orderId) return null
    const { l } = this.context
    const { returnDetails } = this.props
    const {
      orderId,
      paymentDetails,
      totalOrderPrice,
      totalOrdersDiscount,
      orderLines,
      deliveryPrice,
      subTotal,
    } = returnDetails
    const returnHistoryDiscountProps = {
      totalOrderPrice,
      totalOrdersDiscount,
      deliveryPrice,
      subTotal,
    }

    const orders = this.setOrderComponent(orderLines)
    const returnDetail = this.extractDateFromList()

    return (
      <section className="ReturnHistoryDetails">
        <AccountHeader
          link="/my-account/return-history"
          label={l`Back to My Returns`}
          title={l`Return Details`}
        />
        <div className="MyAccount-wrapper">
          <div className="ReturnHistoryDetails-orderDetailsContainer">
            <div className="ReturnHistoryDetails-orderNumberContainer">
              <p className="ReturnHistoryDetails-orderNumberLabel">
                {l`Order Number`}:
              </p>
              <p className="ReturnHistoryDetails-orderNumber">
                <PrivacyGuard>
                  <strong>{orderId}</strong>
                </PrivacyGuard>
              </p>
            </div>
            {returnDetail && (
              <p className="ReturnHistoryDetails-returnDate">
                <PrivacyGuard>
                  <strong>{returnDetail.date}</strong>
                </PrivacyGuard>
              </p>
            )}
          </div>
          {orders}
          <ReturnHistoryDetailsSummary {...returnHistoryDiscountProps} />
          <ReturnHistoryDetailsPayment paymentDetails={paymentDetails} />
        </div>
      </section>
    )
  }
}

export default ReturnHistoryDetails
