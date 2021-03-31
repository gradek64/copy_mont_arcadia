import React from 'react'
import PropTypes from 'prop-types'

const RecaptchaTermsAndConditions = (props, { l }) => {
  const url = 'https://policies.google.com'
  const renderLink = (text, linkName) =>
    `<a
          rel="noopener noreferrer"
          target="_blank"
          href=${`${url}/${linkName}`}
        >
          ${text}
        </a>`
  const privacyLink = renderLink(l`Recaptcha Privacy Policy`, 'privacy')
  const termsLink = renderLink(l`Recaptcha Terms of Service`, 'terms')
  const content = l`This site is protected by reCAPTCHA and the Google ${privacyLink} and ${termsLink} apply.`

  return (
    <div
      className="TermsAndConditions" // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

RecaptchaTermsAndConditions.contextTypes = {
  l: PropTypes.func,
}

export default RecaptchaTermsAndConditions
