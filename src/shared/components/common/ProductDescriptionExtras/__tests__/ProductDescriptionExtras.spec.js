import React from 'react'
import { shallow } from 'enzyme'
import ProductDescriptionExtras from '../ProductDescriptionExtras'

describe('<ProductDescriptionExtras />', () => {
  it('should render null', () => {
    const wrapper = shallow(<ProductDescriptionExtras />)

    expect(wrapper.type()).toEqual(null)
  })

  it('should render list of items', () => {
    const attributes = [
      { label: 'colour', value: 'red' },
      { label: 'lineCode', value: 'PDP1234567' },
      { label: 'mudi', value: '' },
    ]
    const wrapper = shallow(
      <ProductDescriptionExtras attributes={attributes} />
    )

    expect(wrapper.type()).toEqual('ul')
    expect(wrapper.find('li')).toHaveLength(2)

    expect(
      wrapper
        .find('li')
        .first()
        .text()
    ).toEqual('colour: red')
    expect(
      wrapper
        .find('li')
        .last()
        .text()
    ).toEqual('lineCode: PDP1234567')
  })
})
