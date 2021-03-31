import React, { Component } from 'react'
import PropTypes from 'prop-types'

const attributeType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
})

export default class ProductDescriptionExtras extends Component {
  static propTypes = {
    attributes: PropTypes.arrayOf(attributeType),
  }

  static defaultProps = {
    attributes: [],
  }

  render() {
    const { attributes } = this.props
    const listItems = attributes.filter(({ value }) => !!value)

    if (!listItems.length) return null

    return (
      <ul className="ProductDescriptionExtras-list">
        {listItems.map(({ label, value }) => (
          <li key={`pde-${label}`} className="ProductDescriptionExtras-item">
            {label}: {value}
          </li>
        ))}
      </ul>
    )
  }
}
