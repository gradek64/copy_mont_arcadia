import React, { Fragment } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import Column from './Column'
import Footer from './Footer'

const SubNav = ({ category, unselectCategory, isActive }) => (
  <Fragment>
    <nav
      data-nosnippet
      className={classnames('MegaNav-subNav', {
        'MegaNav-subNav--shown': isActive,
      })}
    >
      {category.columns.map((column) => (
        <Column
          key={`column_${column.span}`}
          category={category}
          column={column}
          hideMegaNav={unselectCategory}
          isActive={isActive}
        />
      ))}
    </nav>
    <Footer category={category} hideMegaNav={unselectCategory} />
  </Fragment>
)

SubNav.propTypes = {
  category: PropTypes.shape({
    categoryId: PropTypes.string,
    columns: PropTypes.array,
    label: PropTypes.string,
    redirectionUrl: PropTypes.string,
    totalcolumns: PropTypes.number,
    url: PropTypes.string,
  }).isRequired,
  unselectCategory: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
}

export default SubNav
