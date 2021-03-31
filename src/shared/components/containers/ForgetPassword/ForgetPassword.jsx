import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isFeatureDesktopResetPasswordEnabled } from '../../../selectors/featureSelectors'
import {
  forgetPwdRequest,
  resetPasswordLinkRequest,
  setForgetPassword,
} from '../../../actions/common/accountActions'
import {
  resetForm,
  setFormField,
  setFormMessage,
  touchedFormField,
} from '../../../actions/common/formActions'
import Accordion from '../../common/Accordion/Accordion'
import ForgetPasswordForm from '../../common/ForgetPasswordForm/ForgetPasswordForm'

class ForgetPassword extends Component {
  constructor(props) {
    super(props)
    this.scrollRef = null
  }
  static propTypes = {
    className: PropTypes.string,
    forgetPasswordForm: PropTypes.object,
    forgetPwdRequest: PropTypes.func,
    isFeatureDesktopResetPasswordEnabled: PropTypes.bool,
    resetForm: PropTypes.func,
    resetPasswordLinkRequest: PropTypes.func,
    setForgetPassword: PropTypes.func,
    setFormField: PropTypes.func,
    setFormMessage: PropTypes.func,
    touchedFormField: PropTypes.func,
    orderId: PropTypes.number,
    enableScrollToMessage: PropTypes.bool,
    noContentBorderTop: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    enableScrollToMessage: false,
    noContentBorderTop: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    isAccordionExpanded: false,
  }

  onAccordionToggle = () => {
    this.setState((state) => ({
      isAccordionExpanded: !state.isAccordionExpanded,
    }))
  }

  clickedInAccordionTitle = (e) => {
    const titleEl = this.scrollRef.getElementsByClassName(
      Accordion.headerClassName
    )[0]

    if (!titleEl)
      throw new Error('Missing Accordion.headerClassName className!')

    const clickedInTitle =
      titleEl.getElementsByClassName(e.target.className).length > 0
    const clickTitle = titleEl === e.target

    return clickTitle || clickedInTitle
  }

  scrollToMyRef = (e) => {
    if (!this.clickedInAccordionTitle(e) || this.state.isAccordionExpanded)
      return

    const eleCoords = this.scrollRef.getBoundingClientRect()
    const scrollY = window.scrollY
    const pos = eleCoords.top + scrollY - eleCoords.height

    window.scroll({
      top: pos,
      behavior: 'smooth',
    })
  }

  render() {
    const { l } = this.context
    const { className, noContentBorderTop, ...props } = this.props
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <section
        className={`ForgetPassword ${className}`}
        role="presentation"
        ref={(ref) => {
          this.scrollRef = ref
        }}
        onClick={this.scrollToMyRef}
      >
        <Accordion
          expanded={this.state.isAccordionExpanded}
          className="ForgetPassword-accordion"
          header={l`Forgotten your password?`}
          accordionName="forgetPassword"
          onAccordionToggle={this.onAccordionToggle}
          noContentPadding
          noContentBorderTop={noContentBorderTop}
        >
          <ForgetPasswordForm className="ForgetPassword-form" {...props} />
        </Accordion>
      </section>
    )
  }
}

export default connect(
  (state) => ({
    forgetPwd: state.account.forgetPwd,
    forgetPasswordForm: state.forms.forgetPassword,
    isFeatureDesktopResetPasswordEnabled: isFeatureDesktopResetPasswordEnabled(
      state
    ),
  }),
  {
    forgetPwdRequest,
    resetForm,
    resetPasswordLinkRequest,
    setForgetPassword,
    setFormField,
    setFormMessage,
    touchedFormField,
  }
)(ForgetPassword)

export { ForgetPassword as WrappedForgetPassword }
