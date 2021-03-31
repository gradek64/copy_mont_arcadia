import PropTypes from 'prop-types'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import React, { memo } from 'react'
import { Transition } from 'react-transition-group'
import RecentlyViewed from '../RecentlyViewed/RecentlyViewed'
import {
  toggleRecentlyViewedTabOpen,
  dismissRecentlyViewedTab,
} from '../../../actions/common/sessionUXActions'
import { setPredecessorPage } from '../../../actions/common/productsActions'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'
import {
  isRecentlyViewedTabOpen,
  isRecentlyViewedTabDismissed,
} from '../../../selectors/sessionUXSelectors'

const RecentlyViewedTab = (
  {
    isDismissed,
    isOpen,
    toggleRecentlyViewedTabOpen,
    recentlyViewedLength,
    isFeatureLatestViewedEnabled,
    isMobile,
    dismissRecentlyViewedTab,
    setPredecessorPage,
  },
  { l }
) => {
  const shouldDisplayTab =
    isFeatureLatestViewedEnabled &&
    !isMobile &&
    recentlyViewedLength > 1 &&
    !isDismissed

  return (
    shouldDisplayTab && (
      <Transition
        classNames="TrendingProductPDPMessage"
        in={isOpen}
        timeout={500}
      >
        {(state) => {
          return (
            <div className={`RecentlyViewedTab RecentlyViewedTab-${state}`}>
              <div className="RecentlyViewedTab-tabContainer">
                <button
                  onClick={toggleRecentlyViewedTabOpen}
                  className="RecentlyViewedTab-toggleButton"
                >
                  {l('Recently viewed')}
                </button>
                <button
                  onClick={dismissRecentlyViewedTab}
                  className="RecentlyViewedTab-closeButton"
                  aria-label="Close"
                >
                  X
                </button>
              </div>
              <div className="RecentlyViewedTab-content">
                <RecentlyViewed isPlp setPredecessorPage={setPredecessorPage} />
              </div>
            </div>
          )
        }}
      </Transition>
    )
  )
}

RecentlyViewedTab.propTypes = {
  isFeatureLatestViewedEnabled: PropTypes.bool,
  recentlyViewedLength: PropTypes.number,
  isDismissed: PropTypes.bool,
  isOpen: PropTypes.bool,
  toggleRecentlyViewedTabOpen: PropTypes.func,
  dismissRecentlyViewedTab: PropTypes.func,
  isMobile: PropTypes.bool,
  setPredecessorPage: PropTypes.func.isRequired,
}

RecentlyViewedTab.contextTypes = {
  l: PropTypes.func,
}

export default compose(
  connect(
    (state) => ({
      isMobile: isMobile(state),
      recentlyViewedLength: state.recentlyViewed.length,
      isOpen: isRecentlyViewedTabOpen(state),
      isDismissed: isRecentlyViewedTabDismissed(state),
      isFeatureLatestViewedEnabled: isFeatureEnabled(
        state,
        'FEATURE_PLP_RECENTLY_VIEWED_WIDGET'
      ),
    }),
    {
      toggleRecentlyViewedTabOpen,
      dismissRecentlyViewedTab,
      setPredecessorPage,
    }
  ),
  memo
)(RecentlyViewedTab)
