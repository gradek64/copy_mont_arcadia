import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// components
import Subcategory from './Subcategory'

const Content = ({ arraySubcategories, blockName, hideMegaNav }) => {
  const classNames = classnames('MegaNav-item', 'MegaNav-subcategory')
  return (
    <div className={classNames}>
      {blockName && <h3 className="MegaNav-subcategoryHeader">{blockName}</h3>}
      <ul className="MegaNav-subcategoryItems">
        {arraySubcategories &&
          arraySubcategories
            .filter((c) => !c.isHidden)
            .map((subcategory) => (
              <Subcategory
                key={subcategory.categoryId}
                subcategory={subcategory}
                hideMegaNav={hideMegaNav}
              />
            ))}
      </ul>
    </div>
  )
}
Content.propTypes = {
  arraySubcategories: PropTypes.array,
  blockName: PropTypes.string,
}
Content.defaultProps = {
  arraySubcategories: [],
  blockName: '',
}

export default Content
