import React from 'react'
import PropTypes from 'prop-types'
import {
  isNil,
  lensPath,
  view,
  equals,
  type,
  map,
  filter,
  flatten,
  pipe,
  values,
} from 'ramda'
import classnames from 'classnames'

import Content from './Content'

import { heDecode } from '../../../lib/html-entities'

// Helpers
const noColumns = (category) =>
  isNil(category.columns) || category.columns.length <= 0

const lensImagePath = lensPath(['subcategories', 0, '', 0, 'image', 'span'])

const getColumnSpan = (column, lensImagePath) =>
  isNil(view(lensImagePath, column)) ? 1 : view(lensImagePath, column)

const getColumnWidth = (columnCount) => {
  const NUMBER_OF_COLUMNS = 4
  return `${(columnCount / NUMBER_OF_COLUMNS) * 100}%`
}

const isLastColumn = (category, column) => {
  if (category.columns) {
    return equals(Number(column.span), category.columns.length)
  }
}

const getColumnClassNames = (lastColumn) =>
  classnames('MegaNav-column', { 'MegaNav-lastColumn': lastColumn })

const renderSimplifiedList = (subcategories) => {
  return pipe(
    map((item) => values(item)),
    flatten,
    filter((subcategory) => !subcategory.isHidden),
    map((subcategory) => (
      <a
        key={`${subcategory.label}`}
        href={subcategory.redirectionUrl || subcategory.url}
      >
        {heDecode(subcategory.label)}
      </a>
    ))
  )(subcategories)
}

const Column = ({ category, column, hideMegaNav, isActive }) => {
  // NOTE:
  // column.subcategories is passed as two prop types Array and String
  //  - String is rendered as an empty column
  //  - Array should render subcategory links
  if (noColumns(category) || type(column.subcategories) !== 'Array') return null

  const columnSpan = getColumnSpan(column, lensImagePath)
  const lastColumn = isLastColumn(category, column)

  if (!isActive) return renderSimplifiedList(column.subcategories)

  return (
    <div
      className={getColumnClassNames(lastColumn)}
      style={{
        width: getColumnWidth(columnSpan),
      }}
    >
      {column.subcategories.map((block) => {
        return Object.keys(block).map((blockName, idx) => {
          const arraySubcategories = block[blockName]
          return (
            <Content
              // eslint-disable-next-line react/no-array-index-key
              key={`content_${idx}`}
              arraySubcategories={arraySubcategories}
              blockName={blockName}
              hideMegaNav={hideMegaNav}
            />
          )
        })
      })}
    </div>
  )
}

Column.propTypes = {
  category: PropTypes.shape({
    categoryId: PropTypes.string,
    columns: PropTypes.array,
    label: PropTypes.string,
    redirectionUrl: PropTypes.string,
    totalcolumns: PropTypes.number,
    url: PropTypes.string,
  }),
  column: PropTypes.shape({
    subcategories: PropTypes.array,
    span: PropTypes.string,
  }),
  hideMegaNav: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
}

Column.defaultProps = {
  category: {},
  column: {
    subcategories: [],
  },
  isActive: true,
}

export default Column
