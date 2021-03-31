import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../common/Button/Button'

export default class AddressBookList extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }
  static propTypes = {
    savedAddresses: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDeleteAddress: PropTypes.func.isRequired,
    onSelectAddress: PropTypes.func.isRequired,
  }

  selectedAddress() {
    const selected = this.props.savedAddresses.find(
      (address) => address.selected
    )
    return selected.id || selected.addressId
  }

  renderItemDetailsAddress(key, value) {
    return value && value.length > 0 ? (
      <p key={key} className="AddressBookList-itemDetailsAddress">
        {value}
      </p>
    ) : null
  }

  componentDidUpdate(prevProps) {
    if (prevProps.savedAddresses !== this.props.savedAddresses) {
      const id = this.selectedAddress()
      this.props.onPreselect(id)
    }
  }

  onDelete = (event, address) => {
    event.preventDefault()
    const id = this.selectedAddress()
    this.props.onDeleteAddress(address)
    this.props.onPreselect(id)
  }

  render() {
    const { l } = this.context
    const {
      savedAddresses,
      onSelectAddress,
      preSelected,
      onPreselect,
    } = this.props
    return (
      <ol className="AddressBookList">
        {savedAddresses.map((savedAddress) => {
          const id = savedAddress.id || savedAddress.addressId
          return (
            <li
              key={id}
              className={`AddressBookList-item ${
                id === preSelected ? 'AddressBookList-item--selected' : ''
              }`}
            >
              <button
                className=" AddressBookList-item--onClick AddressBookList-itemDetails"
                onClick={() => onPreselect(id)}
              >
                <h3 className="AddressBookList-itemDetailsName">
                  {savedAddress.title} {savedAddress.firstName}{' '}
                  {savedAddress.lastName}
                </h3>
                {[
                  'address1',
                  'address2',
                  'city',
                  'state',
                  'postcode',
                  'country',
                ].map((key) =>
                  this.renderItemDetailsAddress(key, savedAddress[key])
                )}
              </button>
              {savedAddresses.length > 1 &&
                id !== preSelected && (
                  <div className="AddressBookList-itemActions">
                    <a
                      href=""
                      className="AddressBookList-itemAction AddressBookList-itemDelete"
                      onClick={(event) => this.onDelete(event, savedAddress)}
                    >{l`DELETE`}</a>
                  </div>
                )}
            </li>
          )
        })}
        {savedAddresses.length > 1 && (
          <Button
            className="AddressBook-addNewBtn Button--primary"
            clickHandler={onSelectAddress}
          >{l`Use this address`}</Button>
        )}
      </ol>
    )
  }
}
