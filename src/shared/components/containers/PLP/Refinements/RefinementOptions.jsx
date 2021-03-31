import PropTypes from 'prop-types'
import React, { Component } from 'react'

import RangeOption from './OptionTypes/RangeOption'
import ValueOption from './OptionTypes/ValueOption'
import RatingOption from './OptionTypes/RatingOption'

const RANGE_OPTION = 'RANGE'
const SIZE_OPTION = 'SIZE'
const RATING_OPTION = 'RATING'
const VALUE_OPTION = 'VALUE'

export default class RefinementOptions extends Component {
  static propTypes = {
    options: PropTypes.array,
    type: PropTypes.string,
    selections: PropTypes.any,
    label: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
    activeRefinements: PropTypes.number,
  }

  static defaultProps = {
    type: null,
    options: [],
    hidden: false,
  }

  toTitleCase(text) {
    return text.replace(/\w\S*/g, (txt) => {
      if (text.length <= 4) return text.toUpperCase()
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  renderRefinementOption() {
    const {
      type,
      options,
      selections,
      label,
      hidden,
      activeRefinements,
    } = this.props
    const refinement = label.toLowerCase()
    const relNoFollow = activeRefinements >= 2 ? 'nofollow' : null
    if (hidden && (type === VALUE_OPTION || type === SIZE_OPTION)) {
      return options.map((option) => {
        return (
          <a rel={relNoFollow} href={option.seoUrl} key={option.seoUrl}>
            {option.label}
          </a>
        )
      })
    }

    if (type === VALUE_OPTION) {
      return (
        <ValueOption
          relNoFollow={relNoFollow}
          options={options}
          refinement={refinement}
          selections={selections}
          type="valueType"
        />
      )
    }
    if (type === SIZE_OPTION) {
      const updatedOptions = options.map((option) => ({
        ...option,
        label: this.toTitleCase(option.label),
      }))
      return (
        <ValueOption
          relNoFollow={relNoFollow}
          options={updatedOptions}
          refinement={refinement}
          selections={selections}
          type="valueType"
        />
      )
    }
    if (type === RANGE_OPTION) {
      return (
        <RangeOption
          options={options}
          refinement={refinement}
          selections={selections}
        />
      )
    }
    if (type === RATING_OPTION) {
      return (
        <RatingOption
          options={options}
          refinement={refinement}
          selections={selections}
        />
      )
    }
    return null
  }
  render() {
    const refinementOption = this.renderRefinementOption()

    if (!refinementOption) {
      return null
    }
    return <div className="RefinementOptions">{refinementOption}</div>
  }
}
