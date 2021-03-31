import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { PASSWORD_CRITERIA_INDICATOR_LABELS } from '../../../constants/passwordCriteriaIndicator'
import { passwordCriteriaErrorCollector } from '../../../lib/password-criteria-indicator-utils'

const PasswordCriteriaIndicator = ({ password, isTouched }, { l }) => {
  const currentErrors = passwordCriteriaErrorCollector(password)
  const criteriaIndicatorLabelList = Object.values(
    PASSWORD_CRITERIA_INDICATOR_LABELS
  )

  if (password || isTouched) {
    return (
      <div className="PasswordCriteriaIndicator">
        <p>{l`Your password must contain:`}</p>
        <ul>
          {criteriaIndicatorLabelList.map((error) => {
            const errorExist = currentErrors.includes(error)
            const indicatorListClasses = classnames(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem',
              {
                'PasswordCriteriaIndicator-listItem--fail':
                  errorExist && isTouched,
                'PasswordCriteriaIndicator-listItem--pass': !errorExist,
              }
            )
            return (
              <li key={error} className={indicatorListClasses}>
                {l(error)}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return null
}

PasswordCriteriaIndicator.propTypes = {
  password: PropTypes.string,
  isTouched: PropTypes.bool,
}

PasswordCriteriaIndicator.defaultProps = {
  password: '',
  isTouched: false,
}

PasswordCriteriaIndicator.contextTypes = {
  l: PropTypes.func,
}

export default PasswordCriteriaIndicator
