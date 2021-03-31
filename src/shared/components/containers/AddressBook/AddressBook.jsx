import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AddressBookList from './AddressBookList/AddressBookList'
import AddressBookFormWrapper from './AddressBookForm/AddressBookFormWrapper'
import Button from '../../common/Button/Button'
import {
  getSavedAddresses,
  getIsNewAddressFormVisible,
} from '../../../selectors/addressBookSelectors'
import * as AddressBookActions from '../../../actions/common/addressBookActions'
import { validateDDPForCountry } from '../../../actions/common/ddpActions'
import { shouldDisplayDeliveryInstructions } from '../../../selectors/checkoutSelectors'
import HomeDeliveryInstructions from '../../containers/CheckoutV2/shared/DeliveryInstructions/DeliveryInstructionsContainer'
import Accordion from '../../common/Accordion/Accordion'
import CheckoutPrimaryTitle from '../CheckoutV2/shared/CheckoutPrimaryTitle'
import CheckoutSubPrimaryTitle from '../CheckoutV2/shared/CheckoutSubPrimaryTitle'

export class AddressBook extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }
  static propTypes = {
    savedAddresses: PropTypes.arrayOf(PropTypes.object).isRequired,
    isNewAddressFormVisible: PropTypes.bool.isRequired,
    createAddress: PropTypes.func.isRequired,
    deleteAddress: PropTypes.func.isRequired,
    selectAddress: PropTypes.func.isRequired,
    showNewAddressForm: PropTypes.func.isRequired,
    hideNewAddressForm: PropTypes.func.isRequired,
    validateDDPForCountry: PropTypes.func.isRequired,
  }

  state = {
    isAccordionExpanded: false,
    preSelected: null,
  }

  componentDidMount() {
    const { savedAddresses, validateDDPForCountry } = this.props
    const selectedAddress = savedAddresses.find((address) => address.selected)
    if (selectedAddress) validateDDPForCountry(selectedAddress.country)
  }

  onAccordionToggle = () => {
    const { isAccordionExpanded } = this.state
    const { savedAddresses } = this.props
    const selectedAddress = savedAddresses.find((address) => address.selected)
    const id = selectedAddress.id || selectedAddress.addressId
    this.setState({
      isAccordionExpanded: !isAccordionExpanded,
      preSelected: id,
    })
  }

  onPreselect = (id) => {
    this.setState({
      preSelected: id,
    })
  }

  getSelectedAddress = () =>
    this.props.savedAddresses.find(
      (address) => (address.id || address.addressId) === this.state.preSelected
    )

  onSelectAddress = () => {
    const address = this.getSelectedAddress()
    const { selectAddress, validateDDPForCountry } = this.props
    selectAddress(address).then(() => validateDDPForCountry(address.country))
    this.onAccordionToggle()
  }

  getAccordionSubHeaderText = () => {
    const { savedAddresses } = this.props
    if (savedAddresses.length === 0) return
    const selected = savedAddresses.find((address) => address.selected)

    const {
      firstName,
      lastName,
      telephone,
      address1,
      address2,
      city,
      postcode,
      country,
    } = selected

    return (
      <div className="AddressBookList-itemDetails">
        {[firstName, lastName, <br />]}
        {telephone && [telephone, <br />]}
        {address1 && [address1, <br />]}
        {address2 && [address2, <br />]}
        {city && [city, <br />]}
        {postcode && [postcode, <br />]}
        {country && [country, <br />]}
      </div>
    )
  }

  render() {
    const { l } = this.context
    const { isAccordionExpanded, preSelected } = this.state
    const {
      savedAddresses,
      isNewAddressFormVisible,
      createAddress,
      deleteAddress,
      showNewAddressForm,
      hideNewAddressForm,
    } = this.props
    const disableAddNewAddress = savedAddresses.length > 3

    return (
      <div>
        <Accordion
          className="AddressBook DeliveryAddressAccordion"
          expanded={isAccordionExpanded}
          header={
            <CheckoutPrimaryTitle
              isAugmented={isAccordionExpanded}
              title={l`Delivery Address`}
            />
          }
          subHeader={
            savedAddresses.length === 0 || isAccordionExpanded ? (
              ''
            ) : (
              <CheckoutSubPrimaryTitle
                title={this.getAccordionSubHeaderText()}
              />
            )
          }
          noContentBorderTop
          onAccordionToggle={() => this.onAccordionToggle()}
          statusIndicatorText={isAccordionExpanded ? l`CANCEL` : l`CHANGE`}
          withoutBorders
          noHeaderPadding
          noContentPadding
          noMaxHeight={Boolean(isNewAddressFormVisible)}
        >
          {disableAddNewAddress && (
            <div className="AddressBook-addNewNote">
              {l`To add a new address, you need to delete one from your list.`}
            </div>
          )}

          {savedAddresses.length > 0 &&
            !isNewAddressFormVisible && (
              <AddressBookList
                preSelected={preSelected}
                onPreselect={this.onPreselect}
                savedAddresses={savedAddresses}
                onDeleteAddress={deleteAddress}
                onSelectAddress={this.onSelectAddress}
              />
            )}
          {isNewAddressFormVisible && (
            <AddressBookFormWrapper
              addressType="addressBook"
              closeAccordionWithAddress={this.onSelectAddress}
              onSaveAddress={createAddress}
              onClose={hideNewAddressForm}
            />
          )}
          {!isNewAddressFormVisible && (
            <div className="AddressBook-addNew">
              <Button
                className="AddressBook-addNewBtn Button--secondary"
                clickHandler={showNewAddressForm}
                isDisabled={disableAddNewAddress}
              >{l`Add New Address`}</Button>
            </div>
          )}
        </Accordion>

        {shouldDisplayDeliveryInstructions &&
          !isAccordionExpanded && (
            <Accordion
              className="Accordion--deliveryInstructions"
              header={l`Delivery Instructions`}
              accordionName={l`Delivery Instructions`}
              noContentPadding
              noHeaderPadding
            >
              <HomeDeliveryInstructions />
            </Accordion>
          )}
      </div>
    )
  }
}

export default connect(
  (state) => ({
    savedAddresses: getSavedAddresses(state),
    isNewAddressFormVisible: getIsNewAddressFormVisible(state),
    brandName: state.config.brandName,
    shouldDisplayDeliveryInstructions: shouldDisplayDeliveryInstructions(state),
  }),
  {
    createAddress: AddressBookActions.createAddress,
    deleteAddress: AddressBookActions.deleteAddress,
    selectAddress: AddressBookActions.selectAddress,
    showNewAddressForm: AddressBookActions.showNewAddressForm,
    hideNewAddressForm: AddressBookActions.hideNewAddressForm,
    validateDDPForCountry,
  }
)(AddressBook)
