import { mount } from 'enzyme'
import React, { Component } from 'react'
import QubitWrapper from '../../../src/shared/lib/QubitWrapper'

class MockedComponent extends Component {
  render() {
    return <div className="MockedComponent" />
  }
}

test('<QubitWrapper /> Wrapped element should exist as child of Qubit wrapper', () => {
  const component = mount(
    <QubitWrapper id="mock-wrapper">
      <MockedComponent />
    </QubitWrapper>
  )
  expect(component.find('.MockedComponent').length).toBe(1)
})
