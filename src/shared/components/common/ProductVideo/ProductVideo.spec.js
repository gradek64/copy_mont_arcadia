import React from 'react'
import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'
import { VIDEO_FORMAT, VIDEO_SIZE } from '../../../constants/amplience'

import testComponentHelper from 'test/unit/helpers/test-component'

import ProductVideo from './ProductVideo'
import PlayVideoButton from '../PlayVideoButton/PlayVideoButton'

describe('<ProductVideo/>', () => {
  const setVideoEnabledMock = jest.fn()
  const initialProps = {
    className: 'VideoClassName',
    videoUrl: '/oh/hi/eatingVegetables.mp4',
    play: setVideoEnabledMock,
    isAmplienceEnabled: false,
  }
  const renderComponent = testComponentHelper(ProductVideo.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with no className', () => {
      expect(
        renderComponent({ ...initialProps, className: undefined }).getTree()
      ).toMatchSnapshot()
    })

    it('with isVideoPlaying as true', () => {
      expect(
        renderComponent({ ...initialProps, isVideoPlaying: true }).getTree()
      ).toMatchSnapshot()
    })

    it('with Amplience video', () => {
      const amplienceVideo = 'amplience video'
      const { wrapper } = renderComponent({
        ...initialProps,
        isAmplienceEnabled: true,
        amplienceVideo,
      })
      expect(wrapper.find('source').prop('src')).toBe(
        `${amplienceVideo}/${VIDEO_FORMAT}_${VIDEO_SIZE}`
      )
    })

    it('video ref should assign whatever is passed to it', () => {
      const { instance, wrapper } = renderComponent({ ...initialProps })
      const videoNode = wrapper.find('.ProductVideo-video').first()

      videoNode.getElement().ref(123)
      expect(instance.video).toEqual(123)
    })

    it('PlayVideoButton', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(PlayVideoButton)).toHaveLength(1)
    })

    it('PlayVideoButton with isVideoPlaying set to true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isVideoPlaying: true,
      })
      expect(wrapper.find(PlayVideoButton).prop('isVideoPlaying')).toBeTruthy()
    })

    it('PlayVideoButton with isVideoPlaying set to false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isVideoPlaying: false,
      })
      expect(wrapper.find(PlayVideoButton).prop('isVideoPlaying')).toBeFalsy()
    })

    it('PlayVideoButton with click handler', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(PlayVideoButton).prop('clickHandler')).toBeTruthy()
    })
  })

  describe('@connect', () => {
    it('maps state to props', () => {
      const initialState = {
        features: {
          status: {
            FEATURE_USE_AMPLIENCE: true,
          },
        },
      }
      const container = shallow(
        <ProductVideo
          videoUrl=""
          play={jest.fn()}
          store={configureStore()(initialState)}
        />
      )
      expect(container.prop('isAmplienceEnabled')).toBe(true)
    })
  })

  describe('@instance', () => {
    describe('@playVideo', () => {
      it('should play video', () => {
        const { instance } = renderComponent(initialProps)
        const play = jest.fn()
        instance.video = { play }

        instance.playVideo()

        expect(play).toHaveBeenCalledTimes(1)
      })
    })
    describe('@stopVideo', () => {
      it('should pause video and reset time', () => {
        const { instance } = renderComponent(initialProps)
        const pauseMock = jest.fn()
        instance.video = { pause: pauseMock, currentTime: 123 }

        expect(pauseMock).not.toHaveBeenCalled()
        expect(instance.video.currentTime).toEqual(123)

        instance.stopVideo()

        expect(instance.video.currentTime).toEqual(0)
        expect(pauseMock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@lifeCycles', () => {
    describe('componentDidMount', () => {
      it('should add controlsList attribute', () => {
        const { instance } = renderComponent({ ...initialProps })
        instance.video = { setAttribute: jest.fn() }
        instance.componentDidMount()
        expect(instance.video.setAttribute).toHaveBeenCalledTimes(1)
        expect(instance.video.setAttribute).toHaveBeenCalledWith(
          'controlsList',
          'nodownload'
        )
      })
    })
    describe('UNSAFE_componentWillReceiveProps', () => {
      it('should call playVideo', () => {
        const { instance } = renderComponent({ ...initialProps })
        const playVideoSpy = jest.spyOn(instance, 'playVideo')
        instance.forceUpdate()

        instance.video = { play: () => {} }
        expect(playVideoSpy).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps({ isVideoPlaying: true })
        expect(playVideoSpy).toHaveBeenCalledTimes(1)
      })

      it('should call stopVideo', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isVideoPlaying: true,
        })
        const stopVideoSpy = jest.spyOn(instance, 'stopVideo')
        instance.forceUpdate()

        instance.video = { pause: () => {} }
        expect(stopVideoSpy).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps({ isVideoPlaying: false })
        expect(stopVideoSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@events', () => {
    it('should play video when play button is clicked', () => {
      const { wrapper } = renderComponent({ ...initialProps })

      expect(setVideoEnabledMock).toHaveBeenCalledTimes(0)
      wrapper
        .find('.ProductVideo-closeWrapper')
        .first()
        .simulate('click')
      expect(setVideoEnabledMock).toHaveBeenCalledTimes(1)
    })
  })
})
