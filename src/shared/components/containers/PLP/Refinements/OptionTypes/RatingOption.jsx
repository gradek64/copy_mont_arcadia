import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import * as actions from '../../../../../actions/components/refinementsActions'
import RatingImage from '../../../../common/RatingImage/RatingImage'
import Checkbox from '../../../../common/FormComponents/Checkbox/Checkbox'
import { isMobile } from '../../../../../selectors/viewportSelectors'
import { analyticsPlpClickEvent } from '../../../../../analytics/tracking/site-interactions'
import { updateSeoUrlIfSearchFilter } from '../../../../../lib/products-utils'

@connect(
  (state) => ({
    isMobile: isMobile(state),
  }),
  { ...actions }
)
class RatingOption extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    refinement: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
    selections: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
      .isRequired,
    options: PropTypes.array.isRequired,
  }

  onClick = (refinement, value, seoUrl) => {
    browserHistory.push(updateSeoUrlIfSearchFilter(seoUrl))
    analyticsPlpClickEvent(`${refinement.toLowerCase()}-${value.toLowerCase()}`)
  }

  renderOption = (value, seoUrl) => {
    const { refinement, selections, isMobile } = this.props

    const isSelected = selections.indexOf(value) > -1
    const rating = parseInt(value, 10)
    const andUpText = rating !== 5 && (
      <span className="RatingOption-andUp">&amp; up</span>
    )

    if (isMobile) {
      return (
        <button
          key={value}
          className={`RatingOption-item ${isSelected ? 'is-selected' : ''}`}
          onClick={() => this.onClick(refinement, value, seoUrl)}
        >
          <span className="RatingOption-stars">
            <RatingImage rating={parseInt(value, 10)} />
          </span>
          {andUpText}
        </button>
      )
    }

    return (
      <Checkbox
        key={value}
        className="RatingOption-checkbox"
        labelClassName="RatingOption-checkboxLabel"
        checked={{ value: isSelected }}
        name={`rating_option_checkbox_${value}`}
        onChange={() => this.onClick(refinement, value, seoUrl)}
      >
        <span className="RatingOption-stars">
          <RatingImage rating={parseInt(value, 10)} />
        </span>
        {andUpText}
      </Checkbox>
    )
  }

  render() {
    return (
      <div className="RatingOption">
        {this.props.options.map(({ value, seoUrl }) =>
          this.renderOption(value, seoUrl)
        )}
      </div>
    )
  }
}

export default RatingOption
