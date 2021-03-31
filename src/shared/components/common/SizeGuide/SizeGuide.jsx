import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import cn from 'classnames'

import {
  showSizeGuide,
  setSizeGuide,
} from '../../../actions/common/productsActions'
import {
  getMatchingAttribute,
  checkIfOneSizedItem,
} from '../../../lib/product-utilities'
import { isFeaturePdpQuantity } from '../../../selectors/featureSelectors'

@connect(
  (state) => ({
    isFeaturePdpQuantity: isFeaturePdpQuantity(state),
  }),
  { showSizeGuide, setSizeGuide }
)
class SizeGuide extends Component {
  static propTypes = {
    items: PropTypes.array,
    attributes: PropTypes.object,
    type: PropTypes.oneOf(['pdp', 'bundles']),
    setSizeGuide: PropTypes.func,
    showSizeGuide: PropTypes.func,
    openDrawer: PropTypes.bool,
    displayAsBox: PropTypes.bool,
    className: PropTypes.string,
    isFeaturePdpQuantity: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    type: 'pdp',
    openDrawer: false,
    displayAsBox: false,
    className: '',
  }

  onClickSizeGuide = (event) => {
    const { openDrawer, showSizeGuide, setSizeGuide, attributes } = this.props
    const reference = getMatchingAttribute('ECMC_PROD_SIZE_GUIDE', attributes)
    if (openDrawer) {
      event.preventDefault()
      setSizeGuide(reference)
      showSizeGuide()
    }
  }

  render() {
    const { l } = this.context
    const {
      items,
      type,
      attributes,
      displayAsBox,
      className,
      isFeaturePdpQuantity,
    } = this.props
    const isOneSizedItem = checkIfOneSizedItem(items)
    const reference = getMatchingAttribute('ECMC_PROD_SIZE_GUIDE', attributes)

    if (!reference || reference === 'NoSizeGuide' || isOneSizedItem) return null

    return (
      <div
        className={cn(`SizeGuide SizeGuide--${type}`, className, {
          'SizeGuide--box': displayAsBox,
          'SizeGuide--box-withQuantity': isFeaturePdpQuantity,
        })}
      >
        <Link
          className="SizeGuide-link"
          to={`/size-guide/${reference}`}
          onClick={this.onClickSizeGuide}
        >
          <i className="SizeGuide-icon" />
          <span className="SizeGuide-label">{l`Size guide`}</span>
        </Link>
      </div>
    )
  }
}

export default SizeGuide
