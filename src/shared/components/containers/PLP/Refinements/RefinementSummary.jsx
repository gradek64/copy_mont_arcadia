/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Utils/Helpers
import {
  updateSeoUrlIfSearchFilter,
  isSeoUrlSearchFilter,
  getResetSearchUrl,
  removePriceFromSeoUrl,
  addParamClearAll,
} from '../../../../lib/products-utils'

import { sendAnalyticsFilterUsedEvent } from '../../../../analytics/analytics-actions'

// selectors
import {
  getActiveRefinements,
  getRemoveAllFilters,
} from '../../../../selectors/refinementsSelectors'
import { getCanonicalUrl } from '../../../../selectors/navigationSelectors'
import { getRouteSearch } from '../../../../selectors/routingSelectors'
import { getCurrentSortOption } from '../../../../selectors/productSelectors'

// components
import Price from '../../../common/Price/Price'

@connect(
  (state) => ({
    activeRefinements: getActiveRefinements(state),
    categoryTitle: state.products.categoryTitle,
    currentSearchPath: getRouteSearch(state),
    currentSortOptions: getCurrentSortOption(state),
    removeAllFilters: getRemoveAllFilters(state),
    canonicalUrl: getCanonicalUrl(state),
  }),
  {
    sendAnalyticsFilterUsedEvent,
  }
)
class RefinementSummary extends Component {
  static propTypes = {
    activeRefinements: PropTypes.array,
    categoryTitle: PropTypes.string.isRequired,
    currentSearchPath: PropTypes.string,
    currentSortOptions: PropTypes.object,
    removeAllFilters: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    categoryTitle: '',
    activeRefinements: [],
  }

  clearRefinements = () => {
    const {
      sendAnalyticsFilterUsedEvent,
      currentSearchPath,
      removeAllFilters,
      canonicalUrl,
    } = this.props
    if (isSeoUrlSearchFilter(removeAllFilters)) {
      // if is search go-to : /search?q=red
      browserHistory.push(getResetSearchUrl(currentSearchPath))
    } else {
      // if is category go-to : seUrl (removeAllFilters)
      const urlToUse = () => {
        if (removeAllFilters && removeAllFilters.includes(canonicalUrl)) {
          return removeAllFilters
        }
        return canonicalUrl
      }
      browserHistory.push(addParamClearAll(urlToUse()))
    }

    sendAnalyticsFilterUsedEvent({
      filterCategory: 'clear all',
      filterOption: 'clear all',
      filterAction: 'remove',
    })
  }

  removeRefinement = (key, seoUrl) => {
    const { currentSortOptions } = this.props
    if (key === 'NOWPRICE') {
      browserHistory.push(
        updateSeoUrlIfSearchFilter(
          removePriceFromSeoUrl(currentSortOptions.navigationState)
        )
      )
    } else {
      browserHistory.push(updateSeoUrlIfSearchFilter(seoUrl))
    }
  }

  renderRefinement = (refinement) => {
    const { l } = this.context
    if (refinement.title !== l`Category`) {
      const values =
        refinement.values &&
        refinement.values.map((value) => {
          return (
            <span key={value.key} className="RefinementSummary-valueWrapper">
              <span className="RefinementSummary-value RefinementSummary-refinementValue">
                <span className="RefinementSummary-valueInner">
                  {refinement.key === 'NOWPRICE' ? (
                    <div>
                      <Price price={value.lowerBound} /> -{' '}
                      <Price price={value.upperBound} />
                    </div>
                  ) : (
                    value.label
                  )}
                </span>
                <a
                  className="RefinementSummary-removeTextValue"
                  role="button"
                  onClick={() =>
                    this.removeRefinement(refinement.key, value.seoUrl)
                  }
                >
                  X
                </a>
              </span>
            </span>
          )
        })
      return (
        <div key={refinement.key} className="RefinementSummary-item">
          <span className="RefinementSummary-itemTitle">
            {refinement.title}
          </span>
          <div className="RefinementSummary-valuesContainer">{values}</div>
        </div>
      )
    }
  }

  // disable clear all button
  disableClearAllButton = () => {
    const { removeAllFilters, activeRefinements } = this.props

    return isSeoUrlSearchFilter(removeAllFilters)
      ? activeRefinements.length === 0
      : activeRefinements.length < 2
  }

  render() {
    const { categoryTitle, activeRefinements } = this.props
    const { l } = this.context
    return (
      <div className="RefinementSummary">
        <header className="RefinementSummary-header">
          <span className="RefinementSummary-headerTitle">{l`Filter`}</span>
          <button
            disabled={this.disableClearAllButton()}
            className={'RefinementSummary-clearRefinementsButton'}
            onClick={this.clearRefinements}
          >{l`Clear all`}</button>
        </header>
        <div className="RefinementSummary-categoryItem">
          <span className="RefinementSummary-itemTitle">{l`Category`}</span>
          {categoryTitle && (
            <span className="RefinementSummary-value">{l(categoryTitle)}</span>
          )}
        </div>
        {activeRefinements.map((refinement) =>
          this.renderRefinement(refinement)
        )}
      </div>
    )
  }
}

export default RefinementSummary
