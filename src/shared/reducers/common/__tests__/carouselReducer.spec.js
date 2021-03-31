import reducer from '../carouselReducer'
import * as actions from '../../../actions/common/carousel-actions/carousel-actions'

describe('Carousel Reducer', () => {
  const initialState = {}
  const initialItemState = {
    direction: 'right',
    previous: -1,
    current: 0,
    max: 1,
    zoom: 1,
    panX: 0,
    panY: 0,
    tapMessage: undefined,
    currentItemReference: undefined,
    initialIndex: 0,
  }
  const key = 'mockItem'
  const max = 6

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle INIT_CAROUSEL', () => {
    const expectedState = {
      ...initialState,
      [key]: {
        ...initialItemState,
        max,
      },
    }

    expect(reducer(undefined, actions.initCarousel(key, max))).toEqual(
      expectedState
    )
  })

  it('should handle INIT_CAROUSEL with initialIndex', () => {
    const initialIndex = 3
    const expectedState = {
      ...initialState,
      [key]: {
        ...initialItemState,
        max,
        current: initialIndex,
        previous: initialIndex - 1,
        initialIndex,
      },
    }

    expect(
      reducer(undefined, actions.initCarousel(key, max, initialIndex))
    ).toEqual(expectedState)
  })

  describe('SET_CAROUSEL_INDEX', () => {
    it('should update current and previous correctly', () => {
      const index = 'differentCurrent'
      const expectedState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          previous: initialItemState.current,
          current: index,
        },
      }
      const currentState = {
        ...initialState,
        [key]: initialItemState,
      }

      expect(
        reducer(currentState, actions.setCarouselIndex(key, index))
      ).toEqual(expectedState)
    })

    it('should not change anything', () => {
      const index = initialItemState.current
      const expectedState = {
        ...initialState,
        [key]: initialItemState,
      }
      const currentState = {
        ...initialState,
        [key]: initialItemState,
      }

      expect(
        reducer(currentState, actions.setCarouselIndex(key, index))
      ).toEqual(expectedState)
    })
  })

  describe('FORWARD_CAROUSEL', () => {
    it('should increment current index and set direction to right', () => {
      const expectedState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          previous: initialItemState.current,
        },
      }
      const currentState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          direction: 'differentDirection',
        },
      }

      expect(reducer(currentState, actions.moveCarouselForward(key))).toEqual(
        expectedState
      )
    })

    it('should set current index to 0 and set direction to right', () => {
      const expectedState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          previous: 1,
          current: 0,
        },
      }
      const currentState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          direction: 'differentDirection',
          current: 1,
        },
      }

      expect(reducer(currentState, actions.moveCarouselForward(key))).toEqual(
        expectedState
      )
    })
  })

  describe('BACK_CAROUSEL', () => {
    it('should decrement current index and set direction to left', () => {
      const expectedState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          direction: 'left',
          current: 0,
          previous: 1,
        },
      }
      const currentState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          direction: 'differentDirection',
          current: 1,
        },
      }

      expect(reducer(currentState, actions.moveCarouselBack(key))).toEqual(
        expectedState
      )
    })

    it('should set current index to max - 1 and set direction to left', () => {
      const expectedState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          direction: 'left',
          previous: 0,
          current: 5,
          max,
        },
      }
      const currentState = {
        ...initialState,
        [key]: {
          ...initialItemState,
          direction: 'differentDirection',
          current: 0,
          max,
        },
      }

      expect(reducer(currentState, actions.moveCarouselBack(key))).toEqual(
        expectedState
      )
    })
  })

  it('should handle ZOOM_CAROUSEL', () => {
    const zoom = 'differentZoom'
    const expectedState = {
      ...initialState,
      [key]: {
        ...initialItemState,
        zoom,
      },
    }
    const currentState = {
      ...initialState,
      [key]: initialItemState,
    }

    expect(reducer(currentState, actions.carouselZoom(key, zoom))).toEqual(
      expectedState
    )
  })

  it('should handle PAN_CAROUSEL', () => {
    const panX = 'differentPanX'
    const panY = 'differentPanY'
    const expectedState = {
      ...initialState,
      [key]: {
        ...initialItemState,
        panX,
        panY,
      },
    }
    const currentState = {
      ...initialState,
      [key]: initialItemState,
    }

    expect(reducer(currentState, actions.carouselPan(key, panX, panY))).toEqual(
      expectedState
    )
  })
})
