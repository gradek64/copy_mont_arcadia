import React from 'react'
import PropTypes from 'prop-types'
import * as AccountActions from '../../../actions/common/accountActions'
import { connect } from 'react-redux'

// Libs
import { pathOr } from 'ramda'

export const mapStateToProps = (state) => ({
  user: state.account.user,
  visited: state.routing.visited,
})

@connect(
  mapStateToProps,
  {
    ...AccountActions,
  }
)
class MyAccountSubcategory extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    user: PropTypes.object,
    getAccount: PropTypes.func,
    visited: PropTypes.array,
  }

  componentDidMount() {
    const { visited, user, getAccount } = this.props
    const isLoggedIn = pathOr(false, ['exists'], user)
    if (visited.length > 1 && !isLoggedIn) getAccount()
  }

  static needs = [AccountActions.getAccount]

  render() {
    const { children } = this.props
    return <div className="MyAccountSubcategory">{children}</div>
  }
}

export default MyAccountSubcategory
