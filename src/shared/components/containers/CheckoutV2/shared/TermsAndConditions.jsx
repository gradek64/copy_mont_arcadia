import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'

export default class TermsAndConditions extends Component {
  static propTypes = {
    brandName: PropTypes.string.isRequired,
    isGuestOrder: PropTypes.bool,
  }

  static defaultProps = {
    isGuestOrder: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  /**
   * Apply tags to translations to construct links
   *
   * TAGS:
   * - [S] highlights where to split the content
   * - [#] highlights which part of the content is a link
   *
   * Translation:
   * "By placing your order you agree to our Terms & Conditions and Privacy Policy."
   *
   * Translation with tags:
   * "By placing your order you agree to our [S][#]Terms & Conditions[S] and [S][#]Privacy Policy."
   *
   * Translation rendered:
   * By placing your order you agree to our <Link>Terms & Conditions</Link> and <Link>Privacy Policy.</Link>
   */
  constructContent = (content) => {
    const links = [`/cms/${this.context.l`tcs`}`, '/cms/privacyPolicy']
    return content.split('[S]').map((text, iter) => {
      let split = text
      if (text.includes('[#]') && links[0]) {
        split = (
          <Link
            target="_blank"
            to={links[0]}
            key={`${encodeURI(links[0])}_${iter}`} // eslint-disable-line react/no-array-index-key
          >
            {text.replace('[#]', '')}
          </Link>
        )
        links.shift()
      }
      return split
    })
  }

  render() {
    const { brandName, isGuestOrder, forDDPRenewal } = this.props
    const { l } = this.context
    let contentString
    if (forDDPRenewal) {
      contentString = l`Terms & Conditions link`
    } else {
      const TCs = l`By placing your order you agree to our Terms & Conditions and Privacy Policy.`
      const guest = isGuestOrder
        ? l`You also consent to some of your data being stored by ${brandName}, which may be used to make future shopping experiences better for you.`
        : ''
      contentString = `${TCs} ${guest}`
    }

    return (
      <div className="TermsAndConditions">
        {this.constructContent(contentString)}
      </div>
    )
  }
}
