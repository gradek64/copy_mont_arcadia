/* MegaNav > Footer Component
 *
 * To render a footer container with the option to render:
 * - 1 column with the span of 4 (100%)
 * - 2 columns with the span of 2 each (50%)
 * - 4 columns with the span of 1 each (25%)
 *
 * NOTE:
 *  - The MegaNav is a four column layout.
 *  - Currently the "category" data can not be modified to include a footer property.
 *  - To identify if a footer image has been supplied a deep search inside category is required
 *       EXAMPLE: category > columns > subcategories > 0 > [name of property] > image > span === 'footer'
 *  */

import React from 'react'
import PropTypes from 'prop-types'
import { all, equals, dissoc, has, clone, forEachObjIndexed } from 'ramda'

// Components
import Column from './Column'

// Helpers
const hasFooterImage = (subcategory) => {
  const hasImage = has('image')
  const hasSpan = has('span')

  return (
    hasImage(subcategory) &&
    hasSpan(subcategory.image) &&
    subcategory.image.span === 'footer'
  )
}

const filterColumns = ({ columns }) =>
  columns.filter((column) => {
    const equalsFalse = equals(false)
    const subCategories = column.subcategories[0]
    const footerImage = []

    forEachObjIndexed(
      (value, key) =>
        subCategories[key].forEach((subCategory) =>
          footerImage.push(hasFooterImage(subCategory))
        ),
      subCategories
    )

    // If all values inside the array "footerImage" is false then remove subCategory
    return !all(equalsFalse, footerImage)
  })

const filterSubCategoriesWithoutFooter = (columns) =>
  columns.map((column) => {
    // Calculate the footer span
    // 4 divided by 1 column is a span of 4
    // 4 divided by 2 columns is a span of 2
    // 4 divided by 4 columns is a span of 1
    const span = 4 / columns.length
    const columnClone = clone(column)
    const subCategories = column.subcategories[0]

    forEachObjIndexed((value, key) => {
      const filteredSubCategories = subCategories[key].filter((t) =>
        hasFooterImage(t)
      )
      columnClone.subcategories[0] = dissoc(key, column.subcategories[0])
      columnClone.subcategories[0][''] = [...filteredSubCategories]
      columnClone.subcategories[0][''][0].image.span = span
    }, subCategories)
    return columnClone
  })

const removeSubCategoryWithoutFooter = (columns) =>
  columns.map((column) => {
    const columnClone = clone(column)
    const subCategories = column.subcategories[0]

    forEachObjIndexed((value, key) => {
      const filteredSubCategories = subCategories[key].filter((t) =>
        hasFooterImage(t)
      )

      if (filteredSubCategories.length === 0) {
        columnClone.subcategories[0] = dissoc(key, columnClone.subcategories[0])
      }
    }, subCategories)
    return columnClone
  })

const getFooterColumns = (category) => {
  const filteredColumns = filterColumns(category)
  const removedSubcategory =
    filteredColumns.length > 0
      ? removeSubCategoryWithoutFooter(filteredColumns)
      : []

  return removedSubcategory.length > 0
    ? filterSubCategoriesWithoutFooter(removedSubcategory)
    : []
}

const Footer = ({ category, hideMegaNav }) => {
  const footerColumns = getFooterColumns(category)
  if (footerColumns.length <= 0) return null
  return (
    <div className="MegaNav-subNav MegaNav-subNav--footer">
      {footerColumns.map((column, idx) => (
        <Column
          // eslint-disable-next-line react/no-array-index-key
          key={`column_${idx}`}
          category={category}
          column={column}
          hideMegaNav={hideMegaNav}
        />
      ))}
    </div>
  )
}

Footer.propTypes = {
  category: PropTypes.shape({
    categoryId: PropTypes.string,
    columns: PropTypes.array,
    label: PropTypes.string,
    redirectionUrl: PropTypes.string,
    totalcolumns: PropTypes.number,
    url: PropTypes.string,
  }),
  hideMegaNav: PropTypes.func.isRequired,
}

Footer.defaultProps = {
  category: {
    columns: [],
  },
}

export default Footer
