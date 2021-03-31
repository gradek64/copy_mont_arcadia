import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { equals } from 'ramda'
import Slider from '../../../../common/Slider/Slider'

// Actions
import {
  updateOptionRange,
  updateRefinements,
} from '../../../../../actions/components/refinementsActions'

// Selectors
import { getCurrentSortOption } from '../../../../../selectors/productSelectors'
import { isMobile } from '../../../../../selectors/viewportSelectors'

// Helpers
import { analyticsPlpClickEvent } from '../../../../../analytics/tracking/site-interactions'
import {
  updateSeoUrlIfSearchFilter,
  updatePriceSeoUrl,
} from '../../../../../lib/products-utils'

@connect(
  (state) => ({
    currentSortOptions: getCurrentSortOption(state),
    isMobile: isMobile(state),
  }),
  { updateOptionRange, updateRefinements }
)
class RangeOption extends Component {
  static propTypes = {
    currentSortOptions: PropTypes.object,
    isMobile: PropTypes.bool,
    options: PropTypes.array.isRequired,
    refinement: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    selections: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    updateOptionRange: PropTypes.func.isRequired,
    updateRefinements: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = { reset: false }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (equals(nextProps, this.props)) return null
    const reset =
      this.props.selections &&
      (!nextProps.selections || nextProps.selections.length === 0)
    if (reset) this.setState({ reset: !this.state.reset })
  }

  onAfterChange = (refinement, value) => {
    const { isMobile, currentSortOptions, updateRefinements } = this.props
    // MOBILE
    if (isMobile) {
      updateRefinements(
        updatePriceSeoUrl(value, currentSortOptions.navigationState)
      )
    } else {
      // DESKTOP
      browserHistory.push(
        updateSeoUrlIfSearchFilter(
          updatePriceSeoUrl(value, currentSortOptions.navigationState)
        )
      )
    }
    this.props.updateOptionRange(refinement, value)
    analyticsPlpClickEvent(
      `${refinement.toLowerCase()}-${value[0]} to ${value[1]}`
    )
  }

  render() {
    const { refinement, options } = this.props
    const min = parseInt(options[0].minValue, 10)
    const max = parseInt(options[0].maxValue, 10)
    const seoUrl = options[0].seoUrl

    return (
      <div className="RangeOption" key={this.state.reset}>
        <Slider
          refinementIdentifier={refinement}
          minValue={min}
          maxValue={max}
          onChangeFinished={(leftValue, rightValue) =>
            this.onAfterChange(refinement, [leftValue, rightValue], seoUrl)
          }
        />
      </div>
    )
  }
}

export default RangeOption
