import React from 'react'
import Column from '../Column'
import { shallow } from 'enzyme'
import { createStore } from 'redux'

describe('grid components', () => {
  describe('<Column />', () => {
    it('should render using connect', () => {
      const store = createStore((s) => s, {
        features: {
          status: {
            FEATURE_RESPONSIVE: false,
          },
        },
      })
      const wrapper = shallow(<Column />, {
        context: { store },
      })
      expect(wrapper.type()).toEqual(Column.WrappedComponent)
      expect(wrapper.props()).toEqual({
        children: null,
        className: '',
        componentType: 'div',
        dispatch: expect.any(Function),
        isResponsive: false,
        mobile: 'col-12',
        responsive: 'col',
      })
    })

    it('should render a non responsive div', () => {
      const props = {
        isResponsive: false,
        responsive: 'col-md-6',
        className: 'SomeComponent',
      }

      const wrapper = shallow(
        <Column.WrappedComponent {...props}>
          <p>Some Content</p>
        </Column.WrappedComponent>
      )

      expect(wrapper.html()).toEqual(
        `<div class="col-12 SomeComponent"><p>Some Content</p></div>`
      )
    })

    it('should render a responsive div', () => {
      const props = {
        isResponsive: true,
        responsive: 'col-md-6',
        className: 'SomeComponent',
      }

      const wrapper = shallow(
        <Column.WrappedComponent {...props}>
          <p>Some Content</p>
        </Column.WrappedComponent>
      )

      expect(wrapper.html()).toEqual(
        `<div class="col-md-6 SomeComponent"><p>Some Content</p></div>`
      )
    })

    it('should render a custom element', () => {
      const props = {
        isResponsive: false,
        responsive: 'col-md-6',
        className: 'SomeComponent',
        componentType: 'span',
      }

      const wrapper = shallow(
        <Column.WrappedComponent {...props}>
          <p>Some Content</p>
        </Column.WrappedComponent>
      )

      expect(wrapper.html()).toEqual(
        `<span class="col-12 SomeComponent"><p>Some Content</p></span>`
      )
    })
  })
})
