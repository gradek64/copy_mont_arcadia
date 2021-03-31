import React from 'react'
import Link from '../'
import { shallow } from 'enzyme'

describe('Link', () => {
  it('should render an anchor for external links', () => {
    const to = 'somwhere'
    const wrapper = shallow(
      <Link to={to} isExternal>
        My link
      </Link>
    )

    const anchor = wrapper.find('a')
    const { href, isExternal } = anchor.props()

    expect(anchor).toHaveLength(1)
    expect(href).toBe(to)
    expect(isExternal).toBe(undefined)
  })

  it('should render a react router link for internal links', () => {
    const to = 'somwhere'
    const wrapper = shallow(
      <Link to={to} isExternal={false}>
        My link
      </Link>
    )

    const link = wrapper.find('Link')
    const { to: toProp, isExternal } = link.props()

    expect(link).toHaveLength(1)
    expect(toProp).toBe(to)
    expect(isExternal).toBe(undefined)
  })
})
