import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Sandbox from '../SandBox/SandBox'
import Espot from '../Espot/Espot'
import Helmet from 'react-helmet'
import * as sandBoxActions from '../../../actions/common/sandBoxActions'
import espots from '../../../constants/espotsMobile'
import cmsConsts from '../../../constants/cmsConsts'
import { GTM_CATEGORY } from '../../../analytics'
import espotsDesktopConstants from '../../../../shared/constants/espotsDesktop'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import {
  getBrandDisplayName,
  getHrefLanguages,
} from '../../../../shared/selectors/configSelectors'
import {
  isFeatureHomePageSegmentationEnabled,
  isFeatureHttpsCanonicalEnabled,
  isFeatureDeferCmsContentEnabled,
} from '../../../selectors/featureSelectors'
import { getCanonicalHostname } from '../../../../shared/lib/canonicalisation'
import ConnectedAbandonmentModalTrigger from '../AbandonmentModalTrigger/AbandonmentModalTrigger'

@analyticsDecorator(GTM_CATEGORY.HOME, { isAsync: true })
@connect(
  (state) => ({
    brandName: getBrandDisplayName(state),
    isHomePageSegmentationEnabled: isFeatureHomePageSegmentationEnabled(state),
    routingLocation: state.routing.location,
    isFeatureHttpsCanonicalEnabled: isFeatureHttpsCanonicalEnabled(state),
    isFeatureDeferCmsContentEnabled: isFeatureDeferCmsContentEnabled(state),
    hrefLanguages: getHrefLanguages(state),
  }),
  {
    ...sandBoxActions,
  }
)
class Home extends Component {
  static propTypes = {
    showTacticalMessage: PropTypes.func,
    hideTacticalMessage: PropTypes.func,
    brandName: PropTypes.string.isRequired,
    isHomePageSegmentationEnabled: PropTypes.bool.isRequired,
    routingLocation: PropTypes.object.isRequired,
    isFeatureHttpsCanonicalEnabled: PropTypes.bool.isRequired,
    isFeatureDeferCmsContentEnabled: PropTypes.bool.isRequired,
    hrefLanguages: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string.isRequired,
        hreflang: PropTypes.string.isRequired,
      })
    ),
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { showTacticalMessage } = this.props
    showTacticalMessage()
  }

  componentWillUnmount() {
    const { hideTacticalMessage } = this.props
    hideTacticalMessage()
  }

  static needs = [
    sandBoxActions.showTacticalMessage,
    () => sandBoxActions.getHomePageContent(),
    () =>
      sandBoxActions.getContent(
        null,
        espots.home[0],
        cmsConsts.ESPOT_CONTENT_TYPE
      ),
    () =>
      sandBoxActions.getContent(
        null,
        espots.home[1],
        cmsConsts.ESPOT_CONTENT_TYPE
      ),
  ]

  render() {
    const {
      brandName,
      isHomePageSegmentationEnabled,
      routingLocation,
      isFeatureHttpsCanonicalEnabled,
      isFeatureDeferCmsContentEnabled,
      hrefLanguages,
    } = this.props
    const abandonmentModalEspot = espotsDesktopConstants.abandonment_modal.HOME
    const { l } = this.context
    const segmentationData = {
      wcsEndpoint: '/home',
      responseIdentifier: espotsDesktopConstants.home.mainBody,
    }

    const { hostname } = routingLocation

    const canonicalLink = [
      {
        rel: 'canonical',
        href: getCanonicalHostname(hostname, isFeatureHttpsCanonicalEnabled),
      },
    ]

    const hrefLangLinks = (hrefLanguages || []).map((hrefLangOptions) => ({
      rel: 'alternate',
      ...hrefLangOptions,
    }))

    return (
      <div style={{ margin: '0 auto' }}>
        <Helmet link={canonicalLink.concat(hrefLangLinks)} />
        <h1 className="screen-reader-text">{`${brandName} ${l`homepage`}`}</h1>
        <Espot identifier={espotsDesktopConstants.home.content} />
        <Sandbox
          cmsPageName="home"
          segmentationRequestData={
            isHomePageSegmentationEnabled ? segmentationData : null
          }
          contentType={cmsConsts.PAGE_CONTENT_TYPE}
          isInPageContent
          lazyLoad={isFeatureDeferCmsContentEnabled}
        />
        <Sandbox
          cmsPageName={espots.home[0]}
          contentType={cmsConsts.ESPOT_CONTENT_TYPE}
          isInPageContent
          shouldGetContentOnFirstLoad
        />
        <Sandbox
          cmsPageName={espots.home[1]}
          contentType={cmsConsts.ESPOT_CONTENT_TYPE}
          isInPageContent
          shouldGetContentOnFirstLoad
        />
        <ConnectedAbandonmentModalTrigger espot={abandonmentModalEspot} />
      </div>
    )
  }
}

export default Home
