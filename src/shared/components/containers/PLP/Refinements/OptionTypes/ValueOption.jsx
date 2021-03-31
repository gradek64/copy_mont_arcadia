import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { isEmpty } from 'ramda'

// Components
import Checkbox from '../../../../common/FormComponents/Checkbox/Checkbox'

// Actions
import * as actions from '../../../../../actions/components/refinementsActions'
// Action-Analytics
import { sendAnalyticsFilterUsedEvent } from '../../../../../analytics/analytics-actions'
import { analyticsPlpClickEvent } from '../../../../../analytics/tracking/site-interactions'

// Selectors
import { isMobile } from '../../../../../selectors/viewportSelectors'
import { isFilterSelected } from '../../../../../selectors/refinementsSelectors'

// Helpers
import { updateSeoUrlIfSearchFilter } from '../../../../../lib/products-utils'

@connect(
  (state) => ({
    isMobile: isMobile(state),
    isValueSelected: isFilterSelected(state),
  }),
  {
    ...actions,
    sendAnalyticsFilterUsedEvent,
  }
)
class ValueOption extends Component {
  static propTypes = {
    options: PropTypes.array,
    // TODO: investigate if refinement passes an object and if not set to PropTypes.string only
    refinement: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    type: PropTypes.oneOf(['valueType', 'sizeType']).isRequired,
    updateRefinements: PropTypes.func,
    isMobile: PropTypes.bool.isRequired,
    sendAnalyticsFilterUsedEvent: PropTypes.func,
    isValueSelected: PropTypes.func,
    relNoFollow: PropTypes.string,
  }

  onChange = (refinement, value, seoUrl) => {
    const {
      updateRefinements,
      isMobile,
      sendAnalyticsFilterUsedEvent,
      isValueSelected,
    } = this.props

    if (isMobile) {
      updateRefinements(seoUrl)
    } else {
      browserHistory.push(updateSeoUrlIfSearchFilter(seoUrl))
    }

    // GTM analytics
    const isApplyFilter = isValueSelected(refinement, value)
      ? 'remove'
      : 'apply'
    sendAnalyticsFilterUsedEvent({
      filterCategory: refinement,
      filterOption: value,
      filterAction: isApplyFilter,
    })

    analyticsPlpClickEvent(`${refinement.toLowerCase()}-${value.toLowerCase()}`)
  }

  /* NOTE:
   * refinement PropTypes can be a string or an object.
   *  */
  getCheckoutName = (refinement, label) =>
    typeof refinement === 'string'
      ? `${refinement.replace(' ', '')}-${label}`
      : label

  renderOption = ({ label, count, value, seoUrl, selectedFlag = false }) => {
    const { relNoFollow } = this.props
    const {
      props: { refinement, isMobile },
      getCheckoutName,
    } = this

    const labelComponent = <span className="ValueOption-label">{label}</span>
    const countComponent = <span className="ValueOption-count">({count})</span>

    const filter = isMobile ? (
      <button
        className={`ValueOption-item ${selectedFlag ? 'is-selected' : ''}`}
        onClick={() => this.onChange(refinement, value, seoUrl)}
        role="button"
        aria-pressed={selectedFlag}
      >
        <a
          rel={relNoFollow}
          href={seoUrl}
          className="ValueOption-link"
          onClick={(e) => isMobile && e.preventDefault()}
        >
          {labelComponent}
        </a>
        {countComponent}
      </button>
    ) : (
      <a
        rel={relNoFollow}
        href={seoUrl}
        className="ValueOption-link"
        onClick={(e) => isMobile && e.preventDefault()}
      >
        <Checkbox
          className="ValueOption-checkbox"
          labelClassName="ValueOption-checkboxLabel"
          checked={{ value: selectedFlag }}
          name={getCheckoutName(refinement, label)}
          onChange={() => this.onChange(refinement, value, seoUrl)}
        >
          {labelComponent}
          {countComponent}
        </Checkbox>
      </a>
    )

    return (
      <div key={seoUrl} className={!isMobile ? 'ValueOption-container' : ''}>
        {filter}
      </div>
    )
  }

  render() {
    const {
      props: { type, options },
      renderOption,
    } = this
    // Remove empty objects from the array
    const filteredOptions = options.filter((option) => !isEmpty(option))
    // If array is not empty then render contents
    return (
      !isEmpty(filteredOptions) && (
        <div className={`ValueOption ValueOption--${type}`}>
          {filteredOptions.map(renderOption)}
        </div>
      )
    )
  }
}

export default ValueOption
