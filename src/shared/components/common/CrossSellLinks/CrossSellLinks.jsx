import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SandBox from '../../containers/SandBox/SandBox'
import cmsConsts from '../../../constants/cmsConsts'
import { getCurrentProduct } from '../../../../shared/selectors/productSelectors'
import { isFeatureCrossSellLinksEnabled } from '../../../selectors/featureSelectors'

const CrossSellLinks = React.memo((props) => {
  const { isFeatureCrossSellLinksEnabled = false, product = {} } = props
  const { attributes: productAttributes = {} } = product

  const crossSellLinksAttribute = productAttributes.ECMC_PROD_CROSS_SELL_8

  if (isFeatureCrossSellLinksEnabled && crossSellLinksAttribute) {
    return (
      <SandBox
        key="crossSellLinksSandBox"
        cmsPageName={crossSellLinksAttribute}
        isInPageContent
        shouldGetContentOnFirstLoad
        isFinalResponsiveEspotSolution
        contentType={cmsConsts.ESPOT_CONTENT_TYPE}
      />
    )
  }

  return null
})

CrossSellLinks.prototypes = {
  product: PropTypes.object.isRequired,
  isFeatureCrossSellLinksEnabled: PropTypes.bool.isRequired,
}

CrossSellLinks.displayName = 'CrossSellLinks'

export default connect(
  (state) => ({
    product: getCurrentProduct(state),
    isFeatureCrossSellLinksEnabled: isFeatureCrossSellLinksEnabled(state),
  }),
  {}
)(CrossSellLinks)
