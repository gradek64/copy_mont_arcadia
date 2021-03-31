import testComponentHelper from 'test/unit/helpers/test-component'
import React from 'react'
import deepFreeze from 'deep-freeze'
import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'

import ResponsiveImage from '../ResponsiveImage'
import Image from '../../Image/Image'

describe('<ResponsiveImage />', () => {
  const props = deepFreeze({
    isAmplienceEnabled: true,
    amplienceUrl: 'http://images.com',
    sizes: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  })

  const renderComponent = testComponentHelper(ResponsiveImage.WrappedComponent)

  describe('Connected component', () => {
    it('should receive the correct props', () => {
      const container = shallow(
        <ResponsiveImage
          store={configureStore()({
            features: { status: { FEATURE_USE_AMPLIENCE: true } },
          })}
        />
      )

      expect(container).toBeTruthy()
      expect(container.prop('isAmplienceEnabled')).toBe(true)
    })
  })

  describe('@render', () => {
    it('renders correctly', () => {
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render Image with srcSet and sizes props if isAmplienceEnabled is true', () => {
      const { wrapper } = renderComponent(props)
      const image = wrapper.find(Image)

      expect(image.prop('srcSet')).toMatchSnapshot()
      expect(image.prop('sizes')).toMatchSnapshot()
      expect(image.prop('webpSrcSet')).toMatchSnapshot()
    })

    it('should render Image without srcSet and sizes props if isAmplienceEnabled is false', () => {
      const { wrapper } = renderComponent({
        ...props,
        isAmplienceEnabled: false,
      })
      const image = wrapper.find(Image)

      expect(image.prop('srcSet')).toBeFalsy()
      expect(image.prop('webpSrcSet')).toBeFalsy()
      expect(image.prop('sizes')).toBeFalsy()
    })

    it('should fallback to normal image if isImageFallbackEnabled is true', () => {
      const fallbackImageSrc = 'image-url'
      const { wrapper } = renderComponent({
        ...props,
        isAmplienceEnabled: true,
        amplienceUrl: '',
        src: fallbackImageSrc,
        isImageFallbackEnabled: true,
      })
      const image = wrapper.find(Image)

      expect(image.prop('srcSet')).toBeFalsy()
      expect(image.prop('webpSrcSet')).toBeFalsy()
      expect(image.prop('sizes')).toBeFalsy()
      expect(image.prop('src')).toBe(fallbackImageSrc)
    })

    it('should fallback to image if isImageFallbackEnabled is false and amplienceUrl is empty', () => {
      const { wrapper } = renderComponent({
        ...props,
        isAmplienceEnabled: true,
        amplienceUrl: '',
        isImageFallbackEnabled: false,
      })
      const image = wrapper.find(Image)

      expect(image.prop('srcSet')).toBe(undefined)
      expect(image.prop('webpSrcSet')).toBe(undefined)
      expect(image.prop('sizes')).toBe(undefined)
    })

    it('should provide appropriate query params to image url if useProgressiveJPG is true', () => {
      const { wrapper } = renderComponent({
        ...props,
        isAmplienceEnabled: true,
        useProgressiveJPG: true,
      })

      expect(wrapper.find(Image).prop('srcSet')).toMatchSnapshot()
    })
  })
})
