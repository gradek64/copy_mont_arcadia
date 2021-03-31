import React from 'react'
import PropTypes from 'prop-types'
import Image from '../../../common/Image/Image'
import { removeUrlProtocol } from '../../../../lib/html-entities'

const FooterSocialLinks = ({ socialLinks, brandName, className }) => {
  const target = '_blank'
  return (
    <div className={`FooterSocialLinks ${className}`}>
      {socialLinks.links.map(({ fileName, linkUrl }) => (
        <a
          key={fileName}
          href={removeUrlProtocol(linkUrl)}
          className="FooterSocialLinks-icon"
          target={target}
        >
          <Image
            src={`/assets/${brandName}/images/social/${fileName}`}
            className="FooterSocialLinks-image"
            lazyLoad
          />
        </a>
      ))}
    </div>
  )
}

FooterSocialLinks.propTypes = {
  socialLinks: PropTypes.object.isRequired,
  brandName: PropTypes.string.isRequired,
  className: PropTypes.string,
}

FooterSocialLinks.defaultProps = {
  socialLinks: {},
  brandName: '',
}

export default FooterSocialLinks
