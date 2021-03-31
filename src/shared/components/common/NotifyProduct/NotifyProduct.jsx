import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { mapObjIndexed, prop, equals } from 'ramda'
import Button from '../Button/Button'
import {
  showModal,
  setModalChildren,
} from '../../../actions/common/modalActions'
import { resetForm, setFormField } from '../../../actions/common/formActions'
import {
  updateSelectedOosItem,
  emailMeStock,
} from '../../../actions/common/productsActions'
import { checkIfOneSizedItem } from '../../../lib/product-utilities'
import NotifyProductForm from './NotifyProductForm'

@connect(
  (state) => ({
    notifyStockForm: state.forms.notifyStock,
    modal: state.modal,
    selectedOosItem: state.productDetail.selectedOosItem,
  }),
  {
    showModal,
    setModalChildren,
    resetForm,
    setFormField,
    updateSelectedOosItem,
    emailMeStock,
  }
)
class NotifyProduct extends Component {
  static propTypes = {
    backInStock: PropTypes.bool.isRequired,
    notifyMe: PropTypes.bool.isRequired,
    notifyStockForm: PropTypes.object,
    modal: PropTypes.object,
    sizes: PropTypes.array,
    selectedOosItem: PropTypes.object,
    setFormField: PropTypes.func,
    updateSelectedOosItem: PropTypes.func,
    resetForm: PropTypes.func,
    showModal: PropTypes.func,
    setModalChildren: PropTypes.func,
    emailMeStock: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  submitForm = () => {
    const {
      emailMeStock,
      setFormField,
      productId,
      notifyStockForm,
      selectedOosItem,
    } = this.props
    setFormField('notifyStock', 'state', 'submitting')

    const formData = mapObjIndexed(prop('value'), notifyStockForm.fields)
    emailMeStock({ productId, ...formData, ...selectedOosItem })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      modal: { open },
      selectedOosItem,
      setModalChildren,
      updateSelectedOosItem,
      resetForm,
    } = this.props

    if (!nextProps.notifyMe && !nextProps.backInStock) return
    // Needed to rerender form within Modal since Modal doesnt rerender automaticly
    if (
      !equals(this.props.notifyStockForm, nextProps.notifyStockForm) ||
      !equals(selectedOosItem, nextProps.selectedOosItem)
    ) {
      setModalChildren(
        <NotifyProductForm {...this.props} submitForm={this.submitForm} />
      )
    }

    if (open && !nextProps.modal.open) {
      // closing the modal reset everything
      updateSelectedOosItem({})
      resetForm('notifyStock', {
        firstName: null,
        surname: null,
        email: null,
        state: null,
      })
    } else if (
      !nextProps.modal.open &&
      !equals(nextProps.selectedOosItem, {})
    ) {
      this.showNotifyProductForm()
    }
  }

  showNotifyProductForm = () => {
    const { showModal, updateSelectedOosItem, sizes } = this.props
    if (checkIfOneSizedItem(sizes)) updateSelectedOosItem(sizes[0])
    return showModal(
      <NotifyProductForm {...this.props} submitForm={this.submitForm} />,
      { mode: 'roll' }
    )
  }

  render() {
    const { l } = this.context
    const { backInStock, notifyMe, sizes } = this.props
    const itemsAreOutOfStock =
      sizes && sizes.some(({ quantity }) => quantity === 0)

    if ((!notifyMe && !backInStock) || !itemsAreOutOfStock) return null
    return (
      <div className="NotifyProduct">
        <Button
          className="NotifyProduct-button"
          clickHandler={this.showNotifyProductForm}
        >
          {backInStock ? (
            <span className="translate">{l`E-mail me when back in stock`}</span>
          ) : (
            <span className="translate">{l`Notify me when available`}</span>
          )}
        </Button>
      </div>
    )
  }
}

export default NotifyProduct
