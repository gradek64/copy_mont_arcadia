import React from 'react'
import PropTypes from 'prop-types'

// COMPONENTS
import Button from '../../../common/Button/Button'

class GuestCheckoutButton extends React.Component {
  static propTypes = {
    clickGuestCheckout: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const { clickGuestCheckout } = this.props

    return (
      <section className="LoginContainer-guestbutton">
        <Button
          clickHandler={clickGuestCheckout}
        >{l`CONTINUE AS GUEST`}</Button>
      </section>
    )
  }
}

export default GuestCheckoutButton
