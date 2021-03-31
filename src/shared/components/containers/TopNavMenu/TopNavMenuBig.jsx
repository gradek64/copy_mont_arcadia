import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

@connect((state) => ({
  categories: state.navigation.productCategories,
}))
class TopNavMenuBig extends Component {
  static propTypes = {
    categories: PropTypes.array,
    className: PropTypes.string,
  }

  render() {
    const { categories, className } = this.props
    return (
      <div className={`TopNavMenuBig ${className || ''}`}>
        <div className="TopNavMenuBig-categories">
          {categories.map((cat) => {
            return (
              <div key={cat.categoryId} className="TopNavMenuBig-category">
                {cat.label}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default TopNavMenuBig
