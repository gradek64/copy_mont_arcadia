import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// selectors
import { getDDPDefaultSku } from '../../../../../selectors/siteOptionsSelectors'

// components
import Accordion from '../../../../common/Accordion/Accordion'
import Sandbox from '../../../SandBox/SandBox'
import Image from '../../../../common/Image/Image'

const mapStateToProps = (state) => ({
  ddpDefaultSku: getDDPDefaultSku(state),
  brandName: state.config.brandName,
})

class DigitalDeliveryPass extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    contentLoaded: false,
  }

  static propTypes = {
    ddpDefaultSku: PropTypes.object.isRequired,
  }

  static defaultProps = {
    ddpDefaultSku: {},
  }

  onContentLoaded = () => {
    this.setState({ contentLoaded: true })
  }

  render() {
    const { brandName, ddpDefaultSku } = this.props
    const { l } = this.context
    const { contentLoaded } = this.state

    return (
      <Accordion
        className="DigitalDeliveryPass"
        header={
          <div className="DigitalDeliveryPass-container">
            <Image
              className="DigitalDeliveryPass-icon"
              src={`/assets/${brandName}/images/ddp-icon.svg`}
            />
            <h3 className={'DigitalDeliveryPass-header'}>
              {ddpDefaultSku.name || l`Digital Delivery Pass`}
            </h3>
          </div>
        }
        accordionName="DDP"
        noContentPadding
        showLoader={!contentLoaded}
        expanded
      >
        <Sandbox
          shouldGetContentOnFirstLoad
          isResponsiveCatHeader
          onContentLoaded={this.onContentLoaded}
          cmsPageName="ddpPromo"
        />
      </Accordion>
    )
  }
}

export default connect(mapStateToProps)(DigitalDeliveryPass)
