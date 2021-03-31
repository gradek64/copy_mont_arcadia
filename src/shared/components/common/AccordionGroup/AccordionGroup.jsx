import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Accordion from '../Accordion/Accordion'
import { equals, without } from 'ramda'

export default class AccordionGroup extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    singleOpen: PropTypes.bool,
    initiallyExpanded: PropTypes.arrayOf(PropTypes.string),
    onAccordionToggle: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    singleOpen: false,
    initiallyExpanded: [],
    onAccordionToggle: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      expandedAccordions: props.initiallyExpanded,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !equals(nextProps.initiallyExpanded, this.props.initiallyExpanded) ||
      !equals(nextProps.productCategory, this.props.productCategory)
    ) {
      this.setState({ expandedAccordions: nextProps.initiallyExpanded })
    }
  }

  componentDidMount() {
    if (typeof this.props.handleCollapseAll === 'function') {
      this.props.handleCollapseAll(this.closeAllAccordions)
    }
  }

  handleAccordionToggle = (accordionName, isExpanded) => {
    this.props.onAccordionToggle(accordionName, isExpanded)

    if (isExpanded) {
      this.setExpandedAccordion(accordionName)
      return
    }

    this.unsetExpandedAccordion(accordionName)
  }

  setExpandedAccordion = (accordionName) => {
    if (this.props.singleOpen) {
      this.setState({ expandedAccordions: [accordionName] })
      return
    }

    this.setState(({ expandedAccordions }) => ({
      expandedAccordions: expandedAccordions.concat(accordionName),
    }))
  }

  unsetExpandedAccordion = (accordionName) => {
    this.setState(({ expandedAccordions }) => ({
      expandedAccordions: without(accordionName, expandedAccordions),
    }))
  }

  isAccordionExpanded = (accordionName) => {
    return this.state.expandedAccordions.includes(accordionName)
  }

  closeAllAccordions = () => {
    this.setState({ expandedAccordions: [] })
  }

  render() {
    const { children, className } = this.props
    return (
      <div className={`AccordionGroup ${className}`}>
        {children.map(({ props }) => (
          <Accordion
            key={props.label}
            {...props}
            className={`Accordion-groupMember ${props.className}`}
            onAccordionToggle={this.handleAccordionToggle}
            expanded={this.isAccordionExpanded(props.accordionName)}
          />
        ))}
      </div>
    )
  }
}
