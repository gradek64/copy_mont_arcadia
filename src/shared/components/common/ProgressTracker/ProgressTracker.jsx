import React from 'react'
import PropTypes from 'prop-types'
import { addIndex, findIndex, map, prop } from 'ramda'
import classNames from 'classnames'

export default class ProgressTracker extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        active: PropTypes.bool,
      })
    ).isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderItem = ({ title, active }, idx) => {
    const { l } = this.context
    const { steps } = this.props
    const stepNumber = idx + 1
    const stepComplete = idx < findIndex(prop('active'))(steps)
    const itemClass = classNames(
      'ProgressTracker-item',
      `ProgressTracker-item${stepNumber}`,
      {
        'ProgressTracker-item--active': active,
        'ProgressTracker-item--complete': stepComplete,
      }
    )

    return (
      <li key={title} className={itemClass}>
        <span className="ProgressTracker-number">{stepNumber}</span>
        <span className="ProgressTracker-label">{l(title)}</span>
      </li>
    )
  }

  render() {
    const { steps } = this.props

    return (
      <ul className="ProgressTracker">
        {addIndex(map)(this.renderItem, steps)}
      </ul>
    )
  }
}
