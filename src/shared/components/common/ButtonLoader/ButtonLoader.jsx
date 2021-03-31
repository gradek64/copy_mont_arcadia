import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '../Button/Button'
import Loader from '../Loader/Loader'

@connect((state) => ({
  forms: state.forms,
}))
class ButtonLoader extends Component {
  static propTypes = {
    forms: PropTypes.object,
    formName: PropTypes.string,
    children: PropTypes.string,
  }

  static defaultProps = {
    forms: {},
  }

  render() {
    const { forms, formName } = this.props
    const { isLoading } = formName in forms ? forms[formName] : {}
    return (
      <Button {...this.props}>
        {isLoading ? (
          <Loader isButton fillColor="#FFFFFF" />
        ) : (
          this.props.children
        )}
      </Button>
    )
  }
}

export default ButtonLoader
