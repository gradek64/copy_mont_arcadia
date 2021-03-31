import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { isMobile } from '../../../../selectors/viewportSelectors'

// actions
import * as actions from '../../../../actions/components/refinementsActions'
import { sendAnalyticsFilterUsedEvent } from '../../../../analytics/analytics-actions'

// components
import Button from '../../../common/Button/Button'
import AccessibleText from '../../../common/AccessibleText/AccessibleText'
import RefinementList from './RefinementList'
import {
  isRefinementsSelected,
  getRemoveAllFilters,
} from '../../../../../shared/selectors/refinementsSelectors'
import LoaderOverlay from '../../../common/LoaderOverlay/LoaderOverlay'
import EnhancedMessage from '../../../common/EnhancedMessage/EnhancedMessage'

// Helpers
import {
  isSeoUrlSearchFilter,
  getResetSearchUrl,
  isSearchUrl,
  addParamClearAll,
} from '../../../../lib/products-utils'
import {
  getRouteSearch,
  getRoutePath,
} from '../../../../selectors/routingSelectors'
import { getProductsSearchResultsTotal } from '../../../../selectors/productSelectors'

@connect(
  (state) => ({
    isRefinementsSelected: isRefinementsSelected(state),
    removeAllRefinement: getRemoveAllFilters(state),
    isShown: state.refinements.isShown,
    isMobile: isMobile(state),
    isLoadingRefinements: state.refinementsV2.isLoadingRefinements,
    currentPath: getRoutePath(state),
    currentSearchPath: getRouteSearch(state),
    totalProducts: getProductsSearchResultsTotal(state),
  }),
  {
    ...actions,
    sendAnalyticsFilterUsedEvent,
    getRemoveAllFilters,
  }
)
class Refinements extends Component {
  static propTypes = {
    isRefinementsSelected: PropTypes.bool,
    removeAllRefinement: PropTypes.string,
    isShown: PropTypes.bool,
    isMobile: PropTypes.bool,
    isLoadingRefinements: PropTypes.bool,
    currentPath: PropTypes.string,
    currentSearchPath: PropTypes.string,
    toggleRefinements: PropTypes.func,
    updateRefinements: PropTypes.func,
    applyRefinementsMobile: PropTypes.func,
    resetRefinements: PropTypes.func,
    sendAnalyticsFilterUsedEvent: PropTypes.func,
    totalProducts: PropTypes.number,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    isMobile: true,
  }

  componentDidUpdate({ isShown: wasShown }) {
    const { isShown } = this.props
    if (isShown && !wasShown && this.description) this.description.focus()
  }

  componentWillUnmount() {
    const { isMobile } = this.props
    if (isMobile) {
      this.closeRefinementsHandler()
    }
  }

  closeRefinementsHandler = () => {
    const { toggleRefinements, resetRefinements } = this.props

    resetRefinements()
    toggleRefinements(false)

    if (this.collapseAllHandler) {
      this.collapseAllHandler()
    }
  }

  applyRefinementsHandler = () => {
    const {
      toggleRefinements,
      applyRefinementsMobile,
      sendAnalyticsFilterUsedEvent,
    } = this.props

    applyRefinementsMobile()
    if (this.collapseAllHandler) {
      this.collapseAllHandler()
    }
    toggleRefinements(false)

    sendAnalyticsFilterUsedEvent({
      filterCategory: 'apply filters',
      filterOption: 'apply filters',
      filterAction: 'click',
    })
  }

  clearAndApplyRefinements = () => {
    const {
      sendAnalyticsFilterUsedEvent,
      removeAllRefinement,
      updateRefinements,
      currentPath,
      currentSearchPath,
    } = this.props

    if (isSeoUrlSearchFilter(removeAllRefinement)) {
      if (isSearchUrl(currentPath)) {
        updateRefinements(`${currentPath}${currentSearchPath}`)
      } else {
        updateRefinements(getResetSearchUrl(currentSearchPath))
      }
    } else {
      updateRefinements(addParamClearAll(removeAllRefinement))
    }
    // We using the old refinement reducer for resetting priceRange
    // This is needed for Slider Component (TODO : improve this component/logic)
    this.props.removeOptionRange('price')
    if (this.collapseAllHandler) {
      this.collapseAllHandler()
    }

    sendAnalyticsFilterUsedEvent({
      filterCategory: 'clear all',
      filterOption: 'clear all',
      filterAction: 'remove',
    })
  }

  renderNoResultsFound = () => {
    const { l } = this.context
    const { isMobile, totalProducts } = this.props

    if (!isMobile) {
      return
    }

    if (!totalProducts) {
      return (
        <EnhancedMessage
          message={l`There are no products matching your current search criteria.`}
          isFromFilter
          renderChildrenOn="bottom"
        />
      )
    }
  }

  renderHeader = () => {
    const { l } = this.context
    const { isRefinementsSelected } = this.props
    return (
      <div className="Refinements-header">
        <h3 className="Refinements-title">{l`Filter`}</h3>
        <AccessibleText
          ref={(accessibleText) => {
            this.description = accessibleText
          }}
        >
          {l`This is the filters modal. Select any required filters and press apply to return to a filtered product list.`}
        </AccessibleText>
        <button
          className="Refinements-closeIcon"
          onClick={this.closeRefinementsHandler}
        >
          <span className="screen-reader-text">{l`Close filters modal`}</span>
        </button>
        <button
          className="Refinements-clearButton"
          onClick={this.clearAndApplyRefinements}
          disabled={!isRefinementsSelected}
        >
          {l`Clear all`}
        </button>
      </div>
    )
  }

  handleCollapseAll = (cb) => {
    this.collapseAllHandler = cb
  }

  render() {
    const {
      isShown,
      isMobile,
      isLoadingRefinements,
      totalProducts,
    } = this.props
    const { l } = this.context

    return isMobile ? (
      <div className={`Refinements ${isShown ? 'is-shown' : 'is-hidden'}`}>
        <div
          className={`Refinements-content ${
            isShown ? 'is-shown' : 'is-hidden'
          }`}
        >
          {this.renderHeader()}
          <RefinementList handleCollapseAll={this.handleCollapseAll} />
          {this.renderNoResultsFound()}
          <div className="Refinements-applyButtonWrapper">
            <Button
              isDisabled={!totalProducts}
              className="Refinements-applyButton"
              clickHandler={this.applyRefinementsHandler}
            >
              {l`Apply`}
            </Button>
          </div>
          {isLoadingRefinements && (
            <LoaderOverlay className="Refinements-loader" />
          )}
        </div>
      </div>
    ) : null
  }
}

export default Refinements
