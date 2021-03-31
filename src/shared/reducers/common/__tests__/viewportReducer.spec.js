import testReducer from '../viewportReducer'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import { LANDSCAPE, PORTRAIT } from '../../../constants/viewportConstants'

describe('Viewport Reducer', () => {
  it('Default values', () => {
    const state = configureMockStore().getState()
    expect(state.viewport.height).toBe(0)
    expect(state.viewport.width).toBe(0)
    expect(state.viewport.pageHeight).toBe(0)
    expect(state.viewport.iosAgent).toBe(false)
    expect(state.viewport.media).toBe('mobile')
    expect(state.viewport.touch).toBe(false)
  })
  describe('UPDATE_MEDIA_TYPE', () => {
    it('should update the media type', () => {
      expect(
        testReducer(
          {},
          {
            type: 'UPDATE_MEDIA_TYPE',
            media: 'mobile',
          }
        )
      ).toEqual({
        media: 'mobile',
      })
    })
  })
  describe('UPDATE_WINDOW', () => {
    it('should update height and width - portrait', () => {
      expect(
        testReducer(
          {},
          {
            type: 'UPDATE_WINDOW',
            data: {
              height: 100,
              width: 40,
            },
          }
        )
      ).toEqual({
        height: 100,
        width: 40,
        orientation: PORTRAIT,
      })
    })
    it('should update height and width - default to portrait', () => {
      expect(
        testReducer(
          {},
          {
            type: 'UPDATE_WINDOW',
            data: {
              height: 100,
              width: 100,
            },
          }
        )
      ).toEqual({
        height: 100,
        width: 100,
        orientation: PORTRAIT,
      })
    })
    it('should update height and width - landscape', () => {
      expect(
        testReducer(
          {},
          {
            type: 'UPDATE_WINDOW',
            data: {
              height: 30,
              width: 40,
            },
          }
        )
      ).toEqual({
        height: 30,
        width: 40,
        orientation: LANDSCAPE,
      })
    })
  })
  describe('UPDATE_PAGE_HEIGHT', () => {
    it('should update pageHeight', () => {
      expect(
        testReducer(
          {},
          {
            type: 'UPDATE_PAGE_HEIGHT',
            pageHeight: 300,
          }
        )
      ).toEqual({
        pageHeight: 300,
      })
    })
  })
  describe('UPDATE_AGENT', () => {
    it('should update iosAgent', () => {
      expect(
        testReducer(
          {},
          {
            type: 'UPDATE_AGENT',
            iosAgent: true,
          }
        )
      ).toEqual({
        iosAgent: true,
      })
    })
  })
  describe('UPDATE_TOUCH', () => {
    it('should update touch', () => {
      expect(
        testReducer(
          {},
          {
            type: 'UPDATE_TOUCH',
            touch: true,
          }
        )
      ).toEqual({
        touch: true,
      })
    })
  })
})
