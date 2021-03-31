import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TsAndCsItem from '../../../components/common/TsAndCsItem/TsAndCsItem'
import BackToTop from '../../common/BackToTop/BackToTop'

export default class TermsAndConditions extends Component {
  static propTypes = {
    tsAndCs: PropTypes.object,
  }

  render() {
    const {
      tsAndCs: {
        pageData: { '1stlevel': pageDataStructure },
      },
    } = this.props
    return (
      <div className="TermsAndConditions">
        {pageDataStructure.map((firstLevelItem, i) => {
          const fragment = `fragment-${i + 1}`
          return (
            <TsAndCsItem
              key={i} // eslint-disable-line react/no-array-index-key
              item={firstLevelItem}
              fragment={fragment}
            />
          )
        })}
        <BackToTop />
      </div>
    )
  }
}
