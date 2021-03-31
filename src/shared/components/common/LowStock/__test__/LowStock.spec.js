import { shallow } from 'enzyme'
import React from 'react'
import LowStock from '../LowStock'

describe('<LowStock />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const l = jest.fn()
  const context = { l }

  it('does not display low stock without active item', () => {
    const wrapper = shallow(<LowStock activeItem={{}} stockThreshold={3} />, {
      context,
    })
    expect(wrapper.find('.LowStock')).toHaveLength(0)
  })

  it('does not display low stock with active item with no quantity', () => {
    const wrapper = shallow(
      <LowStock activeItem={{ quantity: 0 }} stockThreshold={3} />,
      { context }
    )
    expect(wrapper.find('.LowStock')).toHaveLength(0)
  })

  it('does not display low stock without with active item with many quantity', () => {
    const wrapper = shallow(
      <LowStock activeItem={{ quantity: 5 }} stockThreshold={3} />,
      { context }
    )
    expect(wrapper.find('.LowStock')).toHaveLength(0)
  })

  it('does display low stock without with active item with few quantity', () => {
    const quantity = 2
    const wrapper = shallow(
      <LowStock activeItem={{ quantity }} stockThreshold={5} />,
      { context }
    )
    expect(wrapper.find('.LowStock')).toHaveLength(1)
    expect(l).toHaveBeenCalledTimes(1)
    expect(l).toHaveBeenCalledWith(['Only ', ' left in stock'], quantity)
  })
  it('does display low stock without with active item with few quantity and stockThreshold zero', () => {
    const wrapper = shallow(
      <LowStock activeItem={{ quantity: 2 }} stockThreshold={0} />,
      { context }
    )
    expect(wrapper.find('.LowStock')).toHaveLength(1)
    expect(l).toHaveBeenCalledWith(['Only ', ' left in stock'], 2)
  })
})
