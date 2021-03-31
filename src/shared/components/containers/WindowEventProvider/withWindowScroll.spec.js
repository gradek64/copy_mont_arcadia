import React from 'react'
import { shallow } from 'enzyme'
import { WindowScroll } from './WindowScroll'
import { withWindowScroll } from './withWindowScroll'

const MockComponent = () => null
const Component = withWindowScroll({ scrollPastThreshold: 0.5 })(MockComponent)

describe('withWindowScroll', () => {
  it('should pass all props', () => {
    const props = {
      propA: 'valueA',
      propB: 'valueB',
      propC: 'valueC',
    }
    const wrapper = shallow(<Component {...props} />)
    expect(wrapper.type()).toEqual(WindowScroll)
    expect(wrapper.prop('scrollPastThreshold')).toEqual(0.5)
    expect(wrapper.children()).toHaveLength(1)
    const wrappedComponent = wrapper.childAt(0)
    expect(wrappedComponent.type()).toEqual(MockComponent)
    expect(wrappedComponent.props()).toEqual({
      ...props,
      hasPassedThreshold: false,
      hasReachedPageBottom: false,
    })
  })

  it('should update hasPassedThreshold prop', () => {
    const wrapper = shallow(<Component />)
    const onScrollPast = wrapper.prop('onScrollPast')

    expect(wrapper.find(MockComponent).props()).toEqual({
      hasPassedThreshold: false,
      hasReachedPageBottom: false,
    })

    onScrollPast('<some value>')
    wrapper.update()

    expect(wrapper.find(MockComponent).props()).toEqual({
      hasPassedThreshold: '<some value>',
      hasReachedPageBottom: false,
    })
  })

  describe('hasReachedPageBottom prop', () => {
    it('should NOT update hasReachedPageBottom prop', () => {
      const wrapper = shallow(<Component />)
      const onReachedPageBottom = wrapper.prop('onReachedPageBottom')

      expect(wrapper.find(MockComponent).props()).toEqual({
        hasPassedThreshold: false,
        hasReachedPageBottom: false,
      })

      onReachedPageBottom('<some other value>')

      expect(wrapper.find(MockComponent).props()).toEqual({
        hasPassedThreshold: false,
        hasReachedPageBottom: false,
      })
    })

    it('should update hasReachedPageBottom prop', () => {
      const Component = withWindowScroll({
        notifyWhenReachedBottomOfPage: true,
      })(MockComponent)
      const wrapper = shallow(<Component />)
      const onReachedPageBottom = wrapper.prop('onReachedPageBottom')

      expect(wrapper.find(MockComponent).props()).toEqual({
        hasPassedThreshold: false,
        hasReachedPageBottom: false,
      })

      onReachedPageBottom('<some other value>')
      wrapper.update()

      expect(wrapper.find(MockComponent).props()).toEqual({
        hasPassedThreshold: false,
        hasReachedPageBottom: '<some other value>',
      })
    })
  })
})
