import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Image from '../../../common/Image/Image'
import Link from '../../../common/Link'
import { removeUrlProtocol, heDecode } from '../../../../lib/html-entities'

export default class FooterNavigation extends Component {
  static propTypes = {
    footerCategories: PropTypes.array,
    isCookieManagerEnabled: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  getCategoryCol = ({ label, links, images }, catId) => {
    const uid = `FooterNavigation-${catId}`
    return (
      <div key={uid} className="FooterNavigation-category">
        <h3 className="FooterNavigation-categoryTitle">{label}</h3>
        {links &&
          links.map((link, linkId) => this.getTextLink(link, linkId, catId))}
        {images &&
          images.map((image, linkId) =>
            this.getImageLink(image, linkId, catId)
          )}
      </div>
    )
  }

  isLinkExternal = ({ openNewWindow, linkUrl }) => {
    return openNewWindow && linkUrl.startsWith('http')
  }

  /**
   * Sets the target prop on the react router link component.
   *
   * Setting a target prop on react router v3 forces the browser to handle any links
   * instead of react-router.
   *
   * 'null' should be returned if desired behaviour is to
   * change the route of the app without refreshing the page.
   * @func getLinkTarget
   * @param {Object} getLinkTargetParams
   * @param {String} getLinkTargetParams.linkUrl
   * @param {Boolean} getLinkTargetParams.openNewWindow
   * @returns {String | null}
   */
  getLinkTarget = ({ openNewWindow, linkUrl }) => {
    if (openNewWindow) return '_blank'
    if (linkUrl.startsWith('http')) return '_self'
    return null
  }

  clickHandler = (event, label) => {
    const {
      context: { l },
    } = this
    const { isCookieManagerEnabled } = this.props
    const { truste = {} } = window || {}

    if (
      isCookieManagerEnabled &&
      label.toLocaleLowerCase() === l`manage cookies` &&
      truste.eu &&
      truste.eu.clickListener
    ) {
      event.preventDefault()
      truste.eu.clickListener()
    }
  }

  getTextLink = (link, linkId, catId) => {
    const { label, linkUrl } = link
    const uid = `FooterNavigation-${catId}-${linkId}`

    return (
      <div key={uid} className="FooterNavigation-categoryItem">
        <Link
          isExternal={this.isLinkExternal(link)}
          className="FooterNavigation-textLink"
          target={this.getLinkTarget(link)}
          to={heDecode(linkUrl)}
          onClick={(event) => this.clickHandler(event, label)}
        >
          {label}
        </Link>
      </div>
    )
  }

  getImageLink = (link, linkId, catId) => {
    const { imageUrl, imageSize = '', linkUrl, alt } = link
    const uid = `FooterNavigation-${catId}-${linkId}`
    const size = imageSize
      ? imageSize.charAt(0).toUpperCase() + imageSize.slice(1)
      : 0
    return (
      <div key={uid} className="FooterNavigation-categoryItem">
        <Link
          isExternal={this.isLinkExternal(link)}
          className="FooterNavigation-imageLink"
          to={heDecode(linkUrl)}
          target={this.getLinkTarget(link)}
        >
          <Image
            className={`FooterNavigation-image${size}`}
            src={removeUrlProtocol(imageUrl)}
            alt={alt}
          />
        </Link>
      </div>
    )
  }

  render() {
    const { footerCategories } = this.props

    return (
      <div className="FooterNavigation">
        {footerCategories.map((category, catId) =>
          this.getCategoryCol(category, catId)
        )}
      </div>
    )
  }
}
