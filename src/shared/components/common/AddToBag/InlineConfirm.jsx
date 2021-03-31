import PropTypes from 'prop-types'
import { path } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'

// actions
import { showMiniBagConfirm } from '../../../actions/common/shoppingBagActions'

// components
import ToolTip from '../ToolTip/ToolTip'
import Image from '../Image/Image'
import AddToBagConfirm from '../AddToBagConfirm/AddToBagConfirm'

const mapStateToProps = (state) => ({
  quantity: path(['shoppingBag', 'recentlyAdded', 'quantity'], state),
})

const mapDispatchToProps = { showMiniBagConfirm }

class InlineConfirm extends Component {
  static propTypes = {
    quantity: PropTypes.number,
    showMiniBagConfirm: PropTypes.func.isRequired,
  }

  static defaultProps = {
    quantity: 1,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  handleAddToBagConfirmClose = this.props.showMiniBagConfirm.bind(null, false)

  render() {
    const { quantity } = this.props
    const { l } = this.context

    return (
      <div className="InlineConfirm">
        <ToolTip arrowCentered>
          <div className="InlineConfirm-content">
            <div className="InlineConfirm-label">
              <Image
                className="InlineConfirm-tick"
                src="/assets/{brandName}/images/check-tick.svg"
              />
              {`${quantity} ${l`item(s) added to bag`}`}
            </div>
            <AddToBagConfirm onClose={this.handleAddToBagConfirmClose} />
          </div>
        </ToolTip>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineConfirm)

export {
  InlineConfirm as WrappedInlineConfirm,
  mapStateToProps,
  mapDispatchToProps,
}
