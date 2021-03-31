import {
  buildComponentRender,
  shallowRender,
} from '../../../../../../test/unit/helpers/test-component'

import ImageContainer from '../ImageContainer'
import storeHostMap from '../../../../../server/api/hostsConfig/store_host_map.json'

describe('<ImageContainer />', () => {
  const requiredProps = {
    subcategory: {
      url: 'www.topman.com',
      label: 'This is a label',
      paddingTop: 20,
      image: {
        span: 1,
        url: '/image/imageName',
      },
    },
    apiEnvironment: 'prod',
    storeCode: 'tmuk',
  }

  const renderComponent = buildComponentRender(
    shallowRender,
    ImageContainer.WrappedComponent
  )

  describe('@renders', () => {
    it('should render default state', () => {
      expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@Methods', () => {
    describe('getImageSrc()', () => {
      const absoluteUrls = [
        'http://www.test.com',
        'https://www.test.com',
        '//www.test.com',
      ]
      absoluteUrls.forEach((url) => {
        it('should not change absolute url', () => {
          const { instance } = renderComponent(requiredProps)
          const apiEnvironment = instance.props.apiEnvironment
          const storeCode = instance.props.storeCode
          expect(
            instance.getImageSrc(
              { image: { url } },
              apiEnvironment,
              storeCode,
              storeHostMap
            )
          ).toBe(url)
        })
      })

      it('should convert the url to absoulte url', () => {
        const { instance } = renderComponent(requiredProps)
        const apiEnvironment = instance.props.apiEnvironment
        const storeCode = instance.props.storeCode
        expect(
          instance.getImageSrc(
            { image: { url: '/test.com' } },
            apiEnvironment,
            storeCode,
            storeHostMap
          )
        ).toBe('https://www.topman.com/test.com')
      })
    })

    describe('getStyles()', () => {
      it('should return paddingTop 20', () => {
        const { instance } = renderComponent(requiredProps)
        const subcategory = instance.props.subcategory
        const expected = { paddingTop: 20 }
        expect(instance.getStyles(subcategory)).toEqual(expected)
      })

      it('should return paddingTop 20 to be a number', () => {
        const { instance } = renderComponent(requiredProps)
        const subcategory = instance.props.subcategory
        const expected = { paddingTop: 20 }
        expect(
          instance.getStyles({ ...subcategory, paddingTop: '20' })
        ).toEqual(expected)
      })

      it('should return paddingTop 0 if property paddingTop does not exist', () => {
        const { instance } = renderComponent(requiredProps)
        const expected = { paddingTop: 0 }
        expect(instance.getStyles({})).toEqual(expected)
      })
    })
  })
})
