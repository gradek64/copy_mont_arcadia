import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { addIndex, map, keys } from 'ramda'

import ProgressTracker from '../../common/ProgressTracker/ProgressTracker'

const EXAMPLES = {
  'CheckoutV1 3 Steps': ['Delivery', 'Billing', 'Confirm'],
  'CheckoutV2 3 Steps': ['Delivery', 'Payment', 'Thank You'],
  'CheckoutV2 4 Steps': ['Login', 'Delivery', 'Payment', 'Thank You'],
  'CheckoutV2 D&P 2 Steps': ['Delivery and Payment', 'Thank You'],
  'Example 4 Steps': ['Step0', 'Step1', 'Step2', 'Step3'],
}

const ACTIVE_STEP_OPTIONS = ['none', 0, 1, 2, 3]

export default class UiProgressTracker extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      steps: EXAMPLES['CheckoutV1 3 Steps'],
      activeStepIdx: 'none',
    }
  }

  enrichSteps = (steps, activeStepIdx) => {
    const { l } = this.context
    return addIndex(map)((title, idx) => {
      return {
        title: l(title),
        active: `${idx}` === activeStepIdx,
      }
    }, steps)
  }

  onSelectActiveStep = (event) => {
    this.setState({ activeStepIdx: event.target.value })
  }

  onSelectExample = (event) => {
    this.setState({ steps: EXAMPLES[event.target.value] })
  }

  renderOption = (value) => {
    return (
      <option key={value} value={value}>
        {value}
      </option>
    )
  }

  render() {
    const steps = this.enrichSteps(this.state.steps, this.state.activeStepIdx)

    return (
      <div>
        <div style={{ border: '1px dotted grey', padding: '0 10px' }}>
          <ProgressTracker steps={steps} />
        </div>
        <div>
          <div className="Select is-selected">
            <div className="Select-head">
              <label className="Select-label" htmlFor="examples">
                ProgressTracker example:{' '}
              </label>
            </div>
            <div className="Select-container">
              <select
                className="Select-select"
                name="examples"
                onChange={this.onSelectExample}
              >
                {map(this.renderOption, keys(EXAMPLES))}
              </select>
            </div>
          </div>
          <div className="Select is-selected">
            <div className="Select-head">
              <label className="Select-label" htmlFor="indexes">
                ProgressTracker active step:{' '}
              </label>
            </div>
            <div className="Select-container">
              <select
                className="Select-select"
                name="indexes"
                onChange={this.onSelectActiveStep}
                value={this.state.activeStepIdx}
              >
                {map(this.renderOption, ACTIVE_STEP_OPTIONS)}
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
