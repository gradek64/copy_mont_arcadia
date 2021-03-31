import React from 'react'
import { mount } from 'enzyme'
import testComponentHelper from 'test/unit/helpers/test-component'
import ToolTip from '../ToolTip'

const renderComponent = testComponentHelper(ToolTip)

describe('<ToolTip />', () => {
  it('correctly renders without children', () => {
    const { wrapper } = renderComponent()
    expect(wrapper.find('div')).toHaveLength(2)
    expect(wrapper.hasClass('ToolTip')).toBe(true)
  })

  it('correctly renders variable classes based on props', () => {
    const { wrapper } = renderComponent({ arrowCentered: true })
    expect(wrapper.find('div')).toHaveLength(2)
    expect(wrapper.find('div').get(1).props.className).toBe(
      'ToolTip-content is-centered'
    )
  })

  it('correctly renders the children passed to it', () => {
    const wrapper = mount(
      <ToolTip>
        <div className="JustADiv">
          <img alt="mock" className="JustAnImg" />
        </div>
      </ToolTip>
    )
    expect(wrapper.find('div')).toHaveLength(3)
    expect(wrapper.children().find('img')).toHaveLength(1)
    expect(
      wrapper
        .children()
        .find('img')
        .hasClass('JustAnImg')
    ).toBe(true)
  })
})
