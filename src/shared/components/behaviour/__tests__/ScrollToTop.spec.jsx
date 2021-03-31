import React from 'react'
import { mount } from 'enzyme'

jest.mock('../../../../shared/lib/scroll-helper', () => ({
  scrollToTopImmediately: jest.fn(),
}))
import { scrollToTopImmediately } from '../../../../shared/lib/scroll-helper'

import ScrollToTop from '../ScrollToTop'

const DumbComponent = ScrollToTop.WrappedComponent

const initialLocation = {
  pathname: '/',
}

describe('ScrollToTop', () => {
  const processBrowser = process.browser

  beforeEach(() => {
    process.browser = true
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.browser = processBrowser
  })

  it('renders children untouched', () => {
    const wrapper = mount(
      <DumbComponent location={initialLocation}>
        <div>This is real markup</div>
      </DumbComponent>
    )

    expect(wrapper.html()).toBe('<div>This is real markup</div>')
  })

  it('does not set up on server', () => {
    process.browser = false
    const useEffectSpy = jest.spyOn(React, 'useEffect')

    mount(
      <DumbComponent location={initialLocation}>
        <div>This is real markup</div>
      </DumbComponent>
    )

    expect(useEffectSpy).not.toHaveBeenCalled()
  })

  it('does not scroll to top if the location path does not change', () => {
    const wrapper = mount(
      <DumbComponent location={initialLocation}>
        <div>This is real markup</div>
      </DumbComponent>
    )

    wrapper.setProps({
      location: { ...initialLocation },
    })

    // still gets called on mount
    expect(scrollToTopImmediately).toHaveBeenCalledTimes(1)
  })

  it('scrolls to top when the location pathname changes', () => {
    const wrapper = mount(
      <DumbComponent location={initialLocation}>
        <div>This is real markup</div>
      </DumbComponent>
    )

    wrapper.setProps({
      location: {
        pathname: '/somewhere-else',
      },
    })

    expect(scrollToTopImmediately).toHaveBeenCalledTimes(2)
  })

  it('does not scroll to top if the user hits the back button', () => {
    const wrapper = mount(
      <DumbComponent location={initialLocation}>
        <div>This is real markup</div>
      </DumbComponent>
    )

    wrapper.setProps({
      location: {
        pathname: '/somewhere-else',
        action: 'POP',
      },
    })

    expect(scrollToTopImmediately).toHaveBeenCalledTimes(1)
  })

  it('does not scroll to top if preserveScroll prop is true', () => {
    const wrapper = mount(
      <DumbComponent location={initialLocation}>
        <div>This is real markup</div>
      </DumbComponent>
    )

    wrapper.setProps({
      routes: [
        {},
        {
          preserveScroll: true,
        },
      ],
      location: {
        pathname: '/somewhere-else',
      },
    })

    expect(scrollToTopImmediately).toHaveBeenCalledTimes(1)
  })
})
