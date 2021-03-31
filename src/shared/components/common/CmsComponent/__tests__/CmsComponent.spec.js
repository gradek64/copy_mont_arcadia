import toJson from 'enzyme-to-json'

import testComponentHelper from 'test/unit/helpers/test-component'

import CmsComponent from '../CmsComponent'
import Carousel from '../../Carousel/Carousel'

const noop = () => {}

describe('<CmsComponent />', () => {
  const requiredProps = {
    data: {},
    initCarousel: noop,
  }
  const renderComponent = testComponentHelper(CmsComponent.WrappedComponent)

  describe('@renders', () => {
    it('should render nothing in default state', () => {
      const { wrapper } = renderComponent(requiredProps)
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should render nothing if unrecognised `type`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        type: 'foo',
      })
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    describe('if `type` is `imagelist`', () => {
      it('should render an ‘imagelist’', () => {
        const { getTree } = renderComponent({
          ...requiredProps,
          type: 'imagelist',
        })
        expect(getTree()).toMatchSnapshot()
      })
    })

    describe('if `type` is `carousel`', () => {
      it('should render nothing by default', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          type: 'carousel',
        })
        expect(wrapper.isEmptyRender()).toBe(true)
      })

      describe('if `data.assets` prop supplied', () => {
        it('should render a <Carousel />', () => {
          const { getTree } = renderComponent({
            ...requiredProps,
            type: 'carousel',
            data: {
              assets: [],
              options: {
                margin: '10px',
              },
            },
          })
          expect(getTree()).toMatchSnapshot()
        })

        it('should render a <Carousel /> with correct `autoplay` prop', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'carousel',
            data: {
              assets: [],
              options: {
                autoplay: 'true',
              },
            },
          })
          expect(wrapper.find(Carousel).prop('autoplay')).toBe(true)
        })

        it('should render a <Carousel /> with correct `arrowColor` prop', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'carousel',
            data: {
              assets: [],
              options: {
                arrow: '#fff',
              },
            },
          })
          expect(wrapper.find(Carousel).prop('arrowColor')).toBe('#fff')
        })

        it('should render a <Carousel /> with correct `name` prop', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'carousel',
            name: 'myCarousel',
            data: {
              assets: [],
              options: {
                arrow: '#fff',
              },
            },
          })
          expect(wrapper.find(Carousel).prop('name')).toBe('myCarousel')
        })
      })
    })

    describe('if `type` is `iframe`', () => {
      it('should render nothing by default', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          type: 'iframe',
        })
        expect(wrapper.isEmptyRender()).toBe(true)
      })

      describe('if `data.source` prop supplied', () => {
        it('should render an <iframe />', () => {
          const { getTree } = renderComponent({
            ...requiredProps,
            type: 'iframe',
            data: {
              source: '//test.mp4',
              height: '100px',
              margin: '10px',
            },
          })
          expect(getTree()).toMatchSnapshot()
        })

        it('should render an <iframe /> with supplied class name', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'iframe',
            data: {
              source: '//test.mp4',
              className: 'myClass',
            },
          })
          expect(wrapper.find('iframe').hasClass('CmsComponent-myClass')).toBe(
            true
          )
        })

        it('should render an <iframe /> with correct `src` attribute', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'iframe',
            hash: '#fragment',
            data: {
              source: 'http://test.mp4?foo&amp;bar',
            },
          })
          expect(wrapper.find('iframe').prop('src')).toBe(
            '//test.mp4?foo&bar#fragment'
          )
        })
      })
    })

    describe('if `type` is `video`', () => {
      it('should render nothing by default', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          type: 'video',
        })
        expect(wrapper.isEmptyRender()).toBe(true)
      })

      describe('if `data.youtube` prop supplied', () => {
        it('should render an <iframe />', () => {
          const { getTree } = renderComponent({
            ...requiredProps,
            type: 'video',
            margin: '10px',
            data: {
              youtube: 'abc',
            },
          })
          expect(getTree()).toMatchSnapshot()
        })

        it('should render an <iframe /> with supplied `className`', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'video',
            data: {
              youtube: 'foo.com',
              className: 'myClass',
            },
          })
          expect(
            wrapper
              .find('.CmsComponent--videoContainer')
              .hasClass('CmsComponent-myClass')
          ).toBe(true)
        })

        it('should render an <iframe /> with correct `src` attribute', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'video',
            data: {
              youtube: 'http://foo.com',
            },
          })
          expect(wrapper.find('iframe').prop('src')).toBe(
            '//foo.com?rel=0&amp;controls=0&amp;showinfo=0'
          )
        })
      })

      describe('if `data.source` prop supplied', () => {
        it('should render a <video />', () => {
          const { getTree } = renderComponent({
            ...requiredProps,
            type: 'video',
            poster: 'http://cat-gifs.com',
            data: {
              source: 'foo.com',
            },
          })
          expect(getTree()).toMatchSnapshot()
        })

        it('should render a <video /> with correct `src` attribute', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'video',
            poster: 'http://cat-gifs.com',
            data: {
              source: 'http://foo.com',
            },
          })
          expect(wrapper.find('video').prop('src')).toBe('//foo.com')
        })

        it('should render a <track /> if `caption` prop supplied', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            type: 'video',
            lang: 'en',
            data: {
              source: 'http://foo.com',
              caption: 'http://cat-captions.com',
            },
          })
          expect(toJson(wrapper.find('track'))).toMatchSnapshot()
        })
      })
    })

    describe('if `type` is `html`', () => {
      it('should render ‘html’', () => {
        const { getTree } = renderComponent({
          ...requiredProps,
          type: 'html',
          data: {
            markup: '<html>html content here</html>',
            margin: '10px',
          },
        })
        expect(getTree()).toMatchSnapshot()
      })
    })
  })
})
