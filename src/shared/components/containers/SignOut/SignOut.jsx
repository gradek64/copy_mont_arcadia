import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as authActions from '../../../actions/common/authActions'

@connect(
  null,
  { ...authActions }
)
class SignOut extends Component {
  static propTypes = {
    logoutRequest: PropTypes.func,
  }

  UNSAFE_componentWillMount() {
    this.props.logoutRequest()
  }

  render() {
    return null
  }
}

export default SignOut
