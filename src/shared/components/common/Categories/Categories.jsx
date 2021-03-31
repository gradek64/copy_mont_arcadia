import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as topNavMenuActions from '../../../actions/components/TopNavMenuActions'
import * as navigationActions from '../../../actions/common/navigationActions'
import * as infinityScrollActions from '../../../actions/common/infinityScrollActions'
import ListItemLink from '../ListItemLink/ListItemLink'

@connect(
  (state) => ({
    navigation: state.navigation,
  }),
  {
    ...topNavMenuActions,
    ...navigationActions,
    ...infinityScrollActions,
  }
)
class Categories extends Component {
  static propTypes = {
    toggleScrollToTop: PropTypes.func,
    toggleTopNavMenu: PropTypes.func,
    currentCatId: PropTypes.number,
    pushCategoryHistory: PropTypes.func,
    type: PropTypes.string,
    navigation: PropTypes.object,
    resetCategoryHistory: PropTypes.func,
    clearInfinityPage: PropTypes.func,
  }

  getMenuItems = () =>
    this.props.type ? this.props.navigation[this.props.type] : []

  selectMenu = (evt, menuItem) => {
    this.props.toggleScrollToTop()
    if (menuItem.navigationEntries && menuItem.navigationEntries.length > 0) {
      this.props.pushCategoryHistory(menuItem)
    } else {
      this.props.resetCategoryHistory()
      this.props.clearInfinityPage()
      this.props.toggleTopNavMenu()
    }
  }

  renderCategory = (menuItems, parentCategoryId) => {
    let listItems = []
    menuItems.forEach((item) => {
      if (item.label)
        listItems.push(this.renderMenuItem(item, parentCategoryId))
      if (item.navigationEntries && item.navigationEntries.length > 0) {
        const children = this.renderCategory(
          item.navigationEntries,
          item.categoryId
        )
        listItems = [...listItems, children]
      }
    })
    return listItems
  }

  /**
   * @param  {MenuItem} menuItem
   * @property {Number} menuItem.categoryId
   * @property {String} menuItem.label
   * @property {String} menuItem.seoUrl
   * @property {String} menuItem.redirectionUrl
   * @property {Array<MenuItem>} menuItem.navigationEntries
   * @param  {Number} [parentCategoryId] Optional
   * @return {ReactElement}
   */
  renderMenuItem = (menuItem, parentCategoryId = undefined) => {
    if (menuItem.redirectionUrl === '/switch-to-full-homepage') return null

    const hasSubMenuItems =
      Array.isArray(menuItem.navigationEntries) &&
      menuItem.navigationEntries.length > 0

    const isExternalUrl =
      menuItem.redirectionUrl && menuItem.redirectionUrl.startsWith('http')

    // currentCatId is the currently selected category e.g. "New In"
    const topLevelIsVisible = this.props.currentCatId === null
    // TODO This could be simplified if the top level had it's own categoryId
    const isTopLevelItem = !parentCategoryId
    const isParentCategorySelected =
      this.props.currentCatId === parentCategoryId
    const menuItemIsVisible =
      (isTopLevelItem && topLevelIsVisible) || isParentCategorySelected

    const itemProps = {
      className: cn('ListItemLink', { 'is-active': menuItemIsVisible }),
      onClick: (e) => this.selectMenu(e, menuItem),
      children: [menuItem.label],
      target: isExternalUrl ? '_blank' : undefined,
    }

    const destination = menuItem.redirectionUrl || menuItem.seoUrl

    let ItemComponent
    if (hasSubMenuItems) {
      ItemComponent = 'button'
      itemProps.children.push(<span className="Categories-arrow" key="arrow" />)
    } else if (destination.includes('/blog/')) {
      ItemComponent = 'a'
      itemProps.href = destination
    } else {
      ItemComponent = Link
      itemProps.to = destination
    }

    return (
      <ListItemLink
        key={menuItem.categoryId}
        className={`Categories-listItem Categories-listItem${
          menuItem.categoryId
        }`}
      >
        <ItemComponent key={menuItem.categoryId} {...itemProps} />
      </ListItemLink>
    )
  }

  render() {
    return <div>{this.renderCategory(this.getMenuItems())}</div>
  }
}

export default Categories
