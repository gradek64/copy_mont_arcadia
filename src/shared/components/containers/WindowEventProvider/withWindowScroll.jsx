import React from 'react'
import { WindowScroll } from './WindowScroll'

export const withWindowScroll = ({
  scrollPastThreshold = 0,
  notifyWhenReachedBottomOfPage = false,
  pageBottomBuffer = 0,
}) => (WrappedComponent) => {
  class component extends React.Component {
    state = {
      hasPassedThreshold: false,
      hasReachedPageBottom: false,
    }

    onScrollPast = (hasPassedThreshold) => {
      this.setState({
        hasPassedThreshold,
      })
    }

    onReachedPageBottom = (hasReachedPageBottom) => {
      if (notifyWhenReachedBottomOfPage) {
        this.setState({
          hasReachedPageBottom,
        })
      }
    }

    render() {
      return (
        <WindowScroll
          scrollPastThreshold={scrollPastThreshold}
          onScrollPast={this.onScrollPast}
          onReachedPageBottom={this.onReachedPageBottom}
          pageBottomBuffer={pageBottomBuffer}
        >
          <WrappedComponent
            {...this.props}
            hasPassedThreshold={this.state.hasPassedThreshold}
            hasReachedPageBottom={this.state.hasReachedPageBottom}
          />
        </WindowScroll>
      )
    }
  }

  component.WrappedComponent = WrappedComponent
  return component
}
