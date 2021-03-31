import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Sandbox from '../../containers/SandBox/SandBox'
import { setPageStatusCode } from '../../../actions/common/routingActions'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../analytics'

const meta = [
  { name: 'description', content: 'Page not found' },
  { name: 'ROBOTS', content: 'NOINDEX, NOFOLLOW' },
]

@analyticsDecorator(GTM_CATEGORY.NOT_FOUND, {
  isAsync: true,
})
@connect(
  () => ({}),
  {
    setPageStatusCode,
  }
)
class NotFound extends Component {
  static propTypes = {
    route: PropTypes.object,
    cmsPageName: PropTypes.string,
    setPageStatusCode: PropTypes.func.isRequired,
  }

  static defaultProps = {
    route: {},
    cmsPageName: null,
  }

  UNSAFE_componentWillMount() {
    if (!process.browser && this.props.route.contentType === 'page') {
      this.props.setPageStatusCode(404)
    }
  }

  render() {
    const { cmsPageName, ...restProps } = this.props
    return (
      <div className="NotFound">
        <Helmet title="404 - Page not found" meta={meta} />
        <Sandbox
          cmsPageName={cmsPageName || 'error404'}
          {...restProps}
          shouldGetContentOnFirstLoad
        />
      </div>
    )
  }
}

export default NotFound
