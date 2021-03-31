import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RefinementOptions from './RefinementOptions'
import { capitalize } from '../../../../lib/string-utils'
import * as actions from '../../../../actions/components/refinementsActions'
import Accordion from '../../../common/Accordion/Accordion'
import AccordionGroup from '../../../common/AccordionGroup/AccordionGroup'
import Price from '../../../common/Price/Price'
import { isMobile } from '../../../../selectors/viewportSelectors'
import {
  getRefinements,
  getActiveRefinementsState,
} from '../../../../selectors/refinementsSelectors'
import { pathOr } from 'ramda'
import { analyticsPlpClickEvent } from '../../../../analytics/tracking/site-interactions'
import { getCategoryTitle } from '../../../../selectors/productSelectors'

const header = (isMobile, label, type, selectionText) => (
  <div
    role="presentation"
    className="RefinementList-accordionHeader"
    onClick={() => {
      analyticsPlpClickEvent(`${label.toLowerCase()}`)
    }}
  >
    <span
      className={`RefinementList-label ${
        selectionText ? 'is-filtered' : ''
      } is-${type.toLowerCase()}`}
    >
      {label}
    </span>
    {isMobile && (
      <span className={`RefinementList-selection is-${type.toLowerCase()}`}>
        {selectionText}
      </span>
    )}
  </div>
)

@connect(
  (state) => ({
    refinements: getRefinements(state),
    selectedOptions: state.refinements.selectedOptions,
    isMobile: isMobile(state),
    productCategory: getCategoryTitle(state),
    getActiveRefinements: getActiveRefinementsState(state),
  }),
  { ...actions }
)
class RefinementList extends Component {
  static propTypes = {
    selectedOptions: PropTypes.object,
    refinements: PropTypes.array,
    isMobile: PropTypes.bool,
    onAccordionToggle: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    onAccordionToggle: () => {},
    selectedOptions: {},
    refinements: [],
    isMobile: true,
  }

  setRefinementsAppliedForNoFollow(refinements) {
    let refinementsLength = refinements.length
    if (refinements.find((ref) => ref.propertyName === 'nowPrice')) {
      refinementsLength -= 1
    }
    if (
      refinements.find(
        (ref) => ref.dimensionName && ref.dimensionName.includes('category')
      )
    ) {
      refinementsLength -= 1
    }
    return refinementsLength
  }

  setRefinementType(options, type) {
    const rating = type === 'Rating' ? 'RATING' : ''
    const size = type.includes('Size') ? 'SIZE' : ''
    const firstOption = options[0] ? options[0].type : ''
    return rating || size || firstOption
  }

  selectionText(selections, type) {
    if (!selections || !selections.length) return ''

    const { l } = this.context
    switch (type) {
      case 'VALUE':
        return selections.join(', ').replace(/\w\S*/g, capitalize)
      case 'SIZE':
        return selections.join(', ').toUpperCase()
      case 'RATING': {
        const rating = selections[0].toString()
        return rating === '5'
          ? `${rating} ${l`stars`}`
          : `${rating} ${l`stars`} ${l`& up`}`
      }
      case 'RANGE':
        return (
          <div>
            <Price price={selections[0]} /> - <Price price={selections[1]} />
          </div>
        )
      default:
        return selections.join(' - ').replace(/\w\S*/g, capitalize)
    }
  }

  returnInitiallyExpanded(isMobile, refinements) {
    // items without refinementOptions are ignored
    // RANGE refinements are always expanded.
    return isMobile
      ? []
      : refinements
          .filter(
            (refinement) =>
              refinement.refinementOptions &&
              refinement.refinementOptions.length
          )
          .reduce(
            (expanded, { refinementOptions, label } = {}) =>
              refinementOptions[0].type === 'RANGE' ||
              refinementOptions.some(({ selectedFlag }) => selectedFlag)
                ? [...expanded, label]
                : expanded,
            []
          )
  }

  parseSelectedRefinements(refinementOptions, selectedOptions) {
    return refinementOptions.reduce((selectedRefinements, option) => {
      const selected = pathOr(null, ['price'], selectedOptions)
      if (option.type === 'RANGE' && selected) {
        return [
          ...selectedRefinements,
          parseInt(selected[0], 10),
          parseInt(selected[1], 10),
        ]
      }
      return option.selectedFlag
        ? [...selectedRefinements, option.label]
        : selectedRefinements
    }, [])
  }

  blockRefinementItem = (type, refinementOptions) => {
    switch (type) {
      case '':
      case undefined:
        return true
      case 'RANGE': {
        const [{ minValue, maxValue }] = refinementOptions
        return Number(minValue) >= Number(maxValue)
      }
      default:
        return false
    }
  }

  renderRefinementItem = (refineObj) => {
    const { isMobile, selectedOptions, getActiveRefinements } = this.props
    const { refinementOptions, label } = refineObj
    const type = this.setRefinementType(refinementOptions, label)
    const selection = this.parseSelectedRefinements(
      refinementOptions,
      selectedOptions
    )
    const selectionText = refinementOptions.length
      ? this.selectionText(selection, type)
      : ''

    return this.blockRefinementItem(type, refinementOptions) ? null : (
      <Accordion
        key={label}
        header={header(isMobile, label, type, selectionText)}
        accordionName={label}
        scrollPaneSelector=".RefinementList"
        noContentPadding={isMobile}
        noContentBorderTop={!isMobile}
        label={label}
        noHeaderPadding={!isMobile}
        noExpandedHeaderBackground
        arrowStyle="secondary"
        arrowPosition="right"
        className={`Accordion--${label}`} // TODO: EXP-373 Remove this after test has ran
      >
        <RefinementOptions
          options={refinementOptions}
          type={type}
          label={label}
          selections={selection}
          isMobile={isMobile}
          activeRefinements={this.setRefinementsAppliedForNoFollow(
            getActiveRefinements
          )}
        />
      </Accordion>
    )
  }

  render() {
    const {
      onAccordionToggle,
      isMobile,
      refinements,
      handleCollapseAll,
      productCategory,
    } = this.props

    return (
      <AccordionGroup
        className="RefinementList"
        groupName="refinements"
        singleOpen={isMobile}
        initiallyExpanded={this.returnInitiallyExpanded(isMobile, refinements)}
        onAccordionToggle={onAccordionToggle}
        handleCollapseAll={handleCollapseAll}
        productCategory={productCategory}
      >
        {refinements.map(this.renderRefinementItem).filter(Boolean)}
      </AccordionGroup>
    )
  }
}

export default RefinementList
