import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as ModalActions from '../../../actions/common/modalActions'
import OrderProducts from '../OrderProducts/OrderProducts'
import SandBox from '../../containers/SandBox/SandBox'
import QubitReact from 'qubit-react/wrapper'

// Selectors
import { getShoppingBagProductsWithInventory } from '../../../selectors/inventorySelectors'
import espots from '../../../constants/espotsMobile'
import { deleteFromBag } from '../../../actions/common/shoppingBagActions'
import {
  isFeatureHasDiscountTextEnabled,
  isFeatureEnabled,
} from '../../../selectors/featureSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

import cmsConsts from '../../../constants/cmsConsts'

import withRestrictedActionDispatch from '../../../lib/restricted-actions'

@withRestrictedActionDispatch({ deleteFromBag })
@connect(
  (state) => ({
    bagProducts: getShoppingBagProductsWithInventory(state),
    inCheckout: state.routing.location.pathname.startsWith('/checkout'),
    hasDiscountText: isFeatureHasDiscountTextEnabled(state),
    isFeatureSocialProofMinibagBadgeEnabled: isFeatureEnabled(
      state,
      'FEATURE_SOCIAL_PROOF_MINIBAG_BADGE'
    ),
    isMobile: isMobile(state),
  }),
  { ...ModalActions }
)
class ShoppingBag extends Component {
  static propTypes = {
    bagProducts: PropTypes.array,
    className: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    inCheckout: PropTypes.bool.isRequired,
    scrollMinibag: PropTypes.func,
    hasDiscountText: PropTypes.bool,
    isFeatureSocialProofMinibagBadgeEnabled: PropTypes.bool.isRequired,
  }

  renderEspot() {
    if (this.props.inCheckout || !this.props.isMobile) return null
    return (
      <SandBox
        cmsPageName={espots.shoppingBag[0]}
        contentType={cmsConsts.ESPOT_CONTENT_TYPE}
        isInPageContent
        shouldGetContentOnFirstLoad
      />
    )
  }

  render() {
    const {
      className,
      bagProducts,
      scrollMinibag,
      inCheckout,
      hasDiscountText,
      isFeatureSocialProofMinibagBadgeEnabled,
    } = this.props
    return (
      <div className={`ShoppingBag${className ? ` ${className}` : ''}`}>
        <OrderProducts
          products={bagProducts}
          scrollOnEdit={scrollMinibag}
          allowEmptyBag={!inCheckout}
          allowMoveToWishlist
          shouldProductsLinkToPdp
          hasDiscountText={hasDiscountText}
          shouldDisplaySocialProofLabel={
            isFeatureSocialProofMinibagBadgeEnabled
          }
          socialProofView="minibag"
        />
        <QubitReact id="qubit-minibag-shopping-bag-espot">
          {this.renderEspot()}
        </QubitReact>
      </div>
    )
  }
}

export default ShoppingBag
