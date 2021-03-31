import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Accordion from '../Accordion/Accordion'
import { scrollElementIntoView } from '../../../lib/scroll-helper'

@connect((state) => ({
  location: state.routing.location,
}))
class TsAndCsItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      heading: PropTypes.node,
      '2ndlevel': PropTypes.arrayOf(
        PropTypes.shape({
          subHeading: PropTypes.string,
          markup: PropTypes.string,
        })
      ),
    }).isRequired,
    fragment: PropTypes.string.isRequired,
    location: PropTypes.shape({
      hash: PropTypes.string,
    }).isRequired,
  }

  componentDidMount() {
    const {
      location: { hash },
      fragment,
    } = this.props
    const hashUrl = hash.replace('#', '')
    if (hashUrl === fragment) {
      scrollElementIntoView(this.tsAndCsItem, 1)
    }
  }

  render() {
    const {
      item,
      item: { heading },
      location: { hash },
      fragment,
    } = this.props
    const hashUrl = hash.replace('#', '')
    return (
      <div
        className="TsAndCsItem"
        ref={(div) => {
          this.tsAndCsItem = div
        }}
      >
        <Accordion
          header={heading}
          accordionName={`tscs-${fragment}`}
          expanded={hashUrl === fragment}
        >
          {item['2ndlevel'].map((current, i) => {
            return (
              <div
                key={i} // eslint-disable-line react/no-array-index-key
                className="TsAndCsItem-secondLevelItem"
              >
                <div className="TsAndCsItem-secondLevelItemSubHeading">
                  <span className="TsAndCsItem-secondLevelItemSubHeadingText">
                    {current.subHeading}
                  </span>
                </div>
                <div
                  className="TsAndCsItem-markup"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: current.markup }}
                />
              </div>
            )
          })}
        </Accordion>
      </div>
    )
  }
}

export default TsAndCsItem
