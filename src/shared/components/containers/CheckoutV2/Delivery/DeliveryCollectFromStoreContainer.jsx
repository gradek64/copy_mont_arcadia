import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import StoreLocator from '../../../common/StoreLocator/StoreLocator'
import { getStores } from '../../../../actions/components/StoreLocatorActions'
import { setStoreUpdating } from '../../../../actions/common/checkoutActions'
import analyticsDecorator from '../../../../../client/lib/analytics/analytics-decorator'

@analyticsDecorator('collect-from-store', { isAsync: true })
@connect(
  (state) => ({
    location: state.routing.location,
    isMobile: state.viewport.media === 'mobile',
  }),
  {
    setStoreUpdating,
  }
)
class DeliveryCollectFromStoreContainer extends Component {
  static propTypes = {
    location: PropTypes.object,
    isMobile: PropTypes.bool,
    setStoreUpdating: PropTypes.func,
  }

  componentDidMount() {
    if (window) window.scrollTo(0, 0)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isMobile, setStoreUpdating } = this.props
    if (!nextProps.isMobile && isMobile !== nextProps.isMobile) {
      setStoreUpdating(false)
      browserHistory.push('/checkout/delivery')
    }
  }

  static needs = [getStores]

  render() {
    return (
      <StoreLocator
        storeLocatorType="collectFromStore"
        location={this.props.location}
      />
    )
  }
}

export default DeliveryCollectFromStoreContainer
