import testComponentHelper from 'test/unit/helpers/test-component'

import PlayVideoButton from '../PlayVideoButton'

describe('<PlayVideoButton/>', () => {
  const initialProps = {
    clickHandler: jest.fn(),
  }
  const renderComponent = testComponentHelper(PlayVideoButton)

  describe('@renders', () => {
    it('in default state', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.PlayVideoButton-label').text()).toBe('play video')
    })

    it('with no extra classes', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.PlayVideoButton').props().className).toBe(
        'PlayVideoButton '
      )
    })

    it('with with extra classes', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        className: 'extra classes',
      })
      expect(wrapper.find('.PlayVideoButton').props().className).toBe(
        'PlayVideoButton extra classes'
      )
    })

    it('with isVideoPlaying as true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isVideoPlaying: true,
      })
      expect(wrapper.find('.PlayVideoButton-label').text()).toBe('stop video')
    })
  })
})
