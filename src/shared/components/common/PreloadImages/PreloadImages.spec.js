import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import PreloadImages from './PreloadImages'

describe('<PreloadImages />', () => {
  const onRender = jest.fn()
  let imageStubs

  beforeEach(() => {
    jest.resetAllMocks()
    onRender.mockReturnValue(<span>Yo</span>)

    imageStubs = []
    global.Image = function ImageMock() {
      const imageStub = {}
      imageStubs.push(imageStub)
      return imageStub
    }
  })

  it('renders nothing if the images are not loaded', () => {
    const wrapper = mount(
      <PreloadImages sources={['/foo.png', 'bar.jpg']} render={onRender} />
    )
    expect(onRender).toHaveBeenCalledTimes(0)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders the render prop result when the images load', async () => {
    const wrapper = mount(
      <PreloadImages sources={['/foo.png', 'bar.jpg']} render={onRender} />
    )
    imageStubs.forEach((stub) => stub.onload())
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(onRender).toHaveBeenCalledTimes(1)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders the render prop result if any the images fail to load', async () => {
    const wrapper = mount(
      <PreloadImages sources={['/foo.png', 'bar.jpg']} render={onRender} />
    )
    imageStubs.forEach((stub) => stub.onerror())
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders the render prop result if no sources are given', () => {
    const wrapper = mount(<PreloadImages sources={[]} render={onRender} />)
    expect(onRender).toHaveBeenCalledTimes(1)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
