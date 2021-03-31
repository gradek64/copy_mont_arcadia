import React from 'react'
import { shallow } from 'enzyme'
import Thumbnail from '../Thumbnail'
import ResponsiveImage from '../../../common/ResponsiveImage/ResponsiveImage'

describe('<Thumbnail />', () => {
  it('should render with correct props', () => {
    const setCarouselIndexSpy = jest.fn()
    const amplienceProps = {
      amplienceUrl: 'http://www.images.com',
      sizes: { mobile: 1, tablet: 1, desktop: 1 },
    }
    const wrapper = shallow(
      <Thumbnail
        {...amplienceProps}
        className="..."
        source="../wokkawokka.gif"
        carouselKey="testCarousel"
        setCarouselIndex={setCarouselIndexSpy}
        carouselFull={false}
        index={1}
      />
    )
    expect(wrapper.find(ResponsiveImage)).toHaveLength(1)
    expect(wrapper.find(ResponsiveImage).props()).toEqual({
      ...amplienceProps,
      src: '../wokkawokka.gif',
      className: '...-thumb ',
      onClick: expect.any(Function),
      useProgressiveJPG: false,
    })
  })

  it('should call an action when clicked', () => {
    const setCarouselIndexSpy = jest.fn()
    const wrapper = shallow(
      <Thumbnail
        className="..."
        source="../wokkawokka.gif"
        setCarouselIndex={setCarouselIndexSpy}
        carouselKey="testCarousel"
        carouselFull={false}
        index={1}
      />,
      { lifecycleExperimental: true }
    )

    expect(setCarouselIndexSpy).not.toHaveBeenCalled()

    wrapper.find(ResponsiveImage).prop('onClick')()
    wrapper.update()

    expect(setCarouselIndexSpy).toHaveBeenCalledTimes(1)
    expect(setCarouselIndexSpy).toHaveBeenCalledWith(1)
  })
})
