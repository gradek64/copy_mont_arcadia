import { compose } from 'ramda'
import {
  mountRender,
  withStore,
  buildComponentRender,
} from 'test/unit/helpers/test-component'

import DDPIcon from '../DDPIcon'

const initialState = {
  config: {
    brandName: 'topshop',
    brandCode: 'tsuk',
  },
}

describe('<DDPIcon />', () => {
  const render = compose(
    mountRender,
    withStore(initialState)
  )
  const renderComponent = buildComponentRender(render, DDPIcon)

  it('should render image with given ddpLogoSrc', () => {
    const ddpLogoSrc = 'test/src'
    const { wrapper } = renderComponent({
      ddpLogoSrc,
      ddpAdded: true,
    })
    const img = wrapper.find('img')
    expect(img.props().src).toBe(ddpLogoSrc)
  })
  it('should render className "DDPAdded-image" is ddpAdded is true', () => {
    const ddpLogoSrc = 'test/src'
    const { wrapper } = renderComponent({
      ddpLogoSrc,
      ddpAdded: true,
    })
    const Image = wrapper.find('Image')
    expect(Image.props().className).toBe('DDPAdded-image')
  })
  it('should render className "DDPRenewal-image" is ddpAdded is false', () => {
    const ddpLogoSrc = 'test/src'
    const { wrapper } = renderComponent({
      ddpLogoSrc,
    })
    const Image = wrapper.find('Image')
    expect(Image.props().className).toBe('DDPRenewal-image')
  })
})
