import renderComponentHelper from 'test/unit/helpers/test-component'
import { error } from '../../../../../server/lib/logger'
import ProductPromoBanner from '../ProductPromoBanner'
import Image from '../../Image/Image'

jest.mock('../../../../../server/lib/logger')

const src = 'http://media.topshop.com/image.png'
const isFeatureLogBadAttributeBannersEnabled = true
const productURL = 'http://local.m.topshop.com:8080/jacket'
const message = 'Failed to load attribute banner'

describe('<ProductPromoBanner/>', () => {
  const renderComponent = renderComponentHelper(ProductPromoBanner)

  describe('@renders', () => {
    it('in default state', () => {
      expect(
        renderComponent({
          src,
          isFeatureLogBadAttributeBannersEnabled,
          productURL,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('Error handling', () => {
    let wrapper
    beforeEach(() => {
      wrapper = renderComponent({
        isFeatureLogBadAttributeBannersEnabled,
        src,
        productURL,
      }).wrapper
    })

    it("doesn't render the image if theres an error", () => {
      wrapper.find(Image).simulate('error')
      expect(wrapper.find(Image)).toHaveLength(0)
    })

    it('logs an error when the image fails to load', () => {
      wrapper.find(Image).simulate('error')
      expect(error).toBeCalledWith(message, {
        message,
        src,
        location: window.location.href,
        productURL,
      })
      expect(wrapper.find(Image)).toHaveLength(0)
    })

    it('resets error state if the src changes', () => {
      wrapper.find(Image).simulate('error')
      expect(wrapper.find(Image)).toHaveLength(0)
      wrapper.setProps({
        src: 'http://media.topshop.com/new-image.png',
      })
      expect(wrapper.find(Image)).toHaveLength(1)
    })
  })
})
