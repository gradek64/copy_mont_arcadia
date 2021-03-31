import headerReducer from '../headerReducer'

describe('headerReducer', () => {
  describe('UPDATE_STICKY_HEADER', () => {
    it('should set sticky=true', () => {
      const sticky = false
      expect(
        headerReducer(
          { sticky },
          {
            type: 'UPDATE_STICKY_HEADER',
            sticky: true,
          }
        )
      ).toEqual({
        sticky: true,
      })
    })
    it('should set sticky=false', () => {
      const sticky = true
      expect(
        headerReducer(
          { sticky },
          {
            type: 'UPDATE_STICKY_HEADER',
            sticky: false,
          }
        )
      ).toEqual({
        sticky: false,
      })
    })
  })
})
