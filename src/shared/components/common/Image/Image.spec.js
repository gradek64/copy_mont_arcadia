import {
  buildComponentRender,
  shallowRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import Image from './Image'
import { compose } from 'ramda'

jest.mock('../../../lib/image-loader/image-loader')

describe('<Image />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@connected', () => {
    const initialState = {
      config: {
        brandName: 'topman',
        brandCode: 'tm',
      },
    }
    const render = compose(
      mountRender,
      withStore(initialState)
    )
    const renderComponent = buildComponentRender(render, Image)
    describe('@render', () => {
      it('default render for connected image with mount', () => {
        const { getTree } = renderComponent()
        expect(getTree()).toMatchSnapshot()
      })
    })
    describe('@store', () => {
      it('get brandName and brandCode from the store', () => {
        const { store } = renderComponent()
        expect(store.getState()).toEqual(initialState)
      })
    })
    describe('mapStateToProps', () => {
      it('should pass brandName from the store', () => {
        const { instance } = renderComponent()
        expect(instance.stateProps.brandName).toBe(
          initialState.config.brandName
        )
      })
      it('should pass brandCode from the store', () => {
        const { instance } = renderComponent()
        expect(instance.stateProps.brandCode).toBe(
          initialState.config.brandCode
        )
      })
    })
  })

  describe('wrapped component', () => {
    const initialProps = {
      brandCode: 'ts',
      brandName: 'topshop',
    }
    const renderComponent = buildComponentRender(
      shallowRender,
      Image.WrappedComponent
    )

    it('should render with src when deferredLoad and lazyLoad are false', () => {
      const { getTree, wrapper } = renderComponent({
        ...initialProps,
        src: 'foo bar',
        deferredLoad: false,
        lazyLoad: false,
      })
      expect(wrapper.find({ src: 'foo bar' }).exists()).toBe(true)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render without src when deferredLoad is true', () => {
      const { getTree, wrapper } = renderComponent({
        ...initialProps,
        src: 'foo bar',
        deferLoad: true,
      })
      expect(wrapper.find({ src: 'foo bar' }).exists()).toBe(false)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render without src when lazyLoad is true', () => {
      const { getTree, wrapper } = renderComponent({
        ...initialProps,
        src: 'foo bar',
        lazyLoad: true,
      })
      expect(wrapper.find({ src: 'foo bar' }).exists()).toBe(false)
      expect(getTree()).toMatchSnapshot()
    })

    it('should use alt text as the title if one is not specifically provided', () => {
      const alt = 'this is alt text'
      const { wrapper } = renderComponent({
        ...initialProps,
        alt,
      })

      const image = wrapper.find('img').first()
      expect(image.prop('title')).toBe(alt)
    })

    it('should prioritise the passed title over the alt text', () => {
      const title = 'This is a title'
      const { wrapper } = renderComponent({
        ...initialProps,
        alt: 'this is alt text',
        title,
      })

      const image = wrapper.find('img').first()
      expect(image.prop('title')).toBe(title)
    })

    describe('webp support', () => {
      it('should render a normal image if there is no webp source set', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          webpSrcSet: undefined,
        })

        const image = wrapper.find('img')
        const picture = wrapper.find('picture')

        expect(image).toHaveLength(1)
        expect(picture).toHaveLength(0)
      })

      it('should render a picture set with the correct fallbacks if a webpSrcSet is provided', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          webpSrcSet: 'someDummySrcSet',
        })

        const image = wrapper.find('img')
        const picture = wrapper.find('picture')
        const jpgSource = wrapper.find('source[type="image/jpeg"]')
        const webpSource = wrapper.find('source[type="image/webp"]')

        expect(image).toHaveLength(1)
        expect(picture).toHaveLength(1)
        expect(jpgSource).toHaveLength(1)
        expect(webpSource).toHaveLength(1)
      })
    })
  })
})
