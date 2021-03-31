import classNames from 'classnames'
import PropTypes from 'prop-types'
import { addIndex, map, isEmpty } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { scrollElementIntoView } from '../../../lib/scroll-helper'

// actions
import * as FormActions from '../../../actions/common/formActions'
import * as ShoppingBagActions from '../../../actions/common/shoppingBagActions'

// components
import Accordion from '../../common/Accordion/Accordion'
import Promotion from './Promotion'
import PromotionForm from './PromotionForm'

// HOC
import withRestrictedActionDispatch from '../../../lib/restricted-actions'

@withRestrictedActionDispatch({
  addPromotionCode: ShoppingBagActions.addPromotionCode,
  delPromotionCode: ShoppingBagActions.delPromotionCode,
})
@connect(
  (state) => ({
    currentPromotions: state.shoppingBag.bag.promotions,
    promotionForm: state.forms.promotionCode,
    promotionCodeConfirmation: state.shoppingBag.promotionCodeConfirmation,
  }),
  { ...FormActions, ...ShoppingBagActions }
)
class PromotionCode extends React.Component {
  static propTypes = {
    promotionForm: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFormMessage: PropTypes.func.isRequired,
    setFormMeta: PropTypes.func.isRequired,
    addPromotionCode: PropTypes.func,
    className: PropTypes.string,
    currentPromotions: PropTypes.array,
    delPromotionCode: PropTypes.func,
    groupMember: PropTypes.bool,
    isHeaderPadded: PropTypes.bool,
    isContentPadded: PropTypes.bool,
    isOpenIfPopulated: PropTypes.bool,
    promotionCodeConfirmation: PropTypes.bool,
    setFormField: PropTypes.func,
    setPromotionCodeConfirmation: PropTypes.func,
    touchedFormField: PropTypes.func,
    isCompactHeader: PropTypes.bool,
    gtmCategory: PropTypes.string.isRequired,
    scrollOnPromoCodeError: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    isAccordionExpanded:
      this.props.isOpenIfPopulated && !isEmpty(this.props.currentPromotions),
  }

  static defaultProps = {
    className: '',
    currentPromotions: [],
    groupMember: false,
    isOpenIfPopulated: false,
    isHeaderPadded: true,
    isContentPadded: true,
    promotionCodeConfirmation: false,
    isCompactHeader: false,
    scrollOnPromoCodeError: true,
  }

  UNSAFE_componentWillMount() {
    const { currentPromotions, setFormMeta } = this.props
    setFormMeta('promotionCode', 'isVisible', isEmpty(currentPromotions))
    this.resetForm()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !this.props.promotionCodeConfirmation &&
      nextProps.promotionCodeConfirmation
    ) {
      setTimeout(() => this.props.setPromotionCodeConfirmation(false), 8000)
    }

    const openIfPromoApplied =
      !this.state.isAccordionExpanded &&
      nextProps.isOpenIfPopulated &&
      isEmpty(this.props.currentPromotions) &&
      !isEmpty(nextProps.currentPromotions)
    // An error may have occurred when applying the ARCPROMO_CODE which we want
    // to show to the user
    const hasErrorMessage = !isEmpty(nextProps.promotionForm.message)

    if (openIfPromoApplied || hasErrorMessage) {
      this.setState({ isAccordionExpanded: true })
    }
  }

  scrollToPromoCodeError = () => {
    if (document)
      scrollElementIntoView(document.querySelector('.PromotionCode-message'))
  }

  onSubmitHandler = ({ promotionCode }) => {
    const { addPromotionCode, gtmCategory, scrollOnPromoCodeError } = this.props
    let promoCodeArgs = { promotionId: promotionCode, gtmCategory }

    if (scrollOnPromoCodeError)
      promoCodeArgs = {
        ...promoCodeArgs,
        errorCallback: this.scrollToPromoCodeError,
      }
    addPromotionCode(promoCodeArgs)
  }

  setField = (name) => (e) => {
    const value = e.target.value.toUpperCase().replace(' ', '')
    this.props.setFormField('promotionCode', name, value)
  }

  resetForm = () => {
    this.props.setFormMessage('promotionCode', {})
    this.props.resetForm('promotionCode', { promotionCode: '' })
  }

  removePromotionCode = (code) => {
    this.props.delPromotionCode({ promotionCode: code })
  }

  onAccordionToggle = () => {
    this.resetForm()
    this.setState((state) => ({
      isAccordionExpanded: !state.isAccordionExpanded,
    }))
  }

  showForm = () => this.props.setFormMeta('promotionCode', 'isVisible', true)
  touchedField = (name) => () =>
    this.props.touchedFormField('promotionCode', name)

  render() {
    const { l } = this.context
    const {
      currentPromotions,
      promotionForm,
      className,
      isHeaderPadded,
      isContentPadded,
      groupMember,
      promotionCodeConfirmation,
      isCompactHeader,
    } = this.props
    const headerText = l`Promo & Student Codes`
    const classes = classNames('PromotionCode', className, {
      'Accordion-groupMember': groupMember,
    })
    const headerClasses = classNames('PromotionCode-header', {
      'is-compact': isCompactHeader,
    })

    return (
      <Accordion
        expanded={this.state.isAccordionExpanded}
        header={<h3 className={headerClasses}>{headerText}</h3>}
        accordionName="promotionCode"
        scrollPaneSelector=".MiniBag-content"
        className={classes}
        noHeaderPadding={!isHeaderPadded}
        noContentPadding={!isContentPadded}
        onAccordionToggle={this.onAccordionToggle}
      >
        <div className="PromotionCode-list">
          <p
            className={`PromotionCode-codeConfirmation ${
              promotionCodeConfirmation ? 'is-shown' : 'is-hidden'
            }`}
          >{l`Your promo code has been applied`}</p>
          {addIndex(map)(
            (promotion, idx, list) => (
              <Promotion
                key={idx}
                l={l}
                showAddButton={
                  !promotionForm.isVisible && idx === list.length - 1
                }
                showForm={this.showForm}
                removePromotionCode={this.removePromotionCode}
                promotion={promotion}
              />
            ),
            currentPromotions
          )}
        </div>
        <PromotionForm
          show={promotionForm.isVisible || currentPromotions.length === 0}
          promotionForm={promotionForm}
          setField={this.setField}
          touchedField={this.touchedField}
          onSubmitHandler={this.onSubmitHandler}
        />
      </Accordion>
    )
  }
}

export default PromotionCode
