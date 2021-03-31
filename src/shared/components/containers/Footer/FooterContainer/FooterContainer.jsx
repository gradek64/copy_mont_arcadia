// Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'

// Components
import FooterNewsletter from '../FooterNewsletter/FooterNewsletter'
import FooterSocialLinks from '../FooterSocialLinks/FooterSocialLinks'
import FooterNavigation from '../FooterNavigation/FooterNavigation'
import Image from '../../../common/Image/Image'

// Actions
import { getFooterContent } from '../../../../actions/common/footerActions'

// Selectors
import { isMobile } from '../../../../selectors/viewportSelectors'
import { isInCheckout } from '../../../../selectors/routingSelectors'
import { isCookieManagerEnabled } from '../../../../selectors/featureSelectors'
import { getProductsSearchResultsTotal } from '../../../../selectors/productSelectors'

class FooterContainer extends Component {
  static propTypes = {
    brandName: PropTypes.string.isRequired,
    footerCategories: PropTypes.array,
    visited: PropTypes.array,
    getFooterContent: PropTypes.func,
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    footerConfig: PropTypes.object,
    pageType: PropTypes.string,
    isInCheckout: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    brandName: '',
    lang: 'en',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.loadFooterContent()
  }

  loadFooterContent = () => {
    const { visited, getFooterContent, footerCategories, isMobile } = this.props
    if (
      (visited && visited.length > 1) ||
      (footerCategories && footerCategories.length === 0 && !isMobile)
    ) {
      getFooterContent()
    }
  }

  bottomContentSection = (bottomContent, section) => {
    const { brandName } = this.props

    if (
      bottomContent &&
      bottomContent[section] &&
      bottomContent[section].length > 0
    ) {
      return bottomContent[section].map(
        ({ text, fileName, linkUrl, openNewWindow }) => {
          const target = openNewWindow ? '_blank' : '_self'
          const isLink = linkUrl && linkUrl.replace(/\s/g, '').length

          if (text) {
            const { l } = this.context

            return isLink ? (
              <a
                target={target}
                key={text.replace(/\s/g, '')}
                href={linkUrl}
                className="FooterContainer-bottomContentText FooterContainer-clickable"
              >
                {l(text)}
              </a>
            ) : (
              <span
                key={text.replace(/\s/g, '')}
                className="FooterContainer-bottomContentText"
              >
                {l(text)}
              </span>
            )
          }
          if (fileName) {
            return isLink ? (
              <a
                target={target}
                key={fileName}
                href={linkUrl}
                className="FooterContainer-bottomContentImage FooterContainer-clickable"
              >
                <Image
                  key={fileName}
                  src={`/assets/${brandName}/images/footer/${fileName}`}
                  lazyLoad
                />
              </a>
            ) : (
              <span
                key={fileName}
                className="FooterContainer-bottomContentImage"
              >
                <Image
                  key={fileName}
                  src={`/assets/${brandName}/images/footer/${fileName}`}
                  lazyLoad
                />
              </span>
            )
          }
          return null
        }
      )
    }
    return null
  }

  render() {
    const {
      brandName,
      className,
      footerConfig,
      pageType,
      isInCheckout,
      totalProducts,
    } = this.props
    const { newsletter, socialLinks, bottomContent } = footerConfig

    const footerContainerClasses = classnames(
      'FooterContainer',
      `${className || ''}`,
      `${
        pageType === 'plp' && totalProducts > 0 ? 'FooterContainer--hidden' : ''
      }`
    )

    const topSectionClasses = classnames('FooterContainer-topSection', {
      'FooterContainer-topSectionCentered':
        socialLinks.location === 'TOP_CENTER' ||
        newsletter.location === 'TOP_CENTER',
    })

    const socialLinksTopClasses = classnames('FooterContainer-socialLinksTop', {
      'FooterContainer-socialLinksTopCentered':
        socialLinks.location === 'TOP_CENTER',
    })

    const socialLinksPropClass = classnames({
      'FooterContainer-socialLinksTopCenteredProp':
        socialLinks.location === 'TOP_CENTER',
    })

    const newsletterClasses = classnames(
      'FooterContainer-newsletter',
      {
        'FooterContainer-newsletterTopCentered':
          newsletter.location === 'TOP_CENTER',
      },
      {
        'FooterContainer-newsletterWithLabel': newsletter.label,
      }
    )

    return (
      <footer
        className={footerContainerClasses}
        ref={(node) => {
          this.element = node
        }}
      >
        <div className="FooterContainer-inner">
          <div className={topSectionClasses}>
            {socialLinks.isVisible &&
              (socialLinks.location === 'TOP_LEFT' ||
                socialLinks.location === 'TOP_CENTER') && (
                <div className={socialLinksTopClasses}>
                  <FooterSocialLinks
                    socialLinks={socialLinks}
                    brandName={brandName}
                    className={socialLinksPropClass}
                  />
                </div>
              )}
            <div className={newsletterClasses}>
              {newsletter.isVisible &&
                !isInCheckout && (
                  <FooterNewsletter
                    inputPlaceholder={newsletter.inputPlaceholder}
                    buttonText={newsletter.buttonText}
                    redirectUrl={newsletter.redirectUrl}
                  />
                )}
            </div>
          </div>
          <hr className="FooterContainer-horizontalLine" />
          <div className="FooterContainer-navigation">
            <FooterNavigation
              footerCategories={this.props.footerCategories}
              isCookieManagerEnabled={this.props.isCookieManagerEnabled}
            />
          </div>
          <hr className="FooterContainer-horizontalLine" />
          <div className="FooterContainer-bottomContent">
            <div className="FooterContainer-bottomContentLeft">
              {this.bottomContentSection(bottomContent, 'left')}
              {socialLinks.isVisible &&
                socialLinks.location === 'BOTTOM_LEFT' && (
                  <FooterSocialLinks
                    socialLinks={socialLinks}
                    brandName={brandName}
                  />
                )}
            </div>
            <div className="FooterContainer-bottomContentRight">
              {this.bottomContentSection(bottomContent, 'right')}
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default connect(
  (state) => ({
    brandName: state.config.brandName,
    footerCategories: state.navigation.footerCategories,
    visited: state.routing.visited,
    isMobile: isMobile(state),
    footerConfig: state.footer.config,
    pageType: state.pageType,
    isInCheckout: isInCheckout(state),
    isCookieManagerEnabled: isCookieManagerEnabled(state),
    totalProducts: getProductsSearchResultsTotal(state),
  }),
  {
    getFooterContent,
  }
)(FooterContainer)
