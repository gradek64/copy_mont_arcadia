import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as carouselActions from '../../../actions/common/carousel-actions'
import CmsComponent, { cmsTypes } from '../CmsComponent/CmsComponent'
import NotFound from '../../containers/NotFound/NotFound'
import { getTemplateComponent } from '../../../../custom/templateRoutes'

@connect(
  null,
  carouselActions
)
class CmsPage extends Component {
  static propTypes = {
    page: PropTypes.object,
  }

  getComponent = (setProps) => {
    if (setProps.type === 'custom') {
      return getTemplateComponent(setProps.data.template, {
        id: setProps.name,
        ...setProps,
      })
    } else if (cmsTypes.includes(setProps.type)) {
      return <CmsComponent {...setProps} />
    }
    return null
  }

  render() {
    const { page } = this.props
    if (page && page.pageData) {
      const items = page.pageData.reduce((result, { type, data }, key) => {
        const componentProps = {
          name: `${page.pageName}${key}`,
          key,
          type,
          data,
        }
        const comp = this.getComponent(componentProps)
        return comp ? result.concat(comp) : result
      }, [])
      return items.length ? (
        <div className="CmsPage">{items}</div>
      ) : (
        <NotFound />
      )
    }
    return null
  }
}

export default CmsPage
