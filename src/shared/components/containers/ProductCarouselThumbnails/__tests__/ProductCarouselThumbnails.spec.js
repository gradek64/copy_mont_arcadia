import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import ProductCarouselThumbnails from '../ProductCarouselThumbnails'
import Thumbnail from '../Thumbnail'
import NavButton from '../NavButton'
import { IMAGE_SIZES } from '../../../../constants/amplience'
import deepFreeze from 'deep-freeze'
import configureMockStore from 'test/unit/lib/configure-mock-store'

const generateThumbsData = (count) =>
  deepFreeze(
    Array(count)
      .fill('')
      .map((_, i) => ({ url: `whatever${i}.jpg` }))
  )
const setCarouselIndexSpy = jest.fn()
const thumbs = generateThumbsData(3)

/**
 * Imitating a shallow render by diving through each wrapped layer
 */
const render = (el) => {
  const wrapper = shallow(
    <Provider
      store={configureMockStore({
        features: { status: { FEATURE_PRODUCT_CAROUSEL_THUMBNAIL: true } },
      })}
    >
      {el}
    </Provider>
  )
  return wrapper
    .find(ProductCarouselThumbnails)
    .dive()
    .find('ProductCarouselThumbnails')
    .dive()
}

describe('<ProductCarouselThumbnail />', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should render nothing if there is not thumbs', () => {
    const wrapper = render(
      <ProductCarouselThumbnails
        setCarouselIndex={setCarouselIndexSpy}
        maxVisible={2}
      />
    )

    expect(wrapper.type()).toEqual(null)
  })

  it('should display list of thumbs with navigation placeholders', () => {
    const wrapper = render(
      <ProductCarouselThumbnails
        thumbs={thumbs}
        className="TestCarousel"
        maxVisible={2}
        setCarouselIndex={setCarouselIndexSpy}
      />
    )

    expect(wrapper.find(NavButton)).toHaveLength(2)
    expect(wrapper.find('ul')).toHaveLength(1)
    expect(wrapper.find('li')).toHaveLength(2)
    expect(wrapper.find(Thumbnail)).toHaveLength(2)
  })

  describe('rendering thumbs', () => {
    it('should render from the beginning of the thumbs', () => {
      const thumbs = generateThumbsData(3)
      const amplienceImages = Object.freeze(['url 1', 'url 2'])
      const wrapper = render(
        <ProductCarouselThumbnails
          thumbs={thumbs}
          amplienceImages={amplienceImages}
          maxVisible={2}
          setCarouselIndex={setCarouselIndexSpy}
        />
      )

      expect(wrapper.find('ul')).toHaveLength(1)
      expect(wrapper.find('li')).toHaveLength(2)
      expect(wrapper.find(Thumbnail)).toHaveLength(2)

      const thumbElements = wrapper.find(Thumbnail)
      expect(thumbElements.at(0).prop('source')).toEqual(thumbs[0].url)
      expect(thumbElements.at(0).prop('amplienceUrl')).toEqual(
        amplienceImages[0]
      )
      expect(thumbElements.at(1).prop('source')).toEqual(thumbs[1].url)
      expect(thumbElements.at(1).prop('amplienceUrl')).toEqual(
        amplienceImages[1]
      )

      expect(thumbElements.at(0).prop('sizes')).toBe(IMAGE_SIZES.thumbnails)
      expect(thumbElements.at(1).prop('sizes')).toBe(IMAGE_SIZES.thumbnails)

      wrapper.setProps({
        amplienceImages: [],
      })

      expect(
        wrapper
          .find(Thumbnail)
          .at(0)
          .prop('amplienceUrl')
      ).toBeFalsy()
      expect(
        wrapper
          .find(Thumbnail)
          .at(1)
          .prop('amplienceUrl')
      ).toBeFalsy()
    })

    it('should use correct amplience urls when moving carousel forward', () => {
      const thumbs = generateThumbsData(3)
      const amplienceImages = Object.freeze(['url 1', 'url 2', 'url 3'])
      const wrapper = render(
        <ProductCarouselThumbnails
          thumbs={thumbs}
          amplienceImages={amplienceImages}
          maxVisible={2}
          setCarouselIndex={setCarouselIndexSpy}
        />
      )
      const instance = wrapper.instance()

      instance.goToNext()
      wrapper.update()

      let thumbElements = wrapper.find(Thumbnail)
      expect(thumbElements.at(0).prop('source')).toEqual(thumbs[1].url)
      expect(thumbElements.at(0).prop('amplienceUrl')).toEqual(
        amplienceImages[1]
      )
      expect(thumbElements.at(1).prop('source')).toEqual(thumbs[2].url)
      expect(thumbElements.at(1).prop('amplienceUrl')).toEqual(
        amplienceImages[2]
      )

      instance.goToNext()
      wrapper.update()

      thumbElements = wrapper.find(Thumbnail)
      expect(thumbElements.at(0).prop('source')).toEqual(thumbs[2].url)
      expect(thumbElements.at(0).prop('amplienceUrl')).toEqual(
        amplienceImages[2]
      )
      expect(thumbElements.at(1).prop('source')).toEqual(thumbs[0].url)
      expect(thumbElements.at(1).prop('amplienceUrl')).toEqual(
        amplienceImages[0]
      )
    })

    it('should use correct amplience urls when moving carousel backwards', () => {
      const thumbs = generateThumbsData(3)
      const amplienceImages = Object.freeze(['url 1', 'url 2', 'url 3'])
      const wrapper = render(
        <ProductCarouselThumbnails
          thumbs={thumbs}
          amplienceImages={amplienceImages}
          maxVisible={2}
          setCarouselIndex={setCarouselIndexSpy}
        />
      )
      const instance = wrapper.instance()

      instance.goToPrevious()
      wrapper.update()

      let thumbElements = wrapper.find(Thumbnail)
      expect(thumbElements.at(0).prop('source')).toEqual(thumbs[2].url)
      expect(thumbElements.at(0).prop('amplienceUrl')).toEqual(
        amplienceImages[2]
      )
      expect(thumbElements.at(1).prop('source')).toEqual(thumbs[0].url)
      expect(thumbElements.at(1).prop('amplienceUrl')).toEqual(
        amplienceImages[0]
      )

      instance.goToPrevious()
      wrapper.update()

      thumbElements = wrapper.find(Thumbnail)
      expect(thumbElements.at(0).prop('source')).toEqual(thumbs[1].url)
      expect(thumbElements.at(0).prop('amplienceUrl')).toEqual(
        amplienceImages[1]
      )
      expect(thumbElements.at(1).prop('source')).toEqual(thumbs[2].url)
      expect(thumbElements.at(1).prop('amplienceUrl')).toEqual(
        amplienceImages[2]
      )
    })

    it('should render indexed wrapping round the end of the thumb list', () => {
      const thumbs = generateThumbsData(3)
      const wrapper = render(
        <ProductCarouselThumbnails
          thumbs={thumbs}
          maxVisible={2}
          startIndex={2}
          setCarouselIndex={setCarouselIndexSpy}
        />
      )

      expect(wrapper.find('ul')).toHaveLength(1)
      expect(wrapper.find('li')).toHaveLength(2)
      expect(wrapper.find(Thumbnail)).toHaveLength(2)

      const thumbElements = wrapper.find(Thumbnail)
      expect(thumbElements.at(0).prop('source')).toEqual(thumbs[2].url)
      expect(thumbElements.at(1).prop('source')).toEqual(thumbs[0].url)
    })

    it('should only render thumbs once', () => {
      const thumbs = generateThumbsData(3)
      const wrapper = render(
        <ProductCarouselThumbnails
          thumbs={thumbs}
          maxVisible={4}
          startIndex={0}
          setCarouselIndex={setCarouselIndexSpy}
        />
      )

      expect(wrapper.find('ul')).toHaveLength(1)
      expect(wrapper.find('li')).toHaveLength(3)
      expect(wrapper.find(Thumbnail)).toHaveLength(3)
    })

    it('should only render 1 thumb even if the startIndex is out of bounds', () => {
      const thumbs = generateThumbsData(1)
      const wrapper = render(
        <ProductCarouselThumbnails
          thumbs={thumbs}
          maxVisible={10}
          startIndex={2}
          setCarouselIndex={setCarouselIndexSpy}
        />
      )

      expect(wrapper.find('ul')).toHaveLength(1)
      expect(wrapper.find('li')).toHaveLength(1)
      expect(wrapper.find(Thumbnail)).toHaveLength(1)

      const thumbElements = wrapper.find(Thumbnail)
      expect(thumbElements.at(0).prop('source')).toEqual(thumbs[0].url)
    })

    it('should add a className to the carousel when there are enough thumbnails to fill it', () => {
      const thumbs = generateThumbsData(5)
      const wrapper = render(
        <ProductCarouselThumbnails
          thumbs={thumbs}
          maxVisible={4}
          startIndex={0}
          setCarouselIndex={setCarouselIndexSpy}
          className="TestCarousel"
        />
      )

      const carouselContainer = wrapper.find('.TestCarousel-thumbList')
      expect(
        carouselContainer.hasClass('TestCarousel-thumbList--fullCarousel')
      ).toEqual(true)
    })
  })

  describe('nav buttons', () => {
    describe('top nav', () => {
      describe('previous nav', () => {
        it('should show thumbs starting from the end', () => {
          const thumbs = generateThumbsData(20)
          const wrapper = render(
            <ProductCarouselThumbnails
              thumbs={thumbs}
              maxVisible={10}
              setCarouselIndex={setCarouselIndexSpy}
            />
          )

          expect(wrapper.find(Thumbnail)).toHaveLength(10)
          let thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[0].url)
          expect(thumbElements.at(0).prop('index')).toEqual(0)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[9].url)
          expect(thumbElements.at(9).prop('index')).toEqual(9)

          wrapper
            .find('NavButton')
            .first()
            .prop('onClick')()
          wrapper.update()
          thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[19].url)
          expect(thumbElements.at(0).prop('index')).toEqual(19)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[8].url)
          expect(thumbElements.at(9).prop('index')).toEqual(8)
        })

        it('should show thumbs starting from the beginning', () => {
          const thumbs = generateThumbsData(20)
          const wrapper = render(
            <ProductCarouselThumbnails
              thumbs={thumbs}
              maxVisible={10}
              startIndex={1}
              setCarouselIndex={setCarouselIndexSpy}
            />
          )

          expect(wrapper.find(Thumbnail)).toHaveLength(10)
          let thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[1].url)
          expect(thumbElements.at(0).prop('index')).toEqual(1)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[10].url)
          expect(thumbElements.at(9).prop('index')).toEqual(10)

          wrapper
            .find('NavButton')
            .first()
            .prop('onClick')()
          wrapper.update()
          thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[0].url)
          expect(thumbElements.at(0).prop('index')).toEqual(0)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[9].url)
          expect(thumbElements.at(9).prop('index')).toEqual(9)
        })
      })

      describe('next nav', () => {
        it('should show thumbs starting from the beginning', () => {
          const thumbs = generateThumbsData(20)
          const wrapper = render(
            <ProductCarouselThumbnails
              thumbs={thumbs}
              maxVisible={10}
              startIndex={10}
              setCarouselIndex={setCarouselIndexSpy}
            />
          )

          expect(wrapper.find(Thumbnail)).toHaveLength(10)
          let thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[10].url)
          expect(thumbElements.at(0).prop('index')).toEqual(10)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[19].url)
          expect(thumbElements.at(9).prop('index')).toEqual(19)

          wrapper
            .find('NavButton')
            .last()
            .prop('onClick')()
          wrapper.update()
          thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[11].url)
          expect(thumbElements.at(0).prop('index')).toEqual(11)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[0].url)
          expect(thumbElements.at(9).prop('index')).toEqual(0)
        })

        it('should show next thumbs as expected', () => {
          const thumbs = generateThumbsData(20)
          const wrapper = render(
            <ProductCarouselThumbnails
              thumbs={thumbs}
              maxVisible={10}
              setCarouselIndex={setCarouselIndexSpy}
              startIndex={1}
            />
          )

          expect(wrapper.find(Thumbnail)).toHaveLength(10)
          let thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[1].url)
          expect(thumbElements.at(0).prop('index')).toEqual(1)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[10].url)
          expect(thumbElements.at(9).prop('index')).toEqual(10)

          wrapper
            .find('NavButton')
            .last()
            .prop('onClick')()
          wrapper.update()
          thumbElements = wrapper.find(Thumbnail)
          expect(thumbElements.at(0).prop('source')).toEqual(thumbs[2].url)
          expect(thumbElements.at(0).prop('index')).toEqual(2)
          expect(thumbElements.at(9).prop('source')).toEqual(thumbs[11].url)
          expect(thumbElements.at(9).prop('index')).toEqual(11)
        })
      })
    })
  })
})
