import {
  buildComponentRender,
  shallowRender,
} from '../../../../../../test/unit/helpers/test-component'
import Link from '../../../common/Link'

import Subcategory from '../Subcategory'
import ImageContainer from '../ImageContainer'
import { browserHistory } from 'react-router'

jest.spyOn(browserHistory, 'push').mockImplementation(() => null)

describe('<Subcategory />', () => {
  const requiredProps = {
    hideMegaNav: jest.fn(),
    subcategory: {
      redirectionUrl: '',
      url: 'http://www.topman.com/category/jeans/blue-jeans.html',
      label: 'This is a label',
      paddingTop: 20,
    },
  }

  const renderComponent = buildComponentRender(shallowRender, Subcategory)

  describe('@renders', () => {
    it('should render text content with <Link> tags', () => {
      expect(
        renderComponent({
          ...requiredProps,
          subcategory: {
            redirectionUrl: '',
            url: 'http://www.topman.com/category/jeans/blue-jeans.html',
            label: 'This is a label',
            paddingTop: 20,
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render text content with <a> tags', () => {
      expect(
        renderComponent({
          ...requiredProps,
          subcategory: {
            redirectionUrl: '/foo/bar',
            url: 'http://www.topman.com/category/jeans/blue-jeans.html',
            label: 'This is a label',
            paddingTop: 20,
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should not render Subcategory at all if image span is footer', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        subcategory: {
          image: {
            span: 'footer',
          },
        },
      })
      expect(wrapper.find(Link)).toHaveLength(0)
    })

    it('should render Subcategory > Link if an image > span and url are not available', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        subcategory: { image: {} },
      })
      expect(wrapper.find(Link)).toHaveLength(1)
    })

    it('should render image if subcategory has "image"', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        subcategory: {
          ...requiredProps.subcategory,
          image: {
            span: 1,
            url: 'http://topman.com',
          },
        },
      })
      expect(wrapper.find(ImageContainer)).toHaveLength(1)
    })

    it('should render text when image is not provided', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        subcategory: {},
      })
      expect(wrapper.find(ImageContainer)).toHaveLength(0)
      expect(wrapper.find('span.MegaNav-subcategoryItemLabel')).toHaveLength(1)
    })

    it('should render text when image is not provided', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        subcategory: {},
      })
      expect(wrapper.find(ImageContainer)).toHaveLength(0)
      expect(wrapper.find('span.MegaNav-subcategoryItemLabel')).toHaveLength(1)
    })

    it('should return props for redirect links', () => {
      const newProps = {
        ...requiredProps,
        subcategory: {
          ...requiredProps.subcategory,
          redirectionUrl: '/blog/',
        },
      }
      const { wrapper } = renderComponent(newProps)
      expect(wrapper.find(Link).props().to).toBe('/blog/')
      expect(wrapper.find(Link).props().isExternal).toBe(true)
    })
  })

  describe('@Events', () => {
    const { wrapper } = renderComponent(requiredProps)
    const event = {
      preventDefault: jest.fn(),
    }

    describe('click', () => {
      wrapper.find('Link').simulate('click', event)
      it('closes the megaNav when clicking on a <Link>', () => {
        expect(requiredProps.hideMegaNav).toHaveBeenCalled()
        expect(event.preventDefault).toHaveBeenCalled()
        expect(browserHistory.push).toHaveBeenCalledWith(
          'http://www.topman.com/category/jeans/blue-jeans.html'
        )
      })
    })

    describe('touchEnd', () => {
      const event = {
        preventDefault: jest.fn(),
      }

      wrapper.find('Link').simulate('touchEnd', event)
      it('closes the megaNav when clicking on a <Link>', () => {
        expect(requiredProps.hideMegaNav).toHaveBeenCalled()
      })
    })
  })
})
