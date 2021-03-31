import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Button from '../../common/Button/Button'
import LoginRegisterHeader from './LoginRegisterHeader'

export default class RegisterSuccess extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }

  onContinue = () => {
    browserHistory.push('/')
  }
  render() {
    const { l } = this.context
    return (
      <section className={'RegisterSuccess'}>
        <div className={'RegisterSuccess-inner'}>
          <LoginRegisterHeader className="RegisterSuccess-header">{l`Great news!`}</LoginRegisterHeader>
          <p className="RegisterSuccess-text">{l`You're now registered and can start looking...`}</p>
          <Button
            className="RegisterSuccess-button"
            clickHandler={this.onContinue}
          >
            {l`Get me to those bargains`}
          </Button>
        </div>
      </section>
    )
  }
}
